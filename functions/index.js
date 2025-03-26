/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { getFirestore, Timestamp} = require('firebase-admin/firestore');
const { getStorage, getDownloadURL, uploadBytes, ref } = require('firebase-admin/storage');
const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');

const logger = require("firebase-functions/logger");
//const { user ,getAuth} = require('firebase-functions/v1/auth');
const { getAuth } = require('firebase-admin/auth');

initializeApp({
    storageBucket: 'sound-of-peanuts-cooking-site.appspot.com'
});

const db = getFirestore();
const store = getStorage();
const auth = getAuth();

exports.helloWorld = onCall(async (req) => {
    logger.info("Hello logs!", { structuredData: true });

    try {
        return { message: "Hello from Firebase!" };
    } catch (error) {
        logger.error("Error in Cloud Function:", error);
        return { error: error.message }; //Return an error message to the client
    }
});

exports.getDbRecipesByField = onCall(async (req) => {
    const docLimit = req.data.docLimit || 6;
    if (!docLimit || typeof docLimit !== 'number') {
        logger.log("Error: docLimit not found or invalid: ", docLimit);
        return { success: false, message: "docLimit not found or invalid" };
    }

    logger.info("Requesting " + docLimit + " most liked recipes");

    try {
        const queryType = req.data.queryType || 'likes';
        const order = req.data.order || 'desc';
        logger.log("Query type: " + queryType + " Order: " + order);

        const q = db.collection('Recipe').orderBy(queryType, order).limit(docLimit);
        const snapshot = await q.get();

        logger.log("Requested posts " + req.data);
        if (snapshot.empty) {
            logger.log("Error: no recipes found");
            return { success: false, message: "No recipes found" };
        } else {
            const recipes = [];
            for (const doc of snapshot.docs) {
                const recipeData = doc.data();

                let author = null;

                if (recipeData.authorRef) {
                    logger.log("Author ref found");
                    const aSnapshot = await recipeData.authorRef.get();
                    if (aSnapshot.exists) {
                        logger.log("Author found: ", aSnapshot.data());
                        author = {
                            id: aSnapshot.id,
                            name: aSnapshot.data().name,
                            pfpUrl: aSnapshot.data().pfpUrl
                        };
                    }
                    else {
                        logger.log("Author not found: ", recipeData.authorRef);
                        author = {
                            id: null,
                            name: "Deleted User"
                        }
                    }
                }

                recipes.push({
                    id: doc.id,
                    name: recipeData.name || "",
                    likes: recipeData.likes || 0,
                    preparationTime: recipeData.preparationTime || 0,
                    cardImgReg: recipeData.cardImgReg || "",
                    author: author
                });

            }
            logger.log("Recipes found: ", recipes);
            return { success: true, recipeList: recipes };
        }
    } catch (error) {
        logger.error("Error fetching recipes by most likes:", error);
        return { success: false, message: "Error fetching recipes" };
    }
});

exports.getDbMoreRecipes = onCall(async (req, res) => {
    const docLimit = req.data.docLimit || 6;
    const lastDocId = req.data.lastDocId || null;

    if (!docLimit || typeof docLimit !== 'number') {
        logger.log("Error: docLimit or lastDocId not found or invalid: ", docLimit);
        return { success: false, message: "docLimit not found or invalid" };
    }

    logger.info("Requesting " + docLimit + " recipes after " + lastDocId);

    try {
        let q = db.collection('Recipe').orderBy('name').limit(docLimit);

        if (lastDocId) {
            logger.log("Starting from: ", lastDocId);
            const lastDocRef = await db.collection('Recipe').doc(lastDocId).get();
            if (lastDocRef.exists) {
                q = q.startAfter(lastDocRef);
            } else {
                logger.log("Error: lastDocId not found in the database");
                return { success: false, message: "Invalid lastDocId" };
            }
        }

        const snapshot = await q.get();

        if (snapshot.empty) {
            logger.log("Error: no recipes found");
            return { success: false, message: "No recipes found" };
        } else {

            const recipes = [];
            for (const doc of snapshot.docs) {
                const recipeData = doc.data();

                let author = null;

                if (recipeData.authorRef) {
                    logger.log("Author ref found");
                    const aSnapshot = await recipeData.authorRef.get();
                    if (aSnapshot.exists) {
                        logger.log("Author found: ", aSnapshot.data());
                        author = {
                            id: aSnapshot.id,
                            name: aSnapshot.data().name,
                            pfpUrl: aSnapshot.data().pfpUrl
                        };
                    } else {
                        logger.log("Author not found: ", recipeData.authorRef);
                        author = {
                            id: null,
                            name: "Deleted User"
                        };
                    }
                }

                recipes.push({
                    id: doc.id,
                    name: recipeData.name || "",
                    likes: recipeData.likes || 0,
                    preparationTime: recipeData.preparationTime || 0,
                    cardImgReg: recipeData.cardImgReg || "",
                    author: author
                });
            }

            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            logger.log("Recipes found: ", recipes);
            return { success: true, recipeList: recipes, lastDocId: lastDoc.id };
        }
    } catch (error) {
        logger.error("Error fetching recipes:", error);
        return { success: false, message: "Error fetching recipes" };
    }
});

exports.getDbRecipeSingle = onCall(async (req, res) => {
    const { id } = req.data
    if (!id) {
        throw new Error("id not found")
    }

    const ref = db.doc("/Recipe/" + id);
    const snapshot = await ref.get();

    logger.log("ID: ", id);
    logger.log("Ref: ", ref.path);

    if (!snapshot.exists || snapshot.empty) {
        logger.log("Error: recipe not found");
        return { success: false, message: "Error: recipe not found" }
    }
    else {

        let author = null;
        const recipeData = snapshot.data();

        if (recipeData.authorRef) {
            logger.log("Author ref found");
            const aSnapshot = await recipeData.authorRef.get();
            if (aSnapshot.exists) {
                logger.log("Author found: ", aSnapshot.data());
                author = {
                    id: aSnapshot.id,
                    name: aSnapshot.data().name,
                    pfpUrl: aSnapshot.data().pfpUrl
                };
            }
            else {
                logger.log("Author not found: ", recipeData.authorRef);
                author = {
                    id: null,
                    name: "Deleted User"
                }
            }
        }
        const recipe = {
            name: recipeData.name || "",
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.instructions || "",
            likes: recipeData.likes || 0,
            dislikes: recipeData.dislikes || 0,
            author: author,
            preparationTime: recipeData.preparationTime || 0,
            equipment: recipeData.equipment || [],
            cardImgReg: recipeData.cardImgReg || "",
            publishDate: recipeData.publishDate || ""
        };
        return { success: true, recipe }
    }
});

exports.postDbRecipe = onCall(async (req, res) => {
    const { name, preparationTime, instructions, ingredients, equipment, cardImgReg, uid } = req.data
    if (!name || !preparationTime || !instructions || !ingredients || !equipment || !cardImgReg || !uid) {
        logger.log("Error: Recipe data not found or invalid: ", req.data);
        return { success: false, message: "Recipe data not found or invalid" }
    }

    if(!req.auth){
        return{ success:false, message: "Error: User is not authenticated"}
    }
    logger.log("Auth info", req.auth);

    try {
        logger.log("type of uid: " + typeof uid)
        const userQuery = db.collection("Users").where('uId', '==', uid).limit(1);
        const userSnapshot = await userQuery.get();

        logger.log("user Snapshot: ", userSnapshot)
        if (userSnapshot.empty) {
            logger.log("Error: User not found");
            return { success: false, message: "Error: User not found" };
        }

        const userDoc = userSnapshot.docs[0];
        const userRef = userDoc.ref; 
        const userData = userDoc.data();
        const madeRecipes = userData.madeRecipes || [];

        logger.log("Attempting to add recipe with: ", req.data);
        const recipeRef = await db.collection('Recipe').add({
            name: name,
            preparationTime: preparationTime,
            cardImgReg: cardImgReg,
            authorRef: userRef,
            authorUid: uid,
            equipment: equipment,
            instructions: instructions,
            ingredients: ingredients,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            publishDate: Timestamp.now(),
        });

        madeRecipes.push(recipeRef.id);
        
        await userRef.update({
            madeRecipes: madeRecipes,
        });
        logger.log("Recipe added with ID: ", recipeRef.id);


        logger.log("Recipe added to user's madeRecipes array");

        return { success: true, message: "Recipe posted successfully", recipeId: recipeRef.id };
    } catch (error) {
        logger.error("Error posting recipe:", error);
        return { success: false, message: "Error posting recipe" };
    }
});

exports.addLikeRecipe = onCall(async (req, res) => {
    const { id, uid } = req.data;

    logger.log("Attempting to like recipe with ID: " + id + " and user ID: " + uid);
    if (!id || !uid) {
        logger.log("Error: Recipe ID or User ID not found");
        return { success: false, message: "Recipe ID or User ID not found" };
    }

    try {
            
        const recipeRef = db.doc("/Recipe/" + id);
        
        const userQuery = db.collection("Users").where('uId', '==', uid).limit(1);
        const userSnapshot = await userQuery.get();

        logger.log("user Snapshot: ", userSnapshot)
        if (userSnapshot.empty) {
            logger.log("Error: User not found");
            return { success: false, message: "Error: User not found" };
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        const likedRecipes = userData.likedRecipes || [];
        const dislikedRecipes = userData.dislikedRecipes || [];

        if (!likedRecipes.includes(id)) {
            likedRecipes.push(id);
        }
        
        if (dislikedRecipes.includes(id)) {
            dislikedRecipes.splice(dislikedRecipes.indexOf(id), 1);
        }

        await userDoc.ref.update({
            likedRecipes: likedRecipes,
            dislikedRecipes: dislikedRecipes,
        });
        
        const recipeSnapshot = await recipeRef.get();
        const recipeData = recipeSnapshot.data();
        const likedBy = recipeData.likedBy || [];
        const dislikedBy = recipeData.dislikedBy || [];

        if (likedBy.includes(uid)) {
            return { success: false, message: "You have already liked this recipe" };
        }

        let dislikes = 0;

        if (dislikedBy.includes(uid)) {
            dislikedBy.splice(dislikedBy.indexOf(uid), 1);
            dislikes = -1;
        }

        likedBy.push(uid);

        await recipeRef.update({
            dislikes: recipeData.dislikes + dislikes,
            likes: recipeData.likes + 1,
            likedBy: likedBy,
            dislikedBy: dislikedBy,
        });

        logger.log("Recipe liked successfully and updated in user document");
        return { success: true, message: "Recipe liked" };
    } catch (error) {
        logger.error("Error liking recipe:", error);
        return { success: false, message: "Error liking recipe" };
    }
});

exports.addDislikeRecipe = onCall(async (req, res) => {
    const { id, uid } = req.data;

    logger.log("Attempting to dislike recipe with ID: " + id + " and user ID: " + uid);
    if (!id || !uid) {
        logger.log("Error: Recipe ID or User ID not found");
        return { success: false, message: "Recipe ID or User ID not found" };
    }

    try {
            
        const recipeRef = db.doc("/Recipe/" + id);
        
        const userQuery = db.collection("Users").where('uId', '==', uid).limit(1);
        const userSnapshot = await userQuery.get();

        logger.log("user Snapshot: ", userSnapshot)
        if (userSnapshot.empty) {
            logger.log("Error: User not found");
            return { success: false, message: "Error: User not found" };
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        const dislikedRecipes = userData.dislikedRecipes || [];
        const likedRecipes = userData.likedRecipes || [];

        if (!dislikedRecipes.includes(id)) {
            dislikedRecipes.push(id);
        }
        
        if (likedRecipes.includes(id)) {
            likedRecipes.splice(likedRecipes.indexOf(id), 1);
        }

        await userDoc.ref.update({
            dislikedRecipes: dislikedRecipes,
            likedRecipes: likedRecipes,
        });
        
        const recipeSnapshot = await recipeRef.get();
        const recipeData = recipeSnapshot.data();
        const likedBy = recipeData.likedBy || [];
        const dislikedBy = recipeData.dislikedBy || [];

        if (dislikedBy.includes(uid)) {
            return { success: false, message: "You have already disliked this recipe" };
        }

        let likes = 0;

        if (likedBy.includes(uid)) {
            likedBy.splice(likedBy.indexOf(uid), 1);
            likes = -1;
        }

        dislikedBy.push(uid);

        await recipeRef.update({
            dislikes: recipeData.dislikes + 1,
            likes: recipeData.likes + likes,
            likedBy: likedBy,
            dislikedBy: dislikedBy,
        });

        logger.log("Recipe disliked successfully and updated in user document");
        return { success: true, message: "Recipe disliked" };
    } catch (error) {
        logger.error("Error disliking recipe:", error);
        return { success: false, message: "Error disliking recipe" };
    }
});

exports.getDbUser = onCall(async (req) => {
    const { uId } = req.data
    if (!uId) {
        logger.log("Error: uId not found or invalid ", uId);
        return { success: false, message: "uId not found or invalid" }
    }

    const snapshot = await db.collection('Users').where('uId', '==', uId).limit(1).get();

    if (snapshot.empty) {
        logger.log("Error: no user found with the uId", uId);
        return { success: false, message: 'Error:no user with this UID' }

    } else {
        return { success: true, user: snapshot.data() }

    }
});

exports.verifyUser = onCall(async (req) => {
    const { token } = req.data;

    if (!token) {
        throw new Error("Token not found");
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        return { success: true, uId: decodedToken.uId };
    } catch (error) {
        return { success: false, message: "Invalid token" };
    }
});

exports.createDbUser = onCall(async (req, res) => {
    const { uName, pfpDownloadURL, uId } = req.data
    if (!uName || !pfpDownloadURL || !uId) {
        throw new Error("Name, pfp, or UID not found");
    }

    logger.log("Attempting to add user : " + uName + " with uId: " + uId + " and pfp url: " + pfpDownloadURL);

    let madeRecipes = []
    let likedRecipes = []
    let dislikedRecipes = []
    const complete = await db.collection('Users').add({
        name: uName,
        pfpUrl: pfpDownloadURL,
        uId: uId,
        biography: "",
        madeRecipes,
        likedRecipes,
        dislikedRecipes
    })

    if (complete) {
        logger.log("User successfully added")
        return { success: true, message: "User added" }
    }
    else {
        logger.log("User failed to be added")
        return { success: false, message: "Error: could not create user" }
    }
});

exports.updateDbUser = onCall(async (req) => {
    const { uName, pfpDownloadURL, uId, } = req.data
    if(req.auth.uid == uId){
        try{
            const toBeUpdated = await db.collection('Users').where("uId","==",uId).limit(1).get();
            const upUser = toBeUpdated.docs[0];
            const complete = await (db.collection('Users').doc(upUser.id).update({
                name: uName,
                pfpUrl: pfpDownloadURL
                })
            )
        }catch(error){
            logger.error(error);
            return{success: false,message: "Could not update user:"+error}
        }
    }
    
    if (complete) {
        return { success: true, message: "User updated" }
    }
    else {
        return { success: false, message: "Error: could not update user" }
    }
});

exports.deleteDbUser = onCall(async (req) => {
    const { uId } = req.data
    var complete = false;
    if (!uId) {
        throw new Error("UID not found")
    }
    if(req.auth.uid == uId){
        try{
            const toBeDeleted = await db.collection('Users').where("uId","==",uId).limit(1).get();
            const rmUser = toBeDeleted.docs[0];
            const dbDelComplete = await db.collection('Users').doc(rmUser.id).delete();
            if(dbDelComplete){
                logger.info("Deleted user from database");

            }
            auth.deleteUser(uId);
            const deletedUserRecipes = await db.collection('Recipe').where("authorUid","==",uId).get();
            deletedUserRecipes.docs.forEach((thisDoc)=>{
                thisDoc.ref.update({
                    uId:"",
                    authorRef:"/Users/aLsEiyAU2DPPajSJdZ0f"
                })
        
            })
        }
        catch(error){
            logger.error(error);
            console.log();
        }  
    }

    if (complete) {
        return { success: true, message: "User deleted" }
    }
    else {
        return { success: false, message: "Error: could not delete user" }
    }
});

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { getFirestore, Timestamp } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');

const logger = require("firebase-functions/logger");
//const { user ,getAuth} = require('firebase-functions/v1/auth');
const { getAuth } = require('firebase-admin/auth');

initializeApp({
    storageBucket: 'sound-of-peanuts-cooking-site.appspot.com'
});

const db = getFirestore();
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
        const order = req.data.order;
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
        logger.error("Error fetching recipes by " + req.data.queryType + ": ", error);
        return { success: false, message: "Error fetching recipes" };
    }
});

exports.getDbMoreRecipes = onCall(async (req) => {
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

exports.getDbRecipeSingle = onCall(async (req) => {
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

        let ownsRecipe = false;
        let isLiked = false;
        let isDisliked = false;
        if (req.auth) {
            if (recipeData.authorUid == req.auth.uid) {
                ownsRecipe = true;
            }
            if (recipeData.likedBy.includes(req.auth.uid)) {
                isLiked = true;
            }
            else if (recipeData.dislikedBy.includes(req.auth.uid)) {
                isDisliked = true;
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
            publishDate: recipeData.publishDate || "",
            ownsRecipe: ownsRecipe,
            isLiked: isLiked,
            isDisliked: isDisliked,

        };
        return { success: true, recipe }
    }
});

exports.postDbRecipe = onCall(async (req) => {
    const { name, preparationTime, instructions, ingredients, equipment, cardImgReg, } = req.data
    if (!name || !preparationTime || !instructions || !ingredients || !equipment || !cardImgReg) {
        logger.log("Error: Recipe data not found or invalid: ", req.data);
        return { success: false, message: "Recipe data not found or invalid" }
    }

    if (!req.auth) {
        return { success: false, message: "Error: User is not authenticated" }
    }

    try {
        const userQuery = db.collection("Users").where('uId', '==', req.auth.uid).limit(1);
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
            authorUid: req.auth.uid,
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

exports.updateDbRecipe = onCall(async (req) => {
    const { name, preparationTime, instructions, ingredients, equipment, cardImgReg, id, } = req.data
    if (!name || !preparationTime || !instructions || !ingredients || !equipment || !cardImgReg) {
        logger.log("Error: Recipe data not found or invalid: ", req.data);
        return { success: false, message: "Recipe data not found or invalid" }
    }

    if (!req.auth) {
        return { success: false, message: "Error: User is not authenticated" }
    }

    try {
        const recipeRef = db.collection("Recipe").doc(id);
        const recipeSnapshot = await recipeRef.get();

        if (!recipeSnapshot.exists) {
            logger.log("Error: Recipe not found");
            return { success: false, message: "Error: Recipe not found" };
        }

        const recipeData = recipeSnapshot.data();

        if (recipeData.authorUid !== req.auth.uid) {
            logger.log("Error: Authenticated user is not the author of the recipe");
            return { success: false, message: "Error: Authenticated user is not the author of the recipe" };
        }


        logger.log("Attempting to update recipe with: ", req.data);

        await recipeRef.update({
            name: name,
            preparationTime: preparationTime,
            instructions: instructions,
            ingredients: ingredients,
            equipment: equipment,
            cardImgReg: cardImgReg,
        });

        logger.log("Recipe updated");
        return { success: true, message: "Recipe updated successfully", recipeId: recipeRef.id };
    } catch (error) {
        logger.error("Error updating recipe:", error);
        return { success: false, message: "Error updating recipe" };
    }
});

exports.deleteDbRecipe = onCall(async (req) => {
    const { id, } = req.data;

    if (!id || !req.auth) {
        logger.log("Error: Recipe ID or User ID not found");
        return { success: false, message: "Recipe ID or User ID not found" };
    }

    logger.log("Attempting to delete recipe with ID: " + id + " and user ID: " + req.auth.uid)
    try {
        const recipePath = "/Recipe/" + id;
        const recipeSnapshot = await db.doc(recipePath).get();

        if (!recipeSnapshot.exists) {
            logger.log("Error: Recipe not found");
            return { success: false, message: "Error: Recipe not found" };
        }

        const recipeData = recipeSnapshot.data();

        if (req.auth.uid === recipeData.authorUid) {
            logger.log("uId match, attempting to delete recipe");

            db.doc(recipePath).delete();
            console.log("Document successfully deleted!");


            const userQuery = db.collection("Users").where('uId', '==', req.auth.uid).limit(1);
            const userSnapshot = await userQuery.get();

            const userDoc = userSnapshot.docs[0];
            const userData = userDoc.data();
            const madeRecipes = userData.madeRecipes || [];

            if (madeRecipes.includes(id)) {
                madeRecipes.splice(madeRecipes.indexOf(id), 1);
            }

            logger.log("Recipe deleted");
            return { success: true, message: "Successfully deleted recipe" }
        }
        else {
            logger.log("Error: uId do not match");
            return { success: false, message: "Error: uId does not match recipe" };
        }


    } catch (error) {
        logger.error("Error deleting recipe:", error);
        return { success: false, message: "Error deleting recipe" };
    }
});

exports.addLikeRecipe = onCall(async (req) => {
    const { id } = req.data;

    logger.log("Attempting to like recipe with ID: " + id + " and user ID: " + req.auth.uid);
    if (!id || !req.auth) {
        logger.log("Error: Recipe ID or User ID not found");
        return { success: false, message: "Recipe ID or User ID not found" };
    }

    try {
        const recipeRef = db.doc("/Recipe/" + id);

        const userQuery = db.collection("Users").where('uId', '==', req.auth.uid).limit(1);
        const userSnapshot = await userQuery.get();

        if (userSnapshot.empty) {
            logger.log("Error: User not found");
            return { success: false, message: "Error: User not found" };
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        const likedRecipes = userData.likedRecipes || [];
        const dislikedRecipes = userData.dislikedRecipes || [];

        const recipeSnapshot = await recipeRef.get();
        if (!recipeSnapshot.exists) {
            logger.log("Error: Recipe not found");
            return { success: false, message: "Error: Recipe not found" };
        }

        const recipeData = recipeSnapshot.data();
        const likedBy = recipeData.likedBy || [];
        const dislikedBy = recipeData.dislikedBy || [];

        let likesChange = 0;
        let dislikesChange = 0;

        let alreadyLiked = false;
        if (likedBy.includes(req.auth.uid)) {
            likedBy.splice(likedBy.indexOf(req.auth.uid), 1);
            likedRecipes.splice(likedRecipes.indexOf(id), 1);
            likesChange = -1;
            alreadyLiked = true;
        } else {
            likedBy.push(req.auth.uid);
            if (!likedRecipes.includes(id)) {
                likedRecipes.push(id);
            }

            if (dislikedBy.includes(req.auth.uid)) {
                dislikedBy.splice(dislikedBy.indexOf(req.auth.uid), 1);
                dislikedRecipes.splice(dislikedRecipes.indexOf(id), 1);
                dislikesChange = -1;
            }

            likesChange = 1;
        }

        await userDoc.ref.update({
            likedRecipes: likedRecipes,
            dislikedRecipes: dislikedRecipes,
        });

        await recipeRef.update({
            likes: Math.max(0, recipeData.likes + likesChange),
            dislikes: Math.max(0, recipeData.dislikes + dislikesChange),
            likedBy: likedBy,
            dislikedBy: dislikedBy,
        });

        logger.log("Recipe like status updated successfully");
        return { success: true, message: "Recipe like status updated", alreadyLiked };
    } catch (error) {
        logger.error("Error liking recipe:", error);
        return { success: false, message: "Error liking recipe" };
    }
});

exports.addDislikeRecipe = onCall(async (req) => {
    const { id } = req.data;

    logger.log("Attempting to like recipe with ID: " + id + " and user ID: " + req.auth.uid);
    if (!id || !req.auth) {
        logger.log("Error: Recipe ID or User ID not found");
        return { success: false, message: "Recipe ID or User ID not found" };
    }

    try {
        const recipeRef = db.doc("/Recipe/" + id);

        const userQuery = db.collection("Users").where('uId', '==', req.auth.uid).limit(1);
        const userSnapshot = await userQuery.get();

        if (userSnapshot.empty) {
            logger.log("Error: User not found");
            return { success: false, message: "Error: User not found" };
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        const likedRecipes = userData.likedRecipes || [];
        const dislikedRecipes = userData.dislikedRecipes || [];

        const recipeSnapshot = await recipeRef.get();
        if (!recipeSnapshot.exists) {
            logger.log("Error: Recipe not found");
            return { success: false, message: "Error: Recipe not found" };
        }

        const recipeData = recipeSnapshot.data();
        const likedBy = recipeData.likedBy || [];
        const dislikedBy = recipeData.dislikedBy || [];

        let likesChange = 0;
        let dislikesChange = 0;

        let alreadyDisliked = false;
        if (dislikedBy.includes(req.auth.uid)) {
            dislikedBy.splice(dislikedBy.indexOf(req.auth.uid), 1);
            dislikedRecipes.splice(dislikedRecipes.indexOf(id), 1);
            dislikesChange = -1;
            alreadyDisliked = true;
        } else {
            dislikedBy.push(req.auth.uid);
            if (!dislikedRecipes.includes(id)) {
                dislikedRecipes.push(id);
            }

            if (likedBy.includes(req.auth.uid)) {
                likedBy.splice(likedBy.indexOf(req.auth.uid), 1);
                likedRecipes.splice(likedRecipes.indexOf(id), 1);
                likesChange = -1;
            }

            dislikesChange = 1;
        }

        await userDoc.ref.update({
            likedRecipes: likedRecipes,
            dislikedRecipes: dislikedRecipes,
        });

        await recipeRef.update({
            likes: Math.max(0, recipeData.likes + likesChange),
            dislikes: Math.max(0, recipeData.dislikes + dislikesChange),
            likedBy: likedBy,
            dislikedBy: dislikedBy,
        });

        logger.log("Recipe dislike status updated successfully");
        return { success: true, message: "Recipe dislike status updated", alreadyDisliked };
    } catch (error) {
        logger.error("Error disliking recipe:", error);
        return { success: false, message: "Error disliking recipe" };
    }
});

exports.getDbUser = onCall(async (req) => {
    const id = req.data.id;

    if (!id) {
        logger.log("Error: User ID not found");
        return { success: false, message: "User ID not found" };
    }

    try {
        const userQuery = db.doc('/Users/' + id);
        const userSnapshot = await userQuery.get();

        if (!userSnapshot.exists) {
            logger.log("Error: No user found");
            return { success: false, message: "No user found" };
        }

        const userData = userSnapshot.data();
        const madeRecipesIds = userData.madeRecipes || [];
        const likedRecipesIds = userData.likedRecipes || [];

        const name = userData.name;
        const pfpUrl = userData.pfpUrl;
        const biography = userData.biography;
        const madeRecipes = [];
        const likedRecipes = [];
        let ownPage = false;
        if (req.auth) {
            ownPage = (req.auth.uid == userData.uId);
        }


        for (const recipeId of madeRecipesIds) {
            const recipeRef = db.doc('/Recipe/' + recipeId);
            const recipeSnapshot = await recipeRef.get();

            if (recipeSnapshot.exists) {
                const recipeData = recipeSnapshot.data();
                madeRecipes.push({
                    id: recipeSnapshot.id,
                    name: recipeData.name || "",
                    likes: recipeData.likes || 0,
                    preparationTime: recipeData.preparationTime || 0,
                    cardImgReg: recipeData.cardImgReg || "",
                });
            } else {
                logger.log(`Made recipe with ID ${recipeId} not found`);
            }
        }

        for (const recipeId of likedRecipesIds) {
            const recipeRef = db.doc('/Recipe/' + recipeId);
            const recipeSnapshot = await recipeRef.get();
            if (recipeSnapshot.exists) {
                const recipeData = recipeSnapshot.data();

                let author = null;
                if (recipeData.authorRef) {
                    logger.log("Author ref found");
                    const aSnapshot = await recipeData.authorRef.get();
                    if (aSnapshot.exists) {
                        logger.log("Author found: ", aSnapshot.data());
                        author = {
                            id: aSnapshot.id,
                            name: aSnapshot.data().name,
                            pfpUrl: aSnapshot.data().pfpUrl,
                        };
                    } else {
                        logger.log("Author not found: ", recipeData.authorRef);
                        author = {
                            id: null,
                            name: "Deleted User",
                        };
                    }
                }

                likedRecipes.push({
                    id: recipeSnapshot.id,
                    name: recipeData.name || "",
                    likes: recipeData.likes || 0,
                    preparationTime: recipeData.preparationTime || 0,
                    cardImgReg: recipeData.cardImgReg || "",
                    author: author,
                });

            } else {
                logger.log(`Liked recipe with ID ${recipeId} not found`);
            }
        }

        logger.log("returning pfpUrl: ", pfpUrl);
        return { success: true, madeRecipes: madeRecipes, likedRecipes: likedRecipes, name: name, pfpUrl: pfpUrl, biography: biography, ownPage: ownPage };

    } catch (error) {
        logger.error("Error fetching user recipes:", error);
        return { success: false, message: "Error fetching user recipes" };
    }
});

exports.searchRecipeBy = onCall(async (req) => {
    const { phrase, searchBy, order} = req.data;
    logger.info(phrase,searchBy,order);
    const searchSpan = await db.collection("Recipe").orderBy(searchBy,order).limit(50).get();
    logger.info(searchSpan);
    let recipes=[];
    if(!searchSpan.empty){
        for(doc of searchSpan.docs){
            const recipeData = doc.data();
            const recipeName = recipeData.name
            logger.info(recipeName);
            logger.info(typeof(recipeName))
            if((recipeName.toLowerCase()).search(phrase.toLowerCase())!=-1){
                    let author = null;
                    if (recipeData.authorRef) {
                        logger.log("Author ref found");
                        logger.log(recipeData.authorRef)
                        const aSnapshot = await recipeData.authorRef.get();
                        logger.info(aSnapshot)
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
                    logger.info("Reached push")

                    recipes.push({
                        id: doc.id,
                        name: recipeData.name || "",
                        likes: recipeData.likes || 0,
                        preparationTime: recipeData.preparationTime || 0,
                        cardImgReg: recipeData.cardImgReg || "",
                        author: author
                    });
            }

        }
        logger.info("Recipes: ",recipes)

        return{success:true,recipeList:recipes}

    }else{
        return{success:false,message:"Search returned no result"}
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

exports.createDbUser = onCall(async (req) => {
    const { uName, pfpFile, uId } = req.data
    logger.log(req.data)
    if (!uName || !pfpFile || !uId) {
        throw new Error("Name, pfp, or UID not found");
    }

    logger.log("Attempting to add user : " + uName + " with uId: " + uId + " and pfp url: " + pfpFile);

    let madeRecipes = []
    let likedRecipes = []
    let dislikedRecipes = []
    try {
        const complete = await db.collection('Users').add({
            name: uName.slice(0, 25),
            pfpUrl: pfpFile,
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
    } catch (error) {
        logger.log("Error: ", error);
        return { success: false, message: "Error: ", error }
    }

});

exports.updateDbUser = onCall(async (req) => {

    const { uName, pfpDownloadURL, uBiography, uDocId } = req.data;

    if (!req.auth) {
        return { success: false, message: "User is not authenticated" };
    }

    if (!uDocId) {
        return { success: false, message: "User document ID is required" };
    }

    logger.log("Attempting to get user: ", uDocId);
    const ref = db.doc("/Users/" + uDocId);
    try {
        const dbUserQuery = await ref.get();

        if (!dbUserQuery.exists) {
            return { success: false, message: "User not found" };
        }

        const dbUserData = dbUserQuery.data();
        logger.log("User: ", dbUserData);

        if (req.auth.uid !== dbUserData.uId) {
            return { success: false, message: "Unauthorized: You cannot update this user" };
        }

        await ref.update({
            biography: uBiography.slice(0, 2000),
            name: uName.slice(0, 25),
            pfpUrl: pfpDownloadURL,
        });

        return { success: true, message: "User updated" };
    } catch (error) {
        logger.error("Error updating user:", error);
        return { success: false, message: "Could not update user", error };
    }
});

exports.deleteDbUser = onCall(async (req) => {
    const { uDocId } = req.data;
    if (!uDocId) {
        throw new Error("UDocID not found");
    }

    if (!req.auth || !req.auth.uid) {
        logger.error("No user UID found in the request");
        return { success: false, message: "Authentication failed" };
    }

    logger.info("Document id: " + uDocId + "\nUser req id: " + req.auth.uid);
    
    try {
        const dbUser = await db.collection('Users').doc(uDocId).get();

        if (!dbUser.exists) {
            logger.error("User not found");
            return { success: false, message: "User not found" };
        }

        const uId = dbUser.data().uId;

        if (req.auth.uid !== uId) {
            logger.error("User UID does not match the requested UID");
            return { success: false, message: "Authentication failed" };
        }

        logger.info("Authentication successful");

        await dbUser.ref.delete();

        logger.info("User deleted from the database");

        const deletedUserRecipes = dbUser.data().madeRecipes;

        const deletedDefaultUser = await db.doc("/Users/aLsEiyAU2DPPajSJdZ0f").get();
        const deletedDefaultUserRef = deletedDefaultUser.ref;

        let migratedRecipeIds = [];

        if (deletedUserRecipes.length > 0) {
            const updatePromises = deletedUserRecipes.map(async (recipeId) => {
                const recipeDoc = await db.collection("Recipe").doc(recipeId).get();
                if (recipeDoc.exists) {
                    await recipeDoc.ref.update({
                        authorUid: "",
                        authorRef: deletedDefaultUserRef,
                    });
                    migratedRecipeIds.push(recipeId);
                }
            });
            await Promise.all(updatePromises);

            if (migratedRecipeIds.length > 0) {
                await deletedDefaultUser.ref.update({
                    madeRecipes: admin.firestore.FieldValue.arrayUnion(...migratedRecipeIds)
                });

                logger.info("Default user's madeRecipes field updated with migrated recipe IDs");
            }
        }

        logger.log("User's recipes updated successfully");
        return { success: true, message: "User deleted successfully" };

    } catch (error) {
        logger.error("Error deleting user from database: ", error);
        return { success: false, message: "Error occurred while deleting user" };
    }
});

exports.getUDocIdFromUId = onCall(async (req) => {

    logger.info("Getting user ID: ");
    const { uId } = req.data;
    logger.info("Getting user with ID: " + uId);
    try {
        const uDoc = await db.collection('Users').where("uId", "==", uId).limit(1).get();
        if (uDoc != null) {
            logger.info("Returned uDocId", uDoc.docs[0].id)
            return { success: true, uDocId: uDoc.docs[0].id }
        } else {
            logger.error("Could not get user doc ID")
            return { success: false, message: "Could not get user doc ID" }
        }
    }
    catch (error) {
        logger.error("Error in getting doument from user ID:", error);
    }
});

exports.searchRecipeBy = onCall(async (req) => {
    const { phrase, searchBy, order} = req.data;
    logger.info(phrase,searchBy,order);
    const searchSpan = await db.collection("Recipe").orderBy(searchBy,order).limit(50).get();
    logger.info(searchSpan);
    let recipes=[];
    if(!searchSpan.empty){
        for(doc of searchSpan.docs){
            const recipeData = doc.data();
            const recipeName = recipeData.name
            logger.info(recipeName);
            logger.info(typeof(recipeName))
            if((recipeName.toLowerCase()).search(phrase.toLowerCase())!=-1){
                    let author = null;
                    if (recipeData.authorRef) {
                        logger.log("Author ref found");
                        logger.log(recipeData.authorRef)
                        const aSnapshot = await recipeData.authorRef.get();
                        logger.info(aSnapshot)
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
                    logger.info("Reached push")
    
                    recipes.push({
                        id: doc.id,
                        name: recipeData.name || "",
                        likes: recipeData.likes || 0,
                        preparationTime: recipeData.preparationTime || 0,
                        cardImgReg: recipeData.cardImgReg || "",
                        author: author
                    });
            }
    
        }
        logger.info("Recipes: ",recipes)
    
        return{success:true,recipeList:recipes}

    }else{
        return{success:false,message:"Search returned no result"}
    }
 
});

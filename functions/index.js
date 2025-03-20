/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { getFirestore, query, orderBy, limit, getDocs } = require('firebase-admin/firestore');
const { getStorage, getDownloadURL, uploadBytes } = require('firebase-admin/storage');
const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require('firebase-admin/app');

const logger = require("firebase-functions/logger");

initializeApp({
    storageBucket: 'sound-of-peanuts-cooking-site.appspot.com'
});

const db = getFirestore();
const store = getStorage();

exports.helloWorld = onCall(async (req, res) => {
    logger.info("Hello logs!", { structuredData: true });

    try {
        return { message: "Hello from Firebase!" };
    } catch (error) {
        logger.error("Error in Cloud Function:", error);
        return { error: error.message }; //Return an error message to the client
    }
});

exports.getDbRecipesByMostRecent = onCall(async (req, res) => {
    const docLimit = req.data.docLimit || 6;
    if (!docLimit || typeof docLimit !== 'number') {
        logger.log("Error: docLimit not found or invalid: ", docLimit);
        return { success: false, message: "docLimit not found or invalid" };
    }

    logger.info("Requesting " + docLimit + " most liked recipes");

    try {
        const q = db.collection('Recipe').orderBy('likes', 'desc').limit(docLimit);

        const snapshot = await q.get();

        logger.log("Requested posts "+ req.data);
        if (snapshot.empty) {
            logger.log("Error: no recipes found");
            return { success: false, message: "No recipes found" };
        } else {
            const recipes = [];
            snapshot.docs.forEach(doc => {
                const recipeData = doc.data();
                recipes.push({
                    id: doc.id,
                    name: recipeData.name || "",
                    likes: recipeData.likes || 0,
                    preparationTime: recipeData.preparationTime || 0,
                    cardImgReg: recipeData.cardImgReg || "",
                    // authorName: recipeData.authorRef || ""
                });
            });
            logger.log("Recipes found: ", recipes);
            return { success: true, recipeList: recipes };
        }
    } catch (error) {
        logger.error("Error fetching recipes by most likes:", error);
        return { success: false, message: "Error fetching recipes" };
    }
});

exports.getDbRecipesByMostLikes = onCall(async (req, res) => {
    const docLimit = req.data.docLimit || 6;
    if (!docLimit || typeof docLimit !== 'number') {
        logger.log("Error: docLimit not found or invalid: ", docLimit);
        return { success: false, message: "docLimit not found or invalid" };
    }

    logger.info("Requesting " + docLimit + " most liked recipes");

    try {
        const q = db.collection('Recipe').orderBy('likes', 'desc').limit(docLimit);

        const snapshot = await q.get();

        logger.log("Requested posts "+ req.data);
        if (snapshot.empty) {
            logger.log("Error: no recipes found");
            return { success: false, message: "No recipes found" };
        } else {
            const recipes = [];
            snapshot.docs.forEach(doc => {
                const recipeData = doc.data();
                recipes.push({
                    id: doc.id,
                    name: recipeData.name || "",
                    likes: recipeData.likes || 0,
                    preparationTime: recipeData.preparationTime || 0,
                    cardImgReg: recipeData.cardImgReg || "",
                    // authorName: recipeData.authorRef || ""
                });
            });
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
        const q = db.collection('Recipe').orderBy('name').limit(docLimit);

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
            snapshot.docs.forEach(doc => {
                const recipeData = doc.data();
                recipes.push({
                    id: doc.id,
                    name: recipeData.name || "",
                    likes: recipeData.likes || 0,
                    preparationTime: recipeData.preparationTime || 0,
                    cardImgReg: recipeData.cardImgReg || "",
                    // authorName: recipeData.authorRef || ""
                });
            });
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            logger.log("Recipes found: ", recipes);
            return { success: true, recipeList: recipes, lastDocId: lastDoc.id };
        }
    } catch (error) {
        logger.error("Error fetching recipes by most likes:", error);
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
        const recipeData = snapshot.data();
        const recipe = {
            name: recipeData.name || "",
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.instructions || "",
            likes: recipeData.likes || 0,
            dislikes: recipeData.dislikes || 0,
            author: recipeData.author || "",
            preparationTime: recipeData.preparationTime || 0,
            equipment: recipeData.equipment || [],
            cardImgReg: recipeData.cardImgReg || "",
            publishDate: recipeData.publishDate || ""
        };
        return { success: true, recipe }
    }
});

exports.postDbRecipe = onCall(async (req, res) => {
    const { title, ingredients, steps, author, likes, comments } = req.data
    const complete = await db.collection('Recipe').add({
        title: title,
        ingredients: ingredients,
        steps: steps,
    })
    if (complete) {
        return { success: true, message: "Recipe added" }
    }
    else {
        return { success: false, message: "Error: could not create recipe" }
    }
});

exports.addLikeRecipe = onCall(async (req, res) => {
    const { id, userId } = req.data;

    logger.log("Attempting to like recipe with ID: " + id + " and user ID: " + userId);
    if (!id || !userId) {
        logger.log("Error: Recipe ID or User ID not found");
        return { success: false, message: "Recipe ID or User ID not found" };
    }

    const ref = db.doc("/Recipe/" + id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
        return { success: false, message: "Error: recipe not found" };
    } else {
        const recipeData = snapshot.data();
        const likedBy = recipeData.likedBy || [];
        const dislikedBy = recipeData.dislikedBy || [];

        if (likedBy.includes(userId)) {
            return { success: false, message: "You have already liked this recipe" };
        }
        let dislikes = 0
        if (dislikedBy.includes(userId)) {
            dislikedBy.splice(dislikedBy.indexOf(userId), 1)
            dislikes = -1
        }

        likedBy.push(userId);
        await ref.update({
            likes: recipeData.likes + 1,
            dislikes: recipeData.dislikes + dislikes,
            dislikedBy: dislikedBy,
            likedBy: likedBy
        });

        return { success: true, message: "Recipe liked" };
    }
});

exports.addDislikeRecipe = onCall(async (req, res) => {
    const { id, userId } = req.data;

    logger.log("Attempting to dislike recipe with ID: " + id + " and user ID: " + userId);
    if (!id || !userId) {
        logger.log("Error: Recipe ID or User ID not found");
        return { success: false, message: "Recipe ID or User ID not found" };
    }

    const ref = db.doc("/Recipe/" + id);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
        return { success: false, message: "Error: recipe not found" };
    } else {
        const recipeData = snapshot.data();
        const likedBy = recipeData.likedBy || [];
        const dislikedBy = recipeData.dislikedBy || [];

        if (dislikedBy.includes(userId)) {
            return { success: false, message: "You have already disliked this recipe" };
        }

        let likes = 0

        if (likedBy.includes(userId)) {
            likedBy.splice(likedBy.indexOf(userId), 1)
            likes = 1
        }

        likedBy.push(userId);
        await ref.update({
            dislikes: recipeData.dislikes + 1,
            likes: recipeData.likes - likes,
            likedBy: likedBy,
            dislikedBy: dislikedBy
        });

        return { success: true, message: "Recipe liked" };
    }
});

exports.getDbUser = onCall(async (req, res) => {
    const { uID } = req.data
    if (!uID) {
        throw new Error("UID not found")
    }

    const snapshot = await db.collection('User').where('uId', '==', req.query.uId).limit(1).get();

    if (snapshot.empty) {
        return { success: false, message: 'Error:no user with this UID' }

    } else {
        return { success: true, user: snapshot.data() }

    }
});

exports.verifyUser = onCall(async (req, res) => {
    const { token } = req.data;

    if (!token) {
        throw new Error("Token not found");
    }

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        return { success: true, uid: decodedToken.uid };
    } catch (error) {
        return { success: false, message: "Invalid token" };
    }
});

exports.createDbUser = onCall(async (req, res) => {
    const { uName, pfpFile, uId } = req.data
    if (!uName || !pfpFile || !uId) {
        throw new Error("Name, pfp, or UID not found")
    }

    const pfpRef = ref(store, uId + "/pfp.png")
    uploadBytes(pfpRef, pfpFile).then((snapshot) => {
        pfpDownloadURL = getDownloadURL(snapshot.ref);
    })

    const complete = await db.collection('User').add({
        name: uName,
        pfpUrl: pfpDownloadURL,
        uId: uId
    })

    logger.log("Attempting to add user : " + uName + " with uId: " + uId + " and pfp url: " + pfpDownloadURL);

    if (complete) {
        return { success: true, message: "User added" }
    }
    else {
        return { success: false, message: "Error: could not create user" }
    }
});

exports.updateDbUser = onCall(async (req, res) => {
    const { uName, pfpFile, uId } = req.data
    const pfpRef = ref(store, uId + "/pfp.png")
    uploadBytes(pfpRef, pfpFile).then((snapshot) => {
        pfpDownloadURL = getDownloadURL(snapshot.ref);
    })

    const complete = await db.collection('User').doc(uId).update({
        name: uName,
        pfpUrl: pfpDownloadURL
    })

    if (complete) {
        return { success: true, message: "User updated" }
    }
    else {
        return { success: false, message: "Error: could not update user" }
    }
});

exports.deleteDbUser = onCall(async (req, res) => {
    const { uId } = req.data
    if (!uId) {
        throw new Error("UID not found")
    }

    const complete = await db.collection('User').doc(uId).delete()

    if (complete) {
        return { success: true, message: "User deleted" }
    }
    else {
        return { success: false, message: "Error: could not delete user" }
    }
});

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage, getDownloadURL, uploadBytes } = require('firebase-admin/storage');
const { onCall } = require("firebase-functions/v2/https");

const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');

initializeApp({
  storageBucket: 'sound-of-peanuts-cooking-site.appspot.com'
});

const db = getFirestore();
const store = getStorage();

exports.helloWorld = onCall(async (req, res) => {
  logger.info("Hello logs!", { structuredData: true });

  try {
    return { message: "Hello from Firebase!"};
  } catch (error) {
    logger.error("Error in Cloud Function:", error);
    return { error: error.message }; //Return an error message to the client
  }
});

exports.getDbRecipes = onCall(async(req,res)=>{
    const {num} = req.data
    const q = query(db.collection('Recipe'),orderBy('likes'),limit(num))
    const snapshot = await getDocs(q);
    logger.info("Requested posts",req);
    
    if(snapshot.empty){
        return{success:false,message:"No recipes found"}

    }else{
        const recipes = [];
        snapshot.docs.forEach(doc =>{
            recipes.push({
                id:doc.id,
                ...doc.data()
            })
        })
        return {success:true,recipeList:recipes}
    }
})
exports.getDbRecipeSingle = onCall(async(req,res)=>{
    const {id} = req.data   
    if(!id){
        throw new Error("id not found")
    }

    const snapshot = await db.doc("/Recipe/"+id).get();

    if(snapshot.empty){
        return{success:false,message:"Error: recipe not found"}
    }
    else{
        return{success: true,recipe:snapshot.data()}
    }
})

exports.getDbUser = onCall(async(req,res)=>{
    const {uID} = req.data
    if(!uID){
        throw new Error("UID not found")
    }

    const snapshot = await db.collection('User').where('uId','==',req.query.uId).limit(1).get();

    if(snapshot.empty){
        return{success:false,message:'Error:no user with this UID'}

    }else{
        return{success:true,user:snapshot.data()}

    }
})

exports.createDbUser = onCall(async(req,res)=>{
    const{uName,pfpFile,uId} = req.data
    pfpRef = ref(store,uId+"/pfp.png")
    uploadBytes(pfpRef,pfpFile).then((snapshot)=>{
        pfpDownloadURL = getDownloadURL(snapshot.ref);
    })

    const complete = await db.collection('User').add({
        name: uName,
        pfpUrl: pfpDownloadURL,
        uId: uId
    })

    if(complete){
        return{success:true,message:"User added"}
    }
    else{
        return{success:false,message:"Error: could not create user"}
    }
});

exports.postDbRecipe = onCall(async(req,res)=>{
    const {title,ingredients,steps,author,likes,comments} = req.data
    const complete = await db.collection('Recipe').add({
        title:title,
        ingredients:ingredients,
        steps:steps,
    })
    if(complete){
        return{success:true,message:"Recipe added"}
    }
    else{
        return{success:false,message:"Error: could not create recipe"}
    }
});
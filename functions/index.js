/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {limit,getDocs,orderBy} = require('firebase/firestore');
const { uploadBytes } = require('firebase/storage');
const {onCall} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage,getDownloadURL, } = require('firebase-admin/storage');
//const { default: Recipe } = require('@/pages/Recipe.vue');
initializeApp({storageBucket: 'sound-of-peanuts-cooking-site.appspot.com'});
const db = getFirestore();
const store = getStorage();


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.getDbRecipes = onCall(async(req,res)=>{
    num = req.query.quantity
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
        return recipes

    }
})

exports.getDbRecipeSingle = onCall(async(req,res)=>{
    const id = req.data
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
    }else{
        return{success:false,message:"Error: could not create user"}
    }

})
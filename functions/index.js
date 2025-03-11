/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {limit,getDocs,orderBy} from 'firebase/firestore';
import { uploadBytes } from 'firebase/storage';
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getStorage,getDownloadURL, } = require('firebase-admin/storage')
const db = getFirestore();
const store = getStorage();
initializeApp({storageBucket: 'sound-of-peanuts-cooking-site.appspot.com'});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.getDbRecipes = onRequest(async(req,res)=>{
    num = req.query.quantity
    const q = query(db.collection('Recipe'),orderBy('likes'),limit(num))
    const snapshot = await getDocs(q);
    logger.info("Requested posts",req);
    
    if(snapshot.empty){
        res.send('Error:no posts found')

    }else{
        res.json(snapshot.data())

    }
})

exports.getDbRecipeSingle = onRequest(async(req,res)=>{
    const q = query(db.collection("Recipes"),where('recipeId','==',req.query.rId).limit(1).get())
    const snapshot = await(getDocs(q));

    if(snapshot.empty){
        res.send('Error:no recipe found')
    }
    else{
        res.json(snapshot.data())
    }

})

exports.getDbUser = onRequest(async(req,res)=>{

    const snapshot = await db.collection('User').where('uId','==',req.query.uId).limit(1).get();

    if(snapshot.empty){
        res.send('Error:no user with this UID')

    }else{
        res.json(snapshot.data())

    }
})

exports.createDbUser = onRequest(async(req,res)=>{
    pfpRef = ref(store,req.query.uId+"/pfp.png")
    uploadBytes(pfpRef,req.query.pfpFile).then((snapshot)=>{
        pfpDownloadURL = getDownloadURL(snapshot.ref);
    })

    const complete = await db.collection('User').add({
        name: req.query.uName,
        pfpUrl: pfpDownloadURL,
        uId: req.query.uId
    })

    if(complete){
        res.send("User added")
    }else{
        res.send("Error: could not create user")
    }

})
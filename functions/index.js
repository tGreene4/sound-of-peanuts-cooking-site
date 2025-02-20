/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {limit,getDocs,orderBy} from 'firebase/firestore';
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.getDbRecipes = onRequest(async(req,res)=>{
    num = req.query.quantity
    const q = query(db.collection('Recipe'),orderBy('likes'),limit(num))
    const snapshot = await getDocs(q);
    
    if(snapshot.empty){
        res.send('Error:no posts found')

    }else{
        res.json(snapshot.data())

    }
})

exports.getDbUser = onRequest(async(req,res)=>{

    const snapshot = await db.collection('User').where('uId','==',req.query.uid).limit(1).get();

    if(snapshot.empty){
        res.send('Error:no user with this UID')

    }else{
        res.json(snapshot.data())

    }
})
import {limit,getDocs,orderBy} from 'firebase/firestore';
const {onRequest} = require('firebase/functions/v2/https')
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
initializeApp();

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
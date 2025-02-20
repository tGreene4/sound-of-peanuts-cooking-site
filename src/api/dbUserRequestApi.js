
const {onRequest} = require('firebase/functions/v2/https')
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
initializeApp();

exports.getDbUser = onRequest(async(req,res)=>{

    const snapshot = await db.collection('User').where('uId','==',req.query.uid).limit(1).get();

    if(snapshot.empty){
        res.send('Error:no user with this UID')

    }else{
        res.json(snapshot.data())

    }
})

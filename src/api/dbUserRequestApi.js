
const {onRequest} = require('firebase/functions/v2/https')
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
initializeApp();



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDla9VlcegBM2_Aja0QiYNRh5FPhkJYVdA",
  authDomain: "sound-of-peanuts-cooking-site.firebaseapp.com",
  projectId: "sound-of-peanuts-cooking-site",
  storageBucket: "sound-of-peanuts-cooking-site.appspot.com",
  messagingSenderId: "673148647334",
  appId: "1:673148647334:web:2ee44e6f6210134a518167",
  measurementId: "G-XX6V4GR026"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app);

if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
  console.log('Connecting to the local emulator');
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
 
export { app, db, auth, storage, functions };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
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

  export default {app,db};
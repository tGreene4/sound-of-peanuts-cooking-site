// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);

export default app;
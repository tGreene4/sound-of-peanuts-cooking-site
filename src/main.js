
// Import the functions you need from the SDKs you need
import { createApp } from 'vue';
import App from './App.vue'
import './assets/main.css'

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

const app = firebase.initializeApp(firebaseConfig);

createApp(App).mount('#app')

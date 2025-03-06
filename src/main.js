
// Import Vue app functions for creating Vue app
import { createApp } from 'vue';
import App from './App.vue';
//router functions
import {createRouter, createWebHistory} from 'vue-router';
//SPA routes
import routes from "./router/routes"

//bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/js/dist/tab.js"


//router object
let mainRouter = createRouter({
    history:createWebHistory(),
    routes:routes
});

//main vue app create object, attach to index.html
const mainApp = createApp(App);
mainApp.use(mainRouter);
mainApp.mount('#app');

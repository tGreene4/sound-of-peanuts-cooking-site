function loadPage(component) {
    // '@' is aliased to src/components
    return () => import(
        /* webpackChunkName: "[request]" */
        `@/pages/${component}.vue`)
}

import { auth } from '@/api/firebase'

function isAuth(to, from, next) {
    if (auth.currentUser) {
        next();
    } else {
        next('/');
    }
}
export default [
    { path: '/', component: loadPage('Home') },
    { path: '/recipe/:id', component: loadPage('Recipe'), props: true },
    { path: '/user/:id', component: loadPage('User')},
    { path: '/search', component: loadPage('Search')},
    { path: '/account', component: loadPage('Accounts')},
    { path: '/createRecipe', component: loadPage('CreateRecipe') },
    { path: '/updateRecipe/:id', component: loadPage('UpdateRecipe'), props:true},
    { path: '/secure', component: loadPage('Secure'), beforeEnter: isAuth },
    { path: '/:pathMatch(.*)*', component: loadPage('NotFound') },
]
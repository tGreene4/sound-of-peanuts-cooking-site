function loadPage(component) {
    // '@' is aliased to src/components
    return () => import(
        /* webpackChunkName: "[request]" */
        `@/pages/${component}.vue`)
}
export default [
    { path: '/', component: loadPage('Home') },
    { path: '/search', component: loadPage('Search') },
    { path: '/recipe', component: loadPage('Recipe'),props:true},
    { path: '/user', component: loadPage('User'),props:true},
    { path: '/account', component: loadPage('Accounts')},
    { path: '/CreateRecipe', component: loadPage('CreateRecipe') },
]
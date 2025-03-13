function loadPage(component) {
    // '@' is aliased to src/components
    return () => import(
        /* webpackChunkName: "[request]" */
        `@/pages/${component}.vue`)
}

export default [
    { path: '/', component: loadPage('Home') },
    { path: '/search', component: loadPage('Search') },
    { path: '/recipe/:id',name:'Recipe', component: loadPage('Recipe'),props:true},
    { path: '/user/:id', component: loadPage('User'),props:true},
    { path: '/account', component: loadPage('Accounts')}
]
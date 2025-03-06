function loadPage(component) {
    // '@' is aliased to src/components
    return () => import(
        /* webpackChunkName: "[request]" */
        `@/pages/${component}.vue`)
}
export default [
    { path: '/', component: loadPage('Home') },
    { path: '/search', component: loadPage('Search') },
    { path: '/recipe', component: loadPage('Recipe') },
    { path: '/user', component: loadPage('User')},
    { path: '/account', component: loadPage('Accounts')}
]
<template>
    <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
        <div class="container-fluid">
            <a class = "navbar-brand">
                <img src = "../assets/images/Potluck Logo.png" height="50vh">
            </a>
            <button @click="$router.push('/')" class="btn btn-primary col-1" type="button">Home</button>
            <button @click="$router.push('/search')" class="btn btn-primary" type="button">Search</button>
        </div>
    </nav>
</template>
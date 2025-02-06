<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Comic Neue"></link>
    <div class="container-fluid" id="headerContainer">
        <div class="row" style="padding:0; margin:0">
            <a class = "navbar-brand ml-5 col" href="/">
                <img src = "../assets/images/Potluck Logo.png" height="50vh" class="d-inline-block align-text-bottom">
                <h1 class="d-none d-md-inline">Potluck</h1>
            </a>
            <div class="input-group col" id="searchBar">
                <button @click="$router.push('/search')" class="btn btn-primary" id="searchButton" type="button">Search</button>
                <input type="text" class="form-control" placeholder="Search" id="searchBar">
            </div>
            
            <div class="col"><a href="/"><img src="../assets/images/User icon.png" height="50vh" style="float: inline-end;"></a></div>
            
        </div>
    </div>
</template>



<style scoped>
*{
    font-family: "Comic Neue";
}
#searchButton{
    background-color: #BA3500;
    border-color: brown;
}
h1{
    
    display: inline;
    font-size: 200%;
    margin-left: 5px;
}
#headerContainer{
    background-color: rgb(255, 183, 77);
    padding:1vh
}
</style>
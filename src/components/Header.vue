<script setup>
</script>

<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=ComicNeue">
    <div class="container-fluid justify-content-center"  id="headerContainer">
            <a class = "navbar-brand col-xs-10" href="/">
                <img src = "../assets/images/Potluck Logo.png" height="50vh" class="d-inline-block align-text-bottom">
                <h1 class="">Potluck</h1>
            </a>
            <a href="/account"><img src="../assets/images/User icon.png" height="50vh" style="float: right;"></a>
            <button @click="$router.push('/CreateRecipe')" class="btn btn-primary" type="button">Create Recipe</button>
    </div>
</template>


<style scoped>
*{
    font-family: "Comic Neue";
}
h1{
    display: inline;
    font-size: 200%;
    margin-left: 5px;
}
#headerContainer{
    background-color: rgb(255, 183, 77);
    border-bottom: 3px solid black;
    padding:1vh;
    width: 100%;
    height: 10%;
    max-height: 100px;
    min-width: 720px;
}
.btn{
  background-color: black;
  border: none;
  position: relative;
  right: 10px;
  Box-shadow: 3px 3px 10px white;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  float: right;
}
</style>
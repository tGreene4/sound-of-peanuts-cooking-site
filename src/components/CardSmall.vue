<template>
    <div class="card" style="width: 10rem; height : 20rem">
            <img class="card-img-top img-thumbnail" src="..\assets\images\coconut.png" alt="Card image cap">
        <div class="card-body">
        <h5 class="card-title">Card title</h5>      
        <button @click="$router.push('/recipe')" class="btn btn-primary">Recipe</button>
        </div>
    </div>
</template>
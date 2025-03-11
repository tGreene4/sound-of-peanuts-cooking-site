<script setup>
    import { httpsCallable } from 'firebase/functions';
    import funcs from "../api/firebase"


    const props = defineProps({
        thisRecipeId: Number
    });

    const dbRecipeRequest = httpsCallable(funcs,"getDbSingleRecipe");
    dbRecipeRequest({rid: props.thisRecipeId})
        .then((res)=>{const output = res.data.text;console.log(output);})
        .catch((error)=>{console.log(error)})
</script>

<template>
    <div class="card" style="width: 18rem;">
        <img style="width: 15rem; height: 15rem" class="card-img-top img-thumbnail .img-fluid"
            src="..\assets\images\coconut.png" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's
                content.</p>
            <button @click="$router.push('/recipe')" class="btn btn-primary">Recipe</button>
        </div>
    </div>
</template>

<style scoped>
.img-fluid {
    max-width: 50%;
    max-height: auto;
}
</style>
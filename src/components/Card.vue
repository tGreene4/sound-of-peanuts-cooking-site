<script setup>
    import {ref} from 'vue'
    const props = defineProps({
        thisRecipeId: Number,
        thisRecipeName: String,
        thisAuthorName: String,
        thisCookTime: Number,
        thisLikes: Number,
        thisImgStorageSrc: String
    });

    const recipeLink = ref("/recipe/"+props.thisRecipeId)

</script>

<template>
    <div class="card" style="width: 18rem;">
        <img style="width: 15rem; height: 15rem" class="card-img-top img-thumbnail .img-fluid"
            src="..\assets\images\coconut.png" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title"><a :href="recipeLink">{{thisRecipeName}}</a></h5>
            <h6 class = "card-text">by {{thisAuthorName}}</h6>
            <p class="card-text" style="display: inline;float: left;">{{thisCookTime}} Minutes</p>
            <p class="card-text" style="display: inline;float: right;">{{thisLikes}} Likes</p>
        </div>
    </div>
</template>

<style scoped>
.img-fluid {
    max-width: 50%;
    max-height: auto;
}
</style>
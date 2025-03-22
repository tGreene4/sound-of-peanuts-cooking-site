<script setup>
    import { ref } from 'vue'
    import placeholderImg from '@/assets/images/coconut.png';
    const props = defineProps({
        thisRecipeId: String,
        thisRecipeName: String,
        thisAuthor: {
            type: Object,
            default: () => ({ 
                name: "Unknown" //add default pfp and no link, like a deleted reddit profile
            })
        },
        thisCookTime: Number,
        thisLikes: Number,
        thisImgStorageSrc: String
    });
    const recipeLink = ref("/recipe/"+props.thisRecipeId)
</script>

<template>
    <div class="card" id="card">
        <a :href="recipeLink"><img class="card-img-top img-thumbnail img-fluid align-self-center" 
            :src= "thisImgStorageSrc || placeholderImg" alt="Card image cap"></a>
        <div class="card-body">
            <h5 class="card-title"><a :href="recipeLink">{{thisRecipeName}}</a></h5>
            <h6 class = "card-text">by {{thisAuthor.name}}</h6>
            <p class="card-text" style="display: inline;float: left;">{{thisCookTime}} Minutes</p>
            <p class="card-text" style="display: inline;float: right;">{{thisLikes}} Likes</p>
        </div>
    </div>
</template>

<style scoped>
.img-fluid {
    max-width: 100%;
    max-height: 100%;
}
.card{
  box-shadow: 2px 5px 5px black;
  width: 18rem;
  background-color: rgba(255, 183, 77,50% );
  position: relative;
}

.card-body{
  background: linear-gradient(to bottom, rgba(255, 183, 77,50% ),rgba(255, 183, 77,0% ));
}
</style>
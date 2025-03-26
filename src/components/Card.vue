<script setup>
    import { ref } from 'vue'
    import placeholderPfp from '@/assets/images/User icon.png';
    import placeholderImg from '@/assets/images/coconut.png';
    const props = defineProps({
        thisRecipeId: String,
        thisRecipeName: String,
        thisAuthor: {
            type: Object,
            default: () => ({ 
                name: "Unknown", //add default pfp and no link, like a deleted reddit profile
                pfpUrl: "",
                id: 0
            })
        },
        thisCookTime: Number,
        thisLikes: Number,
        thisImgStorageSrc: String
    });
    const recipeLink = ref("/recipe/"+props.thisRecipeId)
    const authorLink = ref("/user/"+props.thisAuthor.id)
</script>

<template>
    <div class="card" id="card">
        <a :href="recipeLink"><img class="card-img-top img-thumbnail img-fluid align-self-center"
            :src= "thisImgStorageSrc || placeholderImg" alt="Card image cap"></a>
        <div class="card-body">
          <h5 class="card-title"><a :href="recipeLink">{{thisRecipeName}}</a></h5>
          <div class="row justify-content-center">
            <div class="col-6">
              <p class="card-text" style="display: inline;float: left;">{{thisCookTime}} Minutes</p>
              <p class="card-text" style="display: inline;float: left;">{{thisLikes}} Likes</p>
            </div>
            <div class="col-2 "></div>
            <div class="col-4" style="padding-bottom: 1px">
              <!--TO DO: Pfps still broken? -->
              <a :href="authorLink" style="float: right">
                <img id="Avatar" class="card-img-top img-thumbnail" :src="thisAuthor.pfpUrl || placeholderPfp" alt="Avatar">
                <h6 class = "card-text">by {{thisAuthor.name}}</h6>
              </a>
            </div>

          </div>
        </div>
    </div>
</template>

<style scoped>
.img-fluid {
    width: 100%;
    height: 100%;
    max-width: 18rem;
    max-height: 22rem;
}

#Avatar{
  border-radius: 50%;
  height: 3rem;
  width: 3rem;
  max-height: 3rem;
  max-width: 3rem;
  background: lightgray;
  border: 1px solid black;
}
.card{
  box-shadow: 2px 5px 5px black;
  width: 18rem;
  background-color: rgba(255, 183, 77, 75% );
  position: relative;
}
</style>
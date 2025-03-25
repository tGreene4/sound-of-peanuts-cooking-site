<script setup>
    import { ref } from 'vue'
    import placeholderImg from '@/assets/images/coconut.png';
    const props = defineProps({
        thisRecipeId: String,
        thisRecipeName: String,
        thisAuthor: {
            type: Object,
            default: () => ({ 
                name: "Unknown", //add default pfp and no link, like a deleted reddit profile
                pfpUrl: "@/assets/images/coconut.png",
            })
        },
        thisCookTime: Number,
        thisLikes: Number,
        thisImgStorageSrc: String
    });
    const recipeLink = ref("/recipe/"+props.thisRecipeId)
    const authorLink = ref("/user/")
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
            <div class="col-6" style="padding-bottom: 10px">
              <!--TO DO: Make the author Link actually link to the author, get the author's pfp and set it as the image here-->
              <a :href="authorLink" style="float: right">
                <img id="Avatar" class="card-img-top img-thumbnail" :src="placeholderImg" alt="Avatar">
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
  max-height: 70px;
  max-width: 70px;
}
.card{
  box-shadow: 2px 5px 5px black;
  width: 18rem;
  background-color: rgba(255, 183, 77, 75% );
  position: relative;
}
</style>
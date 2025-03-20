<script>
import Card from "@/components/Card.vue";
</script>

<script setup>
import { functions } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import { ref, onMounted } from 'vue';


const mostRecent = ref([]);
const mostLiked = ref([]);
const more = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

const getMostLikedRecipe = async () => {
  console.log("Calling getDbRecipesByMostLikes");
  const getDbMostLikedRecipe = httpsCallable(functions, 'getDbRecipesByMostLikes');
  try {
    const docLimit = 6;
    console.log("Calling getDbMostLikedRecipe with docLimit: ", docLimit);
    const result = await getDbMostLikedRecipe({ docLimit: 6 }); // Ensure docLimit is passed correctly
    console.log("Response from getDbMostLikedRecipe:", result.data);

    if (result.data.success) {
      console.log("Recipe found:", result.data);
      return result.data.recipeList;
    } else {
      console.log("Recipes not found: ", result.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error calling getDbRecipesByMostLikes:", error);
    return [];
  }
};

const getMostRecentRecipe = async () => {
  console.log("Calling getDbRecipesByMostRecent");
  const getDbMostRecentRecipe = httpsCallable(functions, 'getDbRecipesByMostRecent');
  try {
    const docLimit = 6;
    console.log("Calling getDbRecipesByMostRecent with docLimit: ", docLimit);
    const result = await getDbMostRecentRecipe({ docLimit: 6 }); // Ensure docLimit is passed correctly
    console.log("Response from getDbRecipesByMostRecent:", result.data);

    if (result.data.success) {
      console.log("Recipe found:", result.data);
      return result.data.recipeList;
    } else {
      console.log("Recipes not found: ", result.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error calling getDbRecipesByMostRecent:", error);
    return [];
  }
};

onMounted(async () => {
  try {
    const mostRecentRecipes = await getMostRecentRecipe();
    if (mostRecentRecipes.length > 0) {
      mostRecent.value = mostRecentRecipes;
    }
    else {
      mostRecent = [];
    }
    const mostLikedRecipes = await getMostLikedRecipe();
    if (mostLikedRecipes.length > 0) {
      mostLiked.value = mostLikedRecipes;
    }
    else {
      mostLiked = [];
    }

  } catch (error) {
    console.error("Critical error onMounted: ", error);
  }
});

</script>
<template>
  <div class="container-fluid align-self-center gradient-custom w-100 min-vh-100">

    <h1 class="sectionHeader">Most Recent</h1>
    <div class="row" id="mostRecentField">
      <div class="col-sm-auto" id="MostRecent" v-for="item in mostRecent">
        <div class="cardContainer">
          <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthorRef="item.authorRef"
            :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
        </div>
      </div>
    </div>

    <h1 class="sectionHeader">Most Liked</h1>
    <div class="row" id="mostLikedField">
      <div class="col-sm-auto" id="MostLiked" v-for="item in mostLiked">
        <div class="cardContainer">
          <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthorRef="item.authorRef"
            :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
        </div>
      </div>
    </div>

    <h1 class="sectionHeader">More</h1>
    <div class="row" id="moreField" style="padding-bottom: 25px">
      <div class="col-sm-auto" id="More" v-for="item in more">
        <div class="cardContainer">
          <Card thisRecipeId={{item}} />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-custom {
  background: linear-gradient(to right, rgba(242, 233, 126, 75%), rgba(255, 121, 0, 50%));
}

.sectionHeader {
  border: 3px solid;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  border-left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 5px 5px 5px black;
  position: relative;
  top: 5px;
  left: -15px;
  width: 15%;
  min-width: 250px;
  text-align: center;
  background: rgba(255, 183, 77, 50%);
}

.row {
  position: relative;
  align-self: center;
}

.cardContainer {
  padding-top: 5px;
  padding-bottom: 5px;
  position: relative;
  align-self: center;
}
</style>
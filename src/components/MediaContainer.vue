<script>
import Card from "@/components/Card.vue";
</script>

<script setup>
import { functions } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import { ref, onMounted } from 'vue';


const mostRecent = ref([]);
const mostLiked = ref([]);
const more = ref([]);

const getRecipeByField = async (queryType = 'likes', order = 'desc') => {
  console.log("Calling getDbRecipesByField");
  const getDbRecipesByField = httpsCallable(functions, 'getDbRecipesByField');
  try {
    const docLimit = 6;
    console.log(`Calling getDbRecipesByField with queryType: ${queryType}, order: ${order}, docLimit: ${docLimit}`);
    const result = await getDbRecipesByField({ queryType, order, docLimit });
    console.log("Response from getDbRecipesByField:", result.data);

    if (result.data.success) {
      console.log("Recipes found:", result.data.recipeList);
      return result.data.recipeList;
    } else {
      console.warn("Recipes not found:", result.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error calling getDbRecipesByField:", error);
    return [];
  }
};

let lastDocId = ref(null);
const getMoreRecipe = async () => {
  console.log("Calling getDbMoreRecipes");
  const getDbMoreRecipes = httpsCallable(functions, 'getDbMoreRecipes');
  try {
    const docLimit = 6;
    console.log("Calling getDbMoreRecipes with docLimit: ", docLimit);
    const result = await getDbMoreRecipes({ docLimit, lastDocId: lastDocId.value});
    console.log("Response from getDbMoreRecipes:", result.data);

    if (result.data.success) {
      console.log("Recipe found:" , result.data);
      console.log("Last Doc ID: ", result.data.lastDocId);
      lastDocId.value = result.data.lastDocId;
      return result.data.recipeList;
    } else {
      console.warn("Recipes not found: ", result.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error calling getDbMoreRecipes:", error);
    return [];
  }
};

const tryGetMoreRecipes = async () => {
  try {
    const moreRecipes = await getMoreRecipe();
    if (moreRecipes.length > 0) {
      more.value.push(...moreRecipes);
    } else {
      console.log("No more recipes to load.");
    }
  } catch (error) {
    console.error("Error in tryGetMoreRecipes: ", error);
  }
};

onMounted(async () => {
  try {
    const mostRecentRecipes = await getRecipeByField('publishDate', 'desc');
    if (mostRecentRecipes.length > 0) {
      mostRecent.value = mostRecentRecipes;
    }
    else {
      mostRecent = [];
    }
    const mostLikedRecipes = await getRecipeByField('likes', 'desc');
    if (mostLikedRecipes.length > 0) {
      mostLiked.value = mostLikedRecipes;
    }
    else {
      mostLiked = [];
    }
    const moreRecipes = await getMoreRecipe();
    if (mostLikedRecipes.length > 0) {
      more.value = moreRecipes;
    }
    else {
      more = [];
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
          <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
            :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
        </div>
      </div>
    </div>

    <h1 class="sectionHeader">Most Liked</h1>
    <div class="row" id="mostLikedField">
      <div class="col-sm-auto" id="MostLiked" v-for="item in mostLiked">
        <div class="cardContainer">
          <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
            :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
        </div>
      </div>
    </div>

    <h1 class="sectionHeader">Most</h1>
    <div class="row" id="moreField">
      <div class="col-sm-auto" id="More" v-for="item in more">
        <div class="cardContainer">
          <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
            :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
        </div>
      </div>
      <button @click="tryGetMoreRecipes">Load More</button>  <!--If more fails to return more recipes, remove this button and functionality(script bool)-->
      <button @click="$router.push('/createRecipe')"></button>
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
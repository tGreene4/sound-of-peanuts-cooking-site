<script setup>
import { functions, auth } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import { ref, onMounted } from 'vue';

import IngredientList from '@/components/IngredientList.vue';

const getHelloWorld = async () => {
  console.log("Calling helloWorld");
  const helloWorld = httpsCallable(functions, 'helloWorld');
  try {
    const result = await helloWorld({});
    console.log(result.data);
  } catch (error) {
    console.error("Error calling helloWorld:", error);
  }
};

const routeProp = defineProps(['id']);

const recipe = ref({
  name: '',
  ingredients: [],
  instructions: [],
  likes: 0,
  dislikes: 0,
  image: '',
  author: '',
  preparationTime: 0,
  equipment: '',
  publishDate: ''
});

const getDbRecipeSingle = async () => {
  console.log("Calling getDbRecipeSingle with ID:", routeProp.id);
  const getDbRecipeSingleFunction = httpsCallable(functions, 'getDbRecipeSingle');
  try {
    const result = await getDbRecipeSingleFunction({ id: routeProp.id });
    console.log("Response from getDbRecipeSingle:", result.data);

    if (result.data.success) {
      const recipeData = result.data.recipe;
      console.log("Recipe found:", recipe);

      recipe.value = {
        name: recipeData.name || "No name provided",
        ingredients: recipeData.ingredients || "No ingredients provided",
        instructions: recipeData.instructions || "No instructions provided",
        likes: recipeData.likes || 0,
        dislikes: recipeData.dislikes || 0,
        image: recipeData.image || '',
        author: recipeData.authorRef || '',
        preparationTime: recipeData.preparationTime || 0,
        equipment: recipeData.equipment || '',
        publishDate: recipeData.publishDate || ''
      };
    } else {
      console.log("Recipe not found: ", result.data.message);
      //set up a 404 page when this works consistently
      recipe.value = {
        name: "Recipe not found",
        ingredients: "",
        instructions: "",
        likes: 0,
        dislikes: 0,
        image: '',
        author: '',
        preparationTime: 0,
        equipment: ''
      };
    }
  } catch (error) {
    console.error("Error calling getDbRecipeSingle:", error);
         //set up a 404 page when this works consistently
    recipe.value = {
      name: "Error fetching recipe",
      ingredients: "",
      instructions: "",
      likes: 0,
      dislikes: 0,
      image: '',
      author: '',
      preparationTime: 0,
      equipment: ''
    };
  }
};

const likeRecipe = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not authenticated. Cannot like the recipe.");
    return;
  }

  const uid = user.uid;

  console.log("Calling addLikeRecipe with ID:", routeProp.id, "and user ID: ", uid);
  const likeRecipeFunction = httpsCallable(functions, 'addLikeRecipe');
  try {
    const result = await likeRecipeFunction({ id: routeProp.id , uid});
    console.log(result.data);
  } catch (error) {
    console.error("Error calling addLikeRecipe:", error);
  }
};

const dislikeRecipe = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.error("User is not authenticated. Cannot like the recipe.");
    return;
  }

  const uid = user.uid;

  console.log("Calling addDislikeRecipe with ID:", routeProp.id, "and user ID: ", uid);
  const dislikeRecipeFunction = httpsCallable(functions, 'addDislikeRecipe');
  try {
    const result = await dislikeRecipeFunction({ id: routeProp.id , uid});
    console.log(result.data);
  } catch (error) {
    console.error("Error calling addDislikeRecipe:", error);
  }
};

onMounted(() => {
    getDbRecipeSingle();
  });
</script>

<template>
  <div class="container-fluid bg-secondary min-vh-100" style="padding-top: 20px;">
    <div class="row d-flex justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 d-flex justify-content-center align-items-center">
                <img class="img-fluid rounded" src="../assets/images/coconut.png" alt="Recipe default" style="max-width: 100%; height: auto;">
              </div>
              <div class="col-md-6">
                <h2 class="card-title mb-4">{{ recipe.name }}</h2>
                <div class="mb-4">
                  <h5>Ingredients:</h5>
                  <p class="card-text">{{ recipe.ingredients }}</p>
                </div>
                <div class="mb-4">
                  <h5>Instructions:</h5>
                  <p class="card-text">{{ recipe.instructions }}</p>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-primary" @click="likeRecipe">Like</button>
                  <button class="btn btn-primary" @click="dislikeRecipe">Dislike</button>
                  <button class="btn btn-secondary" @click="getHelloWorld">Hello World</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 15px;
  background-color: lightblue;
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
}

.card-text {
  font-size: 1.1rem;
  line-height: 1.6;
}

.btn {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}
</style>
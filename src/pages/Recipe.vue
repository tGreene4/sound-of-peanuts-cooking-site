<script setup>
import { functions, auth } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import { ref, onMounted, useId } from 'vue';

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

const recipeName = ref('');
const recipeIngredients = ref('');
const recipeInstructions = ref('');

const getDbRecipeSingle = async () => {
  console.log("Calling getDbRecipeSingle with ID:", routeProp.id);
  const getDbRecipeSingleFunction = httpsCallable(functions, 'getDbRecipeSingle');
  try {
    const result = await getDbRecipeSingleFunction({ id: routeProp.id });
    console.log("Response from getDbRecipeSingle:", result.data);

    if (result.data.success) {
      const recipe = result.data.recipe;
      console.log("Recipe found:", recipe);

      recipeName.value = recipe.name || "No name provided";
      recipeIngredients.value = recipe.ingredients || "No ingredients provided";
      recipeInstructions.value = recipe.instructions || "No instructions provided";
    } else {
      console.log("Recipe not found: ", result.data.message);
      recipeName.value = "Recipe not found";
      recipeIngredients.value = "";
      recipeInstructions.value = "";
    }
  } catch (error) {
    console.error("Error calling getDbRecipeSingle:", error);
    recipeName.value = "Error fetching recipe";
    recipeIngredients.value = "";
    recipeInstructions.value = "";
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

/**>
const postRecipe = async () => {
  console.log("Calling postRecipe with name:", recipeName.value);
  const postRecipeFunction = httpsCallable(functions, 'postRecipe');
  try {
    const result = await postRecipeFunction({
      name: recipeName.value,
      ingredients: recipeIngredients.value,
      instructions: recipeInstructions.value
    });
    console.log(result.data);
  } catch (error) {
    console.error("Error calling postRecipe:", error);
  }
};
*/

onMounted(() => {
    getDbRecipeSingle();
  });
</script>

<template>
  <div class="container-fluid bg-secondary min-vh-100 vh-100" style="padding-top: 10px;">
    <div class='row d-flex align-items-start'>
      <div class="col-md-2">
      </div>
      <div class="col-md-4">
        <!--<IngredientList></IngredientList> -->  
      </div>
      <div class="col-md-5 d-flex justify-content-center align-items-center" style="background-color: lightblue; padding: 20px; border-radius: 15px;">
        <img class="img-fluid rounded w-50 h-auto" src="..\assets\images\coconut.png" alt="Recipe default">
      </div>
      
      <div class="col-md-12 mt-4">
        <p><strong>Name:</strong> {{ recipeName }}</p>
        <p><strong>Ingredients:</strong> {{ recipeIngredients }}</p>
        <p><strong>Instructions:</strong> {{ recipeInstructions }}</p>
      </div>

      <button class="btn btn-primary" @click="likeRecipe">Like</button>
      <button class="btn btn-primary" @click="dislikeRecipe">Dislike</button>
      <button class="btn btn-primary" @click="getHelloWorld">Hello world</button>
    </div>
  </div>
</template>
<script setup>
import { functions } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import { ref } from 'vue';

import Sidebar from '../components/Sidebar.vue';
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

const recipeId = ref('');
const recipeName = ref('');
const recipeIngredients = ref('');
const recipeInstructions = ref('');

const getDbRecipeSingle = async () => {
  console.log("Calling getDbRecipeSingle with ID:", recipeId.value);
  const getDbRecipeSingleFunction = httpsCallable(functions, 'getDbRecipeSingle');
  try {
    const result = await getDbRecipeSingleFunction({ id: recipeId.value });
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error calling getDbRecipeSingle:", error);
    return null;
  }
};

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

</script>

<template>
  <div class="container-fluid bg-secondary min-vh-100 vh-100" style="padding-top: 10px;">
    <div class='row d-flex align-items-start'>
      <div class="col-md-2">
        <Sidebar />
      </div>
      <div class="col-md-4">
        <IngredientList></IngredientList>   
      </div>
      <div class="col-md-5 d-flex justify-content-center align-items-center" style="background-color: lightblue; padding: 20px; border-radius: 15px;">
        <img class="img-fluid rounded w-50 h-auto" src="..\assets\images\coconut.png" alt="Recipe default">
      </div>
      
      <button class="btn btn-primary" @click="getHelloWorld">Hello world</button>

      <input v-model="recipeId" placeholder="Enter Recipe ID" class="form-control mb-2" />
      <button class="btn btn-primary" @click="getDbRecipeSingle">Get Recipe</button>    

      
      <div class="col-md-12 mt-4">
        <h3>Add New Recipe</h3>
        <input v-model="recipeName" placeholder="Recipe Name" class="form-control mb-2" />
        <textarea v-model="recipeIngredients" placeholder="Ingredients" class="form-control mb-2"></textarea>
        <textarea v-model="recipeInstructions" placeholder="Instructions" class="form-control mb-2"></textarea>
        <button class="btn btn-primary" @click="postRecipe">Add Recipe</button>
      </div>

    </div>
  </div>
</template>
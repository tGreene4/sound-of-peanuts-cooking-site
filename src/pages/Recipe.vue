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

const getDbRecipeSingle = async () => {
  console.log("Calling getDbRecipeSingle with ID:", recipeId.value);
  const getDbRecipeSingleFunction = httpsCallable(functions, 'getDbRecipeSingle');
  try {
    const result = await getDbRecipeSingleFunction({ id: recipeId.value });
    console.log(result.data);
  } catch (error) {
    console.error("Error calling getDbRecipeSingle:", error);
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
    </div>
  </div>
</template>
<script setup>
import { functions, auth } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import {useRouter} from "vue-router";
import { ref, onMounted } from 'vue';

const router = useRouter();
const recipeNotFound = ref(false);
const loading = ref(true);
const readableDate = ref('');
const ownsRecipe = ref(false);

const getHelloWorld = async () => { //remove before final deployment
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
  author: [],
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
      if (recipeData.publishDate && recipeData.publishDate._seconds) {
        const date = new Date(recipeData.publishDate._seconds * 1000);
        readableDate.value = date.toLocaleDateString();
      }
      console.log(recipeData.publishDate._seconds);
    }
    else {
      console.log("Recipe not found: ", result.data.message);
      recipeNotFound.value = true;
    }
  } catch (error) {
    console.error("Error calling getDbRecipeSingle:", error);
    recipeNotFound.value = true;
  } finally {
    loading.value = false;
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
    const result = await likeRecipeFunction({ id: routeProp.id, uid });
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
    const result = await dislikeRecipeFunction({ id: routeProp.id, uid });
    console.log(result.data);
  } catch (error) {
    console.error("Error calling addDislikeRecipe:", error);
  }
};

onMounted(() => {
  getDbRecipeSingle();
});
</script>

<!-- TODO: 
Add the popup to ask for authentication on like+dislike buttons
Show author name (hyperlinked) and PFP near the title
Add a script to +1 or -1 like number locally
-->

<template>
  <div class="container-fluid bg-secondary gradient-custom min-vh-100" style="padding-top: 20px;">
    <div v-if="loading" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else-if="recipeNotFound" class="text-center">
      <h1>Recipe Not Found</h1>
      <p>The recipe you are looking for does not exist or has been removed.</p>
      <router-link to="/" class="btn btn-primary">Return to Home</router-link>
    </div>
    <div v-else class="row d-flex justify-content-center">
      <div class="col-md-8 ">
        <div class="card vh-80 shadow-sm">
          <div class="card-body d-flex flex-column h-100">
            <div class="row">
              <div class="col-md-6 d-flex justify-content-center align-items-center border">
                <img class="img-fluid rounded" src="../assets/images/coconut.png" alt="Recipe default"
                  style="max-width: 100%; height: auto;">
              </div>
              <div class="col-md-6">
                <h2 class="card-title mb-1">{{ recipe.name }}</h2>
                <p>Preparation Time: <b>{{ recipe.preparationTime }} mins</b> &emsp; {{ recipe.authorRef }}
                  &emsp; Published: {{ readableDate }}</p>
                <hr class="my-1" />
                <div class="m-4">
                  <h5>Ingredients:</h5>
                  <p class="card-text">
                    <li v-for="item in recipe.ingredients">
                      {{ item }}
                    </li>
                  </p>
                </div>
                <hr class="my-1" />
                <div class="m-2">
                  <h5>Instructions:</h5>
                  <p class="card-text">
                  <ol>
                    <li v-for="item in recipe.instructions">
                      {{ item }}
                    </li>
                  </ol>
                  </p>
                </div>

              </div>
            </div>
              <div class="d-flex gap-2 mt-auto justify-content-end border-top py-3">
                <button v-if="ownsRecipe" class="btn btn-outline-dark" @click="router.push('/updaterecipe/'+routeProp.id)">Edit</button>
                <button class="btn btn-outline-success" @click="likeRecipe">Like {{ recipe.likes }}</button>
                <button class="btn btn-outline-danger" @click="dislikeRecipe">Dislike {{ recipe.dislikes }}</button>
               <!---<button class="btn btn-secondary" @click="getHelloWorld">Hello World</button> --> 
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  background: rgb(240, 240, 240);
  border: black 2px solid;
  border-radius: 15px;
  Box-shadow: 3px 3px 5px black;
  max-width: 20rem;
  min-width: 5rem;
}

.card {
  border-radius: 15px;
  background-color: rgb(245, 247, 248);
  min-height: 750px;
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

.gradient-custom {
  background: linear-gradient(to right, rgba(242, 233, 126, 75%), rgba(255, 121, 0, 50%));
}
</style>
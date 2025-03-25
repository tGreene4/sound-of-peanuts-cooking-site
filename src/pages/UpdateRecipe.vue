<script setup>
import { functions, auth } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import { ref, onMounted } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import placeholderImg from '@/assets/images/coconut.png';
import NotFound from '@/components/NotFound.vue';

// Props
const routeProp = defineProps(['id']);

// Reactive variables
const recipe = ref({
    name: '',
    ingredients: [],
    instructions: [],
    equipment: [],
    preparationTime: 0,
    image: '',
});
const recipeNotFound = ref(false);
const loading = ref(true);
const downloadURL = ref('');

const addField = (type) => {
    switch (type) {
        case 'instructions':
            recipe.value.instructions.push({ value: '' });
            break;
        case 'ingredients':
            recipe.value.ingredients.push({ value: '' });
            break;
        case 'equipment':
            recipe.value.equipment.push({ value: '' });
            break;
    }
};

const deleteField = (type, index) => {
    switch (type) {
        case 'instructions':
            recipe.value.instructions.splice(index, 1);
            break;
        case 'ingredients':
            recipe.value.ingredients.splice(index, 1);
            break;
        case 'equipment':
            recipe.value.equipment.splice(index, 1);
            break;
    }
};

const getDbRecipeSingle = async () => {
    console.log("Calling getDbRecipeSingle with ID:", routeProp.id);
    const getDbRecipeSingleFunction = httpsCallable(functions, 'getDbRecipeSingle');
    try {
        const result = await getDbRecipeSingleFunction({ id: routeProp.id });
        console.log("Response from getDbRecipeSingle:", result.data);

        if (result.data.success) {
            const recipeData = result.data.recipe;
            console.log("Recipe found:", recipeData);

            recipe.value = {
                name: recipeData.name || "No name provided",
                ingredients: (recipeData.ingredients || []).map((ingredient) => ({ value: ingredient })),
                instructions: (recipeData.instructions || []).map((instruction) => ({ value: instruction })),
                equipment: (recipeData.equipment || []).map((equipment) => ({ value: equipment })),
                preparationTime: recipeData.preparationTime || 0,
                image: recipeData.image || '',
            };
            downloadURL.value = recipeData.image || '';
        } else {
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

// Update recipe
const updateRecipe = async () => {
    if (!recipe.value.name || !recipe.value.preparationTime || !recipe.value.instructions.length || !recipe.value.ingredients.length || !recipe.value.equipment.length || !downloadURL.value) {
        console.error("Error: Missing required fields");
        alert("Please fill in all fields before updating the recipe.");
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        console.error("Error: User is not authenticated");
        alert("You must be logged in to update a recipe.");
        return;
    }
    const parsedInstructions = recipe.value.instructions.map((step) => step.value);
    const parsedIngredients = recipe.value.ingredients.map((ingredient) => ingredient.value);
    const parsedEquipment = recipe.value.equipment.map((item) => item.value);

    const updateDbRecipe = httpsCallable(functions, 'updateDbRecipe');
    try {
        console.log(`Calling updateDbRecipe`);
        const result = await updateDbRecipe({
            id: routeProp.id,
            name: recipe.value.name,
            preparationTime: parseInt(recipe.value.preparationTime),
            instructions: parsedInstructions,
            ingredients: parsedIngredients,
            equipment: parsedEquipment,           
            cardImgReg: downloadURL.value,
            uid: user.uid,
        });

        console.log("Response from updateDbRecipe:", result.data);

        if (result.data.success) {
            console.log("Recipe updated successfully", result.data.message);
            alert("Recipe updated successfully!");
        } else {
            console.warn("Recipe failed to update", result.data.message);
            alert("Failed to update the recipe. Please try again.");
        }
    } catch (error) {
        console.error("Error calling updateDbRecipe:", error);
        alert("An error occurred while updating the recipe. Please try again.");
    }
};

// Delete recipe
const deleteRecipe = async () => {
    const user = auth.currentUser;
    if (!user) {
        console.error("Error: User is not authenticated");
        alert("You must be authenticated to delete this recipe.");
        return;
    }

    const deleteDbRecipe = httpsCallable(functions, 'deleteDbRecipe');
    try {
        console.log(`Calling deleteDbRecipe`);
        const result = await deleteDbRecipe({ id: routeProp.id, uid: user.uid });

        console.log("Response from deleteDbRecipe:", result.data);

        if (result.data.success) {
            console.log("Recipe deleted successfully", result.data.message);
            alert("Recipe deleted successfully!");
        } else {
            console.warn("Recipe failed to delete", result.data.message);
            alert("Failed to delete the recipe. Please try again.");
        }
    } catch (error) {
        console.error("Error calling deleteDbRecipe:", error);
        alert("An error occurred while deleting the recipe. Please try again.");
    }
};

const handleFileUpload = async (event) => {
    try {
        const storage = getStorage();
        const file = event.target.files[0];
        const fileRef = storageRef(storage, 'images/' + file.name);
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        console.log(url);
        downloadURL.value = url;
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};

onMounted(() => {
    getDbRecipeSingle();
});
</script>

<template>
    <div class="main container-fluid align-self-center min-vh-100">
        <div v-if="loading" class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else-if="recipeNotFound">
            <NotFound />
        </div>
        <div v-else class="flex-d flex-column align-self-center" id="flexWrapper">
            <form class="align-self-center" id="content">
                <div class="container-fluid align-self-center">
                    <div class="row">
                        <div class="col-lg-3">
                            <br>
                            <div style="width:40%;align-self:center;">
                                <button class="form-control" type="button" @click="updateRecipe"
                                    style="width:200px;">Update Recipe</button>
                            </div>
                            <br>
                            <label for="nameField" class="form-label">Name</label>
                            <input class="form-control" v-model="recipe.name" id="nameField"><br><br><br><br>
                            <label for="timeField" class="form-label">Cooking Time (in minutes)</label>
                            <input class="form-control" v-model="recipe.preparationTime" id="timeField">
                            <br><br><br><br>
                        </div>
                        <div class="col-lg-3"></div>
                        <div class="col-lg-2">
                            <a>Upload Image</a><br>
                            <input type="file" id="media" accept="image/*" multiple
                                @change="(event) => handleFileUpload(event)" />
                            <br><br>
                        </div>
                        <div class="col-lg-3">
                            <img class="card-img-top img-thumbnail img-fluid align-self-center"
                                :src="downloadURL || placeholderImg" alt="Card image cap"
                                style="max-height:90%;max-width:90%;position: relative; top:10px">
                            <br>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-6 form-group">
                            <label for="instructionsField" class="form-label">Instructions</label>
                            <div class="container-fluid" id="instructionsFields"
                                v-for="(step, index) in recipe.instructions" :key="index">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Step # {{ index + 1
                                            }}</span>
                                    </div>
                                    <input type="text" class="form-control" v-model="step.value">
                                    <div class="input-group-append">
                                        <button class="btn" type="button"
                                            @click="deleteField('instructions', index)">X</button>
                                    </div>
                                </div>
                            </div>
                            <br><button type="button" @click="addField('instructions')">Add new step</button><br>
                        </div>
                        <div class="col-lg-1"></div>
                        <div class="col-lg-2 form-group">
                            <label for="ingredientFields" class="form-label">Ingredients</label>
                            <div id="ingredientFields" v-for="(ingredient, index) in recipe.ingredients" :key="index">
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" v-model="ingredient.value">
                                    <div class="input-group-append">
                                        <button class="btn" type="button"
                                            @click="deleteField('ingredients', index)">X</button>
                                    </div>
                                </div>
                            </div>
                            <br><button type="button" @click="addField('ingredients')">Add new Ingredient</button><br>
                        </div>
                        <div class="col-lg-1"></div>
                        <div class="col-lg-2 form-group">
                            <label for="equipmentFields" class="form-label">Equipment</label>
                            <div id="equipmentFields" v-for="(item, index) in recipe.equipment" :key="index">
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" v-model="item.value">
                                    <div class="input-group-append">
                                        <button class="btn" type="button"
                                            @click="deleteField('equipment', index)">X</button>
                                    </div>
                                </div>
                            </div>
                            <button type="button" class="align-self-start" @click="addField('equipment')">Add new
                                Equipment</button><br><br>
                        </div>
                    </div>

                    <br>
                    <div style="width:40%;align-self:center;">
                        <button class="form-control" type="button" @click="deleteRecipe" style="width:200px;">Delete
                            Recipe</button>
                    </div>
                    <br>
                </div>
            </form>
        </div>
    </div>
</template>


<style scoped>
#flexWrapper {
    background: radial-gradient(rgba(242, 233, 126, 50%), rgba(255, 121, 0, 25%));
    min-height: 99vh;
    height: 100%;
    align-items: center;
    border: 2px solid black;
    border-top: 0;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin-left: 20px;
    margin-right: 20px;
    position: relative;
}

#content {
    width: 100%;
    position: relative;
    left: 5px;
}

.form-label {
    font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
    font-weight: bold;
}

.col-lg-2 {
    width: 15%;
}

.col-lg-6 {
    width: 50%;
    position: relative;
    left: 10px
}

.form-group {
    border: 2px solid;
    border-radius: 5px;
    padding-bottom: 10px;
    padding-left: 10px;
    min-width: 300px;
    min-height: 50vh;
    Box-shadow: 3px 3px 5px black;
    background-color: rgba(255, 183, 77, 35%);
}

.main {
    background: radial-gradient(rgba(242, 233, 126, 75%), rgba(255, 121, 0, 50%));
    min-height: 100vh;
    height: 100%;
    padding: 0;
    margin: 0;
    position: relative;
}

.btn {
    color: red;
    border: none;
    border-radius: 0;
}

button {
    background: rgb(240, 240, 240);
    border: black 2px solid;
    border-radius: 15px;
    Box-shadow: 3px 3px 5px black;
}

img {
    border: 2px dashed black;
    border-radius: 20px;
}

#media {
    background: linear-gradient(to left, rgba(255, 121, 0, 0%), rgba(255, 121, 0, 100%));
    border-radius: 2px;
    width: 100%;
}


#field {
    width: 100%;
}
</style>
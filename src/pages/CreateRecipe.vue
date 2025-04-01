<script>
import { functions, auth } from '../api/firebase';
import { httpsCallable } from 'firebase/functions';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import placeholderImg from '@/assets/images/coconut.png';
import {useRouter} from "vue-router";

export default {
  data() {
    return {
      name: '',
      ingredients: [],
      equipment: [],
      steps: [],
      time: '',
      downloadURL: '',
      placeholderImg,
      loading: false,
      router: useRouter(),
    };
  },
  mounted() {
    this.ingredients.push({ value: '' });
    this.equipment.push({ value: '' });
    this.steps.push({ value: '' });
  },
  methods: {
    addField(type) {
      switch (type) {
        case 'ingredients':
          this.ingredients.push({value: ''});
          break;
        case 'equipment':
          this.equipment.push({value: ''});
          break;
        case 'steps':
          this.steps.push({value: ''});
          break;
      }
    },
    deleteField(type,index) {
      switch (type) {
        case 'ingredients':
          this.ingredients.splice(index,1);
          break;
        case 'equipment':
          this.equipment.splice(index,1);
          break;
        case 'steps':
          this.steps.splice(index,1);
          break;
      }
    },
    async handleFileUpload(event) {
      try {
        const storage = getStorage();
        const file = event.target.files[0];
        if (!file) return;
        
        const storageRef = ref(storage, 'images/' + file.name);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(downloadURL);
        this.downloadURL = downloadURL;
        const imageElement = this.$refs.image;
        if (imageElement) {
          imageElement.setAttribute("src", downloadURL);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    async postRecipe() {
  this.loading = true;

  if (!this.name || !this.time || !this.steps.length || !this.ingredients.length || !this.equipment.length || !this.downloadURL) {
    console.error("Error: Missing required fields");
    alert("Please fill in all fields before publishing the recipe.");
    this.loading = false;
    return;
  }

  const preparationTime = parseInt(this.time);
  if (isNaN(preparationTime) || preparationTime <= 0) {
    console.error("Error: Invalid cooking time");
    alert("Please enter a valid cooking time in minutes.");
    this.loading = false;
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    console.error("Error: User is not authenticated");
    alert("You must be logged in to post a recipe.");
    this.loading = false;
    return;
  }

  const postDbRecipe = httpsCallable(functions, 'postDbRecipe');
  try {
    console.log(`Calling postDbRecipe`);
    const result = await postDbRecipe({
      name: this.name,
      preparationTime: preparationTime,
      instructions: this.steps.map(step => step.value),
      ingredients: this.ingredients.map(ingredient => ingredient.value),
      equipment: this.equipment.map(equipment => equipment.value),
      cardImgReg: this.downloadURL,
      uid: user.uid,
    });

    console.log("Response from postDbRecipe:", result.data);

    if (result.data.success) {
      console.log("Recipe posted successfully", result.data.message);
      console.log("Routing to recipe ", result.data.recipeId);
      await this.router.push("/recipe/" + result.data.recipeId);
    } else {
      console.warn("Recipe failed to post", result.data.message);
    }
  } catch (error) {
    console.error("Error calling postDbRecipe:", error);
  } finally {
    this.loading = false;
  }
},
  },
};
</script>

<template>
  <div class="main container-fluid align-self-center min-vh-100">
    <div v-if="false" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else class="flex-d flex-column align-self-center" id="flexWrapper">
      <form class="align-self-center" id="content">
        <div class="container-fluid align-self-center">
          <div class="row justify-content-center">
            <div class="col-xl-3">
              <br>
              <div style="width:40%;align-self:center;">
                <button class="form-control" type="button" @click="postRecipe" style="width:200px;">Publish
                  Recipe</button>
              </div>
              <br>
              <label for="nameField" class="form-label">Name</label>
              <input class="form-control" v-model="name" id="nameField"><br><br><br><br>
              <label for="timeField" class="form-label">Cooking Time (in minutes)</label>
              <input class="form-control" v-model="time" id="timeField">
              <br><br><br><br>
            </div>
            <div class="col-xl-3"></div>
            <div class="col-xl-2 justify-content-center">
              <a>Upload Image</a><br>
              <input type="file" id="media" accept="image/*" multiple @change="(event) => handleFileUpload(event)" />
              <br><br>
            </div>
            <div class="col-xl-3">
              <img class="card-img-top img-thumbnail img-fluid align-self-center" :src="downloadURL || placeholderImg"
                alt="Card image cap" style="max-height:90%;max-width:90%;position: relative; top:10px">
              <br>
            </div>

            <div class="row justify-content-center">
              <div class="col-xxl-4 col-xl-12 form-group">
                <label for="instructionsField" class="form-label">Instructions</label>
                <div class="container-fluid" id="instructionsFields" v-for="(step, index) in steps">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="inputGroup-sizing-sm">Step # {{ index + 1 }}</span>
                    </div>
                    <input type="text" class="form-control" v-model="step.value" @keyup.enter="addField('steps')">
                    <div class="input-group-append">
                      <button class="btn" type="button" @click="deleteField('steps', index)" tabindex="-1">X</button>
                    </div>
                  </div>
                </div>
                <br><button type="button" @click="addField('steps')" tabindex="-1">Add new step</button><br>
              </div>

              <div class="col-xxl-2 col-xl-5 form-group">
                <label for="ingredientFields" class="form-label">Ingredients</label>
                <div id="ingredientFields" v-for="(ingredient, index) in ingredients">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" v-model="ingredient.value" @keyup.enter="addField('ingredients')">
                    <div class="input-group-append">
                      <button class="btn" type="button" @click="deleteField('ingredients', index)" tabindex="-1">X</button>
                    </div>
                  </div>
                </div>
                <br><button type="button" @click="addField('ingredients')" tabindex="-1">Add new Ingredient</button><br>

              </div>
              <div class="col-xxl-2 col-xl-5 form-group">
                <label for="equipmentFields" class="form-label">Equipment</label>
                <div id="equipmentFields" v-for="(item, index) in equipment">
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" v-model="item.value" @keyup.enter="addField('equipment')">
                    <div class="input-group-append">
                      <button class="btn" type="button" @click="deleteField('equipment', index)" tabindex="-1">X</button>
                    </div>
                  </div>
                </div><br>
                <button type="button" class="align-self-start" @click="addField('equipment')" tabindex="-1">Add new
                  Equipment</button><br><br>
              </div>
            </div>
          </div>
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

.form-label {
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  font-weight: bold;
  min-width: 50px;
}

.form-group {
  border: 2px solid;
  border-radius: 5px;
  min-width: 400px;
  margin: 5px;
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


img {
  border: 2px dashed black;
  border-radius: 20px;
  align-self: center;
}

button:hover{
  background: rgb(0, 0, 0);
  color: white;
}

</style>
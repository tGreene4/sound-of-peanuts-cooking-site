<script setup>
import { getFunctions, httpsCallable } from "firebase/functions";
import funcs from '../api/firebase';
</script>

<template>
  <div class = "flex-d flex-column align-self-center" id = "flexWrapper">
    <form class = "align-self-center" id = "content">
      <label for = "nameField" class = "form-label">Name</label>
      <input class="form-control" v-model="name" id="nameField">
      <div class="container-fluid align-self-center">
        <div class="row">

          <div class="col-lg-6">
            <label for = "instructionsField" class = "form-label">Instructions</label>
            <div class="container-fluid"   id="instructionsFields" v-for="(step,index) in steps">
              <div class= "row">
                <div class="col-sm-1"><a>Step {{index+1}}</a></div>
                <div class="col-sm-10">
                  <input id="field" class="form-label" v-model="step.value">
                </div>
                <div class="col-sm-1">
                  <button type="button" @click="deleteField('steps',index)">X</button>
                </div>
              </div>
            </div>
            <br><button type="button" @click="addField('steps')">Add new step</button><br>
          </div>

          <div class="col-lg-3">
            <label for = "ingredientFields" class = "form-label">Ingredients</label>
            <div id="ingredientFields" v-for="ingredient in ingredients">
              <div class="row">
                <div class="col-sm-11">
                  <input id="field" class = "form-label" v-model="ingredient.value">
                </div>
                <div class="col-sm-1">
                  <button type="button" @click="deleteField('ingredients',index)">X</button>
                </div>
              </div>
              <br>
            </div>
            <br><button type="button" @click="addField('ingredients')">Add new Ingredient</button><br>
          </div>

          <div class="col-lg-3">
            <label for = "equipmentFields" class = "form-label">Equipment</label>
            <div id="equipmentFields" v-for="item in equipment">
              <div class="row">
                <div class="col-sm-11">
                  <input id="field" class = "form-label" v-model="item.value">
                </div>
                <div class="col-sm-1">
                  <button type="button" @click="deleteField('equipment',index)">X</button>
                </div>
              </div>
              <br>
            </div>
            <br><button type="button" @click="addField('equipment')">Add new Equipment</button><br>
          </div>
        </div>
      </div>

      <!--Basic, doesn't work yet-->
      <br><a>Upload Image</a><br>
      <input type="file" id="media" accept="image/*" multiple @change="(event) => handleFileUpload(event)"/>
      <br><br>
      <label for = "timeField" class = "form-label">Time</label>
      <input class="form-control" v-model="time"  id="timeField">
      <br>
      <div style="width:40%;align-self:center;">
        <button class="form-control" type="button" @click="postRecipe">Save Recipe</button>
      </div>
      <br>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      ingredients: [],
      equipment: [],
      steps: [],
      time: '',
    }
  },
  mounted() {
    this.ingredients.push({value: ''});
    this.equipment.push({value: ''});
    this.steps.push({value: ''});
  },
  methods : {
    addField: function(type){
      switch(type){
        case('ingredients'):
          this.ingredients.push({value: ''});
          break;
        case('equipment'):
          this.equipment.push({value: ''});
          break;
        case('steps'):
          this.steps.push({value: ''});
          break;
      }
    },
    deleteField: function(type, index){
      switch(type){
        case('ingredients'):
          this.ingredients.splice(index, 1);
          break;
        case('equipment'):
          this.equipment.splice(index, 1);
          break;
        case('steps'):
          this.steps.splice(index, 1);
          break;
      }
    },
    handleFileUpload: function (event) {
      console.log("image uploaded");
    },

    //Method that hopefully uploads the recipe info to the db
    async postRecipe() {
      console.log(this.name);
      console.log(this.ingredients);
      console.log(this.equipment);
      console.log(this.steps );
      console.log(this.time);
      /* Code for posting recipe unfinished
      const postRecipe = httpsCallable(funcs, 'postrecipe');
      const result = await postRecipe(
          {
            "steps": this.steps,
            "authorId": 0,
            "cardImgReg": "blank",
            "time": this.time,
            "equipment": this.equipment,
            "ingredients": this.ingredients,
            "likes": 0,
            "name": this.name,
            "recipeId": 0,
          });
      console.log(result);
      */
    }
  }
}
</script>


<style scoped>
#flexWrapper{
  background-color: rgb(255, 243, 224);
  height: 100%;
  align-items: center;
  padding: 2vh;
  border: 2px solid lightgrey;
  border-radius: 20px;
  padding-bottom: 0;
  margin: 3vh;
}
#content{
  width: 100%;
}
.form-control{
  width: 20%;
}

#field{
  width:100%;
}
</style>

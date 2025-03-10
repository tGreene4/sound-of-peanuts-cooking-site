<template>
  <div class = "flex-d flex-column align-self-center" id = "flexWrapper">
    <form class = "align-self-center" id = "content">
      <label for = "nameField" class = "form-label">Name</label>
      <input class="form-control" v-model="name" id="nameField">
      <div class="container-fluid align-self-center">
        <div class="row">
          <div class="col-sm-6">
            <label for = "instructionsField" class = "form-label">Instructions</label>
            <div class="container-fluid"   id="instructionsFields" v-for="(step,index) in steps">
              <div class= "row">
                <div class="col-md-1"><a>{{index+1}}</a></div>
                <div class="col-md-11"><input id="field" class="form-label" v-model="step.value"><br></div>
              </div>
            </div>
            <br><button type="button" @click="addStep">Add new step</button><br>
          </div>
          <div class="col-sm-3">
            <label for = "ingredientFields" class = "form-label">Ingredients</label>
            <div id="ingredientFields" v-for="ingredient in ingredients">
              <input id="field" class = "form-label" v-model="ingredient.value"><br>
            </div>
            <br><button type="button" @click="addIngredient">Add new Ingredient</button><br>
          </div>
          <div class="col-sm-3">
            <label for = "equipmentFields" class = "form-label">Equipment</label>
            <div id="equipmentFields" v-for="item in equipment">
              <input id="field" class = "form-label" v-model="item.value"><br>
            </div>
            <br><button type="button" @click="addEquipment">Add new Equipment</button><br>
          </div>
        </div>
      </div>
      <!--Basic, doesn't work yet-->
      <br><a>Upload Image</a><br>
      <input type="file" id="media" accept="image/*" multiple @change="(event) => handelFileUpload(event)"/>
      <br><br>
      <label for = "timeField" class = "form-label">Time</label>
      <input class="form-control" v-model="time"  id="timeField">
      <div style="width:40%;align-self:center">
        <button class="form-control" type="button" @click="postRecipe">Save Recipe</button>
      </div>
    </form>
  </div>
</template>

<script>
import funcs from '../api/firebase';
import { getFunctions, httpsCallable } from "firebase/functions";
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
  methods : {
    //Method that adds a new input field to the given div
    addIngredient: function (){
      this.ingredients.push({value: ''});
    },
    addEquipment: function (){
      this.equipment.push({value: ''});
    },
    addStep: function (){
      this.steps.push({value: ''});
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
      /* Commented out for now
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

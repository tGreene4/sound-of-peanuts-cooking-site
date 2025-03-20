<script setup>
</script>

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

<template>
  <div class="main container-fluid align-self-center min-vh-100">
    <div class = "flex-d flex-column align-self-center" id = "flexWrapper">
      <form class = "align-self-center" id = "content">
        <div class="container-fluid align-self-center">
          <div class="row">
            <div class="col-lg-3">
              <br>
              <div style="width:40%;align-self:center;">
                <button class="form-control" type="button" @click="postRecipe" style = "width:200px;">Publish Recipe</button>
              </div>
              <br>
              <label for = "nameField" class="form-label">Name</label>
              <input class="form-control" v-model="name" id="nameField"><br><br><br><br>
              <label for = "timeField" class = "form-label">Cooking Time (in minutes)</label>
              <input class="form-control" v-model="time"  id="timeField">
              <br><br><br><br>
            </div>
            <div class="col-lg-3"></div>
            <div class="col-lg-2">
              <a>Upload Image</a><br>
              <input type="file" id="media" accept="image/*" multiple @change="(event) => handleFileUpload(event)"/>
              <br><br>
            </div>
            <div class="col-lg-3">
              <img class="card-img-top img-thumbnail img-fluid align-self-center"
                   src="..\assets\images\coconut.png" alt="Card image cap"
                   style="max-height:90%;max-width:90%;position: relative; top:10px">
              <br>
            </div>

          <div class="row">
            <div class="col-lg-6 form-group">
              <label for = "instructionsField" class = "form-label">Instructions</label>
              <div class="container-fluid"   id="instructionsFields" v-for="(step,index) in steps">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Step # {{index+1}}</span>
                  </div>
                  <input type="text" class="form-control" v-model="step.value">
                  <div class="input-group-append">
                    <button class="btn" type="button" @click="deleteField('steps',index)">X</button>
                  </div>
                </div>
              </div>
              <br><button type="button" @click="addField('steps')">Add new step</button><br>
            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-2 form-group">
              <label for = "ingredientFields" class = "form-label">Ingredients</label>
              <div id="ingredientFields" v-for="(ingredient,index) in ingredients">
                <div class="input-group mb-3">
                  <input type="text" class="form-control" v-model="ingredient.value">
                  <div class="input-group-append">
                    <button class="btn" type="button" @click="deleteField('ingredients',index)">X</button>
                  </div>
                </div>
              </div>
              <br><button type="button" @click="addField('ingredients')">Add new Ingredient</button><br>

            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-2 form-group">
              <label for = "equipmentFields" class = "form-label">Equipment</label>
              <div id="equipmentFields" v-for="(item,index) in equipment">
                <div class="input-group mb-3">
                  <input type="text" class="form-control" v-model="item.value">
                  <div class="input-group-append">
                    <button class="btn" type="button" @click="deleteField('equipment',index)">X</button>
                  </div>
                </div>
              </div>
              <button type="button" class="align-self-start" @click="addField('equipment')">Add new Equipment</button><br><br>
            </div>
          </div>
        </div>
        </div>
      </form>
    </div>
  </div>
</template>


<style scoped>
#flexWrapper{
  background: radial-gradient( rgba(242,233,126,50%),rgba(255,121,0,25%));
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
#content{
  width: 100%;
  position: relative;
  left: 5px;
}
.form-control{
}

.form-label{
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  font-weight: bold;
}
.col-lg-2{
  width: 15%;
}
.col-lg-6{
  width: 50%;
  position: relative;
  left:10px
}

.form-group{
  border: 2px solid;
  border-radius: 5px;
  padding-bottom: 10px;
  padding-left: 10px;
  min-width: 300px;
  min-height: 50vh;
  Box-shadow: 3px 3px 5px black;
  background-color: rgba(255, 183, 77,35%);
}

.main{
  background: radial-gradient( rgba(242,233,126,75%),rgba(255,121,0,50%));
  min-height: 100vh;
  height: 100% ;
  padding: 0;
  margin: 0;
  position: relative;
}

.btn{
  color: red;
  border: none;
  border-radius: 0;
}

button{
  background: rgb(240,240,240);
  border: black 2px solid;
  border-radius: 15px;
  Box-shadow: 3px 3px 5px black;
}
img{
  border: 2px dashed black;
  border-radius: 20px;
}

#media{
  background: linear-gradient(to left, rgba(255,121,0,0%),rgba(255,121,0,100%));
  border-radius: 2px;
  width: 100%;
}


#field{
  width:100%;
}
</style>
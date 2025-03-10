<template>
  <div class = "flex-d flex-column align-self-center" id = "flexWrapper">
    <form class = "align-self-center" id = "content">
      <label for = "nameField" class = "form-label">Name</label>
      <input class="form-control" id="nameField">
      <div class="container-fluid">
        <div class="row">
          <div class="col-sm-3">
            <label for = "ingredientFields" class = "form-label">Ingredients</label>
            <div id="ingredientFields">
              <input id="field" class = "form-label"><br>
            </div>
            <button type="button" @click="addInput('ingredientFields')">Add new Ingredient</button><br>
          </div>
          <div class="col-sm-3">
            <label for = "equipmentFields" class = "form-label">Equipment</label>
            <div id="equipmentFields">
              <input id="field" class = "form-label"><br>
            </div>
            <button type="button" @click="addInput('equipmentFields')">Add new Equipment</button><br>
          </div>
          <div class="col-sm-6">
            <!--Basic, the function for uploading this hasn't been made yet-->
            <a>Upload Image <br></a>
            <input type="file" id="media" accept="image/*" multiple @change="(event) => handelFileUpload(event)"/>
          </div>
        </div>
      </div>
      <label for = "instructionsField" class = "form-label">Instructions</label>
      <textarea id = "instructionsField" style="width:100%; height:500px"></textarea>
      <label for = "timeField" class = "form-label">Time</label>
      <input class="form-control" id="timeField">
      <div style="width:40%;align-self:center">
        <button class="form-control">Save Recipe</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  methods: {
    //Method that adds a new input field to the given div
    addInput(Field){
      const divEle = document.getElementById(Field);
      divEle.innerHTML += `<input id="field" class = "form-label"><br>`;
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
</style>

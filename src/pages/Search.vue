<script setup>
  import { httpsCallable } from 'firebase/functions';
  import { functions } from '@/api/firebase';
  import {ref} from 'vue'
  import Card from '@/components/Card.vue';
  const searchPhrase = ref("");
  const searchParam = ref("likes")
  const searchOrder = ref("desc");
  var resultsReady = true;

  const searchBy = httpsCallable(functions,"searchRecipeBy");
  var recipeList = ref([]);
  const startSearch= async()=>{
    try{
      console.log("Search with phrase "+searchPhrase.value+", search parameter "+searchParam.value+", ordered by "+searchOrder.value);
      const result=await searchBy({phrase:searchPhrase.value,searchBy:searchParam.value,order:searchOrder.value});
      console.log(result.data)
      if(result.data.success==true){
        recipeList.value=result.data.recipeList;
        console.log(recipeList)

      }

    }catch(error){
      console.log("Error searching:",error);
    }
    
  }


</script>

<template>
  <div class="container-fluid min-vh-100 vh-150" style="background-color: rgb(242, 233, 126, 75%);">
    <div class='row'>
      <div class="col-3">
        <div class = "options">
          <h3>Sort By:</h3>
          <div class="radioInput">
            <input class="form-check-input" type="radio" name="sortOptions" id="likes" value="likes" v-model="searchParam" checked><label class="form-check-label" for="likes">Popularity</label>
          </div>
          <div class="radioInput">
            <input class="form-check-input" type="radio" name="sortOptions" id="preparationTime" value="preparationTime" v-model="searchParam"><label class="form-check-label" for="preparationTime">Cook Time</label>
          </div>
          <div class="radioInput">
            <input class="form-check-input" type="radio" name="sortOptions" id="publishDate" value="publishDate" v-model="searchParam"><label class="form-check-label" for="publishDate">Date Published</label>
          </div>
          
          <br>
          <h3>Order:</h3>
          <div class="radioInput">
            <input class="form-check-input" type="radio" name="orderOptions" id="ascending" value="asc" v-model="searchOrder"><label class="form-check-label" for="ascending">Ascending</label>
          </div>
          <div class="radioInput">
            <input class="form-check-input" type="radio" name="orderOptions" id="descending" value="desc" v-model="searchOrder" checked><label class="form-check-label" for="descending">Descending</label>
          </div>
        </div>
      </div>
      <div class="col-9">
        <div class="input-group" id="searchBar">
          <button @click="startSearch()" class="btn btn-primary" id="searchButton" type="button">Search</button>
          <input type="text" class="form-control" placeholder="Search" id="searchBar" v-model="searchPhrase">
        </div>
      </div>
    </div>
    <div class='row justify-content-center'>
      <div v-for="item in recipeList" class="col-auto">
        <div class="cardContainer">
          <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
              :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  input[type="radio"]:checked{
    background-color: rgb(255, 119, 0);
    border-color: rgb(202, 88, 35);
    
  }
  
  input[type="radio"]:focus {
      box-shadow: 0px 0px 8px rgba(255, 178, 77, 0.734);
    }

  .btn {
    background-color: grey;
    border: ridge;
    position: relative;
    font-family: 'Times New Roman', Times, serif
  }

  .btn:hover{
    background-color: rgb(255, 183, 77);
  }


  label{
    float:inline-end;
  }


  .options{
    background-color: rgb(255, 153, 80);
    height:100%;;
    padding:1em;
    border:2px ridge;
    box-shadow: 5px 5px 5px black;
  }

  .row{
    padding:1em;
    
  }

  #searchButton:hover{
    border: solid white;
  }
  #searchButton:active{
    background-color: rgb(202, 88, 35);
  }

  .cardContainer {
  padding-top: 5px;
  padding-bottom: 5px;
  position: relative;
  align-self: center;
  font-size: 80%;
}


</style>

<script setup>
import Card from './Card.vue';
import CardSmall from './CardSmall.vue';
</script>
    
<template>
  <div class="container-fluid overflow-auto">
    <div class="row flex-nowrap g-2 g-lg-3 d-none d-md-flex mb-3">
      <div class="col-auto">
        <Card class="p-3" 
          thisRecipeId=0 
          thisAuthorName="Author Name" 
          thisRecipeName="Recipe Name" 
          thisCookTime=3 
          thisLikes=2 
          thisImgStorageSrc="na"/>
      </div>
      <div class="col-auto">
        <Card class="p-3" 
          thisRecipeId=1 
          thisAuthorName="Me" 
          thisRecipeName="Recipe 1" 
          thisCookTime=4 
          thisLikes=10 
          thisImgStorageSrc="na"/>
      </div>
      <!-- <div class="col-auto">
        <Card class="p-3" thisRecipeId="0"/>
      </div>
      <div class="col-auto">
        <Card class="p-3" thisRecipeId="0"/>
      </div>
      <div class="col-auto">
        <Card class="p-3" thisRecipeId="0"/>
      </div>
      <div class="col-auto">
        <Card class="p-3" thisRecipeId="0"/>
      </div>
      <div class="col-auto">
        <Card class="p-3" thisRecipeId="0"/>
      </div> -->
    </div>

    <div class="row flex-nowrap g-2 g-lg-3 d-md-none mb-3">
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
    </div>
    <div class="row flex-nowrap g-2 g-lg-3 d-md-none mb-3">
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
    </div>
  </div>
</template>
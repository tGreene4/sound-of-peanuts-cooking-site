<script setup>
import Sidebar from '../components/Sidebar.vue';
import IngredientList from '@/components/IngredientList.vue';

defineProps({
  id:String
})
</script>

<template>
<div class = "container-fluid bg-secondary min-vh-100 vh-100" style="padding-top: 10px;">
    <div class = 'row d-flex align-items-start'>
      <div class="col-md-2">
        <Sidebar />
      </div>
      <div class="col-md-4">
        
        <IngredientList></IngredientList>   
      </div>
      <div class="col-md-5 d-flex justify-content-center align-items-center" style="background-color: lightblue; padding: 20px; border-radius: 15px;">
        <img  class="img-fluid rounded w-50 h-auto" src="..\assets\images\coconut.png" alt="Recipe default">
        <p>{{ id }}</p>
      </div>
      
        
      
    </div>
  </div>
    
</template>
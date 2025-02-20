<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>

<template>
<div class = "container-fluid bg-secondary min-vh-100 vh-100">
    <div class = 'row d-flex align-items-start'>
      <div class="col-md-2">
        <Sidebar />
      </div>
      <div class="col-md-4">
        <p>A description of the recipe here.</p>
        <ul>
            <li>Spicy!</li>
            <li>Acidic</li>
            <li>Salty</li>
        </ul>    
      </div>
      <div class="col-md-5 d-flex justify-content-center align-items-center" style="background-color: lightblue; padding: 20px; border-radius: 15px;">
        <img  class="img-fluid rounded w-50 h-auto" src="..\assets\images\coconut.png" alt="Recipe default">
      </div>
    </div>
  </div>
    
</template>
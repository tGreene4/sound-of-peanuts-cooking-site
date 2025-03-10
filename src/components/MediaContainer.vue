<script setup>
import TestGutter from './TestGutter.vue';
</script>


<template>
    <div class="container-fluid bg-secondary min-vh-50 vh-100">
        <h1>PlaceHolder</h1>
        <TestGutter />
      <button @click="$router.push('/CreateRecipe')" class="btn btn-primary" type="button">Create Recipe</button>
    </div>
</template>
<script setup>
import Header from './components/Header.vue';
</script>

<template>
  <div id="body">
    <Header />
    <router-view />
  </div>
</template>

<style scoped>
#body{
  min-height: 100%;
  min-width: 720px;
}
</style>

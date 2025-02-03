<script setup>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import HomeMediaContainer from './components/HomeMainMediaContainer.vue';

</script>

<template>

  <Header />
  <HomeMediaContainer />
  <router-view />

</template>

<style scoped>
</style>

<script setup>
import Header from './components/Header.vue';

import MediaContainer from './components/MediaContainer.vue';
</script>

<template>
  <Header />
  <MediaContainer></MediaContainer>
  <router-view>
  </router-view>
</template>

<style scoped>

</style>

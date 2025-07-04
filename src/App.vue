<script setup>
import Header from './components/Header.vue';
</script>

<template>
  <div id="body">
    <Header />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style>
@import './assets/main.css';
#body {
  min-height: 100%;
  height: 100%;
  min-width: 720px;
  width: 100%;
}

.main-content {
  margin-top: 5rem;
}
</style>
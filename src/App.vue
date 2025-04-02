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
  min-width: 720px;
  min-height: 100%;
}

.main-content {
  margin-top: 5rem;
}
</style>
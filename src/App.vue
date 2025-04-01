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

<style scoped>
#body {
  min-height: 100%;
  min-width: 720px;
}

.main-content {
  margin-top: 5rem;
}
</style>
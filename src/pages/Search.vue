<template>
  <div class = "container-fluid bg-secondary min-vh-100 vh-100">
    <div class = 'row'>
      <div class="col-2">
        <Sidebar />
      </div>
      <div class="col-9">
        <p>Search</p>
       <input type="text">
      </div>
      <div class="col-1"></div>
    </div>
    <div class = 'row'>the bottom</div>
  </div>
</template>
<script setup lang="ts">
import Sidebar from "@/components/Sidebar.vue";
</script>
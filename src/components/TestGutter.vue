<script setup>
import Card from './Card.vue';
import CardSmall from './CardSmall.vue';
</script>
    
<template>
  <div class="container-fluid overflow-auto">
    <div class="row flex-nowrap g-2 g-lg-3 d-none d-md-flex mb-3">
      <div class="col-auto">
        <Card class="p-3" />
      </div>
      <div class="col-auto">
        <Card class="p-3" />
      </div>
      <div class="col-auto">
        <Card class="p-3" />
      </div>
      <div class="col-auto">
        <Card class="p-3" />
      </div>
      <div class="col-auto">
        <Card class="p-3" />
      </div>
      <div class="col-auto">
        <Card class="p-3" />
      </div>
    </div>

    <div class="row flex-nowrap g-2 g-lg-3 d-md-none mb-3">
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
    </div>
    <div class="row flex-nowrap g-2 g-lg-3 d-md-none mb-3">
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
      <div class="col-auto">
        <CardSmall class="p-2"/>
      </div>
    </div>
  </div>
</template>
<script>
import Card from "@/components/Card.vue";

export default {
  components: {Card},
  data() {
    return {
      newest: [1,2,3,4,5,6],
      mostLiked: [1,2,3,4,5,6],
      more: [1,2,3,4,5,6],
    }
  },
}
</script>
<template>
  <div class="container-fluid align-self-center gradient-custom w-100">
    <h1>Newest</h1>
    <div class="row" id="newestField">
        <div class="col-sm-auto"   id="Newest" v-for="item in newest">
          <Card thisRecipeId={{item}}
          />
        </div>

    </div>
    <h1>Most Liked</h1>
    <div class="row" id="mostLikedField">
      <div class="col-sm-auto"   id="MostLiked" v-for="item in mostLiked">
          <Card thisRecipeId={{item}}
          />
      </div>
    </div>
    <h1>More</h1>
    <div class="row" id="moreField" style="padding-bottom: 25px">
        <div class="col-sm-auto"   id="More" v-for="item in more">
          <Card thisRecipeId={{item}}
          />
        </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-custom {
  background: linear-gradient(to bottom, rgba(242,233,126,75%),rgba(255,121,0,50%));
}

</style>
<script>
import Card from "@/components/Card.vue";

export default {
  components: {Card},
  data() {
    return {
      newest: [1,2,3,4,5,6],
      mostLiked: [1,2,3,4,5,6],
      more: [1,2,3,4,5,6,7,8,9,10,11,12],
    }
  },
}
</script>
<template>
  <div class="container-fluid align-self-center gradient-custom w-100 min-vh-100">
    <h1 class="sectionHeader">Newest</h1>
    <div class="row" id="newestField">
        <div class="col-sm-auto"   id="Newest" v-for="item in newest">
          <div class="cardContainer">
            <Card thisRecipeId={{item}}
                  this-recipe-name="New"
            />
          </div>
        </div>

    </div>

    <h1 class="sectionHeader">Most Liked</h1>
    <div class="row" id="mostLikedField">
      <div class="col-sm-auto"   id="MostLiked" v-for="item in mostLiked">
        <div class="cardContainer">
          <Card thisRecipeId={{item}}
          />
        </div>
      </div>
    </div>

    <h1 class="sectionHeader">More</h1>
    <div class="row" id="moreField" style="padding-bottom: 25px">
        <div class="col-sm-auto"   id="More" v-for="item in more">
          <div class="cardContainer">
            <Card thisRecipeId={{item}}
            />
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.gradient-custom {
  background: linear-gradient(to right, rgba(242,233,126,75%),rgba(255,121,0,50%));
}

.sectionHeader {
  border: 3px solid;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  border-left: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  box-shadow: 5px 5px 5px black;
  position: relative;
  top: 5px;
  left: -15px;
  width: 15%;
  min-width: 250px;
  text-align: center;
  background: rgba(255, 183, 77,50%);
}

.row{
  position: relative;
  align-self: center;
}

.cardContainer {
  padding-top: 5px;
  padding-bottom: 5px;
  position: relative;
  align-self: center;
}

</style>
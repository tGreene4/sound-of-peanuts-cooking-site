<script setup>
    import { functions,auth } from '../api/firebase'
    import { httpsCallable } from 'firebase/functions';
    import Card from "@/components/Card.vue";
    import {ref} from "vue";
    import placeholderPfp from "@/assets/images/User icon.png";

    const props = defineProps({
        thisUserId:String,
        thisUserName:String,
        thisUserBio:String,
    });
/*
const dbUserRequest = httpsCallable(functions,'getDbUser');
    dbUserRequest({ uid: props.thisUserId})
        .then((res)=>{const output = result.data.text;console.log(output);})
        .catch((error)=>{console.log(error)})
*/
    const liked = ref([]);
    const userRecipes = ref([]);
    const likedLoading = ref(true);
    const userRecipeLoading = ref(true);
</script>

<template>
  <div class="main container-fluid align-self-center min-vh-100">
    <ul class="nav nav-tabs" style="justify-content: center;">
      <li class="nav-item">
        <button class="nav-link active" id="userTab" data-bs-toggle="tab"
                data-bs-target="#userContent" type="button" role="tab" aria-controls="user Content Tab"
                aria-selected="true">Your Profile</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" id="likedTab" data-bs-toggle="tab" data-bs-target="#likedContent" type="button"
                role="tab" aria-controls="like tab" aria-selected="false">Your Liked Recipes</button>
      </li>
    </ul>
    <div class="flex-d flex-column tab-content align-self-center" id="flexWrapper">

      <div class="tab-pane show active align-self-center"  role="tabpanel" id="userContent">
        <div class="container-fluid align-self-center">
          <div class="row justify-content-center">
            <div class="col-xxl-6 col-xl-12 form-group align-content-start">
              <h1>Name goes here</h1>
              <div class="row justify-content-start">
                <img id="Avatar" class="card-img-top img-thumbnail" :src="placeholderPfp" alt="Avatar">
              </div>
              </div>
            <div class="col-xxl-6 col-xl-12 form-group">
              <h3>Your Bio</h3>
              <textarea style="width:80%; height: 80%" value="Bio Goes Here" id="bio">
              </textarea>
            </div>
            <h1 class="sectionHeader">Your Recipes</h1>
            <div class="row justify-content-center" id="likeField">
              <div v-if="!userRecipeLoading" class="col-auto" id="" v-for="item in userRecipes">
                <div class="cardContainer">
                  <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
                        :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
                </div>
              </div>
              <br>
              <div v-if="userRecipeLoading" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

          </div>
        </div>
      </div>

        <div class="tab-pane align-self-center" role="tabpanel" id="likedContent">
          <div class="container-fluid align-self-center">
            <div class="row justify-content-center">
              <h1 class="sectionHeader">Recipes You Liked</h1>
              <div class="row justify-content-center" id="moreField">
                <div v-if="!likedLoading" class="col-auto" id="" v-for="item in liked">
                  <div class="cardContainer">
                    <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
                          :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
                  </div>
                </div>
                <br>
                <div v-if="likedLoading" class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
      </div>

    </div>
    </div>
</template>

<style>
.main {
  background: radial-gradient(rgba(242, 233, 126, 75%), rgba(255, 121, 0, 50%));
  min-height: 90vh;
  height: 100%;
  padding: 0;
  margin: 0;
  position: relative;
}

#flexWrapper {
  background: radial-gradient(rgba(242, 233, 126, 50%), rgba(255, 121, 0, 25%));
  min-height: 95vh;
  height: 99%;
  align-items: center;
  border: 2px solid black;
  border-radius: 20px;
  margin: 0;
  top: 0;
  position: relative;
}

#Avatar{
  border-radius: 50%;
  background: lightgray;
  border: 1px solid black;
  max-height: 30rem;
  max-width: 30rem;
}

.nav-link{
  background: darkgray;
  accent-color: black;
  color: white;
}

.nav-tabs{
  left:100px;
  border: none;
}

#bio{
  border: 2px solid black;
  border-radius: 20px;
}


</style>
<script setup>
    import { onMounted, ref } from 'vue';
    import { functions } from '../api/firebase'
    import { httpsCallable } from 'firebase/functions';
    import { useRoute, useRouter } from 'vue-router';
    import Card from "@/components/Card.vue";
    import placeholderPfp from "@/assets/images/User icon.png";

    const router = useRouter();
    
    const route = useRoute();
    const getThisUser = async()=>{
        const dbUserRequest = httpsCallable(functions,'getDbUser');
        try{
            const output = await dbUserRequest({uid:route.params.id});
        }catch(error){
            console.log("Failed to get user:"+error.message);
        }
        
    }
    
    onMounted(()=>{
        getThisUser();
    })

    var file;
    var pfpRef = ref("https://firebasestorage.googleapis.com/v0/b/sound-of-peanuts-cooking-site.appspot.com/o/User%20icon%20Clear.png?alt=media&token=02ef6aea-e4bd-4c39-a65a-f00acea43188")

    const handleFileUpload = function(event){
      file = event.target.files[0];
      pfpRef.value = URL.createObjectURL(file);
    };
    
    const liked = ref([]);
    const userRecipes = ref([]);
    const likedLoading = ref(true);
    const userRecipeLoading = ref(true);
    const nameLabel = ref("Your ");
    const ownPage = ref(true);
</script>

<template>
  <div class="main container-fluid align-self-center min-vh-100">
    <ul class="nav nav-tabs" style="justify-content: center;">
      <li class="nav-item">
        <button class="nav-link active" id="userTab" data-bs-toggle="tab"
                data-bs-target="#userContent" type="button" role="tab" aria-controls="user Content Tab"
                aria-selected="true">{{nameLabel}} Profile</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" id="likedTab" data-bs-toggle="tab" data-bs-target="#likedContent" type="button"
                role="tab" aria-controls="like tab" aria-selected="false">{{nameLabel}} Liked Recipes</button>
      </li>
    </ul>
    <div class="flex-d flex-column tab-content align-self-center" id="flexWrapper">

      <div class="tab-pane show active align-self-center"  role="tabpanel" id="userContent">
        <div class="container-fluid align-self-center">
          <div class="row justify-content-center">
            <div class="col-xxl-6 col-xl-12 form-group align-content-start">
              <h1>Name goes here</h1>
              <div class="row justify-content-center">
                <img :src="pfpRef" id="Avatar">
              </div>
              <div v-if="ownPage">
                <a> Profile Picture Upload</a><br>
                <input type="file" :value="null" class="form-control" id="pfpInput" title="iajf"
                       accept="image/png,image/jpeg" multiple @change="(event) => handleFileUpload(event)">
              </div>
              </div>
            <div class="col-xxl-6 col-xl-12 form-group">
              <h3>{{nameLabel}} Bio</h3>
              <div v-if="ownPage" style="margin: 0;padding:0; height:80%;width: 80%;">
                <textarea id="bio">"User Bio"</textarea>
                <button> Upload Bio</button>
              </div>
              <div v-else id="bio">
                "Bio Goes Here"
              </div>
            </div>
            <h1 class="sectionHeader">{{nameLabel}} Recipes</h1>
            <div class="row justify-content-center" id="likeField">
              <div class="col-xxl-12">
                <div v-if="!userRecipeLoading" class="col-auto" id="" v-for="item in userRecipes">
                  <div class="cardContainer">
                    <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
                          :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
                  </div>
                  <button v-if="ownPage" @click="router.push('/updaterecipe/' + item.id)";> Edit</button>
                </div>
              </div>
              <div v-if="(userRecipes == '') & (!userRecipeLoading)" id="noRecWarning">
                No recipes found
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
              <h1 class="sectionHeader" style="top:5px">{{ nameLabel }} Liked Recipes</h1>
              <div class="row justify-content-center" id="moreField">
                <div v-if="!likedLoading" class="col-auto" id="" v-for="item in liked">
                  <div class="cardContainer">
                    <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
                          :thisCookTime="item.preparationTime" :thisLikes="item.likes" :thisImgStorageSrc="item.cardImgReg" />
                  </div>
                </div>
                <div v-if="(liked == '') & (!likedLoading)" id="noRecWarning">
                  No recipes found
                </div>
                <br>
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
  border-radius: 100%;
  background: lightgray;
  border: 1px solid black;
  height: 100vh;
  width: 100vw;
  max-height: 30rem;
  max-width: 30rem;
  object-fit: cover;
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
  height: 80%;
  width: 80%;
  border: 2px solid black;
  border-radius: 20px;
  margin-bottom: 15px;
  margin-left: 40px;
  background: whitesmoke;
  padding: 15px;

}
.sectionHeader {
  border: 3px solid;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  border-radius: 5px;
  box-shadow: 5px 5px 5px black;
  position: relative;
  top: 20px;
  width: 25%;
  min-width: 400px;
  text-align: center;
  background: rgba(255, 183, 77, 50%);
}

#pfpInput{
  width: 25%;
  min-width: 400px;
}



</style>
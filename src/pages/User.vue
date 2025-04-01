<script setup>
import { onMounted, ref } from 'vue';
import { auth, functions, storage } from '../api/firebase'
import { httpsCallable } from 'firebase/functions';
import {deleteUser, EmailAuthProvider, reauthenticateWithCredential, signOut,updateProfile} from 'firebase/auth'
import { useRoute, useRouter } from 'vue-router';
import Card from "@/components/Card.vue";
import placeholderImg from "@/assets/images/User icon.png";
import { deleteObject, ref as storageRef ,uploadBytes,getDownloadURL} from 'firebase/storage';
const router = useRouter();

const liked = ref([]);
const userRecipes = ref([]);
const userName = ref('');
const userBiography = ref('');
const pfpRef = ref(placeholderImg);
const userLoading = ref(true);

const nameLabel = ref("Your");
const ownPage = ref(false);

const route = useRoute();

const getThisUser = async () => {
  console.log("Calling getDbUser");
  const dbUserRequest = httpsCallable(functions, 'getDbUser');
  try {
    const docId = route.params.id;
    console.log("Fetching recipes for document ID: ", docId);
    const result = await dbUserRequest({ id: docId });
    console.log("Response from getDbUser:", result.data);

    if (result.data.success) {
      userName.value = result.data.name;
      userBiography.value = result.data.biography;
      pfpRef.value = result.data.pfpUrl;
      liked.value = result.data.likedRecipes || [];
      userRecipes.value = result.data.madeRecipes || [];
      ownPage.value = result.data.ownPage || false;

      console.log("Liked Recipes:", liked.value);
      console.log("User Recipes:", userRecipes.value);
    } else {
      console.warn("Error fetching user recipes:", result.data.message);
    }
  } catch (error) {
    console.error("Error calling getDbUserRecipes:", error);
  } finally {
    console.log("PFPREFERENCE: ",pfpRef.value)
    userLoading.value = false;
  }
};

const deleteThisUser = async () => {
  
  const dbUserDelete = httpsCallable(functions,"deleteDbUser")
  var dbSuccess = false;
  var delUid = auth.currentUser.uid;
  try{
    let email = prompt("Enter email:")
    let password = prompt("Enter password:")
    if(email!=null && password!=null){
      let cred = EmailAuthProvider.credential(email,password);
      reauthenticateWithCredential(auth.currentUser,cred).then(()=>{
        deleteUser(auth.currentUser);
      });
    }
    
  }catch(error){
    console.log("Error deleting account:",error)
    alert("Could not delete account")
  }
  
  try{
    const docId = route.params.id
    console.log("Deleting user with doc ID "+docId)
    dbSuccess = await dbUserDelete({uDocId:docId});
  }catch(error){
    console.log("Error deleting user from DB:",error)
    return;
  }

  try{
      console.log("Removed user from database")
      deleteObject(storageRef(storage,"images/"+delUid));
  }catch(error){
      console.log("Error deleting pfp:",error)
  }

  router.push("/account");

}

const updateThisUser = async() => {
  const updateBio = userBiography.value;
  const updateName = userName.value;
  const pfpFile = file;
  var updatePfpDownloadURL;

  try{
    const storageReference = storageRef(storage, 'images/' + auth.currentUser.uid);
    deleteObject(storageReference);
    const snapshot = await uploadBytes(storageReference, pfpFile);
    updatePfpDownloadURL = await getDownloadURL(snapshot.ref);
    console.log("Image uploaded successfully. Download URL:", updatePfpDownloadURL);
    await updateProfile(auth.currentUser, { photoURL: updatePfpDownloadURL });
    
  }catch(error){
    console.log("Failed to download image:",error)

  }

  const dbUserUpdate = httpsCallable(functions,"updateDbUser");
  try{
    const result = await dbUserUpdate({
      uName:updateName,
      pfpDownloadURL:updatePfpDownloadURL,
      uBiography:updateBio,
      uDocId:route.params.id
    });
    if(result.data.success=true){
      console.log("Update complete");
    }else{
      console.log("Update failed");
    }

  }
  catch(error){
    console.log("Failed to update DB:",error)

  }

  router.push("/user/" + route.params.id);

}

function logOut(){
  signOut(auth);
  router.push("/account")
  
}


onMounted(() => {
  getThisUser();
})

var file;
const handleFileUpload = function (event) {
  file = event.target.files[0];
  pfpRef.value = URL.createObjectURL(file);
};
</script>

<template>
  <div class="main container-fluid align-self-center min-vh-100">
    <div v-if="userLoading" class="d-flex justify-content-center align-items-center min-vh-100">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="userNotFound" class="text-center">
      <h1>User Not Found</h1>
      <p>The user you are looking for does not exist or has been removed.</p>
      <button @click="router.push('/')">Go Back to Home</button>
    </div>
    <div v-else>
      <ul class="nav nav-tabs" style="justify-content: center;">
        <li class="nav-item">
          <button class="nav-link active" id="userTab" data-bs-toggle="tab" data-bs-target="#userContent" type="button"
            role="tab" aria-controls="user Content Tab" aria-selected="true">{{ nameLabel }} Profile</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" id="likedTab" data-bs-toggle="tab" data-bs-target="#likedContent" type="button"
            role="tab" aria-controls="like tab" aria-selected="false">{{ nameLabel }} Liked Recipes</button>
        </li>
      </ul>

      <div class="flex-d flex-column tab-content align-self-center" id="flexWrapper">
        <div class="tab-pane show active align-self-center" role="tabpanel" id="userContent">
          <div class="container-fluid align-self-center">
            <div class="row justify-content-start">
              <button v-if="ownPage" style="width: 10%;min-width: 200px" @click="logOut">Log out</button>
            </div>
            <div class="row justify-content-center">
              <div class="col-xxl-6 col-xl-12 form-group align-content-start">
                <h1>{{ userName.value }}</h1>
                <div class="row justify-content-center">
                  <a class="align-content-center">
                    <img class="d align-self-center" id="Avatar" :src="pfpRef" alt="Avatar">
                  </a>
                  <div v-if="ownPage">
                    <a> Profile Picture Upload</a><br>
                    <div class="input-group">
                      <input type="file" :value="null" class="form-control" id="pfpInput" style="width:2rem"
                        accept="image/png,image/jpeg" multiple @change="(event) => handleFileUpload(event)">
                      <div class="input-group-append">
                        <button style="border-radius: 0;">Save profile picture</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div class="col-xxl-6 col-xl-12 form-group">
                <h3>{{ nameLabel }} Bio</h3>
                <div v-if="ownPage" style="height:100%;width: 100%;">
                  <div class="row justify-content-center" style="height: 60%; min-height: 200px; width:100%">
                    <textarea id="bio" style="border: dashed">{{ userBiography.value }}</textarea>
                    <button style="width: 25%" @click="updateThisUser();">Update Profile</button>
                  </div>
                </div>
                <div v-else id="bio">
                  {{ userBiography.value }}
                </div>
              </div>

            </div>
            <div class="row justify-content-center" style="margin-top:50px">
              <h1 class="sectionHeader">{{ nameLabel }} Recipes</h1>
              <div class="col-xxl-12">
                <div class="row justify-content-center">
                  <div v-if="!userRecipeLoading" class="col-auto" id="" v-for="item in userRecipes">
                    <div class="cardContainer">
                      <button v-if="ownPage" @click="router.push('/updaterecipe/' + item.id)" style="border-radius: 0">
                        Edit</button>
                      <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
                        :thisCookTime="item.preparationTime" :thisLikes="item.likes"
                        :thisImgStorageSrc="item.cardImgReg" />
                    </div>
                  </div>
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

            <div class="row justify-content-end">
              <!--Connect this to delete User-->
              <button v-if="ownPage" style="width: 10%;min-width: 200px" @click="deleteThisUser()">Delete User Profile</button>
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
                      :thisCookTime="item.preparationTime" :thisLikes="item.likes"
                      :thisImgStorageSrc="item.cardImgReg" />
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

#Avatar {
  border-radius: 100%;
  background: lightgray;
  border: 1px solid black;
  height: 100vh;
  width: 100vw;
  max-height: 30rem;
  max-width: 30rem;
  object-fit: cover;
}


.nav-link {
  background: darkgray;
  accent-color: black;
  color: white;
}

.nav-tabs {
  left: 100px;
  border: none;
}

#bio {
  height: 100%;
  width: 100%;
  border: 4px solid black;
  border-radius: 20px;
  background: whitesmoke;
  padding: 20px;
  margin-bottom: 10px;

}

.sectionHeader {
  border: 3px solid;
  font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
  border-radius: 5px;
  box-shadow: 5px 5px 5px black;
  position: relative;
  width: 25%;
  min-width: 400px;
  text-align: center;
  background: rgba(255, 183, 77, 50%);
}

#pfpInput {
  width: 25%;
  min-width: 100px;
  max-width: 300px;
}

button {
  background: rgb(240, 240, 240);
  border: black 2px solid;
  border-radius: 15px;
  Box-shadow: 3px 3px 5px black;
  max-width: 20rem;
  min-width: 5rem;
}

.cardContainer {
  padding-top: 5px;
  padding-bottom: 5px;
  position: relative;
  align-self: center;
}
</style>
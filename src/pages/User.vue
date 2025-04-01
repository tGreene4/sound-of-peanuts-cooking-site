<script setup>
import { onMounted, ref } from 'vue';
import { auth, functions, storage } from '../api/firebase'
import { httpsCallable } from 'firebase/functions';
import { useRoute, useRouter } from 'vue-router';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import Card from "@/components/Card.vue";
const router = useRouter();

const liked = ref([]);
const userRecipes = ref([]);
const userName = ref('');
const userBiography = ref('');
const pfpRef = ref('');
const userLoading = ref(true);
const userNotFound = ref(true);

const deleteWarning = ref(false);
const updateWarning = ref(false);

const nameLabel = ref("Your");
const ownPage = ref(false);

const changedPFP = ref(false);

const route = useRoute();
const userDoc = route.params.id;

const getThisUser = async () => {
  console.log("Calling getDbUser");
  const dbUserRequest = httpsCallable(functions, 'getDbUser');
  try {
    console.log("Fetching recipes for user ID: ", userDoc);
    const result = await dbUserRequest({ id: userDoc });
    console.log("Response from getDbUser:", result.data);

    if (result.data.success) {
      userName.value = result.data.name;
      userBiography.value = result.data.biography;
      pfpRef.value = result.data.pfpUrl;
      liked.value = result.data.likedRecipes || [];
      userRecipes.value = result.data.madeRecipes || [];
      ownPage.value = result.data.ownPage;
      userNotFound.value = false;

      if (ownPage.value == false) {
        nameLabel.value = userName.value + "\'s"
      }

      console.log("Liked Recipes:", liked.value);
      console.log("User Recipes:", userRecipes.value);
    } else {
      console.warn("Error fetching user recipes:", result.data.message);
    }
  } catch (error) {
    console.error("Error calling getDbUserRecipes:", error);
  } finally {
    userLoading.value = false;
  }
};

const updateThisUser = async () => {
  console.log("Calling updateDbUser");
  const updateThisDbUser = httpsCallable(functions, 'updateDbUser');

  if (!auth.currentUser) {
    console.error("User is not authenticated. Cannot update.");
    return;
  }
  try {
    const result = await updateThisDbUser({
      uName: userName.value,
      pfpDownloadURL: pfpRef.value,
      uBiography: userBiography.value,
      uDocId: userDoc
    });

    if (result.data.success) {
      location.reload();
    } else {
      alert("Error updating user", result.data.message);
    }
  } catch (error) {
    console.error("Error calling getDbUserRecipes:", error);
  }
};

const logOut = async () => {
  signOut(auth).then(() => {
    router.push("/account");
  }).catch((error) => {
    console.log("Error caught when attempting to log out", error);
  });
};

onMounted(() => {
  getThisUser();
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const storageReference = storageRef(storage, 'images/' + auth.currentUser.uid);
    const snapshot = await uploadBytes(storageReference, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    pfpRef.value = downloadURL;
    console.log("Image uploaded successfully. Download URL:", pfpRef.value);
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

const showEditName = ref(false);
const toggleEditName = () => {
  showEditName.value = !showEditName.value;
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
      <ul class="nav nav-tabs" style="justify-content: center; border:0">
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
            <div class="row">
              <div class="col d-flex justify-content-end">
                <button v-if="ownPage" style="width: 10%; min-width: 200px; margin: 0.2rem;" @click="logOut">Log
                  out</button>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-xxl-6 col-xl-12 form-group align-content-start">
                <div class="sectionHeader" style="height:3.5rem; width: fit-content;">
                  <div v-if="!showEditName" @click="toggleEditName" style="cursor: pointer;">
                    <h1 style="font-size: 2.5rem; font-weight: bold;">
                      {{ userName.length > 20 ? userName.slice(0, 20) + '...' : userName }}
                    </h1>
                  </div>
                  <div v-else>
                    <textarea v-model="userName"
                      style="font-size: 2.5rem; font-weight: bold; font-size: 2rem;background-color: transparent; width: 100%; height: 100%; border: none; outline: none; resize: none; text-align: center;"
                      @blur="toggleEditName"></textarea>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <a class="align-content-center">
                    <img class="d align-self-center" id="userAvatar" :src="pfpRef" alt="Avatar">
                  </a>
                  <div v-if="ownPage">
                    <a> Profile Picture Upload</a><br>
                    <div class="input-group">
                      <input type="file" :value="null" class="form-control" id="pfpInput" style="width:2rem"
                        accept="image/png,image/jpeg" multiple @change="(event) => handleFileUpload(event)">
                    </div>
                  </div>
                </div>

              </div>

              <div id="warning" class="container" v-if="deleteWarning">
                <div class="box">
                  <h3>
                    Are You Sure That You Want To Delete Your User Account?
                    There is no going back from this.
                  </h3>
                  <div class="row justify-content-center">
                    <button class="form-control" type="button" @click="" style="width:200px;"> Yes, Delete
                      Account</button>
                    <button class="form-control" type="button" @click="deleteWarning = false;"
                      style="width:100px;">No</button>
                  </div>
                </div>
              </div>

              <div id="warning" class="container" v-if="updateWarning">
                <div class="box">
                  <h3>
                    Are You Sure That You Want To Save these Changes?
                  </h3>
                  <div class="row justify-content-center">
                    <button class="form-control" type="button" @click="updateThisUser" style="width:200px;"> Yes, Update
                      Account</button>
                    <button class="form-control" type="button" @click="updateWarning = false;"
                      style="width:100px;">No</button>
                  </div>
                </div>
              </div>

              <div class="col-xxl-6 col-xl-12 form-group">
                <h3>{{ nameLabel }} Bio</h3>
                <div v-if="ownPage" style="height:100%;width: 100%;">
                  <div class="row justify-content-center" style="height: 85%; min-height: 200px; width:100%">
                    <textarea id="bio" style="border: dashed; width: 100%; height: 100%;"
                      v-model="userBiography"></textarea>
                    <button style="width: 25%; padding:0;margin:0;" @click="updateWarning = true"> Save Changes
                    </button>
                  </div>
                </div>
                <div v-else id="bio">
                  {{ userBiography }}
                </div>
              </div>

            </div>
            <div class="row justify-content-center" style="margin-top:50px">
              <h1 class="sectionHeader">{{ nameLabel }} Recipes</h1>
              <div class="col-xxl-12">
                <div class="row justify-content-center">
                  <div class="col-auto" id="" v-for="item in userRecipes">
                    <div class="cardContainer">
                      <button v-if="ownPage" @click="router.push('/updaterecipe/' + item.id)" style="border-radius: 0">
                        Edit</button>
                      <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisUserRecipe="true"
                        :thisCookTime="item.preparationTime" :thisLikes="item.likes"
                        :thisImgStorageSrc="item.cardImgReg" />
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="(userRecipes == '')" id="noRecWarning">
                No recipes found
              </div>
              <br>
            </div>

            <div class="row justify-content-end">
              <!--Connect this to delete User-->
              <button v-if="ownPage" style="width: 10%;min-width: 200px; color: red"
                @click="deleteWarning = true">Delete
                User Profile</button>
            </div>
          </div>
        </div>

        <div class="tab-pane align-self-center" role="tabpanel" id="likedContent">
          <div class="container-fluid align-self-center">
            <div class="row justify-content-center">
              <h1 class="sectionHeader" style="top:5px">{{ nameLabel }} Liked Recipes</h1>
              <div class="row justify-content-center" id="moreField">
                <div class="col-auto" id="" v-for="item in liked">
                  <div class="cardContainer">
                    <Card :thisRecipeId="item.id" :thisRecipeName="item.name" :thisAuthor="item.author"
                      :thisCookTime="item.preparationTime" :thisLikes="item.likes"
                      :thisImgStorageSrc="item.cardImgReg" />
                  </div>
                </div>
                <div v-if="(liked == '')" id="noRecWarning">
                  No recipes found
                </div>
                <br>
                <br>
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

#userAvatar {
  Box-shadow: 10px 5px 10px black;
  background: lightgray;
  border: 3px solid black;
  min-height: 30rem;
  min-width: 30rem;
  max-height: 30rem;
  max-width: 30rem;
  object-fit: cover;
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

.sectionHeader {
  max-width: 700px;
  margin-bottom: 20px;
}
</style>
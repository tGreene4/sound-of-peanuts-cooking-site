<script setup>
import { auth, functions } from "../api/firebase";
import { ref, onMounted } from "vue";
import { httpsCallable } from "firebase/functions";
import { onAuthStateChanged } from "firebase/auth";
import placeholderPfp from "@/assets/images/User icon.png";

const pfpImgRef = ref(placeholderPfp);
const loadingPfp = ref(true);
const isAuthenticated = ref(false);
const userId = ref("");

onMounted(() => {
    auth.authStateReady().then(async ()=>{
        console.log("Pfp image user check")
        const currentUser = auth.currentUser;
        if (currentUser) {
            isAuthenticated.value = true;
            userId.value = currentUser.uid;

            try {
                const getDocIdFromUserId = httpsCallable(functions, "getUDocIdFromUId");
                console.log("Getting doc ID from user ID " + currentUser.uid);

                const res = await getDocIdFromUserId({ uId: currentUser.uid });
                console.log(res.data);

                if (res.data.uDocId) {
                    userId.value = res.data.uDocId;
                } else {
                    console.log("Could not get doc ID");
                }
            } catch (error) {
                console.error("Error fetching doc ID:", error);
            }

            if (currentUser.photoURL) {
                pfpImgRef.value = currentUser.photoURL;
            }
        } else {
            console.log("User not signed in")
            isAuthenticated.value = false;
            userId.value = "";
            pfpImgRef.value = placeholderPfp;
        }
        loadingPfp.value = false;

    })
});
</script>


<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=ComicNeue">
    <div class="container-fluid justify-content-around top-0" id="headerContainer">
        <a class="navbar-brand col-xs-10" href="/">
            <img src="../assets/images/Potluck Logo.png" height="50vh" class="d-inline-block align-text-bottom">
            <h1 class="">Potluck</h1>
        </a>
        <span v-if="(loadingPfp)">
            <a class="spinner-border" role="status" style="float: right; width: 3rem; height: 3rem">
                <span class="visually-hidden">Loading...</span>
            </a>
        </span>
        <a v-else-if="isAuthenticated" :href="`/user/${userId}`">
            <img :src="pfpImgRef" id="Avatar" height="50vh" style="float: right;" data-toggle="tooltip" data-placement="left"
                title="Account">
        </a>
        <a v-else href="/account">
            <img :src="pfpImgRef" id="Avatar" height="50vh" style="float: right;" data-toggle="tooltip" data-placement="left"
                title="Account">
        </a>
        <a href="/search"><img src="../assets/images/Search icon.png" height="50vh"
                style="float: right;margin-right: 1vw;" data-toggle="tooltip" data-placement="left"
                title="Search Recipes">
        </a>
        <a v-if="isAuthenticated" :href="'/createRecipe'"><img src="../assets/images/Create icon.png" height="50vh"
                style="float: right;margin-right: 1vw;" data-toggle="tooltip" data-placement="left"
                title="Create Recipe">
        </a>
        
        <a v-else href="/account"><img src="../assets/images/Create icon.png" height="50vh"
                style="float: right;margin-right: 1vw;" data-toggle="tooltip" data-placement="left"
                title="Create Recipe">
        </a>
        <a href="/search"><img src="../assets/images/Search icon.png" height="50vh"
                style="float: right;margin-right: 1vw;" data-toggle="tooltip" data-placement="left"
                title="Search Recipes">
        </a>
    </div>
</template>

<style scoped>
* {
    font-family: "Comic Neue";
}

h1 {
    display: inline;
    font-size: 200%;
    margin-left: 5px;
}

#Avatar {
  border: 3px black solid;
  border-radius: 10%;
  background: rgb(255, 183, 77);
  box-shadow: 5px 5px 5px black;
  width: 3.5rem;
  height: 3.5rem;
}
#headerContainer {
    background-color: rgb(255, 183, 77);
    border-bottom: 3px solid black;
    padding: 1vh 1.5vh 1.5vh;
    width: 100%;
    height: 5rem;
    max-height: 100px;
    min-width: 700px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}
</style>
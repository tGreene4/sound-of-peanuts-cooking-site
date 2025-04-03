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
    onAuthStateChanged(auth, async (currentUser) => {
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
            isAuthenticated.value = false;
            userId.value = "";
            pfpImgRef.value = placeholderPfp; // Reset to placeholder if user logs out
        }
        loadingPfp.value = false;
    });
});
</script>


<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=ComicNeue">
    <div class="container-fluid justify-content-around" id="headerContainer">
        <a class="navbar-brand col-xs-10" href="/">
            <img src="../assets/images/Potluck Logo.png" height="50vh" class="d-inline-block align-text-bottom">
            <h1 class="">Potluck</h1>
        </a>
        <a v-if="(loadingPfp)">
            <a class="spinner-border" role="status" style="float: right; width: 3rem; height: 3rem">
                <span class="visually-hidden">Loading...</span>
            </a>
        </a>
        <a v-else-if="isAuthenticated" :href="`/user/${userId}`">
            <img :src="pfpImgRef" height="50vh" style="float: right;" data-toggle="tooltip" data-placement="left"
                title="Account">
        </a>
        <a v-else href="/account">
            <img :src="pfpImgRef" height="50vh" style="float: right;" data-toggle="tooltip" data-placement="left"
                title="Account">
        </a>
        <a href="/CreateRecipe"><img src="../assets/images/Create icon.png" height="50vh"
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

#headerContainer {
    background-color: rgb(255, 183, 77);
    border-bottom: 3px solid black;
    padding: 1.5vh;
    width: 100%;
    height: 5rem;
    max-height: 100px;
    min-width: 720px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

.btn {
    background-color: black;
    border: none;
    position: relative;
    right: 10px;
    Box-shadow: 3px 3px 10px white;
    font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
    float: right;
}
</style>
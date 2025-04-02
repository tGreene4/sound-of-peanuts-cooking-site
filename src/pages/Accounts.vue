<script setup>
import { onMounted, ref } from 'vue'
import { auth, functions, storage } from '../api/firebase'
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, updateCurrentUser, updateProfile } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useRouter } from 'vue-router';
import placeholderPfp from "@/assets/images/User icon.png";


const router = useRouter();
console.log(router);

const loading = ref(true);

const signUp = {
    username: ref(""),
    email: ref(""),
    password: ref(""),
    confirmPassword: ref(""),
    downloadURL: "https://firebasestorage.googleapis.com/v0/b/sound-of-peanuts-cooking-site.appspot.com/o/User%20icon%20Clear.png?alt=media&token=02ef6aea-e4bd-4c39-a65a-f00acea43188"
}

const login = {
    email: ref(""),
    password: ref("")
}

var file = placeholderPfp;
const pfpRef = ref("https://firebasestorage.googleapis.com/v0/b/sound-of-peanuts-cooking-site.appspot.com/o/User%20icon%20Clear.png?alt=media&token=02ef6aea-e4bd-4c39-a65a-f00acea43188")
const defaultPFP = ref(true);

function authCheck() {
    console.log("Auth check")
    console.log("auth.currentUser:", auth.currentUser)
    if (auth.currentUser != null) {
        console.log("User verified")
        const id = auth.currentUser.uid;
        const getDocIdFromUserId = httpsCallable(functions, "getUDocIdFromUId");
        const getDocId = async () => {
            console.log("Getting doc ID from user ID " + id)
            const res = await getDocIdFromUserId({ uId: id });
            console.log(res.data)
            if (res.data.uDocId) {
                router.push("/user/" + res.data.uDocId);
            } else {
                console.log("Could not get doc ID")
            }
        }
        getDocId()
    }
    else {
        loading.value = false;
    }
}

auth.authStateReady().then(authCheck)

const handleFileUpload = function (event) {
    file = event.target.files[0];
    if (!file) return;
    
    pfpRef.value = URL.createObjectURL(file);
    defaultPFP.value = false;
};

const userCreate = async () => {
    const regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regexEmail.test(signUp.email.value)) {
        alert("Invalid Email");
        return;
    }

    if (!(signUp.password.value.length > 5 && /\d/.test(signUp.password.value))) {
        alert("Invalid password: passwords must be at least 6 characters and contain at least 1 number");
        return;
    }

    if (signUp.confirmPassword.value !== signUp.password.value) {
        alert("Password and confirmation password do not match");
        return;
    }

    try {
        console.log("Attempting to create account");
        const createSuccess = await createUserWithEmailAndPassword(auth, signUp.email.value, signUp.password.value);
        if (!createSuccess) {
            alert("Failed to create account");
            return;
        }
        console.log(createSuccess);
    } catch (error) {
        console.log("Failed to create user: " + error.message);

        if (error.code === 'auth/email-already-in-use') {
            alert("This email is already registered. Please use a different email.");
            return;
        }

        if (auth.currentUser) {
            const signUpUser = auth.currentUser;
            deleteObject(storageRef(storage, 'images/' + signUpUser.uid)).catch((deleteError) => {
                console.error("Error deleting image:", deleteError.message);
            });
            deleteUser(signUpUser).catch((deleteError) => {
                console.error("Error deleting user:", deleteError.message);
            });
        }

        alert("An error occurred while creating the account. Please try again.");
        return;
    }

    const signUpUser = auth.currentUser;
    console.log(signUpUser);
    
    if (!defaultPFP.value) {
        try {
            const storageReference = storageRef(storage, 'images/' + signUpUser.uid);
            const snapshot = await uploadBytes(storageReference, file);
            const url = await getDownloadURL(snapshot.ref);
            console.log("Image uploaded successfully. Download URL:", url);
            signUp.downloadURL = url;
            await updateProfile(signUpUser, { photoURL: url });
        } catch (error) {
            console.error("Error uploading image:", error);            
            deleteUser(signUpUser);
        }
    }

    try {
        const createUser = httpsCallable(functions, "createDbUser");
        const result = await createUser({
            uName: signUp.username.value,
            pfpFile: signUp.downloadURL,
            uId: signUpUser.uid
        });

        if (result.data.success === true) {
            console.log("Added User to database");
        } else if (result.data.success === false) {
            console.log("Could not add user to database");
        }
    } catch (error) {
        console.error("Error adding user to db:", error.message);
        alert("An error occurred while adding the user to the database. Please try again.");
        return;
    }

    authCheck();
};

function userLogin(event) {
    event.preventDefault();

    signInWithEmailAndPassword(auth, login.email.value, login.password.value)
        .then(() => {
            console.log("Login successful");
            authCheck();
        })
        .catch((error) => {
            console.error("Error during login:", error.message);
            alert("Could not log in. Please check your credentials.");
        });
}
</script>

<template>
    <div id="flexWrapper" class="d-flex flex-column gradient-custom align-self-center">
        <div v-if="loading" class="d-flex justify-content-center align-items-center min-vh-100">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
        <div v-else id="accountPageDiv" class="align-self-center">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <button class="nav-link active" id="newAccountTab" data-bs-toggle="tab"
                        data-bs-target="#newAccountDiv" type="button" role="tab" aria-controls="sign up tab"
                        aria-selected="true">Sign Up</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link" id="loginTab" data-bs-toggle="tab" data-bs-target="#loginDiv" type="button"
                        role="tab" aria-controls="log in tab" aria-selected="false">Log In</button>
                </li>
            </ul>
            <div class="tab-content" style=" min-width: 20vw;">
                <div class="tab-pane show active" id="newAccountDiv">
                    <form>
                        <label for="usernameInput" class="form-label">Username:</label>
                        <input type="text" class="form-control" id="usernameInput" placeholder="Enter your username"
                            v-model="signUp.username.value">

                        <label for="emailInput" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="emailInput" style="width: 100%" placeholder="Enter your email"
                            v-model="signUp.email.value">

                        <label for="passwordInput" class="form-label">Password:</label>
                        <input type="password" class="form-control" id="passwordInput" placeholder="Enter your password"
                            v-model="signUp.password.value">

                        <label for="confirmPasswordInput" class="form-label">Confirm Password:</label>
                        <input type="password" class="form-control" id="confirmPasswordInput"
                            placeholder="Enter the same password as above" v-model="signUp.confirmPassword.value">

                        <label for="pfpInput" class="form-label">Upload your Profile Picture</label>
                        <img :src="pfpRef" style="width:100%;height:30rem;display:block;object-fit: cover;"
                            id="pfpPreviewImg">
                        <input type="file" :value="null" class="form-control" id="pfpInput"
                            accept="image/png,image/jpeg" multiple @change="(event) => handleFileUpload(event)">
                        <br>

                        <button class="form-control" @click="userCreate" type="button">Sign Up</button>
                    </form>
                </div>
                <div class="tab-pane" style="min-width: 20vw " id="loginDiv">
                    <form>
                        <label for="emailLoginInput" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="emailLoginInput" placeholder="Enter your email"
                            v-model="login.email.value">

                        <label for="passwordLoginInput" class="form-label">Password:</label>
                        <input type="password" class="form-control" id="passwordLoginInput"
                            placeholder="Enter your password" v-model="login.password.value">

                        <br>
                        <button class="form-control" @click="userLogin" type="button">Log In</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#flexWrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

#accountPageDiv {
    align-items: center;
    width: max-content;
    align-content: center;
    padding: 4vh;
    border: 2px solid lightgrey;
    border-radius: 20px;
    margin: 3vh;
    background-color: rgb(243, 239, 234);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

#emailLoginInput {
    width: 35ch;
}
</style>
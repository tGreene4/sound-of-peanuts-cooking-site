<script setup>
import { onMounted, ref } from 'vue'
import { auth, functions } from '../api/firebase'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { getStorage, ref as storageRef ,uploadBytes, getDownloadURL } from "firebase/storage";
import placeholderImg from '@/assets/images/User icon.png'

const signUp = {
    username: ref(""),
    email: ref(""),
    password: ref(""),
    confirmPassword: ref(""),
    downloadURL: ref(placeholderImg)
}


const login = {
    email: ref(""),
    password: ref("")
}


function authCheck() {
    if (auth.currentUser != null) {
        const id = auth.currentUser.uid;
        $router.push("/user/" + id);
    }
}

onMounted(() => {
    authCheck()
})


const handleFileUpload = async (event) => {
    try {
        const storage = getStorage();
        const file = event.target.files[0];
        const storageReference = storageRef(storage, 'images/' + file.name);
        const snapshot = await uploadBytes(storageReference, file); 
        const url = await getDownloadURL(snapshot.ref); 
        console.log("Image uploaded successfully. Download URL:", url);
        signUp.downloadURL.value = url; 
    } catch (error) {
        console.error("Error uploading image:", error);
    }
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
        const createSuccess = await createUserWithEmailAndPassword(auth, signUp.email.value, signUp.password.value);
        if (!createSuccess) {
            alert("Failed to create account");
            return;
        }

        console.log("Attempting to create account");
        console.log(createSuccess);

        const signUpUser = auth.currentUser;
        console.log(signUpUser);

        const createUser = httpsCallable(functions, "createDbUser");
        const result = await createUser({
            uName: signUp.username.value,
            pfpFile: signUp.downloadURL.value,
            uId: signUpUser.uid
        });

        if (result.data.success === true) {
            console.log("Added User to database");
        } else if (result.data.success === false) {
            console.log("Could not add user to database");
        }
    } catch (error) {
        console.error("Error during user creation:", error.message);
        alert("An error occurred while creating the account. Please try again.");
    }
};

function userLogin(event) {
    event.preventDefault();

    signInWithEmailAndPassword(auth, login.email.value, login.password.value)
        .then(() => {
            console.log("Login successful");
        })
        .catch((error) => {
            console.error("Error during login:", error.message);
            alert("Could not log in. Please check your credentials.");
        });
}
</script>

<template>
    <div id="flexWrapper" class="d-flex flex-column align-self-center">
        <div id="accountPageDiv" class="align-self-center">
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
            <div class="tab-content" style="width: 8cm;">
                <div class="tab-pane show active" id="newAccountDiv">
                    <form>
                        <label for="usernameInput" class="form-label">Username:</label>
                        <input type="text" class="form-control" id="usernameInput" placeholder="Enter your username"
                            v-model="signUp.username.value">

                        <label for="emailInput" class="form-label">Email:</label>
                        <input type="email" class="form-control" id="emailInput" placeholder="Enter your email"
                            v-model="signUp.email.value">

                        <label for="passwordInput" class="form-label">Password:</label>
                        <input type="password" class="form-control" id="passwordInput" placeholder="Enter your password"
                            v-model="signUp.password.value">

                        <label for="confirmPasswordInput" class="form-label">Confirm Password:</label>
                        <input type="password" class="form-control" id="confirmPasswordInput"
                            placeholder="Enter the same password as above" v-model="signUp.confirmPassword.value">

                        <label for="pfpInput" class="form-label">Upload your Profile Picture</label>
                        <img :src="signUp.downloadURL" style="width:100%;height:30vh;display:block;object-fit: cover;"
                            id="pfpPreviewImg">
                        <input type="file" :value="null" class="form-control" id="pfpInput"
                            accept="image/png,image/jpeg" multiple @change="(event) => handleFileUpload(event)">
              <br>

                        <button class="form-control" @click="userCreate" type="button">Sign Up</button>
                    </form>
                </div>
                <div class="tab-pane" id="loginDiv">
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
#accountPageDiv {
    align-items: center;
    width: max-content;
    padding: 4vh;
    border: 2px solid lightgrey;
    border-radius: 20px;
    margin: 3vh;
    background-color: rgb(243, 239, 234);
}

#emailInput,
#emailLoginInput {
    width: 35ch;
}

#flexWrapper {
    background-color: rgb(255, 243, 224);
    height: 100vh;
}
</style>
<script setup>

    import {onMounted, ref} from 'vue'
    import {auth,functions} from '../api/firebase'
    import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
    import { httpsCallable } from 'firebase/functions';

    var signUpUsername,signUpEmail,signUpPassword,signUpConfirmPassword;
    var loginEmail,loginPassword;

    function authCheck(){
        if(auth.currentUser!=null){
        const id = auth.currentUser.uid;
        $router.push("/user/"+id);
        }
    }

    onMounted(()=>{
        authCheck();
    })

    onAuthStateChanged(auth, (user)=>{
        authCheck();
    })
    
    const pfpImgSrc = ref("../assets/images/User Icon.png")

    function changeImg(event){
        pfpImgSrc.value = URL.createObjectURL(event.target.files[0])
    }

    const userCreate = async() => {
            createUserWithEmailAndPassword(auth,signUpEmail,signUpPassword);
            console.log("Account created");
            let signUpUser = auth.currentUser
            const createFun = httpsCallable(functions,createDbUser);

            try{
                await createFun({uName:signUpUsername,pfpFile:pfpImgSrc.value,uId:signUpUser.uid});
                console.log("User created in database");
            }
            catch(error){
                console.log(error.message)
            }
            
     }

    function userLogin(){
        signInWithEmailAndPassword(auth,loginEmail,loginPassword)
    }

</script>

<template>
    <div id = "flexWrapper" class = "d-flex flex-column align-self-center">
        <div id = "accountPageDiv" class="align-self-center">
            <ul class="nav nav-tabs">
                <li class = "nav-item">
                    <button class="nav-link active" id="newAccountTab" data-bs-toggle="tab" data-bs-target="#newAccountDiv" type="button" role="tab" aria-controls="sign up tab" aria-selected="true">Sign Up</button>
                </li>
                <li class = "nav-item">
                    <button class="nav-link" id="loginTab" data-bs-toggle="tab" data-bs-target="#loginDiv" type="button" role="tab" aria-controls="log in tab" aria-selected="false">Log In</button>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane show active" id="newAccountDiv">
                    <form>
                        <label for = "usernameInput" class = "form-label">Username:</label>
                        <input type = "text" class = "form-control" id = "usernameInput" placeholder="Enter your username" v-model="signUpUsername">
                        <label for = "usernameInput" class = "form-label">Email:</label>
                        <input type = "email" class = "form-control" id = "emailInput" placeholder="Enter your email" v-model="signUpEmail">
                        <label for = "usernameInput" class = "form-label">Password:</label>
                        <input type = "password" class = "form-control" id = "passwordInput" placeholder="Enter your password" v-model="signUpPassword">
                        <label for = "usernameInput" class = "form-label">Confirm Password:</label>
                        <input type = "password" class = "form-control" id = "confirmPasswordInput" placeholder="Enter the same password as above" v-model="signUpConfirmPassword">
                        <br>
                        <label for = "pfpInput" class="form-label">Upload your Profile Picture</label>
                        <img :src="pfpImgSrc" style="width:30vh;display:block;" id = "pfpPreviewImg">
                        <input type ="file" :value = null class = form-control id="pfpInput" accept="image/png,image/jpeg" @change="changeImg($event)">
                        <button class="form-control" @click="userCreate">Sign Up</button>
                    </form>
                </div>
                <div class = "tab-pane" id = "loginDiv">
                    <form>
                        <label for = "emailLoginInput" class = "form-label">Email:</label>
                        <input type="email" class="form-control" id="emailLoginInput" placeholder="Enter your email" v-model="loginEmail">
                        <label for = "passwordLoginInput" class = "form-label">Password:</label>
                        <input type="password" class="form-control" id="passwordLoginInput" placeholder="Enter your password" v-model="loginPassword">
                        <br>
                        <button class="form-control" @click="userLogin">Log In</button>
                    </form>
                </div>

            </div>
        </div>
    </div>

</template>

<style scoped>
#accountPageDiv{
    align-items: center;
    width:max-content;
    padding: 4vh;
    border: 2px solid lightgrey;
    border-radius: 20px;
    margin: 3vh;
    background-color:rgb(243, 239, 234);
    
}
#emailInput,#emailLoginInput{
    width: 35ch;
}

#flexWrapper{
    background-color: rgb(255, 243, 224);
    height: 100vh;
}
</style>
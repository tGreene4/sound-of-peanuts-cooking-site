<script setup>
    pfpInputElem = document.getElementById("pfpInput")
    previewImg = document.getElementById("pfpPreviewImg")
    pfpInputElem.addEventListener("change", (e) => {
         previewImg.src = URL.createObjectURL(e.target.files[0])
    })

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
                        <input type = "text" class = "form-control" id = "usernameInput" placeholder="Enter your username">
                        <label for = "usernameInput" class = "form-label">Email:</label>
                        <input type = "email" class = "form-control" id = "emailInput" placeholder="Enter your email">
                        <label for = "usernameInput" class = "form-label">Password:</label>
                        <input type = "password" class = "form-control" id = "passwordInput" placeholder="Enter your password">
                        <label for = "usernameInput" class = "form-label">Confirm Password:</label>
                        <input type = "password" class = "form-control" id = "confirmPasswordInput" placeholder="Enter the same password as above">
                        <br>
                        <label for = "pfpInput" class="form-label">Upload your Profile Picture</label>
                        <img src="../assets/images/User Icon.png" style="width:30vh;display:block;" id = "pfpPreviewImg">
                        <input type ="file" class = form-control id = "pfpInput" accept="image/png,image/jpeg">
                        <button class="form-control">Sign Up</button>
                    </form>
                </div>
                <div class = "tab-pane" id = "loginDiv">
                    <form>
                        <label for = "emailLoginInput" class = "form-label">Email:</label>
                        <input type="email" class="form-control" id="emailLoginInput" placeholder="Enter your email">
                        <label for = "passwordLoginInput" class = "form-label">Password:</label>
                        <input type="password" class="form-control" id="passwordLoginInput" placeholder="Enter your password">
                        <br>
                        <button class="form-control" @click="">Log In</button>
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
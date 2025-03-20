<script>
import { app } from "../api/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../api/firebase";

export default {
    name: "Upload",
    data() {
        return {
        }
    },
    methods: {
        handleFileUpload() {
            // Creates a folder images (if it doesn't already exist)
            const storageRef = ref(storage, 'images/' + this.$refs.file.value);
            // Uploads to the the storage bucket
            uploadBytes(storageRef, this.$refs.file.files[0]).then((snapshot) => {
                // Gets a URL of the image
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    // Set the SRC attribute to the downloadURL
                    this.$refs.image.setAttribute("src", downloadURL);
                    console.log(downloadURL);
                });
            });
        }
    }
} 
</script>

<template>
    <label for="avatar">Choose a profile picture:</label>
    <input ref="file" @change="handleFileUpload()" type="file" id="avatar" name="avatar"
        accept="image/png, image/jpeg" />
    <img ref="image" src="" alt="">
</template>
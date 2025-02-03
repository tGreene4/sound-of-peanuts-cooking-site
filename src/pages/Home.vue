<script>
import app from '../api/firebase';
import { getFunctions, httpsCallable } from
    "../../functions/index.js";
export default {
    data() {
        return {
            handle: ''
            ,
            comment: ''
        }
    },
    methods: {
        async postComment() {
            console.log(this.handle);
            console.log(this.comment);
            const functions = getFunctions(app);
            const postComment =
                httpsCallable(functions,
                    'postcomment');
            const result = await postComment(
                {
                    "handle": this.handle,
                    "comment": this.comment
                });
            console.log(result);
        }
    }
}
</script>

<script setup>
import MainMediaContainer from '../components/HomeMainMediaContainer.vue';
import postComment from '../components/postComment.vue'
</script>

<template>
    <MainMediaContainer />
    <postComment />
</template>
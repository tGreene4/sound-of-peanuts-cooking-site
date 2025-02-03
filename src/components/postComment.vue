<template>
    <div class="mb-3 right">
        <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Email address</label>
            <input type="email" v-model="handle" class="form-control" id="exampleFormControlInput1"
                placeholder="name@example.com">
        </div>
        <div class="mb-3">
            <label for="exampleFormControlTextarea1" class="form-label">Comment</label>
            <textarea class="form-control" v-model="comment" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
        <div class="mb-3 right">
            <button type="button" @click="postComment" class="btn btn-primary">Post Comment</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            handle: '',
            comment: ''
        }
    },
    methods: {
        postComment() {
            console.log(this.handle);
            console.log(this.comment);
        }
    }
}
</script>
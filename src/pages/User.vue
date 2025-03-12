<script setup>
    import funcs from '../api/firebase'
    import { httpsCallable } from 'firebase/functions';
    

    const props = defineProps({
        thisUserId:Int
    });

    const dbUserRequest = httpsCallable(funcs,'getDbUser');
    dbUserRequest({ uid: '0'})
        .then((res)=>{const output = result.data.text;console.log(output);})
        .catch((error)=>{console.log(error)})

</script>

<template>
    <h1>{{output}}</h1>
    <img src = "">
    


</template>
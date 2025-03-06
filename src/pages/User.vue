<script setup>
    import funcs from '../api/firebase'
    import {getDocs, collections, collection} from 'firebase/firestore'
    import { httpsCallable } from 'firebase/functions';
    

    const props = defineProps({thisUserId:Int});

    const dbUserRequest = httpsCallable(funcs,'getDbUser');
    dbUserRequest({ uid: '0'})
        .then((result)=>{const output = result.data.text})
        .catch((error)=>{console.log(error)})

</script>

<template>
    <h1>{{output}}</h1>
    <img src = "">
    


</template>
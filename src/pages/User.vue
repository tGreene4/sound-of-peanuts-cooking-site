<script setup>
    import { onMounted } from 'vue';
    import { functions } from '../api/firebase'
    import { httpsCallable } from 'firebase/functions';
    import { useRoute } from 'vue-router';
    
    const route = useRoute();
    const getThisUser = async()=>{
        const dbUserRequest = httpsCallable(functions,'getDbUser');
        try{
            const output = await dbUserRequest({uid:route.params.id});
        }catch(error){
            console.log("Failed to get user:"+error.message);
        }
        
    }
    
    onMounted(()=>{
        getThisUser();
    })

</script>

<template>
    <h1>{{output}}</h1>
    <img src = "">
    


</template>
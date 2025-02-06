<script>
    import auth from '../api/firebase'
    import {onAuthStateChanged} from 'firebase/auth'

    onAuthStateChanged(auth, (user) => {
        if(user){
            user.uid
        }else{
            
        }
    })
</script>

<template @onload="">

</template>
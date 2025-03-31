<template>
    <div class="not-found container-fluid bg-secondary gradient-custom min-vh-100 " style="padding-top: 20px;">
        <div class="text-center">
            <h1 class="header">404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <router-link to="/" class="btn btn-primary">Return to Home</router-link>

        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>

<style scoped>

button {
  background: rgb(240, 240, 240);
  border: black 2px solid;
  border-radius: 15px;
  Box-shadow: 3px 3px 5px black;
  max-width: 20rem;
  min-width: 5rem;
}

.header {
    background: #2242cf;
    background: linear-gradient(to right, #2233cf 0%, #CF2AA6 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.gradient-custom {
    background: linear-gradient(to right, rgba(242, 233, 126, 75%), rgba(255, 121, 0, 50%));
}
</style>
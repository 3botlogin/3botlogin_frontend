<template>
  <v-app>
    <div class="overlay primary darken-2"></div>
    <v-content>
      <v-container class="mt-4">
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

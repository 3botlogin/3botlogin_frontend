<template>
  <v-app>
    <v-content>
      <v-container class="mt-4">
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: "App",
  data() {
    return {
    };
  }
};
</script>

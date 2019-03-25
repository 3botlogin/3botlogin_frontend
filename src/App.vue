<template>
  <v-app>
    <div class="overlay primary darken-2"></div>
    <v-content fill-height>
      <v-container>
          <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  mounted () { 
   if (this.$route.query && this.$route.query.state && this.$route.query.redirecturl) {
     this.$store.dispatch('saveState', {
       hash: this.$route.query.state,
       redirectUrl: this.$route.query.redirecturl
     })
   } else {
     this.$router.push('error')
   }
  },
};
</script>

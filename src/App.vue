<template>
  <div id="app">
    <b-navbar class="navbar">
      <b-navbar-brand href="/">
        <img src="../src/assets/logo.png" class="logo" height="100px" alt="Logo" />
      </b-navbar-brand>
      <b-navbar-nav class="ms-auto">
        <b-nav-item href="/map" style="margin-top: 5px;">Map</b-nav-item>
        <b-nav-item><search-bar></search-bar></b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "App",
  components: {
    SearchBar,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navbar {
  background-color: #e2edee;
  padding: 0 40px;
  font-weight: bold;
  box-shadow: 2px 2px 4px rgb(189, 189, 189);
}


@media screen and (max-width: 715px) {
  .navbar {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    justify-content: center;
  }

  .logo {
    height: 90px;
  }
}
</style>

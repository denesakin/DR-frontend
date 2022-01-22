<template>
<div>
  <div class="home-container">
    <h1 class="home-header">WELCOME TO DENTISTIMO!</h1>
    <p class="slogan">Where your dental hygiene is the least of your worries</p>
  </div>
  <div class="home-body">
    <p class="home-text">
      Here you can search for our clinics centered in Gothenburg. 
      <br> There is a variety of locations for you to choose from so traveling should not be a big problem.
      <br> You can view each clinic's schedule and book a time for yourself. 
    </p>
    <p class="home-text-lg">For more details about a specific clinic search for one by using the search bar above.
      <br> You can also find a clinic in the map by clicking on the button to the right.
    </p>
    <p class="home-text-sm">For more details about a specific clinic search for one by using the search bar above.
      <br> You can also find a clinic in the map by clicking on the button below.
    </p>
    <router-link to="/map"><button class="map-button">Map</button></router-link>
  </div>
</div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style>
.home-container {
  background-image: url(../assets/home-background.jpg);
  padding: 50px 0px 100px 0px;
  background-size: cover;
  background-repeat: no-repeat;
}

.home-header {
  text-align: center;
  margin-top: 3%;
  font-weight: bold;
  color: #000000;
}

.slogan {
  color: #000000;
  font-size: 18px;
}

.home-body {
  margin-top: 7%;
  margin-right: 5%;
  display: flex;
  align-items: center;
}

.home-text {
  text-align: center;
  margin-left: 5%;
  margin-right: 5%;
  font-weight: bold;
  font-size: 18px;
  color: #1a1a1a;
}

.home-text-lg {
  display: inline-block;
  text-align: center;
  margin-left: 5%;
  margin-right: 5%;
  font-weight: bold;
  font-size: 18px;
  color: #1a1a1a;
}

.home-text-sm {
  display: none;
  text-align: center;
  margin-left: 5%;
  margin-right: 5%;
  font-weight: bold;
  font-size: 18px;
  color: #1a1a1a;
}

.map-button {
  margin-left: 5%;
  border-radius: 20px;
  font-size: 35px;
  padding-inline: 30px;
  padding-block: 10px;
  background-color: #00c8d6;
  color: white;
  border: none;
}

@media screen and (max-width: 600px) {
  .home-container {
    padding: 50px 0px 50px 0px;
  }

  .home-header {
    font-size: 24px;
  }

  .slogan {
    font-size: 14px;
  }

  .home-body {
    flex-direction: column;
    margin-bottom: 5%;
  }

  .home-text-lg {
    display: none;
  }

  .home-text {
    margin-bottom: 10%;
  }

  .home-text-sm {
    display: inline-block;
    margin-bottom: 5%;
  }
}
</style>
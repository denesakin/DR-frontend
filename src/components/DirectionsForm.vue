<template>
  <section class="directions-form">
    <b-container fluid>
      <h4><b>Directions</b></h4>
      <b-input-group class="mb-2 origin">
        <b-input-group-prepend is-text>
          <b-icon icon="geo-alt-fill"></b-icon>
        </b-input-group-prepend>
        <Gmap-Autocomplete
          placeholder="Origin"
          @place_changed="setPlace"
          :options="{
            fields: ['geometry', 'formatted_address', 'address_components'],
          }"
          class="origin"
        ></Gmap-Autocomplete>
      </b-input-group>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="flag-fill"></b-icon>
        </b-input-group-prepend>
        <b-form-input
          type="text"
          placeholder="Clinics"
          list="clinic-list"
          v-model="clinic"
        ></b-form-input>
        <b-form-datalist id="clinic-list" :options="clinics"></b-form-datalist>
      </b-input-group>
      <b-button variant="success" class="findClinic" @click="sendDirections()"
        >Find Clinic</b-button
      >
    </b-container>
  </section>
</template>

<style scoped>
.directions-form {
  position: relative;
  z-index: 1;
  max-width: 272px;
  margin: 10px;
  background: #ecf1f1;
  box-shadow: rgb(0 0 0 / 12%) 0px 1px 2px, rgb(0 0 0 / 24%) 0px 1px 2px;
}
.findClinic {
  margin-bottom: 10px;
  background: #4caf50;
}
</style>

<script>
import { Api } from "@/Api";

export default {
  props: [],
  data() {
    return {
      origin: null,
      destination: null,
      clinic: null,
      clinics: [],
      directionMarkers: [],
      startLocation: null,
      endLocation: null,
    };
  },
  mounted() {
    this.getClinics();
  },
  methods: {
    setPlace(place) {
      this.origin = place;
      console.log(this.origin);
      console.log(this.origin.geometry.location.lat());
      console.log(this.origin.address_components[0].long_name);
      console.log(this.origin.formatted_address);
    },
    async getClinics() {
      await Api.get("/clinics")
        .then((response) => {
          for (let i = 0; i < response.data.results.length; i++) {
            this.clinics.push(response.data.results[i].name);
          }
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.log(error);
        });
    },
    async getDestinationClinic() {
      if (this.clinic === "Your Dentist") {
        await Api.get("/clinics/1")
          .then((response) => {
            this.destination = response.data;
            console.log(this.destination);
            console.log(this.destination.coordinate.longitude);
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      } else if (this.clinic === "Tooth Fairy Dentist") {
        await Api.get("/clinics/2")
          .then((response) => {
            this.destination = response.data;
            console.log(this.destination);
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      } else if (this.clinic === "The Crown") {
        await Api.get("/clinics/3")
          .then((response) => {
            this.destination = response.data;
            console.log(this.destination);
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      } else if (this.clinic === "Lisebergs Dentists") {
        await Api.get("/clinics/4")
          .then((response) => {
            this.destination = response.data;
            console.log(this.destination);
          })
          .catch((error) => {
            alert(error.response.data.message);
          });
      } else {
        alert("Error! Please fill in a destination.");
        console.log(this.clinic);
      }
    },
    async addDirectionMarkers() {
      await this.getDestinationClinic();
      this.directionMarkers = [
        {
          position: {
            lat: this.origin.geometry.location.lat(),
            lng: this.origin.geometry.location.lng(),
          },
          label:
            `<h6>${this.origin.address_components[0].long_name}</h6>` +
            `<div>` +
            `<p><b>Address:</b> ${this.origin.formatted_address}</p>` +
            `</div>`,
        },
        {
          position: {
            lat: this.destination.coordinate.latitude,
            lng: this.destination.coordinate.longitude,
          },
          label:
            `<h6>${this.destination.name}</h6>` +
            `<div>` +
            `<p><b>Address:</b> ${this.destination.name}, ${this.destination.city}, Sweden</p>` +
            `</div>`,
        },
      ];
      this.startLocation = this.directionMarkers[0].position;
      this.endLocation = this.directionMarkers[1].position;
    },
    async sendDirections() {
      await this.addDirectionMarkers();
      this.$emit("direction-markers", this.directionMarkers);
      this.$emit("start-location", this.startLocation);
      this.$emit("end-location", this.endLocation);
    },
  },
};
</script>
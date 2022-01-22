<template>
  <b-container fluid>
    <div>
      <DirectionsForm
        @direction-markers="getDirectionMarkers"
        @start-location="getStartLocation"
        @end-location="getEndLocation"
      />
      <GmapMap
        :center="userCoordinates"
        :zoom="zoom"
        :options="{
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true,
          disableDefaultUI: false,
        }"
        style="position: absolute; top: 130px; right: 0; bottom: 0; left: 0"
        ref="mapRef"
        @dragend="storeDrag"
      >
        <Gmap-Info-Window
          :options="infoOptions"
          :position="infoWindowPosition"
          :opened="infoWindowOpen"
          @closeclick="infoWindowOpen = false"
        >
        </Gmap-Info-Window>
        <GmapMarker
          :key="index"
          v-for="(marker, index) in markers"
          :position="marker.position"
          :clickable="true"
          :icon="marker.icon"
          @click="toggleInfoWindow(marker, index)"
        />
        <DirectionsRenderer
          travelMode="DRIVING"
          :origin="startLocation"
          :destination="endLocation"
        />
      </GmapMap>
    </div>
  </b-container>
</template>
<script>
import { Api } from "@/Api";
import DirectionsForm from "@/components/DirectionsForm";
import DirectionsRenderer from "@/components/DirectionsRenderer.js";

export default {
  components: { DirectionsForm, DirectionsRenderer },
  data() {
    return {
      map: null,
      userCoordinates: {
        lat: 57.705247179,
        lng: 11.970579451,
      },
      zoom: 13,
      clinicInfo: [],
      markers: [],
      infoWindowPosition: null,
      infoWindowOpen: false,
      currentMarkerIndex: null,
      infoOptions: {
        content: "",
        pixelOffset: {
          width: 0,
          height: -35,
        },
        directionMarkers: [],
        startLocation: null,
        endLocation: null,
      },
    };
  },
  created() {
    if (localStorage.center) {
      // store center of map in local storage
      this.userCoordinates = JSON.parse(localStorage.center);
    } else {
      // get user's coordinates
      this.$getLocation({})
        .then((coordinates) => {
          this.userCoordinates = coordinates;
        })
        .catch((error) => alert(error));
    }
    if (localStorage.zoom) {
      // store zoom level in local storage
      this.zoom = parseInt(localStorage.zoom);
    }
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then((map) => (this.map = map));
    this.getClinicMarkers();
    this.addMarkers();
  },
  methods: {
    storeDrag() {
      // store center and zoom in localstorage
      let center = {
        lat: this.map.getCenter().lat(),
        lng: this.map.getCenter().lng(),
      };
      let zoom = this.map.getZoom();
      localStorage.center = JSON.stringify(center);
      localStorage.zoom = zoom;
    },
    async getClinicMarkers() {
      // retrieves all the clinic registry data
      await Api.get("/clinics")
        .then((response) => {
          this.clinicInfo = response.data;
          console.log(response);
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.log(error);
        });
    },
    async addMarkers() {
      // formats the clinic registry data into markers
      await this.getClinicMarkers();
      this.markers = [
        {
          position: {
            lat: this.clinicInfo.results[0].coordinate.latitude,
            lng: this.clinicInfo.results[0].coordinate.longitude,
          },
          label:
            `<h6>${this.clinicInfo.results[0].name}</h6>` +
            `<div>` +
            `<p><b>Address:</b> ${this.clinicInfo.results[0].address} </br>` +
            `<b>City:</b> ${this.clinicInfo.results[0].city} </br>` +
            `<b>Owner:</b> ${this.clinicInfo.results[0].owner}</p>` +
            `<a href="/clinics/1" class="btn btn-primary" role="button">Book</a> ` +
            `</div>`,
          icon: {
            url: require("../assets/marker.png"),
          },
        },
        {
          position: {
            lat: this.clinicInfo.results[1].coordinate.latitude,
            lng: this.clinicInfo.results[1].coordinate.longitude,
          },
          label:
            `<h6>${this.clinicInfo.results[1].name}</h6>` +
            `<div>` +
            `<p><b>Address:</b> ${this.clinicInfo.results[1].address} </br>` +
            `<b>City:</b> ${this.clinicInfo.results[1].city} </br>` +
            `<b>Owner:</b> ${this.clinicInfo.results[1].owner}</p>` +
            `<a href="/clinics/2" class="btn btn-primary" role="button">Book</a> ` +
            `</div>`,
          icon: {
            url: require("../assets/marker.png"),
          },
        },
        {
          position: {
            lat: this.clinicInfo.results[2].coordinate.latitude,
            lng: this.clinicInfo.results[2].coordinate.longitude,
          },
          label:
            `<h6>${this.clinicInfo.results[2].name}</h6>` +
            `<div>` +
            `<p><b>Address:</b> ${this.clinicInfo.results[2].address} </br>` +
            `<b>City:</b> ${this.clinicInfo.results[2].city} </br>` +
            `<b>Owner:</b> ${this.clinicInfo.results[2].owner}</p>` +
            `<a href="/clinics/3" class="btn btn-primary" role="button">Book</a> ` +
            `</div>`,
          icon: {
            url: require("../assets/marker.png"),
          },
        },
        {
          position: {
            lat: this.clinicInfo.results[3].coordinate.latitude,
            lng: this.clinicInfo.results[3].coordinate.longitude,
          },
          label:
            `<h6>${this.clinicInfo.results[3].name}</h6>` +
            `<div>` +
            `<p><b>Address:</b> ${this.clinicInfo.results[3].address} </br>` +
            `<b>City:</b> ${this.clinicInfo.results[3].city} </br>` +
            `<b>Owner:</b> ${this.clinicInfo.results[3].owner}</p>` +
            `<a href="/clinics/4" class="btn btn-primary" role="button">Book</a> ` +
            `</div>`,
          icon: {
            url: require("../assets/marker.png"),
          },
        },
      ];
    },
    toggleInfoWindow: function (marker, index) {
      this.infoWindowPosition = marker.position;
      this.infoOptions.content = marker.label;
      // check if the same or different marker is selected
      if (this.currentMarkerIndex == index) {
        this.infoWindowOpen = !this.infoWindowOpen;
      } else {
        this.infoWindowOpen = true;
        this.currentMarkerIndex = index;
      }
    },
    getDirectionMarkers(payload) {
      this.directionMarkers = payload;
      console.log(this.directionMarkers);
    },
    getStartLocation(payload) {
      this.startLocation = payload;
      this.$forceUpdate();
      console.log(this.startLocation);
    },
    getEndLocation(payload) {
      this.endLocation = payload;
      console.log(this.endLocation);
    },
  },
  computed: {
    mapCoordinates() {
      if (!this.map) {
        return {
          lat: 0,
          lng: 0,
        };
      }
      return {
        lat: this.map.getCenter().lat().toFixed(4),
        lng: this.map.getCenter().lng().toFixed(4),
      };
    },
  },
};
</script>
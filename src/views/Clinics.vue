<template>
  <b-container>
    <b-row>
      <b-carousel
        id="carousel-fade"
        fade
        :interval="5000"
        img-width="1024"
        img-height="270"
      >
        <!-- Images are from Freepik.com -->
        <b-carousel-slide
          img-src="https://ibb.pics/m0sVXJr/dentist.png"
        ></b-carousel-slide>
        <b-carousel-slide img-src="https://ibb.pics/XCrcDMc/smile.png">
        </b-carousel-slide>
        <b-carousel-slide
          img-src="https://ibb.pics/4JvzWFB/tooth.png"
        ></b-carousel-slide>
      </b-carousel>
    </b-row>
    <b-row>
      <b-col>
        <b-breadcrumb :items="items"></b-breadcrumb>
        <h1 class="font dentist">{{ name }}</h1>
        <span class="font address">{{ address }}, {{ city }}</span>
        <b-tabs content-class="mt-3">
          <b-tab title="Avaliable bookings" active>
            <div class="d-flex flex-column">
              <b-card
                v-for="booking in availableBookings"
                v-bind:key="booking._id"
                class="booking"
              >
                <b-row>
                  <b-col class="booking-details">
                    <b-card-text class="font time"
                      ><b
                        >Time: {{ booking.startTime }} -
                        {{ booking.endTime }}</b
                      ></b-card-text
                    >
                    <b-card-text class="font"
                      >Date: {{ booking.date }}</b-card-text
                    >
                  </b-col>
                  <b-col cols="8" class="availability align-self-center">
                    <b-card-text><b>Available</b></b-card-text>
                  </b-col>
                  <b-col>
                    <b-button
                      pill
                      v-on:click="confirmBooking(booking.date, booking.startTime, booking.endTime)"
                      class="font booking-button"
                      >Confirm Booking</b-button
                    >
                  </b-col>
                </b-row>
              </b-card>
            </div>
          </b-tab>
          <b-tab title="View bookings details">
            <p>
              Use your booking code to view details of your booking
            </p>
            <div>
              <input
                  class="input-booking"
                  placeholder="Booking code"
                  v-model="bookingCode"
                  type="text"
              />
            </div>
            <button class="booking-search-button" v-on:click="redirectToBooking">
              Search
            </button>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
    <div class="divider"></div>
    <h2 class="font open-hours-header">Open Hours</h2>
    <div class="open-hours">
      <p class="font days">
        <b>Monday:</b> {{ openingHours.monday }} <br />
        <b>Tuesday:</b> {{ openingHours.tuesday }} <br />
        <b>Wednesday:</b> {{ openingHours.wednesday }} <br />
        <b>Thursday:</b> {{ openingHours.thursday }} <br />
        <b>Friday:</b> {{ openingHours.friday }}
      </p>
    </div>
    <div class="divider"></div>
    <h2 class="font">Clinic Location</h2>
    <GmapMap
      :center="clinicCoordinates"
      :zoom="zoom"
      style="width: 100%; height: 650px; margin: 32px auto"
      ref="mapRef"
    >
      <GmapMarker
        :position="clinicCoordinates"
        :icon="{ url: require('../assets/marker.png') }"
      />
    </GmapMap>
    <b-modal id="booking-modal" hide-footer>
      <template #modal-title>
        Confirming booking
      </template>
      <div class="d-block">
        <p v-if="bookingError">An error occurred while confirming your booking</p>
        <p v-else>You will be redirected shortly...</p>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import { Api } from "@/Api";
import { DateTime } from "luxon";

export default {
  name: "Clinics",
  data() {
    return {
      bookings: [],
      name: null,
      address: null,
      openingHours: [],
      city: null,
      items: [
        {
          text: "Home",
          href: "/",
        },
        {
          text: "Clinic",
          active: true,
        },
      ],
      map: null,
      clinicCoordinates: {
        lat: 0,
        lng: 0,
      },
      zoom: 15,
      bookingCode: "",
      bookingError: false
    };
  },
  async mounted() {
    this.setCurrentClinic();
    this.$refs.mapRef.$mapPromise.then((map) => (this.map = map));
    this.getBookings();
  },
  methods: {
    async setCurrentClinic() {
      console.log("Page loading confirm");
      const clinicId = this.$route.params.Cid;
      console.log(clinicId);
      await Api.get("/clinics/" + clinicId)
        .then((response) => {
          console.log(response.data);
          this.name = response.data.name;
          this.address = response.data.address;
          this.openingHours = response.data.openinghours;
          this.city = response.data.city;
          this.clinicCoordinates.lat = response.data.coordinate.latitude;
          this.clinicCoordinates.lng = response.data.coordinate.longitude;
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.log(error);
        });
    },
    async getBookings() {
      const clinicId = this.$route.params.Cid;
      await Api.get(`/clinics/${clinicId}/bookings?date=${this.currentDate()}`)
        .then((response) => {
          console.log(response.data);
          this.bookings = response.data;
        })
        .catch((error) => {
          alert(error.response.data.message);
          console.log(error);
        });
    },
    async confirmBooking(date, startTime, endTime) {
      const clinicId = this.$route.params.Cid;
      let isCircuitOpen = false;
      const bookingCode = await Api.post(`/clinics/${clinicId}/bookings`, {
        date: date,
        startTime: startTime,
        endTime: endTime
      })
        .then((response) => {
          this.getBookings();
          return response.data.code;
        })
        .catch((error) => {
          if(error.response.status == 503) { // This check was made to ensure that 503 errors are handled differently!
            this.systemUnavailableNotification(error.response.data)
            isCircuitOpen = true;
          } else {
            alert(error.response.data.message);
            console.log(error);
          }
        });

      if (!isCircuitOpen) { // This was done to ensure that the circuit breaker toast message would be displayed in case of a 503 status!
        this.bookingError = false;
        this.$bvModal.show('booking-modal')
        /*
        * Couldn't get exponential backoff to work
        * Quick fix to accommodate for the delay between the request being sent
        * and the booking being created
        * */
        setTimeout(() => {
          Api.get(`/bookings/${bookingCode}`)
          .then(() => {
            this.$router.push(`/details?code=${bookingCode}`);
          })
          .catch(() => {
            this.bookingError = true;
          })
        }, 1500)
      }
    },
    systemUnavailableNotification(notificationMessage) {
      this.$bvToast.toast(notificationMessage, {
        title: 'Error!',
        autoHideDelay: 3000,
        solid: true,
        variant: 'danger',
        toaster: 'b-toaster-top-right'
      });
    },  
    currentDate() {
      const currentDate = new Date();
      return currentDate.getFullYear() + '-'
          + (currentDate.getMonth() + 1).toString().padStart(2, '0') + '-'
          + currentDate.getDate().toString().padStart(2, '0')
    },
    redirectToBooking() {
      if (!this.bookingCode || this.bookingCode === "") {
        return;
      }

      this.$router.push(`/details?code=${this.bookingCode}`)
    }
  },  
  computed: {
    availableBookings: function () {
      return this.bookings.map(booking => {
        const date = DateTime.fromISO(booking, { zone: 'UTC' });

        const startTime = date.toFormat("HH:mm");
        const endTime = date.plus({ minutes: 30 }).toFormat("HH:mm");
        const dateString = date.toFormat("yyyy-MM-dd");

        return {
          startTime: startTime,
          endTime: endTime,
          date: dateString
        }
      });
    },
  },
};
</script>

<style>
.carousel-inner {
  width: 100%;
  max-height: 270px !important;
}
.font {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI";
}
.dentist {
  margin-top: 10px;
}
.address {
  font-size: 1.3rem;
  font-weight: 300;
}
.view-more {
  margin-top: 15px;
}
.open-hours-header {
  margin-top: 15px;
  margin-bottom: 15px;
}
.days {
  font-weight: 400;
  font-size: 16px;
  color: rgb(76, 90, 118);
}
.divider {
  margin-top: 15px;
  margin-bottom: 15px;
  height: 1px;
  width: 100%;
  border-top: 1px solid #dee2e6;
}
.clinic-info {
  margin-top: 15px;
}
.open-hours {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.time {
  font-size: px;
  line-height: 10px;
  color: rgb(13, 34, 76);
}
.booking-details {
  text-align: left;
}
.availability {
  text-align: right;
  color: rgb(112, 218, 77);
}
.booking {
  margin-bottom: 11px;
  box-shadow: rgb(0 0 0 / 12%) 0px 1px 2px, rgb(0 0 0 / 24%) 0px 1px 2px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s !important;
}
.booking:hover {
  z-index: 1000;
  position: relative;
  box-shadow: rgb(15 27 60 / 14%) 0px 7px 14px, rgb(0 0 0 / 22%) 0px 2px 4px;
}
.booking-button {
  padding: 11px 16px !important;
  background-color: rgb(25, 128, 218) !important;
  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s !important;
}
.booking-button:hover {
  box-shadow: rgb(23 128 218 / 20%) 0px 0px 0px 5px;
}

.input-booking {
  width: 20%;
  height: 35px;
  border: 1px solid;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 10px;
}

.input-booking:focus {
  outline: none;
}

.booking-search-button {
  border-radius: 20px;
  padding-inline: 20px;
  padding-block: 5px;
  background-color: #00c8d6;
  color: white;
  border: none;
}

</style>

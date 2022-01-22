<template>
    <div v-if="bookingDetails !== null" class="details-container">
        <h1 class="confirmation">BOOKING DETAILS</h1>
        <p class="detail">Clinic: {{ this.bookingDetails.clinicName }}</p>
        <p class="detail">Date: {{ this.bookingDetails.date }}</p>
        <p class="detail">Time: {{ this.bookingDetails.startTime }} - {{ this.bookingDetails.endTime }}</p>
        <p class="detail code">Code: {{ this.bookingDetails.code }}</p>
    </div>
    <div v-else class="details-container">
        <h1>Booking not found!</h1>
    </div>
</template>

<script>
import { Api } from "@/Api";

export default {
  name: "BookingDetails",
  data() {
    return {
      bookingDetails: null
    }
  },
  mounted() {
    this.getBookingDetails()
  },
  methods: {
    async getBookingDetails() {
      const code = this.$route.query.code;
      const booking = await Api.get(`/bookings/${code}`)
        .then(response => response.data)
        .catch(() => {
          this.bookingDetails = null;
        });

      const clinicId = booking.clinicId;

      const clinicName = await Api.get(`/clinics/${clinicId}`).then(response => response.data.name);

      this.bookingDetails = {
        clinicName: clinicName,
        code: booking.code,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
      }
    }
  }
}
</script>

<style>
    .details-container {
        margin-top: 5%;
    }
    .confirmation {
        font-weight: bold;
        margin-bottom: 2%;
    }
    .detail {
        font-size: 24px;
    }
    .code {
        font-weight: bold;
        margin-top: 5%
    }
    .cancel-button {
        border-radius: 20px;
        font-size: 20px;
        padding-inline: 30px;
        padding-block: 10px;
        background-color: #e43e3e;
        color: white;
        border: none;
    }
</style>

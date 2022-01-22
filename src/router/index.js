import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Map from '../views/Map.vue'
import Clinics from '../views/Clinics.vue'
import BookingDetails from '../views/BookingDetails.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/map',
    name: 'Map',
    component: Map
  },
  {
    path: '/clinics/:Cid',
    name: 'Clinics',
    component: Clinics
  },
  {
    path: '/details',
    name: 'Booking Details',
    component: BookingDetails
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

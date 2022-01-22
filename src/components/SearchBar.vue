<template>
  <div class="wrapper">
    <div class="dropdown">
      <div>
        <input
          @click="isHidden = false"
          class="input-search search-bar" id="search-bar"
          v-model="search"
          placeholder="Search for a clinic"
          type="text"
        />
        <svg class="search-bar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="31" height="31"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/></svg>
      </div>
      <div v-if="!isHidden" class="clinics" id="searched-clinics">
        <ul class="items">
          <li @click="selectClinic(clinic)" v-for="(clinic, index) in searchedClinic" :key="`dentist-${index}`" class="item">{{clinic.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Api } from "@/Api";

window.addEventListener('mouseup', function(event) {
    var search = document.getElementById('searched-clinics');
    if(event.target != document.getElementById('search-bar')) {
      search.style.display = 'none';
    } else if (event.target == document.getElementById('search-bar')) {
      search.style.display = 'block';
    }
});

export default {
  name: "search-bar",
  async mounted() {
    await Api.get('/clinics')
    .then((response) => {
    console.log(response)
    this.clinics = response.data.results
    })
    .catch((error) => {
    this.clinics = []
    console.log(error)
  })
  }, 
  data() {
    return {
      clinics: [],
      selectedClinic: null,
      search: "",
      isHidden: true
    }
  },
  computed: {
    searchedClinic() {
      const query = this.search.toLowerCase();
      if(this.search === "") {
        return this.clinics
      }
      return this.clinics.filter((clinic) => {
        return clinic.name.toLowerCase().includes(query);
      })
    }
  },
  methods: {
    selectClinic(clinic) {
      this.selectedClinic = clinic;
      console.log("chosen clinic: " + this.selectedClinic.name)
      this.$router.push({name: 'Clinics', params: { Cid: clinic.id}})

    }
  }
};
</script>

<style>
.wrapper {
  max-width: 300px;
  margin: 0 auto;
  position: relative;
}

.dropdown {
  position: absolute;
  left: 0;
  right: 0;
  background-color: transparent;
  width: 100%;
}

.input-search {
  width: 85%;
  height: 35px;
  border: 2px solid;
  border-radius: 15px;
  padding: 10px;
}

.input-search:focus {
  outline: none;
}

.search-bar {
  display: inline-block;
}

.clinics{
  float: none;
  position: absolute;
  width: 225px;
  border: #c2cbcc;
  border-radius: 5px;
}

.items {
  list-style: none;
  text-align: left;
  max-height: 100px;
  overflow-y: scroll;
  padding: 5px;
}

.item {
  cursor: pointer;
  font-weight: bold;
  border-bottom: 2px solid;
  padding: 5px;
  width: 100%;
  background-color: #e7f5f8
}

.item:hover{
  background-color: #b9d0d1
}

</style>

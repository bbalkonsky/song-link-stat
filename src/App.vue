// month/week charts choose
// channel links in date page
// filter data by click on chart
// icons for services
// parse date
// avatar in user page
// average by week

<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script type="text/babel">
  import axios from 'axios'

  export default {
    name: 'app',
    data() {
      return {
        usersList: [],
        isActive: true
      }
    },
    methods: {

    },
    created() {
      axios.get('http://127.0.0.1:5000/users').then(response => this.usersList = response.data);
    }
  };
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
  }
</style>

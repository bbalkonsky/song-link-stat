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
  export default {
    name: 'app',
    data() {
      return {
        isActive: true
      }
    },
    methods: {

    },
    created() {
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

<template>
  <div>

  </div>
</template>

<style lang="less">
  @import 'common.css';
</style>

<script>
  import * as d3 from "d3";
  import Chart from "../chart";

  export default {
    name: '',
    data() {
      return {

      }
    },
    props: {
      dataFormatter: {
        type: Object,
        required: true
      },
      config: {
        type: Object,
        required: true
      }
    },
    methods: {
      getData() {

      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

<template>
  <div>
    <div id="chart" ref="chart" style="width: 100%;height: 400px"></div>
  </div>
</template>

<style lang="less">

</style>

<script>
  import axios from 'axios';

  export default {
    name: '',
    data() {
      return {
        takenSeatNames: ['26E', '26D', '26C', '25D', '23C', '21A', '20F']
      }
    },
    methods: {
      getData() {
        let dom = this.$refs.chart;
        if(dom) {
          let myChart = this.$echarts.init(dom);

          axios.get('../../../../static/file/flight-seats.svg').then(res => {
            let svg = res.data;
            this.$echarts.registerMap('flight-seats', { svg: svg });
            let option = {
              tooltip: {},
              geo: {
                map: 'flight-seats',
                roam: true,
                selectedMode: 'multiple',
                layoutCenter: ['50%', '50%'],
                layoutSize: '95%',
                tooltip: {
                  show: true
                },
                itemStyle: {
                  color: '#fff'
                },
                emphasis: {
                  itemStyle: {
                    color: undefined,
                    borderColor: 'green',
                    borderWidth: 2
                  },
                  label: {
                    show: false
                  }
                },
                select: {
                  itemStyle: {
                    color: 'green'
                  },
                  label: {
                    show: false,
                    textBorderColor: '#fff',
                    textBorderWidth: 2
                  }
                },
                regions: this.makeTakenRegions(this.takenSeatNames)
              }
            };

            myChart.setOption(option);
            // Get selected seats.
            let seats = this.takenSeatNames;
            myChart.on('geoselectchanged', function (params) {
              const selectedNames = params.allSelected[0].name.slice();
              // Remove taken seats.
              for (var i = selectedNames.length - 1; i >= 0; i--) {
                if (seats.indexOf(selectedNames[i]) >= 0) {
                  selectedNames.splice(i, 1);
                }
              }
            });
          })

          window.addEventListener('resize', () => {myChart.resize()});
        }
      },
      makeTakenRegions(takenSeatNames) {
        var regions = [];
        for (var i = 0; i < takenSeatNames.length; i++) {
          regions.push({
            name: takenSeatNames[i],
            silent: true,
            itemStyle: {
              color: '#bf0e08'
            },
            emphasis: {
              itemStyle: {
                borderColor: '#aaa',
                borderWidth: 1
              }
            },
            select: {
              itemStyle: {
                color: '#bf0e08'
              }
            }
          });
        }
        return regions;
      }
    },
    mounted() {
      this.getData();
    }
  }

</script>

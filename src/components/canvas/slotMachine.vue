<template>
  <div style="height: 300px;display: flex;align-items: center">
    <div>
      <SlotMachine
        ref="myLucky"
        width="300px"
        height="180px"
        :blocks="blocks"
        :slots="slots"
        :prizes="prizes"
        :defaultStyle="defaultStyle"
        :defaultConfig="defaultConfig"
        @end="endCallback"
      />
      <div style="margin-top: 10px;text-align: center">
        <el-button type="success" plain @click="startLuckDraw">开始抽奖</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less">

</style>

<script>
  export default {
    name: '',
    data() {
      return {
        /*blocks: [
          { padding: '10px', background: '#869cfa' },
          { padding: '10px', background: '#e9e8fe' },
        ],*/
        blocks: [{
          padding: '27px 40px',
          borderRadius: '20px',
          imgs: [{
            src: require('@/assets/canvas/slot-bg.png'),
            width: '100%',
            height: '100%'
          }]
        }],
        //speed速度 direction方向 order 排列顺序
        slots: [
          { speed: 6, direction: 1, order: [0,1,2] },
          { speed: 6, direction: -1, order: [1,2,0]  },
          { speed: 6, direction: 1, order: [2,0,1]  },
        ],
        prizes: [
          {
            background: '#bac5ee',
            borderRadius: '10px',
            imgs: [{
              width: '80%',
              top: '10%',
              src: require('@/assets/canvas/slot_1.png')
            }]
          },
          {
            background: '#bac5ee',
            borderRadius: '10px',
            imgs: [{
              width: '80%',
              top: '20%',
              src: require('@/assets/canvas/slot_2.png')
            }]
          },
          {
            background: '#bac5ee',
            borderRadius: '10px',
            imgs: [{
              width: '80%',
              top: '20%',
              src: require('@/assets/canvas/slot_3.png')
            }]
          },
        ],
        defaultStyle: {
          borderRadius: Infinity,
          background: '#bac5ee',
          fontSize: '32px',
          fontColor: '#333'
        },
        defaultConfig: {
          rowSpacing: '10px',
          colSpacing: '20px'
        }
      }
    },
    methods: {
      startCallback () {
        this.$refs.myLucky.play()
        setTimeout(() => {
          //一共有[0,0,0] [1,1,1] [2,2,2] [0,1,2] [0,2,1] [0,1,1] [0,2,2] [1,2,2] [1,2,0]
          // 假设 27 种结果
          const res = [
            [0, 0, 0],
            [0, 0, 1],
            [0, 0, 2],
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 2],
            [0, 2, 0],
            [0, 2, 1],
            [0, 2, 2],
            [1, 0, 0],
            [1, 0, 1],
            [1, 0, 2],
            [1, 1, 0],
            [1, 1, 1],
            [1, 1, 2],
            [1, 2, 0],
            [1, 2, 1],
            [1, 2, 2],
            [2, 0, 0],
            [2, 0, 1],
            [2, 0, 2],
            [2, 1, 0],
            [2, 1, 1],
            [2, 1, 2],
            [2, 2, 0],
            [2, 2, 1],
            [2, 2, 2],
          ]
          // 随机取一组数据
          const index = res[Math.random() * 27 >> 0]
          // 调用 stop 方法停止游戏
          this.$refs.myLucky.stop(index)
        }, 500);
      },
      endCallback (prize) {
        // console.log(prize)
      },
      startLuckDraw() {
        this.startCallback();
      }
    },
    mounted() {

    }
  }

</script>

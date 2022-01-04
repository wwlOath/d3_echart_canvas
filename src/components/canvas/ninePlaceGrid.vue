<template>
  <div>
    <LuckyGrid
      ref="myLucky"
      width="300px"
      height="300px"
      :blocks="blocks"
      :prizes="prizes"
      :buttons="buttons"
      :activeStyle="activeStyle"
      :defaultStyle="defaultStyle"
      :defaultConfig="defaultConfig"
      @start="startCallback"
      @end="endCallback"
    />
  </div>
</template>

<style lang="less">

</style>

<script>
  const prizeImg = {
    src: require('@/assets/canvas/prize.png'),
    activeSrc: require('@/assets/canvas/grid-active.png'),
    width: '30%',
    top: '50%'
  }

  export default {
    name: '',
    data() {
      return {
        blocks: [
          { padding: '10px', background: '#869cfa', borderRadius: 30 },
          { padding: '10px', background: '#e9e8fe', borderRadius: 30 },
        ],
        prizes: [
          { fonts: [{ text: '华为 P30pro', top: '20%', fontSize: '12px',fontWeight: 600 }], x: 0, y: 0, imgs: [prizeImg] },
          { fonts: [{ text: '车载净化器', top: '20%', fontSize: '12px',fontWeight: 600  }], x: 1, y: 0, imgs: [prizeImg] },
          { fonts: [{ text: '百叶帘遮阳挡', top: '20%', fontSize: '12px',fontWeight: 600  }], x: 2, y: 0, imgs: [prizeImg] },
          { fonts: [{ text: '16元油卡', top: '20%', fontSize: '12px',fontWeight: 600  }], x: 2, y: 1, imgs: [prizeImg] },
          { fonts: [{ text: '5元油卡', top: '20%', fontSize: '12px',fontWeight: 600  }], x: 2, y: 2, imgs: [prizeImg] },
          { fonts: [{ text: '3元话费', top: '20%', fontSize: '12px',fontWeight: 600  }], x: 1, y: 2, imgs: [prizeImg] },
          { fonts: [{ text: '手机支架', top: '20%', fontSize: '12px',fontWeight: 600  }], x: 0, y: 2, imgs: [prizeImg] },
          { fonts: [{ text: '手提迷你车', top: '20%', fontSize: '12px',fontWeight: 600  }], x: 0, y: 1, imgs: [prizeImg] },
        ],
        buttons: [
          {
            x: 0.5, y: 1,
            row: 2, col: 2,
            background: 'rgba(0,0,0,0)',
            imgs: [{
              src: require('@/assets/canvas/grid-btn.png'),
              width: '50%',
              height: '50%',
            }],
          },
        ],
        activeStyle: {
          background: '#869cfa'
        },
        defaultStyle: {
          background: '#b8c5f2'
        },
        defaultConfig: {
          speed: 3
        }
      }
    },
    methods: {
      startCallback() {
        // 调用抽奖组件的play方法开始游戏
        this.$refs.myLucky.play()
        // 模拟调用接口异步抽奖
        setTimeout(() => {
          // 假设后端返回的中奖索引是0
          const index = 4
          // 调用stop停止旋转并传递中奖索引
          this.$refs.myLucky.stop(index)
        }, 3000)
      },
      // 抽奖结束会触发end回调
      endCallback(prize) {
        console.log(prize)
        this.$message({
          message: '恭喜抽中'+prize.fonts[0]['text'],
          offset: 200,
          type: 'success'
        });
      },
    },
    mounted() {
      //this.$refs.myLucky.play()
    }
  }

</script>

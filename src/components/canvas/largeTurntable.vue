<template>
  <div>
    <LuckyWheel
      ref="myLucky"
      width="300px"
      height="300px"
      :prizes="prizes"
      :blocks="blocks"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
    />
  </div>
</template>

<style lang="less">

</style>

<script>
  //参考网址：https://100px.net/?from=thosefree.com
  export default {
    name: '',
    data() {
      return {
          /*currIndex: 0, // 奖品的索引
          async: true,  // 开启异步抽奖
          awards: [     // 奖品
            { name: '价值5988元华为 P30pro', color: '#f9e3bb' },
            { name: '价值398元车载空气净化器', color: '#f8d384' },
            { name: '价值25元百叶帘遮阳挡', color: '#f9e3bb' },
            { name: '16元油卡套餐红包', color: '#f8d384' },
            { name: '5元油卡直冲红包', color: '#f9e3bb' },
            { name: '3元话费直冲红包', color: '#f8d384' },
            { name: '价值32元重力感应手机支架', color: '#f9e3bb' },
            { name: '价值198元手提迷你车在保温冷藏箱', color: '#f8d384' },
          ],*/
          blocks: [
            {
              padding: '12px',
              imgs: [{
                src: require('@/assets/canvas/wheel-border-2.jpg'),
                width: '100%',
                height: '100%'
              }]
            },
            {
              padding: '10px',
              imgs: [{
                src: require('@/assets/canvas/wheel-border-1.png'),
                width: '100%',
                height: '100%'
              }]
            },
            {
              imgs: [{
                src: require('@/assets/canvas/wheel-bg.png'),
                width: '100%',
                height: '100%'
              }]
            }
          ],
          //blocks: [{ padding: '13px', background: '#617df2' }],
          prizes: [
            { fonts: [{ text: '华为 P30pro', top: '10%', fontSize: '12px' }], background: '#f9e3bb',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
            { fonts: [{ text: '车载净化器', top: '10%', fontSize: '12px' }], background: '#f8d384',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
            { fonts: [{ text: '百叶帘遮阳挡', top: '10%', fontSize: '12px' }], background: '#f9e3bb',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
            { fonts: [{ text: '16元油卡', top: '10%', fontSize: '12px' }], background: '#f8d384',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
            { fonts: [{ text: '5元油卡', top: '10%', fontSize: '12px' }], background: '#f9e3bb',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
            { fonts: [{ text: '3元话费', top: '10%', fontSize: '12px' }], background: '#f8d384',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
            { fonts: [{ text: '手机支架', top: '10%', fontSize: '12px' }], background: '#f9e3bb',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
            { fonts: [{ text: '手提迷你车', top: '10%', fontSize: '12px' }], background: '#f8d384',imgs: [{ src: require('@/assets/canvas/prize.png'), width: '40%', top: '40%' }], lineClamp: 1 },
          ],
          /* buttons: [
             { radius: '50px', background: '#617df2' },
             { radius: '45px', background: '#afc8ff' },
             {
               radius: '40px', background: '#869cfa',
               pointer: true,
               fonts: [{ text: '开始\n抽奖', top: '-20px' }]
             },
           ],*/
          //抽奖按钮
          buttons: [
            {
              radius: '30%',
              imgs: [{
                src: require("@/assets/canvas/wheel-btn.png"),
                width: '100%',
                top: '-130%'
              }]
            }
          ]
        }
    },
    methods: {
      // 点击抽奖按钮会触发star回调
      startCallback () {
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
      endCallback (prize) {
        console.log(prize)
        this.$message({
          message: '恭喜抽中'+prize.fonts[0]['text'],
          offset: 200,
          type: 'success'
        });
      },
    },
    mounted() {

    }
  }

</script>

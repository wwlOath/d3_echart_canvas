<template>
  <div class="codeContainer">
      <canvas width="100" height="43" id="canvasCode" @click="refresh" ref="codeRef"></canvas>
  </div>
</template>

<style lang="less">
  .codeContainer {
    #canvasCode {
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
    }
  }
</style>

<script>
  export default {
    name: '',
    data() {
      return {

      }
    },
    methods: {
      init() {
        let width = this.$refs.codeRef.clientWidth;
        let height = this.$refs.codeRef.clientHeight;
        let canvas = document.getElementById('canvasCode');
        let context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        let sCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
        let codeSplit = sCode.split(',');
        for(let i=0; i <= 3; i++){
          let val = Math.floor(Math.random() * codeSplit.length);
          let degree = Math.random() * 30 * Math.PI / 180;
          let text = codeSplit[val].toUpperCase();
          let x = 10 + i * 20;
          let y = 20 + Math.random() * 15;
          context.font = 'bold 23px Arial';
          context.translate(x,y);
          context.rotate(degree);
          context.fillStyle = this.randomColor();
          context.fillText(text,0,0);
          context.rotate(-degree);
          context.translate(-x,-y);
        }
        //绘制横线
        for(let i=0; i<=5; i++){
          context.strokeStyle = this.randomColor();
          context.beginPath();
          context.moveTo(Math.random() * width, Math.random() * height);
          context.lineTo(Math.random() * width, Math.random() * height);
          context.stroke();
        }

        //绘制圆点
        for(let i=0; i<=30; i++) {
          context.strokeStyle = this.randomColor();
          context.beginPath();
          let x = Math.random() * width;
          let y = Math.random() * height;
          context.moveTo(x,y);
          context.lineTo(x+1, y+1);
          context.stroke();
        }
      },
      randomColor() {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
      },
      refresh() {
        this.init();
      }
    },
    mounted() {
      this.init();
    }
  }

</script>

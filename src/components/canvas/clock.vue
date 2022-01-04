<template>
  <div>
    <canvas id="canvas" :width="widthValue" :height="heightValue" />
  </div>
</template>

<style lang="less">

</style>

<script>
  export default {
    name: '',
    data() {
      return {
        context: "",
        milliseconds: 0,
        minutes: 0,
        hour: 0,
        date: 0,
        contextBack: "",
        numBack: "",
        widthValue: 300,
        heightValue: 300
      }
    },
    methods: {
      init() {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = '#7FFFD4';
        ctx.lineWidth = 3;
        ctx.shadowBlur= 5;
        ctx.shadowColor = '#7FFFD4';
        let contextBack = canvas.getContext("2d");
        let numBack = canvas.getContext("2d");
        //Number
        contextBack.lineWidth = 1;
        contextBack.shadowBlur= 0;
        contextBack.shadowColor = '#F0F8FF';
        this.context = ctx;
        this.contextBack = contextBack;
        this.numBack = numBack;

        setInterval(this.pageInit, 50);
      },
      pageInit() {
        this.showTime();
        this.showBack();
        this.drawSecPin();
        this.drawMinPin();
        this.drawHouPin();
        this.setPoint();
        this.setNum();
      },
      setNum(){
        this.numBack.save();
        this.numBack.translate(this.widthValue/2,this.heightValue/2);
        this.numBack.beginPath();
        this.numBack.fillStyle = '#7FFFD4';
        this.numBack.font="18px Helvetica";
        for (let i = 0;i<60;i++) {
          if(i % 5 ==0){
            this.numBack.lineWidth=5;
            let xPoint = Math.sin(i*6*2*Math.PI/360)*(this.widthValue/2-55);
            let yPoint = -Math.cos(i*6*2*Math.PI/360)*(this.widthValue/2-55);
            this.numBack.fillText(i == 0 ? 12 : i/5,
                i == 0 ? -15 : xPoint-10, i == 0 ? -(this.widthValue/2-65) : i <= 30 ? yPoint+5 : yPoint+10);
          }
        }
        this.numBack.stroke();
        this.numBack.closePath();
        this.numBack.restore();
      },

      // 绘制秒针
      drawSecPin(){
        this.contextBack.save();
        this.contextBack.translate(this.widthValue/2,this.heightValue/2);
        this.contextBack.rotate(this.milliseconds/60*2*Math.PI);
        this.contextBack.beginPath();
        this.contextBack.strokeStyle = '#AFEEEE';
        this.contextBack.lineWidth = 1;
        this.contextBack.lineJoin="bevel";
        this.contextBack.miterLimit=10;
        this.contextBack.moveTo(0,30);
        this.contextBack.lineTo(3,-this.widthValue/2+75);
        this.contextBack.lineTo(13,-this.widthValue/2+85);
        this.contextBack.lineTo(0,-this.widthValue/2+40);
        this.contextBack.lineTo(-13,-this.widthValue/2+85);
        this.contextBack.lineTo(-3,-this.widthValue/2+75);
        this.contextBack.lineTo(0,30);
        this.contextBack.stroke();
        this.contextBack.closePath();
        this.contextBack.restore();
      },

      // 绘制分针
      drawMinPin(){
        this.contextBack.save();
        this.contextBack.translate(this.widthValue/2,this.heightValue/2);
        this.contextBack.rotate(this.minutes*6*Math.PI/180);
        this.contextBack.beginPath();
        this.contextBack.strokeStyle = '#20B2AA';
        this.contextBack.lineWidth = 1;
        this.contextBack.lineJoin="bevel";
        this.contextBack.miterLimit=10;

        this.contextBack.moveTo(0,20);
        this.contextBack.lineTo(3,-this.widthValue/2+105);
        this.contextBack.lineTo(10,-this.widthValue/2+115);
        this.contextBack.lineTo(0,-this.widthValue/2+70);
        this.contextBack.lineTo(-10,-this.widthValue/2+115);
        this.contextBack.lineTo(-3,-this.widthValue/2+105);
        this.contextBack.lineTo(0,20);
        this.contextBack.stroke();
        this.contextBack.closePath();
        this.contextBack.restore();

      },

      // 绘制时针
      drawHouPin(){
        this.contextBack.save();
        this.contextBack.translate(this.widthValue/2,this.heightValue/2);
        this.contextBack.rotate(this.hour*30*Math.PI/180);
        this.contextBack.beginPath();
        this.contextBack.strokeStyle = '#87CEFA';
        this.contextBack.lineWidth = 1;
        this.contextBack.lineJoin="bevel";
        this.contextBack.miterLimit=10;

        this.contextBack.moveTo(0,20);
        this.contextBack.lineTo(3,-this.widthValue/2+120);
        this.contextBack.lineTo(10,-this.widthValue/2+130);
        this.contextBack.lineTo(0,-this.widthValue/2+100);
        this.contextBack.lineTo(-10,-this.widthValue/2+130);
        this.contextBack.lineTo(-3,-this.widthValue/2+120);
        this.contextBack.lineTo(0,20);
        this.contextBack.stroke();
        this.contextBack.closePath();
        this.contextBack.restore();

      },

      setPoint(){
        this.contextBack.beginPath();
        this.contextBack.fillStyle = 'black';
        this.contextBack.arc(this.widthValue/2,this.heightValue/2,3, 0, 2*Math.PI);
        this.contextBack.stroke();
      },


      showBack(){
        for(let i = 0; i < 60; i++){
          this.contextBack.save();
          this.contextBack.translate(this.widthValue/2,this.heightValue/2);
          this.contextBack.rotate(i/60*2*Math.PI);
          this.contextBack.beginPath();
          this.contextBack.strokeStyle = '#7FFFD4';
          this.contextBack.moveTo(0,-this.widthValue/2);
          this.contextBack.lineWidth = i%5==0 ? 5 : 2;
          this.contextBack.lineTo(0,-this.widthValue/2 + 20);
          this.contextBack.stroke();
          this.contextBack.closePath();
          this.contextBack.restore();
        }
        this.contextBack.beginPath();
        this.contextBack.arc(this.widthValue/2,this.heightValue/2,this.widthValue/2-20, 0, 2*Math.PI);
        this.contextBack.stroke();
      },

      degToRad(degree){
        let result;
        let factor = Math.PI/180;
        if(degree == 0){
          result = 270*factor;
        }else{
          result = degree*factor;
        }
        return result;
      },

      showTime(){

        let now = new Date();
        let today = now.toLocaleDateString();
        let time = now.toLocaleTimeString();
        let day = now.getDay();
        let hrs = now.getHours();
        let min = now.getMinutes();
        let sec = now.getSeconds();
        let mil = now.getMilliseconds();
        let smoothsec = sec+(mil/1000);

        let smoothmin = min+(smoothsec/60);
        let hours = hrs+(smoothmin/60);

        this.milliseconds = smoothsec;
        this.minutes = smoothmin;
        this.hour = hours;

        switch (day){
          case 1 : this.date = '一'
            break;
          case 2 : this.date = '二'
            break;
          case 3 : this.date =  '三'
            break;
          case 4 : this.date =  '四'
            break;
          case 5 : this.date =  '五'
            break;
          case 6 : this.date =  '六'
            break;
          case 0 : this.date =  '日'
            break;
        }

        //Background
        let gradient = this.context.createRadialGradient(this.widthValue/2, this.heightValue/2, 5, this.widthValue/2, this.heightValue/2, 300);
        gradient.addColorStop(0, "#03303a");
        gradient.addColorStop(1, "black");
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.widthValue, this.heightValue);

        //this.hours
        this.context.beginPath();
        this.context.strokeStyle = '#87CEFA';
        this.context.arc(this.widthValue/2,this.heightValue/2,this.widthValue/2-35, this.degToRad(0), this.degToRad((this.hours*30)-90));
        this.context.stroke();
        //this.minutes
        this.context.beginPath();
        this.context.strokeStyle = '#20B2AA';
        this.context.arc(this.widthValue/2,this.heightValue/2,this.widthValue/2-30, this.degToRad(0), this.degToRad(smoothmin*6-90));
        this.context.stroke();
         //Seconds
        this.context.beginPath();
        this.context.strokeStyle = '#AFEEEE';
        this.context.arc(this.widthValue/2,this.heightValue/2,this.widthValue/2-25, this.degToRad(0), this.degToRad(smoothsec*6-90));
        this.context.stroke();
        //Date
        this.context.font = "16px Helvetica Bold";
        this.context.fillStyle = '#7FFFD4';
        this.context.fillText(today+"/星期"+this.date, this.widthValue/2 - 70, this.heightValue/2 - 10);
        //Time
        this.context.font = "14px Helvetica Bold";
        this.context.fillStyle = '#7FFFD4';
        //this.context.fillText(time+":"+mil, 160, 280);
        this.context.fillText(time, this.widthValue/2-30, this.heightValue/2 + 20);
      }
    },
    mounted() {
      this.init();
    }
  }

</script>

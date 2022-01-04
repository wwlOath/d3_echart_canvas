<template>
  <div class="canvas-container">
    <el-row :gutter="20">
      <el-col :span="8" class="item" key="1">
        <el-card class="dashboard-card setting-center">
          <!--大转盘-->
          <h3>大转盘</h3>
          <largeTurntable></largeTurntable>
        </el-card>
      </el-col>
      <el-col :span="8" class="item" key="2">
        <el-card class="dashboard-card setting-center">
          <!--九宫格-->
          <h3>九宫格</h3>
          <ninePlaceGrid></ninePlaceGrid>
        </el-card>
      </el-col>
      <el-col :span="8" class="item" key="3">
        <el-card class="dashboard-card setting-center">
          <!--老虎机-->
          <h3>老虎机</h3>
          <slotMachine></slotMachine>
        </el-card>
      </el-col>
      <el-col :span="8" class="item" key="4">
        <el-card class="dashboard-card">
          <!--粒子动画-->
          <!--
          color: String类型。默认'#dedede'。粒子颜色。
          particleOpacity: Number类型。默认0.7。粒子透明度。
          particlesNumber: Number类型。默认80。粒子数量。
          shapeType: String类型。默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
          particleSize: Number类型。默认80。单个粒子大小。
          linesColor: String类型。默认'#dedede'。线条颜色。
          linesWidth: Number类型。默认1。线条宽度。
          lineLinked: 布尔类型。默认true。连接线是否可用。
          lineOpacity: Number类型。默认0.4。线条透明度。
          linesDistance: Number类型。默认150。线条距离。
          moveSpeed: Number类型。默认3。粒子运动速度。
          hoverEffect: 布尔类型。默认true。是否有hover特效。
          hoverMode: String类型。默认true。可用的hover模式有: "grab", "repulse", "bubble"。
          clickEffect: 布尔类型。默认true。是否有click特效。
          clickMode: String类型。默认true。可用的click模式有: "push", "remove", "repulse", "bubble"
          -->
          <h3>粒子动画</h3>
          <div style="height:300px;background: #00f;width: 100%;opacity: 0.7">
            <vue-particles
              color="#fff"
              :particleOpacity="0.8"
              :particlesNumber="100"
              shapeType="circle"
              :particleSize="6"
              linesColor="#fff"
              :linesWidth="1"
              :lineLinked="true"
              :lineOpacity="0.4"
              :linesDistance="150"
              :moveSpeed="5"
              :hoverEffect="true"
              hoverMode="grab"
              :clickEffect="true"
              clickMode="push"
            >
            </vue-particles>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" class="item" key="5">
        <el-card class="dashboard-card setting-center">
          <!--右滑拼图验证-->
          <h3>右滑拼图验证</h3>
          <slideVerification></slideVerification>
          <br>
          <!--<slideVerifySingle></slideVerifySingle>-->
        </el-card>
      </el-col>
      <el-col :span="8" class="item" key="6">
        <el-card class="dashboard-card setting-center">
          <!--时钟canvas-->
          <h3>时钟clock</h3>
          <clock></clock>
          <!--<slideVerifySingle></slideVerifySingle>-->
        </el-card>
      </el-col>
      <el-col :span="8" class="item" key="7">
        <el-card class="dashboard-card setting-center">
          <!--电子签名 pc mobile-->
          <h3>手写电子签名</h3>
          <electronicSignature></electronicSignature>
        </el-card>
      </el-col>
      <el-col :span="8" class="item" key="8">
        <el-card class="dashboard-card setting-center">
          <!--电子签名 pc mobile-->
          <h3>验证码</h3>
          <verificationCode></verificationCode>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="less">
  .canvas-container {
    text-align: center;
    .setting-center {
      display: flex;
      justify-content: center;
    }
    .item {
      margin-top: 10px;
    }
  }
</style>

<script>
  import largeTurntable from "@/components/canvas/largeTurntable";
  import ninePlaceGrid from "@/components/canvas/ninePlaceGrid";
  import slotMachine from "@/components/canvas/slotMachine";
  import slideVerification from "@/components/canvas/slideVerification";
  import slideVerifySingle from "@/components/slideVerify/slider-verify-code";
  import clock from "@/components/canvas/clock";
  import electronicSignature from "@/components/canvas/electronicSignature";
  import verificationCode from "@/components/canvas/verificationCode";
  export default {
    name: '',
    data() {
      return {

      }
    },
    components: {
      largeTurntable,
      ninePlaceGrid,
      slotMachine,
      slideVerification,
      slideVerifySingle,
      clock,
      electronicSignature,
      verificationCode
    },
    methods: {

    },
    mounted() {

    }
  }

</script>

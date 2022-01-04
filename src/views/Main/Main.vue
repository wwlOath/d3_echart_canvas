<template>
  <div>
    <el-container style="height: 100vh;">
      <el-container>
        <el-header style="text-align: right; font-size: 18px;color: #606266;  cursor: pointer;position: relative;">
          <el-menu
            :default-active="$route.name"
            router
            mode="horizontal"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            @select="menuSelect">
            <el-menu-item index="home">
              <i class="el-icon-data-board"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="echarts">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                echarts图形
              </template>
              <el-menu-item index="line">折线图</el-menu-item>
              <el-menu-item index="histogram">柱状图</el-menu-item>
              <el-menu-item index="pie">饼图</el-menu-item>
              <el-menu-item index="scatter">散点图</el-menu-item>
              <el-menu-item index="map">地理坐标/地图</el-menu-item>
              <el-menu-item index="kLine">K线图</el-menu-item>
              <el-menu-item index="radar">雷达</el-menu-item>
              <el-menu-item index="box">盒图</el-menu-item>
              <el-menu-item index="heatmap">热图</el-menu-item>
              <el-menu-item index="diagram">关系图</el-menu-item>
              <el-menu-item index="mulberry">桑葚图</el-menu-item>
              <el-menu-item index="funnel">漏斗图</el-menu-item>
              <el-menu-item index="dashboard">仪表盘</el-menu-item>
              <el-menu-item index="river">河流图</el-menu-item>
            </el-submenu>
            <el-menu-item index="d3">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">d3图形</span>
            </el-menu-item>
            <el-menu-item index="canvas">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">Canvas</span>
            </el-menu-item>
            <el-menu-item index="login">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">Login</span>
            </el-menu-item>
          </el-menu>
          <div class="right-operate-btn">
            <i class="el-icon-menu wr-15"></i>
            <i class="el-icon-refresh-right" @click="reload"></i>
          </div>
        </el-header>
        <el-main style="padding:15px;">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    data() {
      return {

      }
    },
    mounted() {

    },
    methods: {
      menuSelect(a, arr) {

      },
      reload() {
        this.$router.go(this.$route.fullPath)
      }
    }
  };
</script>
<style lang="less" scoped>
  .el-header {
    background-color: #ffffff;
    line-height: 60px;
    box-shadow: 0 2px 10px #c4c4c4;
    z-index: 1;
    user-select: none;
    padding: 0;
  }

  .el-container {
    width: 100%;
  }

  .el-menu {
    border-right: none;
  }

  .wr-15 {
    margin-right: 15px;
  }

  .right-operate-btn {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 20px;
    color: #fff;
  }

</style>


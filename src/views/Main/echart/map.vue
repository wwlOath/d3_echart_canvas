<template>
  <div class="content">
    <el-row :gutter="20">
      <draggable chosenClass="chosen" forceFallback="true" group="people" animation="1000" @start="onStart" @end="onEnd">
        <transition-group>
          <el-col :span="8" class="item" key="1">
            <el-card class="box-card">
              <map_1></map_1>
            </el-card>
          </el-col>
          <el-col :span="8" class="item" key="2">
            <el-card class="box-card">
              <map_2></map_2>
            </el-card>
          </el-col>
        </transition-group>
      </draggable>
    </el-row>
  </div>
</template>

<style lang="less">
  .content {
    .item {
      margin-bottom: 20px;
    }
  }
</style>

<script>
  import map_1 from "@/components/echartPlot/map/map_1";
  import map_2 from "@/components/echartPlot/map/map_2";
  import draggable from 'vuedraggable'

  export default {
    name: '',
    data() {
      return {
        drag: false,
      }
    },
    components: {
      map_1,
      map_2,
      draggable
    },
    methods: {
      onStart(){
        this.drag = true;
      },
      onEnd() {
        this.drag = false;
      }
    },
    mounted() {

    }
  }

</script>

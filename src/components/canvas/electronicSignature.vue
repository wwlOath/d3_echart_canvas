<template>
  <div>
    <vue-esign
      ref="esign"
     :width="800"
     :height="300"
     :isCrop="isCrop"
      :lineWidth="lineWidth"
      :lineColor="lineColor"
      :bgColor.sync="bgColor"
    />
    <br>
    <el-row>
    <el-button @click="handleReset">清空画板</el-button>
    <el-button @click="handleGenerate" type="primary">生成图片</el-button>
    </el-row>
    <br>
    <el-row>
      <img :src="resultImg" alt="" style="width: 100%">
    </el-row>
  </div>
</template>

<style lang="less">

</style>

<script>
  export default {
    name: '',
    data() {
      return {
        lineWidth: 6,
        lineColor: '#409eff',
        bgColor: '#ecf5ff',
        resultImg: '',
        isCrop: false
      }
    },
    methods: {
      handleReset () {
        this.$refs.esign.reset();
        this.resultImg = '';
      },
      handleGenerate () {
        this.$refs.esign.generate().then(res => {
          this.resultImg = res
        }).catch(err => {
          //alert(err) // 画布没有签字时会执行这里 'Not Signned'
          this.$message({
            message: err,
            type: 'warning'
          });
        })
      }
    },
    mounted() {

    }
  }

</script>

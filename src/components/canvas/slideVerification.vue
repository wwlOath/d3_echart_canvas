<template>
  <div>
    <div v-show="flag" class="testCode">
      <!--<p class="closeBtn"><i class="el-icon-close" @click="flag=!flag"></i></p>-->
      <slide-verify
        :l="42"
        :r="20"
        :w="362"
        :h="180"
        slider-text="向右滑动完成拼图"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
        :style="{width:'362px'}"
        class="slide-box"
        ref="slideBlock"
        v-show="flag"
      ></slide-verify>
    </div>
  </div>
</template>

<style lang="less">

</style>

<script>
  /*
  * 参数    类型    默认值    描述    版本
    l    Number    42    滑块的边长
    r    Number    10    滑块突出圆的半径
    w    Number    310    canvas画布的宽
    h    Number    155    canvas画布的高
    sliderText    String    Slide filled right    滑块底纹文字    1.0.5
    imgs    Array    []    背景图数组。可不传    1.1.0
    accuracy    Number    5    滑动验证的误差范围    1.1.2
    show    Boolean    true    是否显示刷新按钮    1.1.2
    *
    事件名 类型  描述  版本
    success Function    验证码匹配成功的回调
    fail    Function    验证码未匹配的回调
    refresh Function    点击刷新按钮后的回调函数
    again   Function    检测到非人为操作滑动时触发的回调函数  1.1.2
    fulfilled   Function    刷新成功之后的回调函数 1.1.2

  * */
  export default {
    name: '',
    data() {
      return {
        flag: true,
        // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
        accuracy: 3,
      }
    },
    methods: {
      // 拼图成功
      onSuccess (){
        //this.getLogin();//登录
        alert("拼图成功");
      },
      // 拼图失败
      onFail (){
        alert("拼图失败");
      },
      // 拼图刷新
      onRefresh (){
        alert("拼图刷新");
      },
      /*// 登录请求接口
      getLogin () {
        const loginData = {
          account: '',
          phone: this.ruleForm.userName,
          // Password: sha3.sha3_256(md5(this.ruleForm.password)), // 加密
          password: this.ruleForm.password,
          email: '',
          accountType: 2, // 登录类型手机号
          checkCode: ''
        }
        // 接口
        userLogin(loginData)
            .then(res => {
              console.log(res)
            })
            .catch(res => {
              console.log(res)
            })
      },
      // 点击登录校验-拼图出现
      submitForm (formName) {
        // 表单校验
        this.$refs[formName].validate((valid) => {
          // 验证通过
          if (valid) {
            // 拼图出现
            this.flag = true
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }*/
    },
    mounted() {

    }
  }

</script>

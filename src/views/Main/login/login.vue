
<template>
  <div class="container">
    <el-form ref="form" :model="form" :rules="rules" label-width="70px" class="login">
      <h3>ATP应用测试平台</h3>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="form.pass" type="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证" prop="isLock">
        <slider-verify-code v-model="form.isLock" @change="handlerLock"></slider-verify-code>
      </el-form-item>
      <el-button type="primary" @click="login" style="width: 100%;margin: 0;">立即登录</el-button>
    </el-form>
  </div>
</template>

<script>
  import sliderVerifyCode from '@/components/slideVerify/slider-verify-code.vue';

  export default {
    name: "Login",
    data() {
      const checkStatus = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("请拖动滑块完成验证"));
        } else {
          if (this.form.name == '' || this.form.pass == ''
              || !this.form.name || !this.form.pass) {
            setTimeout(() => {
              this.form.isLock = false;
              this.$refs.form.validateField('name');
              this.$refs.form.validateField('pass');
              return callback(new Error("验证未通过"));
            }, 1);
          }
          callback();
        }
      };
      return {
        form: {},
        rules: {
          name: [
            {required: true, message: '用户名称不得为空！', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
          ],
          pass: [
            {required: true, message: '密码不得为空！', trigger: 'blur'},
            {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
          ],
          isLock: [
            {validator: checkStatus, trigger: 'blur'},
          ],
        },
      }
    },
    components: {
      'slider-verify-code': sliderVerifyCode
    },
    methods: {
      //登录
      login() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$http.post('/sys/user/login', this.$qs.stringify(this.form)).then(res => {
              if (res.data.code === 1) {
                this.$router.push('/home')
              } else {
                this.$refs.form.resetFields();
                this.$message.warning(res.data.msg);
              }
            }).catch(error => {
              this.$message.error(error);
            });
          } else {
            return false;
          }
        });
      },

      handlerLock(data) {
        if (data) {
          this.$refs.form.validateField('isLock');
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgb(84, 92, 100);

    .login {
      text-align: center;
      padding: 20px 30px 30px 30px;
      margin: 10% auto;
      width: 320px;
      background: white;
      border-radius: 10px;

      h3 {
        margin: 30px 0px;
      }

      .el-form-item {
        margin-bottom: 35px;
      }
    }
  }
</style>

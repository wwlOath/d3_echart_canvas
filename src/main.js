// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router/index'
import '@/libs/element.all'
import store from './store';
import {setStore, getStore, removeStore} from '@/libs/storage';
import * as echarts from "echarts";

import VueLuckyCanvas from '@lucky-canvas/vue';
import VueParticles from 'vue-particles';
import SlideVerify from 'vue-monoplasty-slide-verify';
import vueEsign from 'vue-esign'

Vue.use(VueLuckyCanvas);//大转盘 九宫格 老虎机
Vue.use(VueParticles);//粒子动画
Vue.use(SlideVerify);//拼图验证
Vue.use(vueEsign);//电子签名

Vue.config.productionTip = false;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;
Vue.prototype.$echarts = echarts;

String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
  function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
      var t = typeof arguments[0];
      var key;
      var args = ("string" === t || "number" === t) ?
        Array.prototype.slice.call(arguments)
        : arguments[0];

      for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
      }
    }
    return str;
  };

String.prototype.ellipsis = String.prototype.ellipsis ||
  function () {
    "use strict";
    let str = this.toString();
    if (arguments.length) {
      let t = typeof arguments[0];
      if("number" == t){
        if(str.length > arguments[0]){
          return str.substr(0,arguments[0]) + "..."
        }
      }
    }
    return str;
  };


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

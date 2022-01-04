import Vue from 'vue'
import VueRouter from 'vue-router';
import {routers} from './router';
import NProgress from "nprogress";
import 'nprogress/nprogress.css';

Vue.use(VueRouter);
NProgress.configure({
  easing: 'ease',  // 动画方式
  speed: 500,  // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

export const router = new VueRouter({
  mode: 'history',
  routes: routers
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach((to) => {
  NProgress.done();
  window.scrollTo(0, 0);
});

Vue.prototype.$NProgress = NProgress;

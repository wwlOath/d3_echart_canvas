export const routers = [
  {
    path:"/",
    redirect: '/line',
  },
  {
    path: '/',
    name: 'Main',
    component:() => import('@/views/Main/Main.vue'),
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/Main/home/home.vue')
      },
      {
        path: '/line',
        name: 'line',
        component: () => import('@/views/Main/echart/line.vue')
      },
      {
        path: '/histogram',
        name: 'histogram',
        component: () => import('@/views/Main/echart/histogram.vue')
      },
      {
        path: '/pie',
        name: 'pie',
        component: () => import('@/views/Main/echart/pie.vue')
      },
      {
        path: '/scatter',
        name: 'scatter',
        component: () => import('@/views/Main/echart/scatter.vue')
      },
      {
        path: '/map',
        name: 'map',
        component: () => import('@/views/Main/echart/map.vue')
      },
      {
        path: '/kLine',
        name: 'kLine',
        component: () => import('@/views/Main/echart/kLine.vue')
      },
      {
        path: '/radar',
        name: 'radar',
        component: () => import('@/views/Main/echart/radar.vue')
      },
      {
        path: '/box',
        name: 'box',
        component: () => import('@/views/Main/echart/box.vue')
      },
      {
        path: '/heatmap',
        name: 'heatmap',
        component: () => import('@/views/Main/echart/heatmap.vue')
      },
      {
        path: '/diagram',
        name: 'diagram',
        component: () => import('@/views/Main/echart/diagram.vue')
      },
      {
        path: '/mulberry',
        name: 'mulberry',
        component: () => import('@/views/Main/echart/mulberry.vue')
      },
      {
        path: '/funnel',
        name: 'funnel',
        component: () => import('@/views/Main/echart/funnel.vue')
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/Main/echart/dashboard.vue')
      },
      {
        path: '/river',
        name: 'river',
        component: () => import('@/views/Main/echart/river.vue')
      },
      {
        path: '/d3',
        name: 'd3',
        component: () => import('@/views/Main/d3/d3.vue')
      },
      {
        path: '/canvas',
        name: 'canvas',
        component: () => import('@/views/Main/canvas/canvas.vue')
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Main/login/login.vue')
      }
    ]
  },
];

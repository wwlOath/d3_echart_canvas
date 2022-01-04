import axios from 'axios';
import qs from 'qs';
import { getStore, setStore } from './storage';
import { router } from '../router/index';

axios.defaults.withCredentials = true;// 允许跨域携带cookie
axios.defaults.timeout = 300000;

let baseUrl =  '/';

axios.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.resolve(error);
});

//拦截器响应
axios.interceptors.response.use(response => {
  const data = response.data;
  switch(data.status) {
    case '500':
      setStore('userInfo','');
      router.push({
        name: 'home',
        query: {
          redirect: 'lose'
        }
      });
      break;
    case '6000':
      break;
    default:
      return data;
  }
})

export const getResponse = (url, params) => {
  return axios({
    method: 'GET',
    url: `${baseUrl}${url}`,
    params: params
  })
}

export const postRequest = async (url, params) => {
  return axios({
    method: 'POST',
    url: `${baseUrl}${url}`,
    data: params,

  });
};

export const postRequestPort = async (url, params) => {
  return axios.post(`${baseUrl}${url}`, qs.stringify(params, { indices: false }));
};

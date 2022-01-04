// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postRequest, postRequestX} from '@/libs/axios';

export const login = (params) => {
  return postRequest('/login', params);
}

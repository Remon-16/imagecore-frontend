import axios from "axios";
import {message} from "ant-design-vue";

// 区分开发和生产环境
// const DEV_BASE_URL = "";
const PROD_BASE_URL = import.meta.env.VITE_BASE_HTTPS_URL;
// 创建 Axios 实例
const myAxios = axios.create({
    baseURL: PROD_BASE_URL,
    timeout: 10000,
    withCredentials: true,
});

myAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken')
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config
  });

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !window.location.pathname.includes('/user/login')
      ) {
        message.warning('请先登录')
        const token = localStorage.getItem('authToken')
        if(token){
          // 说明 token 过期了，清除掉
          localStorage.removeItem('authToken')
        }
        window.location.href = `/user/login?redirect=${window.location.href}`
      }
    }
    // console.log('后端接收到的头:', response.config.headers);
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response) {
      console.error('后端返回的错误头:', error.response.headers);
    }
    return Promise.reject(error)
  },
)

export default myAxios;

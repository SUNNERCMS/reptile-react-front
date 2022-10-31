// 自定义axios实例，并添加拦截器，在响应被 then 或 catch 处理前拦截处理返回的数据结构。
// https://www.axios-http.cn/docs/instance
// https://www.axios-http.cn/docs/interceptors

import axios from "axios";

// 自定义配置新建一个实例。
const instance = axios.create({
    baseURL: '/',
    timeout: 1000,
});

// 响应拦截器-中间件进行拦截逻辑处理: 减少相应数据的data层级
instance.interceptors.response.use(response => {
    return response.data
});

// 将封装的axios实例导出，作为request封装提供给外部使用。
export default instance;


import axios from "axios";
import { toast } from '~/composables/util'
import { getToken,removeToken } from '~/composables/auth'
import { router } from '~/router'

axios.defaults.timeout = 10000;
const service = axios.create({
    baseURL: "/api"
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {

    const token = getToken("access-token")
    if (token) {

        config.headers["access-token"] = 'Bearer ' + token;
        config.headers.Authorization = 'Bearer ' + token;
    }
    const refresh = getToken("refresh-token")
    if (refresh) {

        config.headers["refresh-token"] = 'Bearer ' + refresh;
    }
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        console.log("添加响应拦截器")
        console.log(response.data)
        if(response.data.code == 40010){
            
            removeToken("access-token")
            removeToken("refresh-token")
            router.push("/login")
            return Promise.reject(response.data.msg || "授权超时");
        }
        if (response.data.code != 200){
            toast(response.data.msg || "请求失败", "error")
            return Promise.reject(response.data.msg || "请求失败");
        }
        // 对响应数据做点什么
        return response.data.data;
    }, 
    function (err) {
    // 对响应错误做点什么
        toast(err.response.data.msg || "请求失败", "error")
        return Promise.reject(error);
    }
);

export default service
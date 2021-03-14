/*
 * @Descripttion: request_method
 * @version: 1.0
 * @Author: xiaohu
 * @Date: 2020-11-25 11:55:12
 * @LastEditors: xiaohu
 * @LastEditTime: 2020-11-25 13:06:50
 */
import axios from 'axios';
const { Toast } = 'vant';
// 创建axios实例
const service = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://www.cjssy.cn:20013' : '/', // api 的 base_url
    timeout: 10000, // 请求超时时间
    headers: {
        post: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8;multipart/form-data',
        },
    },
});
// 请求拦截器
service.interceptors.request.use(
    config => {
        // const token = store.state.token
        // token && (config.headers.Authorization = token)
        return config;
    },
    error => {
        return Promise.error(error);
    }
);
// 响应拦截器
service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.Successed) {
                return Promise.resolve(response);
            } else {
                Toast.fail({ 
                    message: response.data.Errors,
                    duration: 2000,
                });
                return Promise.reject(response);
            }
        } else {
            return Promise.reject(response);
        }
    },
    // 服务器状态码不是200的情况
    error => {
        let code = 0;
        try {
            code = error.response.data.status;
        } catch (e) {
            if (error.toString().indexOf('Error: timeout') !== -1) {
                Toast.fail({
                    message: '网络请求超时',
                    duration: 2000,
                });
                return Promise.reject(error);
            }
        }
        if (code) {
            if (code === 401) {
            } else if (code === 403) {
                router.push({ path: '/401' });
            } else {
                const errorMsg = error.response.data.message;
                if (errorMsg !== undefined) {
                    Toast.fail({
                        message: errorMsg,
                        duration: 2000,
                    });
                }
            }
        } else {
            Toast.fail({
                message: '接口请求失败',
                duration: 2000,
            });
        }
        return Promise.reject(error.response);
    }
);
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} data [请求时携带的参数]
 */
function post(url, data) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
/**
 * requset方法，对应所有请求
 * @param {Object} config [请求时携带的参数]
 */
function request(config) {
    return new Promise((resolve, reject) => {
        axios
            .request(config)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
const baseUrl = axios.defaults.baseURL;
export default { get, post, request, baseUrl };
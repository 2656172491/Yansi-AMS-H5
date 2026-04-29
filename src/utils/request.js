import axios from 'axios'
import { showToast } from 'vant'
import router from '@/router/index.js'

const service = axios.create({
    baseURL: import.meta.env.DEV ? '/api' : 'http://localhost:10010/wsq_zcgl/api',
    timeout: 10000
})

service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    (error) => {
        showToast('请求异常：' + error.message)
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response) => {
        const res = response.data
        if (res.code === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
            showToast(res.message || '登录已过期')
            return Promise.reject(new Error(res.message))
        }
        return res
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            router.push('/login')
        }
        showToast('网络异常')
        return Promise.reject(error)
    }
)

export default service

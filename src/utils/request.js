// import axios from 'axios'
// import { useUserStore } from '@/stores'
// import { ElMessage } from 'element-plus'
// import router from '@/router'
// // const baseURL = 'http://big-event-vue-api-t.itheima.net'
// const baseURL = '/api'

// const instance = axios.create({
//   // TODO 1. 基础地址，超时时间
//   baseURL,
//   timeout: 10000
// })

// // 请求拦截器
// instance.interceptors.request.use(
//   (config) => {
//     // TODO 2. 携带token
//     const useStore = useUserStore()
//     if (useStore.token) {
//       config.headers.Authorization = useStore.token
//     }
//     return config
//   },
//   (err) => Promise.reject(err)
// )

// // 响应拦截器
// instance.interceptors.response.use(
//   (res) => {
//     // TODO 4. 摘取核心响应数据
//     if (res.data.code === 0) {
//       return res
//     }
//     // TODO 3. 处理业务失败
//     // 处理业务失败, 给错误提示，抛出错误
//     ElMessage.error(res.data.message || '服务异常')
//     return Promise.reject(res.data)
//   },
//   (err) => {
//     // TODO 5. 处理401错误
//     // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
//     if (err.response?.status === 401) {
//       router.push('/login')
//     }

//     // 错误的默认情况 => 只要给提示
//     ElMessage.error(err.response.data.message || '服务异常')
//     return Promise.reject(err)
//   }
// )

// export default instance
// export { baseURL }
import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = '/api'

const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    const { data } = res

    // 统一处理数据提取
    if (data && typeof data === 'object') {
      // 成功状态码处理，这里以code为0为例，您可以根据实际情况调整
      if (data.code === 0) {
        return data.data // 直接返回data给业务层处理
      } else {
        // 处理非0的业务失败状态码
        ElMessage.error(data.message || '服务异常')
        return Promise.reject(data) // 返回错误信息给业务层进一步处理
      }
    } else {
      // 如果响应数据不符合预期格式，给出错误提示并拒绝 promise
      ElMessage.error('无效的响应格式')
      return Promise.reject(new Error('Invalid response format'))
    }
  },
  (err) => {
    // 处理网络错误
    if (err.response) {
      // 401 错误处理
      if (err.response.status === 401) {
        router.push('/login')
      } else {
        ElMessage.error(err.response.data.message || '服务异常')
      }
    } else {
      // 无响应错误
      ElMessage.error('网络连接错误')
    }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }

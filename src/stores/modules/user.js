// import { defineStore } from 'pinia'
// import { ref } from 'vue'
// import { getUserInfoService } from '@/api/user.js'
// // 用户模块 token setToken removeToken
// export const useUserStore = defineStore(
//   'big-user',
//   () => {
//     const token = ref('')
//     const setToken = (newToken) => {
//       token.value = newToken
//     }
//     const removeToken = () => {
//       token.value = ''
//     }
//     const user = ref({})
//     const getUser = async () => {
//       const res = await getUserInfoService()
//       user.value = res.data.data
//     }
//     return {
//       token,
//       setToken,
//       removeToken,
//       user,
//       getUser
//     }
//   },
//   {
//     persist: true
//   }
//   //获取用户信息
// )
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfoService } from '@/api/user.js' // 假设此服务已根据request.js调整

export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const user = ref({})

    // 设置和移除token的方法保持不变
    const setToken = (newToken) => {
      token.value = newToken
    }

    const removeToken = () => {
      token.value = ''
    }

    // 获取用户信息的方法，考虑了响应处理逻辑
    // const getUser = async () => {
    //   try {
    //     const res = await getUserInfoService() // 假设此函数已处理异常并在失败时抛出错误

    //     // 根据您的API实际返回结构，这里可能需要调整
    //     if (res && res.data) {
    //       user.value = res.data.user || res.data // 假设数据结构是 { user: {...} } 或直接 {...}
    //     } else {
    //       throw new Error('Invalid response data format') // 如果响应格式不正确，主动抛出错误
    //     }
    //   } catch (error) {
    //     console.error('获取用户信息时发生错误:', error)
    //     ElMessage.error(error.message || '获取用户信息失败，请重试！')
    //   }
    // }
    const getUser = async () => {
      try {
        const res = await getUserInfoService() // 假设此函数已处理异常并在失败时抛出错误

        // 根据实际调试的API响应结构，直接访问所需字段
        if (res && Object.keys(res).length > 0) {
          // 确保res不是空对象
          user.value = res // 直接将整个用户信息对象赋值给user
        } else {
          throw new Error('Invalid response data format') // 如果响应为空或格式不正确，主动抛出错误
        }
      } catch (error) {
        console.error('获取用户信息时发生错误:', error)
        ElMessage.error(error.message || '获取用户信息失败，请重试！')
      }
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUser
    }
  },
  { persist: true }
)

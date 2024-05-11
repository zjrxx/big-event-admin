import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getArticleCategoryListService } from '@/api/articleCategory.js' // 假设此函数用于获取文章分类列表

export const useCategoryStore = defineStore(
  'category',
  () => {
    const categories = ref([]) // 用于存储分类列表

    // 异步获取分类列表的方法
    // const fetchCategories = async () => {
    //   try {
    //     const response = await getArticleCategoryListService()
    //     console.log('API响应详情:', response);
    //     // 假设API返回的数据结构是{data: [{id, categoryName, categoryAlias}, ...]}
    //     categories.value = response
    //     // console.log('Categories fetched successfully:', categories.value);
    //   } catch (error) {
    //     console.error('获取分类列表时发生错误:', error)
    //     // 这里可以根据项目需求使用ElMessage等进行错误提示
    //     ElMessage.error('获取分类列表时发生错误')
    //   }
    // }
    const fetchCategories = async () => {
      try {
        const response = await getArticleCategoryListService()

        // await nextTick();
        console.log('API响应详情:', response)
        // 确保从response.data中取值，假设API返回的是{data: [...]}
        if (response && Array.isArray(response)) {
          categories.value = response // 如果API直接返回数组，则保留此行
        } else if (response && response.data && Array.isArray(response.data)) {
          categories.value = response.data // 如果API返回的是{data: [...]}
        } else {
          console.error('Unexpected API response structure')
        }
      } catch (error) {
        console.error('获取分类列表时发生错误:', error)
        ElMessage.error('获取分类列表时发生错误')
      }
    }
    return {
      categories,
      fetchCategories
    }
  },
  { persist: true } // 如果需要持久化存储，确保已安装并配置了相应的Pinia plugin
)

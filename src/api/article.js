import request from '@/utils/request'
/**
 * 新增文章
 * @param {*} params
 */
// export const addArticleService = (
//   articleTitle,
//   articleContent,
//   cateId,
//   coverImg,
//   articleStatus
// ) =>
//   request.post('api/article/add', {
//     articleTitle,
//     articleContent,
//     cateId,
//     coverImg,
//     articleStatus
//   })
export const addArticleService = (formData) => {
  return request.post('/api/article/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // 设置正确的Content-Type以适应文件上传
    }
  })
}
/**
 * 获取文章列表
 * @param {*} params
 */
export const getArticleListService = (
  pageNum,
  pageSize,
  cateId,
  articleStatus
) =>
  request.get('api/article/list', {
    params: { pageNum, pageSize, cateId, articleStatus }
  })

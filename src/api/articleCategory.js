import request from '@/utils/request'
/* 添加文章分类 */
export const addArticleCategoryService = ({ categoryName, categoryAlias }) =>
  request.post('api/category/add', { categoryName, categoryAlias })
/* 删除文章分类 */
export const deleteArticleCategoryService = (categoryId) =>
  request.delete(`api/category/delete/${categoryId}`)
/* 修改文章分类 */
export const updateArticleCategoryService = ({
  categoryId,
  categoryName,
  categoryAlias
}) =>
  request.post('api/category/updateCategory', {
    categoryId,
    categoryName,
    categoryAlias
  })
/* 获取文章分类列表 */
export const getArticleCategoryListService = () =>
  request.get('api/category/getCategoryList')

/* 获取文章分类 */
// export const getArticleCategoryService = () => request.get('api/category/get')
export const getArticleCategoryService = (categoryId) =>
  request.get('api/category/getCategoryInfo', { params: { categoryId } })

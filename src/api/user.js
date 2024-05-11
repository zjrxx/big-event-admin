import request from '@/utils/request'

export const userRegisterService = ({
  userAccount,
  userPassword,
  checkPassword
}) =>
  request.post('/api/user/register', {
    userAccount,
    userPassword,
    checkPassword
  })
export const userLoginService = ({ userAccount, userPassword }) =>
  request.post('api/user/login', { userAccount, userPassword })
/** 获取用户信息 */
export const getUserInfoService = () => request.get('api/user/get/login')
/**修改用户信息 */
export const updateUserInfoService = ({ userName, email }) =>
  request.post('api/user/update/my', { userName, email })
/**修改密码 */
export const updateUserPasswordService = ({
  userPassword,
  newPassword,
  checkPassword
}) =>
  request.post('api/user/update/my/password', {
    userPassword,
    newPassword,
    checkPassword
  })
// 图片上传接口
export const uploadImageService = (formData) => {
  /**
   * formData 应该包含文件和其他可能需要的字段，例如：
   * {
   *   file: 文件对象, // 从<input type="file">获取的文件
   *   bizType: 'imageTypeExample', // 示例业务类型参数，根据实际情况调整
   *   otherParam: 'otherValue' // 其他可能需要的参数
   * }
   */
  return request.post('/api/file/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data' // 设置正确的Content-Type以适应文件上传
    }
  })
}

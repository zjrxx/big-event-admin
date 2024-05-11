<!-- <template>
  <el-card class="avatar-change-card">
    <template v-slot:header>
      <div class="card-header">
        更换头像（建议上传300*300像素的图片以获得最佳预览效果）
      </div>
    </template>
    <div class="avatar-upload-container">
      <div
        class="avatar-preview"
        :style="{ backgroundImage: `url(${previewImage})` }"
      >
        <div v-if="!previewImage" class="upload-text" @click="selectImage">
          请选择头像
        </div>
      </div>
      <div>
        <el-button type="primary" class="upload-btn" @click="selectImage"
          >选择图片</el-button
        >

        <el-button
          type="success"
          class="upload-btn"
          @click="uploadAvatar"
          :disabled="!selectedFile"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template> -->

<template>
  <el-card class="avatar-change-card">
    <template v-slot:header>
      <div class="card-header">
        更换头像（建议上传300*300像素的图片以获得最佳预览效果）
      </div>
    </template>
    <div class="avatar-upload-container">
      <div
        class="avatar-preview"
        :style="{ backgroundImage: `url(${previewImage})` }"
      >
        <div v-if="!previewImage" class="upload-overlay" @click="selectImage">
          请选择头像
        </div>
      </div>
      <div class="upload-buttons">
        <el-button type="primary" class="upload-btn" @click="selectImage"
          >选择图片</el-button
        >
        <el-button
          type="success"
          class="upload-btn"
          @click="uploadAvatar"
          :disabled="!selectedFile"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
//导入uploadImageService
import { uploadImageService } from '@/api/user'
const previewImage = ref('')
const selectedFile = ref(null)

const selectImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*' // 限制只能选择图片文件
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      selectedFile.value = file
      const reader = new FileReader()
      reader.onload = (event) => {
        previewImage.value = event.target.result // 显示预览图
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

const uploadAvatar = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先选择图片！')
    return
  }

  try {
    // 准备formData
    const formData = new FormData()
    formData.append('file', selectedFile.value) // 假设后端接口期望的字段名为'file'
    // 如果您的后端接口需要额外的参数，比如业务类型，可以这样添加：
    //formData.append('bizType', 'avatar')
    formData.append('biz', 'avatar')
    // 调用uploadImageService并传入formData

    // 直接等待响应，由于拦截器中已经处理了成功和错误逻辑，这里不需要手动检查code
    const response = await uploadImageService(formData)

    // 假设拦截器在成功时直接返回了data，这里就可以直接使用response了
    // 如果拦截器在失败时抛出错误，则应该在下方的catch中处理
    console.log('上传成功，响应数据:', response)

    ElMessage.success('头像上传成功！')
    selectedFile.value = null // 上传成功后清空文件选择
    previewImage.value = '' // 清空预览图
  } catch (error) {
    // 这里捕捉到的是axios请求失败的情况，或者是拦截器中reject的错误
    console.error('上传头像时发生错误:', error)
    ElMessage.error(error.message || '头像上传失败，请重试！')
  }
}
</script>

<!-- <style scoped>
.avatar-change-card {
  width: 100%;
  max-width: 700px;
  margin: 100px auto;
}

.card-header {
  color: #333;
  font-weight: bold;
  text-align: center;
  padding: 32px 0;
  border-bottom: 1px solid #ddd;
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px 0;
}

.avatar-preview {
  width: 300px;
  height: 300px;
  background-color: #f5f5f5;
  border: 2px dashed #ccc;
  border-radius: 15px;
  overflow: hidden;
  position: relative; /* 新增 */
  /* display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer; */
}
.avatar-preview img {
  /* 新增 */
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持宽高比并填充容器 */
  position: absolute;
  top: 0;
  left: 0;
}
.upload-text {
  color: #999;
  font-size: 18px;
}

.upload-btns {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  /* 添加这一行来直接增加按钮之间的间距 */
  gap: 20px; /* 您可以根据需要调整这个值 */
}

.upload-btn {
  /* 确保按钮尺寸适应并排显示 */
  width: calc(50% - 10px); /* 减少两边的间隙以适应 */
  max-width: 120px;
  height: 36px;
  border-radius: 5px;

  cursor: pointer;
  /* 可选：如果需要去除按钮之间的微量间隙 */
  margin-left: 5px;
  margin-right: 5px;
}
</style> -->
<style scoped>
.avatar-change-card {
  width: 100%;
  max-width: 700px;
  margin: 100px auto;
}

.card-header {
  color: #333;
  font-weight: bold;
  text-align: center;
  padding: 32px 0;
  border-bottom: 1px solid #ddd;
}

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 40px 0;
}

.avatar-preview {
  width: 300px;
  height: 300px;
  background-color: #f5f5f5;
  border: 2px dashed #ccc;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}
.avatar-preview::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.avatar-preview:hover::before {
  opacity: 1;
}
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.4);
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.avatar-preview:hover .upload-overlay {
  opacity: 1;
}

/* .upload-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  gap: 20px;
}

.upload-btn {
  width: calc(50% - 10px);
  max-width: 120px;
  height: 36px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
} */
.upload-btns {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  /* 添加这一行来直接增加按钮之间的间距 */
  gap: 20px; /* 您可以根据需要调整这个值 */
}

.upload-btn {
  /* 确保按钮尺寸适应并排显示 */
  width: calc(50% - 10px); /* 减少两边的间隙以适应 */
  max-width: 120px;
  height: 36px;
  border-radius: 5px;

  cursor: pointer;
  /* 可选：如果需要去除按钮之间的微量间隙 */
  margin-left: 5px;
  margin-right: 5px;
}
</style>

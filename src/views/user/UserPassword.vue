<template>
  <el-card>
    <template v-slot:header>
      <div>重置密码</div>
    </template>
    <el-form
      ref="passwordFormRef"
      :model="passwordForm"
      :rules="passwordRules"
      label-width="80px"
    >
      <el-form-item prop="userPassword">
        <el-input
          v-model="passwordForm.userPassword"
          placeholder="原密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input
          v-model="passwordForm.newPassword"
          placeholder="新密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input
          v-model="passwordForm.checkPassword"
          placeholder="确认新密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passwordForm')"
          >修改密码</el-button
        >
        <el-button @click="resetForm('passwordForm')">重置密码</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { updateUserPasswordService } from '@/api/user'

const passwordForm = reactive({
  userPassword: '',
  newPassword: '',
  checkPassword: ''
})

const passwordRules = {
  userPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      min: 6,
      max: 15,
      message: '原密码长度必须在6到15个字符之间',
      trigger: 'blur'
    }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      min: 6,
      max: 15,
      message: '新密码长度必须在6到15个字符之间',
      trigger: 'blur'
    }
  ],
  checkPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validatePasswordConfirmation, trigger: 'blur' }
  ]
}

function validatePasswordConfirmation(rule, value, callback) {
  if (value === passwordForm.newPassword) {
    callback()
  } else {
    callback(new Error('两次输入的新密码不一致'))
  }
}

// const submitForm = () => {
//   // 提交表单逻辑，这里假设存在一个validate方法用于触发表单验证
//   passwordFormRef.value.validate((valid) => {
//     if (valid) {
//       console.log('表单提交')
//       // 实际提交逻辑
//       updateUserPasswordService({
//         userPassword: passwordForm.userPassword,
//         newPassword: passwordForm.newPassword,
//         checkPassword: passwordForm.checkPassword
//       }).then((res) => {
//         if (res.code === 200) {
//           ElMessage({
//             type: 'success',
//             message: '修改成功'
//           })
//           passwordForm.userPassword = ''
//           passwordForm.newPassword = ''
//         } else {
//           console.log(res.message)
//         }
//       })
//     }
//   })
// }
const submitForm = async () => {
  // 提交表单逻辑，假设validate方法用于触发表单验证
  await new Promise((resolve) => {
    passwordFormRef.value.validate((valid) => {
      resolve(valid)
    })
  }).then(async (valid) => {
    if (valid) {
      console.log('表单提交')
      // 实际提交逻辑
      try {
        const response = await updateUserPasswordService({
          userPassword: passwordForm.userPassword,
          newPassword: passwordForm.newPassword,
          checkPassword: passwordForm.checkPassword
        })

        // 假设拦截器在成功时直接返回了data，这里直接处理数据
        console.log('密码修改成功，响应数据:', response)

        ElMessage({
          type: 'success',
          message: '修改成功'
        })

        // 清空表单
        passwordForm.userPassword = ''
        passwordForm.newPassword = ''
        passwordForm.checkPassword = ''
      } catch (error) {
        // 这里捕捉到的是axios请求失败的情况，或者是拦截器中reject的错误
        console.error('修改密码时发生错误:', error)
        ElMessage.error(error.message || '密码修改失败，请重试！')
      }
    }
  })
}

const passwordFormRef = ref(null)

const resetForm = () => {
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields()
  }
}
</script>
<style scoped>
.reset-password-card {
  width: 100%; /* 让卡片宽度适应容器 */
  max-width: 700px; /* 设置最大宽度以适配不同屏幕 */
  margin: 50px auto; /* 居中显示，上下外边距设置 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 10px; /* 圆角效果 */
}

.card-header {
  color: #333;
  font-weight: bold;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid #ddd; /* 添加分割线 */
}

/* 自定义输入框样式 */
.el-form-item__label {
  color: #555;
}

.el-input__inner {
  border-color: #ddd;
  border-radius: 4px;
}

.el-input__inner:focus {
  border-color: #409eff;
}

/* 自定义按钮样式 */
.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
  border-radius: 20px;
  color: #fff;
}

.el-button--primary:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button {
  margin-left: 10px; /* 按钮间距离 */
}
</style>

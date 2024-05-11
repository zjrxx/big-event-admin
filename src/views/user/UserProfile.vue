<template>
  <el-card shadow="never" class="box-card">
    <template v-slot:header>
      <div>
        <span>个人详情</span>
      </div>
    </template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <!-- 登录名称，虽然禁用不需校验，但展示如何添加校验规则注释 -->
      <el-form-item label="登录名称" prop="userAccount">
        <el-input v-model="form.userAccount" disabled></el-input>
        <!-- 禁用时无需显示校验错误信息，这里仅作演示 -->
        <!-- <template #error> </template> -->
      </el-form-item>

      <!-- 用户昵称 -->
      <el-form-item label="用户昵称" prop="userName">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>

      <!-- 用户邮箱 -->
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { getUserInfoService } from '@/api/user'
import { updateUserInfoService } from '@/api/user.js'
const userStore = useUserStore()
const router = useRouter()
getUserInfoService()
userStore.getUser()
let userAccount = userStore.user.userAccount
const formRef = ref(null)
const form = ref({
  userAccount: userAccount,
  userName: '', // 用户昵称默认为空
  email: '' // 邮箱默认为空
})

// 定义校验规则
const rules = {
  // 注释掉登录名称的校验规则，因为输入框是禁用的
  // userAccount: [{ required: true, message: '请输入登录名称', trigger: 'blur' }],

  userName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称长度应为2-10位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱格式',
      trigger: ['blur', 'change']
    }
  ]
}

// 提交表单的处理函数
const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 这里添加您的提交逻辑
      await updateUserInfoService({
        userName: form.value.userName,
        email: form.value.email
      })

      ElMessage.success('提交成功！')
      //回显数据
      router.push({
        path: '/user/profile'
      })
    } else {
      ElMessage.error('表单验证失败，请检查输入！')
    }
  })
}
</script>

<style scoped>
.personal-detail-card {
  width: 100%;
  max-width: 700px;
  margin: 50px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.card-header {
  color: #333;
  font-weight: bold;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid #ddd;
}

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
  margin-left: 10px;
}
</style>

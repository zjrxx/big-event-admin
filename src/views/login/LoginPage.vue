<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { watch } from 'vue'
const form = ref()
const userStore = useUserStore()
const router = useRouter()
const isRegister = ref(true)
const register = async () => {
  await form.value.validate()
  await userRegisterService(formModel.value)
  // eslint-disable-next-line no-undef
  ElMessage.success('注册成功')
  // 切换到登录
  isRegister.value = false
}
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.token)

  ElMessage.success('登录成功')
  router.push('/')
}
const formModel = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})
const rules = {
  userAccount: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.userPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
watch(isRegister, () => {
  formModel.value = {
    userAccount: '',
    userPassword: '',
    checkPassword: ''
  }
})
</script>

<template>
  <el-row class="login-title" justify="center">
    <h1>xxx管理系统</h1>
    <!-- <el-col :span="4" :offset="10">
     
    </el-col> -->
  </el-row>
  <el-row class="login-page">
    <!-- <el-col :span="12" class="bg"></el-col> -->

    <el-col :span="12" :offset="6" class="form">
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="userAccount">
          <el-input
            v-model="formModel.userAccount"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-model="formModel.userPassword"
            :prefix-icon="Lock"
            type="userPassword"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input
            v-model="formModel.checkPassword"
            :prefix-icon="Lock"
            type="userPassword"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="register"
            class="button"
            type="primary"
            auto-insert-space
          >
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-else
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="userAccount">
          <el-input
            v-model="formModel.userAccount"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-model="formModel.userPassword"
            name="userPassword"
            :prefix-icon="Lock"
            type="userPassword"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="login"
            class="button"
            type="primary"
            auto-insert-space
            >登录</el-button
          >
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-title {
  background-color: #fff;
}
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

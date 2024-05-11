<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
//import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { getUserInfoService } from '@/api/user'
import { onMounted } from 'vue'
const userStore = useUserStore()
const router = useRouter()
//将 getUserInfoService 函数放到钩子中
onMounted(async () => {
  await getUserInfoService()
})

userStore.getUser()

const logout = () => {
  userStore.removeToken()
  //重定向到登录页
  window.location.href = '/login'
}
const userInfo = () => {
  router.push('/user/profile')
}
const changeAvatar = () => {
  router.push('/user/avatar')
}
const changePassword = () => {
  router.push('/user/userPassword')
}

const avatar = userStore.user.userAvatar
</script>

<template>
  <el-container class="layout-container">
    <el-container>
      <el-header>
        <div>
          欢迎：<strong>{{
            userStore.user.userAccount || userStore.user.userName
          }}</strong>
        </div>
        <el-dropdown placement="bottom-end">
          <span class="el-dropdown__box">
            <el-avatar :src="avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User" @click="userInfo"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item
                command="avatar"
                :icon="Crop"
                @click="changeAvatar"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item
                command="userPassword"
                :icon="EditPen"
                @click="changePassword"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item
                command="logout"
                @click="logout"
                :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- <div class="el-aside__logo"></div> -->
          <el-menu
            active-text-color="#ffd04b"
            background-color="#1d74b2"
            :default-active="$route.path"
            text-color="#fff"
            router
          >
            <el-menu-item index="/article/channel">
              <el-icon><Management /></el-icon>
              <span>文章分类</span>
            </el-menu-item>
            <el-menu-item index="/article/manage">
              <el-icon><Promotion /></el-icon>
              <span>文章管理</span>
            </el-menu-item>
            <el-sub-menu index="/user">
              <template #title>
                <el-icon><UserFilled /></el-icon>
                <span>个人中心</span>
              </template>
              <el-menu-item index="/user/profile">
                <el-icon><User /></el-icon>
                <span>基本资料</span>
              </el-menu-item>
              <el-menu-item index="/user/avatar">
                <el-icon><Crop /></el-icon>
                <span>更换头像</span>
              </el-menu-item>
              <el-menu-item index="/user/userPassword">
                <el-icon><EditPen /></el-icon>
                <span>重置密码</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer
            >文章管理系统 ©{{ new Date().getFullYear() }} Created by zjrxx
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #1d74b2;
    // &__logo {
    //   height: 120px;
    //   background: url('@/assets/logo.png') no-repeat center / 120px auto;
    // }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>

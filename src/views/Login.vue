<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo-dot"></div>
      <h2>资产管理</h2>
      <p>信息管理中心</p>
    </div>

    <van-form @submit="handleLogin" class="login-form">
      <van-cell-group inset>
        <van-field
          v-model="form.username"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请输入账号' }]"
        />
        <van-field
          v-model="form.password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>
      <div class="btn-wrap">
        <van-button round block type="primary" native-type="submit" :loading="loading">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { login } from '@/api/auth.js'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

async function handleLogin() {
    loading.value = true
    try {
        const res = await login(form)
        if (res.code === 200) {
            userStore.setToken(res.data.token)
            userStore.setUser(res.data.user)
            showToast('登录成功')
            router.push('/home')
        } else {
            showToast(res.message || '登录失败')
        }
    } catch (e) {
        showToast('登录失败')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 120px;
}
.login-header {
    text-align: center;
    color: #fff;
    margin-bottom: 40px;
}
.logo-dot {
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    margin: 0 auto 16px;
    box-shadow: 0 0 0 6px rgba(255,255,255,0.2);
}
.login-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
}
.login-header p {
    margin: 8px 0 0;
    font-size: 14px;
    opacity: 0.8;
}
.login-form {
    width: 90%;
    max-width: 400px;
}
.btn-wrap {
    padding: 24px 16px;
}
</style>

<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo-dot"></div>
      <h2>资产管理</h2>
      <p>信息管理中心</p>
    </div>

    <div class="login-card">
      <van-form @submit="handleLogin">
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
    background: linear-gradient(180deg, #f0f4ff 0%, #e8eeff 50%, #f5f7fa 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 100px;
}
.login-header {
    text-align: center;
    margin-bottom: 40px;
}
.logo-dot {
    width: 10px;
    height: 10px;
    background: #2563eb;
    border-radius: 50%;
    margin: 0 auto 16px;
    box-shadow: 0 0 0 5px rgba(37,99,235,0.15);
}
.login-header h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
}
.login-header p {
    margin: 6px 0 0;
    font-size: 13px;
    color: #94a3b8;
}
.login-card {
    width: 90%;
    max-width: 400px;
    background: #fff;
    border-radius: 16px;
    padding: 24px 0;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
}
.btn-wrap {
    padding: 24px 16px 0;
}
</style>

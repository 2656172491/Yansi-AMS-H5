<template>
  <div class="app-layout">
    <div class="content-area">
      <router-view />
    </div>
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/create-order" icon="edit">提交工单</van-tabbar-item>
      <van-tabbar-item to="/my-orders" icon="orders-o">我的工单</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const active = ref(0)
</script>

<style scoped>
.app-layout {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.content-area {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 50px;
}
</style>

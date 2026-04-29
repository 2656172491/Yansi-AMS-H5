<template>
  <div class="home-page">
    <div class="header">
      <div class="user-info">
        <div class="avatar">{{ (userStore.userInfo.name || 'U')[0] }}</div>
        <div class="greeting">
          <div class="name">{{ userStore.userInfo.name || userStore.userInfo.username }}</div>
          <div class="role">{{ roleMap[userStore.userInfo.role] || '学生助理' }}</div>
        </div>
      </div>
      <van-button plain size="small" @click="handleLogout">退出</van-button>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-num">{{ pendingCount }}</div>
        <div class="stat-label">待处理</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ myCount }}</div>
        <div class="stat-label">我的工单</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">待处理工单</div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-if="pendingList.length">
          <van-cell v-for="item in pendingList" :key="item.id" is-link @click="goDetail(item.id)">
            <template #title>
              <div class="order-title">
                <span>{{ item.orderNo }}</span>
                <van-tag :type="item.orderType === 'replace' ? 'primary' : 'warning'" size="small">
                  {{ item.orderType === 'replace' ? '更换' : '回收' }}
                </van-tag>
              </div>
            </template>
            <template #label>
              <div class="order-desc">{{ item.faultDesc || '无描述' }}</div>
              <div class="order-meta">{{ item.reporter }} · {{ item.reporterDept }}</div>
            </template>
          </van-cell>
        </van-list>
        <van-empty v-else description="暂无待处理工单" />
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { getOrders } from '@/api/orders.js'
import { showConfirmDialog } from 'vant'

const router = useRouter()
const userStore = useUserStore()
const roleMap = { admin: '管理员', teacher: '老师', assistant: '学生助理' }

const pendingList = ref([])
const pendingCount = ref(0)
const myCount = ref(0)
const refreshing = ref(false)

async function fetchData() {
    try {
        const res = await getOrders({ status: 'pending' })
        if (res.code === 200) {
            pendingList.value = res.data
            pendingCount.value = res.data.length
        }
    } catch (e) {}
    try {
        const res = await getOrders({})
        if (res.code === 200) {
            myCount.value = res.data.length
        }
    } catch (e) {}
}

async function onRefresh() {
    await fetchData()
    refreshing.value = false
}

function goDetail(id) {
    router.push('/order/' + id)
}

function handleLogout() {
    showConfirmDialog({ title: '确认退出？' }).then(() => {
        userStore.logout()
        router.push('/login')
    }).catch(() => {})
}

onMounted(fetchData)
</script>

<style scoped>
.home-page {
    padding: 16px;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}
.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
}
.avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #2563eb;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
}
.name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}
.role {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
}
.stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
}
.stat-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.stat-num {
    font-size: 28px;
    font-weight: 700;
    color: #2563eb;
}
.stat-label {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
}
.section {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.section-title {
    padding: 14px 16px;
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    border-bottom: 1px solid #f1f5f9;
}
.order-title {
    display: flex;
    align-items: center;
    gap: 8px;
}
.order-desc {
    font-size: 13px;
    color: #64748b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.order-meta {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
}
</style>

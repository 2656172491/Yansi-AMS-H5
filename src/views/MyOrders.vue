<template>
  <div class="my-orders-page">
    <div class="page-title">我的工单</div>

    <van-tabs v-model:active="activeTab" sticky @change="onTabChange">
      <van-tab title="全部" name="all" />
      <van-tab title="待处理" name="pending" />
      <van-tab title="已完成" name="done" />
    </van-tabs>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="refresh-area">
      <div class="order-list" v-if="filteredList.length">
        <div class="order-card" v-for="item in filteredList" :key="item.id" @click="goDetail(item.id)">
          <div class="card-status-bar" :class="statusClass(item.status)"></div>
          <div class="card-content">
            <div class="card-header">
              <span class="order-no">{{ item.orderNo }}</span>
              <van-tag :type="statusType(item.status)" size="medium">{{ statusText(item.status) }}</van-tag>
            </div>
            <div class="card-body">
              <div class="card-row">
                <van-tag :type="item.orderType === 'replace' ? 'primary' : item.orderType === 'assign' ? 'success' : 'warning'" size="small" plain>
                  {{ orderTypeText(item.orderType) }}
                </van-tag>
                <span class="reporter">{{ item.reporter }} {{ item.reporterDept }}</span>
              </div>
              <div class="card-desc">{{ item.faultDesc || '无描述' }}</div>
            </div>
            <div class="card-footer">
              <span class="time">{{ item.createdAt }}</span>
              <van-icon name="arrow" color="#c0c4cc" />
            </div>
          </div>
        </div>
      </div>
      <van-empty v-else description="暂无工单" />
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders } from '@/api/orders.js'

const router = useRouter()
const orderList = ref([])
const refreshing = ref(false)
const activeTab = ref('all')

const filteredList = computed(() => {
    if (activeTab.value === 'all') return orderList.value
    return orderList.value.filter(o => o.status === activeTab.value)
})

function statusText(s) { return { pending: '待处理', checking: '检查中', done: '已完成' }[s] || s }
function statusType(s) { return { pending: 'warning', checking: 'primary', done: 'success' }[s] || '' }
function statusClass(s) { return { pending: 'bar-warning', checking: 'bar-primary', done: 'bar-success' }[s] || '' }
function orderTypeText(t) { return { replace: '更换', recycle: '回收', assign: '配出' }[t] || t }

async function fetchData() {
    const res = await getOrders({})
    if (res.code === 200) orderList.value = res.data
}

async function onRefresh() {
    await fetchData()
    refreshing.value = false
}

function onTabChange() {}

function goDetail(id) {
    router.push('/order/' + id)
}

onMounted(fetchData)
</script>

<style scoped>
.my-orders-page {
    min-height: 100vh;
    background: #f5f5f5;
}
.page-title {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    padding: 16px 16px 8px;
}
.refresh-area {
    min-height: calc(100vh - 140px);
}
.order-list {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.order-card {
    display: flex;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.card-status-bar {
    width: 4px;
    flex-shrink: 0;
}
.bar-warning { background: #ff976a; }
.bar-primary { background: #1989fa; }
.bar-success { background: #07c160; }
.card-content {
    flex: 1;
    padding: 14px 16px;
}
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}
.order-no {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
}
.card-body {
    margin-bottom: 10px;
}
.card-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}
.reporter {
    font-size: 13px;
    color: #646566;
}
.card-desc {
    font-size: 13px;
    color: #969799;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.time {
    font-size: 12px;
    color: #c0c4cc;
}
</style>

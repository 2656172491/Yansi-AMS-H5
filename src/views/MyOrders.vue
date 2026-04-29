<template>
  <div class="my-orders-page">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-if="orderList.length">
        <van-cell v-for="item in orderList" :key="item.id" is-link @click="goDetail(item.id)">
          <template #title>
            <div class="order-title">
              <span>{{ item.orderNo }}</span>
              <van-tag :type="statusType(item.status)" size="small">{{ statusText(item.status) }}</van-tag>
            </div>
          </template>
          <template #label>
            <div class="order-info">
              <span>{{ item.orderType === 'replace' ? '更换' : '回收' }}</span>
              <span class="sep">·</span>
              <span>{{ item.reporter }} {{ item.reporterDept }}</span>
            </div>
            <div class="order-desc">{{ item.faultDesc || '无描述' }}</div>
            <div class="order-time">{{ item.createdAt }}</div>
          </template>
        </van-cell>
      </van-list>
      <van-empty v-else description="暂无工单" />
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders } from '@/api/orders.js'

const router = useRouter()
const orderList = ref([])
const refreshing = ref(false)

function statusText(s) { return { pending: '待处理', checking: '检查中', done: '已完成' }[s] || s }
function statusType(s) { return { pending: 'warning', checking: 'primary', done: 'success' }[s] || '' }

async function fetchData() {
    const res = await getOrders({})
    if (res.code === 200) orderList.value = res.data
}

async function onRefresh() {
    await fetchData()
    refreshing.value = false
}

function goDetail(id) {
    router.push('/order/' + id)
}

onMounted(fetchData)
</script>

<style scoped>
.my-orders-page {
    padding: 12px 0;
}
.order-title {
    display: flex;
    align-items: center;
    gap: 8px;
}
.order-info {
    font-size: 13px;
    color: #64748b;
}
.sep {
    margin: 0 4px;
}
.order-desc {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.order-time {
    font-size: 12px;
    color: #cbd5e1;
    margin-top: 4px;
}
</style>

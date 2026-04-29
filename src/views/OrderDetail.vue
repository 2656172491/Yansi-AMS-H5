<template>
  <div class="order-detail-page">
    <van-nav-bar title="工单详情" left-arrow @click-left="$router.back()" />

    <div class="detail-card" v-if="order">
      <div class="card-header">
        <span class="order-no">{{ order.orderNo }}</span>
        <van-tag :type="statusType(order.status)" size="medium">{{ statusText(order.status) }}</van-tag>
      </div>

      <van-cell-group inset>
        <van-cell title="类型" :value="order.orderType === 'replace' ? '更换' : '回收'" />
        <van-cell title="报修人" :value="order.reporter" />
        <van-cell title="报修部门" :value="order.reporterDept" />
        <van-cell title="故障描述" :value="order.faultDesc || '-'" />
        <van-cell title="经办人" :value="order.handler || '-'" />
        <van-cell title="处理结果" :value="resultText(order.result)" />
        <van-cell title="备注" :value="order.remark || '-'" />
        <van-cell title="创建时间" :value="order.createdAt" />
      </van-cell-group>
    </div>

    <van-empty v-else description="加载中..." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderDetail } from '@/api/orders.js'

const route = useRoute()
const order = ref(null)

function statusText(s) { return { pending: '待处理', checking: '检查中', done: '已完成' }[s] || s }
function statusType(s) { return { pending: 'warning', checking: 'primary', done: 'success' }[s] || '' }
function resultText(r) { return { repaired: '已维修', replaced: '已更换', recycled: '已回收' }[r] || '-' }

onMounted(async () => {
    const res = await getOrderDetail(route.params.id)
    if (res.code === 200) order.value = res.data
})
</script>

<style scoped>
.order-detail-page {
    min-height: 100vh;
    background: #f5f5f5;
}
.detail-card {
    padding-top: 12px;
}
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: #fff;
    margin: 0 16px 12px;
    border-radius: 8px;
}
.order-no {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}
</style>

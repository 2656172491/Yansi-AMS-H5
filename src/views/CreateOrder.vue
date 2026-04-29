<template>
  <div class="create-order-page">
    <van-nav-bar title="提交工单" left-arrow @click-left="$router.back()" />

    <van-form @submit="handleSubmit" class="order-form">
      <van-cell-group inset title="工单类型">
        <van-field name="orderType" label="类型">
          <template #input>
            <van-radio-group v-model="form.orderType" direction="horizontal">
              <van-radio name="replace">更换</van-radio>
              <van-radio name="recycle">回收</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <van-cell-group inset title="报修信息">
        <van-field v-model="form.reporter" label="报修人" placeholder="报修人姓名" :rules="[{ required: true, message: '请输入报修人' }]" />
        <van-field v-model="form.reporterDept" label="报修部门" placeholder="报修部门" :rules="[{ required: true, message: '请输入部门' }]" />
      </van-cell-group>

      <van-cell-group inset title="设备信息">
        <van-field v-model="form.assetQuery" label="设备" placeholder="输入编号或SN码查询" @blur="searchAsset" />
        <van-cell v-if="matchedAsset" title="匹配设备" :label="matchedLabel" />
        <van-cell v-else-if="form.assetQuery && searched" title="未找到" label="将创建无关联工单" />
      </van-cell-group>

      <van-cell-group inset title="故障描述">
        <van-field v-model="form.faultDesc" type="textarea" rows="3" placeholder="请描述故障情况" :rules="[{ required: true, message: '请描述故障' }]" />
      </van-cell-group>

      <div class="btn-wrap">
        <van-button round block type="primary" native-type="submit" :loading="loading">提交工单</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createOrder } from '@/api/orders.js'
import { getAssets } from '@/api/assets.js'
import { showToast, showSuccessToast } from 'vant'

const router = useRouter()
const loading = ref(false)
const searched = ref(false)
const matchedAsset = ref(null)

const typeMap = { desktop:'台式主机', monitor:'显示器', lock:'智能门锁', camera:'监控', card:'一卡通', laptop:'笔记本', pointer:'翻页笔', network:'网络设备', key:'机械钥匙', unknown:'未知' }

const form = reactive({
    orderType: 'replace',
    reporter: '',
    reporterDept: '',
    assetQuery: '',
    faultDesc: '',
    assetId: null
})

const matchedLabel = ref('')

async function searchAsset() {
    if (!form.assetQuery) {
        matchedAsset.value = null
        form.assetId = null
        return
    }
    searched.value = false
    try {
        const res = await getAssets({ computerNo: form.assetQuery })
        if (res.code === 200 && res.data.length) {
            matchedAsset.value = res.data[0]
            form.assetId = res.data[0].id
            matchedLabel.value = `${typeMap[res.data[0].assetType] || ''} ${res.data[0].hostSn || res.data[0].monitorSn || ''}`
        } else {
            // Try SN search
            const res2 = await getAssets({ hostSn: form.assetQuery })
            if (res2.code === 200 && res2.data.length) {
                matchedAsset.value = res2.data[0]
                form.assetId = res2.data[0].id
                matchedLabel.value = `${typeMap[res2.data[0].assetType] || ''} ${res2.data[0].hostSn || res2.data[0].monitorSn || ''}`
            } else {
                matchedAsset.value = null
                form.assetId = null
            }
        }
    } catch (e) {}
    searched.value = true
}

async function handleSubmit() {
    loading.value = true
    try {
        const data = {
            orderType: form.orderType,
            reporter: form.reporter,
            reporterDept: form.reporterDept,
            faultDesc: form.faultDesc,
            assetId: form.assetId
        }
        const res = await createOrder(data)
        if (res.code === 200) {
            showSuccessToast('提交成功')
            router.push('/my-orders')
        } else {
            showToast(res.message || '提交失败')
        }
    } catch (e) {
        showToast('提交失败')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.create-order-page {
    min-height: 100vh;
    background: #f5f5f5;
}
.order-form {
    padding-top: 12px;
}
.btn-wrap {
    padding: 24px 16px;
}
</style>

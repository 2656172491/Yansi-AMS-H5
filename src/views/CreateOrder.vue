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
              <van-radio name="assign">配出</van-radio>
            </van-radio-group>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 更换/回收 表单 -->
      <template v-if="form.orderType !== 'assign'">
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
      </template>

      <!-- 配出 表单 -->
      <template v-if="form.orderType === 'assign'">
        <van-cell-group inset title="配出信息">
          <van-field v-model="form.reporter" label="经办人" placeholder="经办人姓名" :rules="[{ required: true, message: '请输入经办人' }]" />
          <van-field v-model="form.reporterDept" label="配出部门" placeholder="配出部门" :rules="[{ required: true, message: '请输入部门' }]" />
        </van-cell-group>

        <van-cell-group inset title="物资信息">
          <van-field v-model="form.assetCategory" label="物资类别" placeholder="如: desktop, laptop" />
          <div class="device-items">
            <div class="device-item" v-for="(item, idx) in form.assetItems" :key="idx">
              <div class="item-header">
                <span class="item-title">设备 {{ idx + 1 }}</span>
                <van-icon name="cross" @click="removeDeviceItem(idx)" v-if="form.assetItems.length > 1" />
              </div>
              <van-field v-model="item.type" label="类型" placeholder="设备类型" />
              <van-field v-model="item.sn" label="SN码" placeholder="SN码" />
              <van-field v-model="item.remark" label="备注" placeholder="备注" />
            </div>
            <van-button plain size="small" icon="plus" @click="addDeviceItem" class="add-btn">添加设备</van-button>
          </div>
        </van-cell-group>

        <van-cell-group inset title="电脑配出信息">
          <van-field v-model="form.assignComputerNo" label="电脑编号" placeholder="如: PC-001" />
          <van-field v-model="form.assignMacAddress" label="MAC地址" placeholder="MAC地址" />
          <van-field v-model="form.assignHostSn" label="主机SN" placeholder="主机序列号" />
          <van-field v-model="form.assignMonitorSn" label="显示器SN" placeholder="显示器序列号" />
          <van-field v-model="form.assignDept" label="保管部门" placeholder="保管部门" />
          <van-field v-model="form.assignKeeper" label="保管人" placeholder="保管人" />
        </van-cell-group>
      </template>

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
    assetId: null,
    // assign fields
    assetCategory: '',
    assetItems: [{ type: '', sn: '', remark: '' }],
    assignComputerNo: '',
    assignMacAddress: '',
    assignHostSn: '',
    assignMonitorSn: '',
    assignDept: '',
    assignKeeper: ''
})

const matchedLabel = ref('')

function addDeviceItem() {
    form.assetItems.push({ type: '', sn: '', remark: '' })
}

function removeDeviceItem(idx) {
    form.assetItems.splice(idx, 1)
}

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
            faultDesc: form.orderType === 'assign' ? '配出物资' : form.faultDesc,
            assetId: form.assetId
        }

        if (form.orderType === 'assign') {
            data.assetCategory = form.assetCategory
            data.assetItems = JSON.stringify(form.assetItems.filter(i => i.type || i.sn))
            data.assignDept = form.assignDept
            data.assignKeeper = form.assignKeeper
            data.assignComputerNo = form.assignComputerNo
            data.assignMacAddress = form.assignMacAddress
            data.assignHostSn = form.assignHostSn
            data.assignMonitorSn = form.assignMonitorSn
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
.device-items {
    padding: 0 16px 12px;
}
.device-item {
    background: #f8f8f8;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 8px 0;
}
.item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 16px 8px;
}
.item-title {
    font-size: 14px;
    font-weight: 600;
    color: #323233;
}
.add-btn {
    width: 100%;
    margin-top: 8px;
}
</style>

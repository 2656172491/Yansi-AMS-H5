import service from '@/utils/request.js'

export function getAssets(params) {
    return service.get('/assets', { params })
}

export function getDepartments() {
    return service.get('/assets/departments')
}

export function getStockPool(assetType) {
    const params = assetType ? { assetType } : {}
    return service.get('/assets/stock-pool', { params })
}

export function getAssetTypes() {
    return service.get('/asset-types', { params: { mode: 'active' } })
}

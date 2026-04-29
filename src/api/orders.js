import service from '@/utils/request.js'

export function getOrders(params) {
    return service.get('/change-orders', { params })
}

export function getOrderDetail(id) {
    return service.get('/change-orders/' + id)
}

export function createOrder(data) {
    return service.post('/change-orders', data)
}

import service from '@/utils/request.js'

export function login(data) {
    return service.post('/auth/login', data)
}

export function getMe() {
    return service.get('/auth/me')
}

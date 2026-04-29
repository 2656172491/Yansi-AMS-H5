import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userInfo = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    const token = ref(localStorage.getItem('token') || '')

    function setUser(data) {
        userInfo.value = data
        localStorage.setItem('user', JSON.stringify(data))
    }

    function setToken(t) {
        token.value = t
        localStorage.setItem('token', t)
    }

    function logout() {
        userInfo.value = {}
        token.value = ''
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    return { userInfo, token, setUser, setToken, logout }
})

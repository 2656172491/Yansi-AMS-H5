import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    { path: '/login', name: 'Login', component: () => import('@/views/Login.vue') },
    {
        path: '/',
        component: () => import('@/views/Layout.vue'),
        redirect: '/home',
        children: [
            { path: 'home', name: 'Home', component: () => import('@/views/Home.vue') },
            { path: 'create-order', name: 'CreateOrder', component: () => import('@/views/CreateOrder.vue') },
            { path: 'order/:id', name: 'OrderDetail', component: () => import('@/views/OrderDetail.vue') },
            { path: 'my-orders', name: 'MyOrders', component: () => import('@/views/MyOrders.vue') },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.path !== '/login' && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router

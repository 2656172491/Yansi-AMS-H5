import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'

import 'vant/lib/index.css'
import './style.css'

import { Button, Field, CellGroup, Form, NavBar, Tabbar, TabbarItem, List, Cell, Tag, Dialog, Popup, Picker, DatePicker, Radio, RadioGroup, Empty, PullRefresh, Icon } from 'vant'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Register Vant components
app.use(Button)
app.use(Field)
app.use(CellGroup)
app.use(Form)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(List)
app.use(Cell)
app.use(Tag)
app.use(Dialog)
app.use(Popup)
app.use(Picker)
app.use(DatePicker)
app.use(Radio)
app.use(RadioGroup)
app.use(Empty)
app.use(PullRefresh)
app.use(Icon)

app.mount('#app')

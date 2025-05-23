// main.ts

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { auth } from '@/firebase'
import { signInAnonymously } from 'firebase/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

signInAnonymously(auth).catch(console.error)

app.mount('#app')

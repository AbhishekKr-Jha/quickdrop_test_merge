import './assets/main.css'

import { createApp } from 'vue'
// import { createVfm } from 'vue-final-modal'
// import 'vue-final-modal/style.css'
import App from './App.vue'
// import Flowbite from 'flowbite-vue'
import 'vue-toast-notification/dist/theme-default.css';
import ToastPlugin  from 'vue-toast-notification';

// const vfm = createVfm()

createApp(App).use(ToastPlugin ).mount('#app')
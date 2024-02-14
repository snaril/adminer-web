import { createApp, h, reactive  } from 'vue'
// import './style.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import { router } from './router'
import store from './store/index'
import 'element-ui/lib/theme-chalk/display.css'
import basicContainer from './components/basic-container/main.vue'

import BasicTable from './components/Table/BasicTable.vue'
import "./permission"
import './style.css'
import App from './App.vue'
import './common/polyfill'

// vxe-table 自适应插件
import Plugin from 'v-fit-columns'



// vxe-table crud 插件
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
// import 'default-passive-events'// 引入库 解决 滚动阻塞“touchstart”事件 的警告


// avue crud 插件
import Avue from '@smallwei/avue'
import '@smallwei/avue/lib/index.css' // 导入样式

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// line-tree
import { getElementLabelLine } from 'element-tree-line'
import 'element-tree-line/dist/style.css'
const ElementLabelLine = getElementLabelLine(h)

const bus = reactive({
  events: {},
  $on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  },
  $emit(event, payload) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(payload));
    }
  },
  $off(event, callback) {
    if (this.events[event]) {
      const index = this.events[event].indexOf(callback);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  }
});

const app = createApp(App)

app.config.globalProperties.$bus = bus;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('basicContainer', basicContainer)
app.component('BasicTable', BasicTable)

// line-tree
app.component(ElementLabelLine.name, ElementLabelLine)

// vxe-table crud 插件
app.use(VXETable)
// avue crud 插件
app.use(Avue)
app.use(store)
app.use(ElementPlus)
app.use(router)
// vxe-table 自适应插件
app.use(Plugin)

app.mount('#app')


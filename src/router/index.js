import Vue from 'vue'
import Router from 'vue-router'
import MsgRender from '@/components/MsgRender'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MsgRender',
      component: MsgRender
    }
  ]
})

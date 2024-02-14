// 处理权限相关的操作

import { router, addRoutes } from '~/router'
import { getToken } from '~/composables/auth'
import { toast } from '~/composables/util'
import store from './store'

// 前置路由守卫{1、如果登录过，不能重复登录 2、没有登录、跳转到登录页}
let hasGetInfo = false
router.beforeEach(async (to, form, next) => {

    const token = getToken("access-token")
    //没有登录强制跳转到登录页面
    if (!token && to.path != "/login") {

        toast("请先登录", "error")
        return next({ path: '/login' })
    }
    //防止重复登录
    if (token && to.path == "/login") {
        toast("请勿重复登录", "error")
        return next({ path: form.path ? form.path : "/" })
    }
    //如果用户登录了，自动获取用户信息，并存储在vuex 当中
    let hasNewRoutes = false
    if (token && !hasGetInfo) {
        let  menus  = await store.dispatch("getinfo")
        hasGetInfo = true
        // 动态添加路由
        hasNewRoutes = addRoutes(menus)

        console.log(hasNewRoutes)
    }

    let title = (to.meta.title ? to.meta.title : "") + "-leetter后台"

    document.title = title
    // if (hasNewRoutes){
    //     next(to.fullPath)
    //     console.log("aaaaaaaaaaaaaaaaaaaaaaaa")
    // }else{
    //     next()
    // }
    hasNewRoutes ? next(to.fullPath) : next()
})
import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '~/layouts/admin.vue'
import Index from '~/pages/index.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'
import GoodList from '~/pages/goods/list.vue'

// 动态路由，用于 匹配后端菜单，动态添加路由

const asyncRoutes = [
    {
        path: "/",
        component: Index,
        meta: {
            title: "后台首页"
        }
    },
    {
        path: "/goods/list",
        component: GoodList,
        meta: {
            title: "商品管理"
        }
    }
]


const routes = [
    {
        path: "/",
        name: "admin",
        component: Admin,

    },
    {
        path: "/login",
        component: Login,
        meta: {
            title: "登陆页面"
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: 'NotFound',
        component: NotFound,
        meta: {
            title: "404"
        }
    }
]



export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 动态添加路由的方法
export function addRoutes(menus){
    // 是否有新的路由
    let hasNewRoutes = false
    const findAndAddRoutesByMenus = (arr) =>{
        arr.forEach(e => {
            let item =  asyncRoutes.find(o => o.path == e.frontpath)
            if (item && !router.hasRoute(e.frontpath)){
                router.addRoute("admin",item)
                hasNewRoutes = true
            }
            if (e.child && e.child.length >0){
                findAndAddRoutesByMenus(e.child)
            }
        })
    }
    findAndAddRoutesByMenus(menus)

    console.log(router.getRoutes())
    return hasNewRoutes

}
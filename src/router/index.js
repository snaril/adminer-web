import { createRouter, createWebHashHistory } from 'vue-router'
import Admin from '~/layouts/admin.vue'
import Login from '~/pages/login.vue'
import NotFound from '~/pages/404.vue'


import { defineAsyncComponent } from 'vue';



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


// 动态路由，用于 匹配后端菜单，动态添加路由

const asyncRoutes = [
    {
        path: "/",
        component: () => import('~/pages/index.vue'),
        meta: {
            title: "首页"
        }
    },
    
    {
        path: "/system/menu",
        component: () => import('~/pages/system/menu/menu.vue'),
        meta: {
            title: "菜单管理"
        }
    },
    
    
    
    
    {
        path: "/web/user",
        component: () => import('~/pages/web/user/user.vue'),
        meta: {
            title: "系统用户"
        }
    },
    {
        path: "/test/test",
        component: () => import('~/pages/test/test.vue'),
        meta: {
            title: "系统用户"
        }
    },
    {
        path: "/test/exportFunc",
        component: () => import('~/pages/test/exportFunc/exportFunc.vue'),
        meta: {
            title: "子组件暴露函数"
        }
    },



    //权限管理
    {
        path: "/purview/tenant",
        component: () => import('~/pages/purview/tenant/tenant.vue'),
        meta: {
            title: "租户管理"
        }
    },
    {
        path: "/purview/role",
        component: () => import('~/pages/purview/role/role.vue'),
        meta: {
            title: "角色管理"
        }
    },
    {
        path: "/purview/user",
        component: () => import('~/pages/purview/user/user.vue'),
        meta: {
            title: "系统用户"
        }
    },
    {
        path: "/purview/wallet",
        component: () => import('~/pages/purview/wallet/wallet.vue'),
        meta: {
            title: "钱包管理"
        }
    },
    {
        path: "/purview/rate",
        component: () => import('~/pages/purview/rate/rate.vue'),
        meta: {
            title: "费率管理"
        }
    },
    {
        path: "/purview/balance",
        component: () => import('~/pages/purview/balance/balance.vue'),
        meta: {
            title: "商户余额"
        }
    },



    // 业务管理
    {
        path: "/business/products",
        component: () => import('~/pages/business/products/products.vue'),
        meta: {
            title: "商品管理"
        }
    },
    
    {
        path: "/business/message",
        component: () => import('~/pages/business/message/message.vue'),
        meta: {
            title: "消息管理"
        }
    },
    {
        path: "/business/ticket",
        component: () => import('~/pages/business/ticket/ticket.vue'),
        meta: {
            title: "工单管理"
        }
    },
    {
        path: "/business/activity",
        component: () => import('~/pages/business/activity/activity.vue'),
        meta: {
            title: "活动管理"
        }
    },
    // 账单管理
    {
        path: "/billy/recharger",
        component: () => import('~/pages/billy/recharger/recharger.vue'),
        meta: {
            title: "充值订单"
        }
    },
    {
        path: "/billy/Withdrawal",
        component: () => import('~/pages/billy/Withdrawal/Withdrawal.vue'),
        meta: {
            title: "提现订单"
        }
    },
    {
        path: "/billy/products-income",
        component: () => import('~/pages/billy/products-income/products-income.vue'),
        meta: {
            title: "产品收入"
        }
    },
    {
        path: "/billy/invite-reward",
        component: () => import('~/pages/billy/invite-reward/invite-reward.vue'),
        meta: {
            title: "邀请奖励"
        }
    },
    {
        path: "/billy/team-reward",
        component: () => import('~/pages/billy/team-reward/team-reward.vue'),
        meta: {
            title: "团队奖励"
        }
    },
    {
        path: "/billy/team-income",
        component: () => import('~/pages/billy/team-income/team-income.vue'),
        meta: {
            title: "团队收入"
        }
    },
    {
        path: "/billy/weekly-reward",
        component: () => import('~/pages/billy/weekly-reward/weekly-reward.vue'),
        meta: {
            title: "周薪奖励"
        }
    },
    {
        path: "/billy/gift",
        component: () => import('~/pages/billy/gift/gift.vue'),
        meta: {
            title: "红包订单"
        }
    },
    {
        path: "/billy/ticket",
        component: () => import('~/pages/billy/ticket/ticket.vue'),
        meta: {
            title: "红包管理"
        }
    },
    // whatsapp 管理
    {
        path: "/whatsapp/whatsapp",
        component: () => import('~/pages/whatsapp/whatsapp/whatsapp.vue'),
        meta: {
            title: "账号管理"
        }
    },
    {
        path: "/whatsapp/send",
        component: () => import('~/pages/whatsapp/send/send.vue'),
        meta: {
            title: "发送消息"
        }
    },
    
    


]


// 动态添加路由的方法
export function addRoutes(menus) {
    // generateDynamicRoutes(menus)
    // 是否有新的路由
    let hasNewRoutes = false
    const findAndAddRoutesByMenus = (arr) => {
        arr.forEach(e => {
            console.log("forEach", e)
            let item = asyncRoutes.find(o => o.path == e.path)
            console.log("frontpath", e.path)
            console.log("item", item)
            if (item && !router.hasRoute(e.path)) {
                router.addRoute("admin", item)
                hasNewRoutes = true
            }
            if (e.children && e.children.length > 0) {
                findAndAddRoutesByMenus(e.children)
            }
        })
    }
    findAndAddRoutesByMenus(menus)

    console.log(router.getRoutes())
    return hasNewRoutes

}


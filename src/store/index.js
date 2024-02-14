import { createStore } from 'vuex'
import { loginByUsername, getinfo } from '~/api/manager'
import { setToken, removeToken } from '~/composables/auth'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
    state (){
        return {
            user:{},

            //菜单
            menus:[],
            ruleNames:[],
            $role_name:null,
        }
    },
    mutations: { 
        // SET_USERINFO(state,user){
        //     state.user = user
        // },
        SET_MENUS(state,menu){
            state.menus = menu
        },
        
        // SET_RULENAMES(state,ruleNames){
        //     state.ruleNames = ruleNames
        // },

        SET_ROLE_NAME(state,role_name){
            state.$role_name = role_name
        },
        GET_ROLE_NAME(state){
            return state.$role_name
        },

    },
    plugins: [
		createPersistedState({
			key: 'RoleName',
			storage: window.localStorage,
			paths: ['$role_name']
		}),
	],
    actions: {
        loginByUsername( {commit }, userinfo ={}  ){

            return new Promise((resolve,reject)=>{
                console.log("userinfo",userinfo)
                loginByUsername(userinfo.tenantId,userinfo.username,userinfo.password).then(res=>{
                    setToken("access-token",res.access_token)
                    setToken("refresh-token",res.refresh_token)
                    commit("SET_ROLE_NAME",res.role_name)
                    resolve(res)
                }).catch(err=>{
                    console.log("请求错误")
                    reject(err)
                })
            })
        },
        //获取当前登录信息
        getinfo({ commit }){
            return new Promise((resolve,reject)=>{
                getinfo().then(res=>{


                    // commit("SET_USERINFO",res)
                    commit("SET_MENUS",res)
                    
                    console.log("bbbbbbb",res)
                    // commit("SET_RULENAMES",res.ruleNames)

                    resolve(res)
                }).catch(err=>reject(err))
            })
        },

        //退出登陆
        logout({commit}){
            //移除 cookie 里面的 token
            removeToken("access-token")
            removeToken("refresh-token")
            //清楚 用户状态 vuex
            commit("SET_USERINFO",{})
        }
    }

})
export default store
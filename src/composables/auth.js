import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies()

// 获取token
export function getToken(title){
    return cookie.get(title)
}

// 设置token
export function setToken(title,token){
    console.log("setTokenA",token)
    return cookie.set(title,token)
}

// 清除token
export function removeToken(title){
    return cookie.remove(title)
}

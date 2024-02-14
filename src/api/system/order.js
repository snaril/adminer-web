import request from '~/axios';
// // 后台用户管理 用户列表接口
export const inviteList = (page, size, params) => {
    return request({
        url: '/system/invite/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

export const productOrderList = (page, size, params) => {
    return request({
        url: '/system/product/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

export const TeamIncomeOrderList = (page, size, params) => {
    return request({
        url: '/system/TeamIncome/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

export const TeamRewardOrderList = (page, size, params) => {
    return request({
        url: '/system/TeamReward/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

export const weeklyOrderList = (page, size, params) => {
    return request({
        url: '/system/weekly/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

export const rechargeOrderList = (page, size, params) => {
    return request({
        url: '/system/recharge/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

export const withdrawOrderList = (page, size, params) => {
    return request({
        url: '/system/withdraw/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}


export const giftOrderList = (page, size, params) => {
    return request({
        url: '/system/gift/order',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}
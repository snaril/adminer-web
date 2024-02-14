import request from '~/axios';

// 后台钱包管理 钱包列表接口
export const getList = (page, size, params) => {
    return request({
        url: '/system/wallet/list',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}
//
// 



// 后台用户管理 用户接口
export const add = (row) => {
    return request({
        url: '/system/wallet/add',
        method: 'post',
        data: row
    })
}

// 租户管理 租户下拉接口
export const getWalletTree = () => {
    return request({
        url: '/system/wallet/tree',
        method: 'get',
    })
}



// // 
export const remove = (id) => {
    return request.delete(`/system/wallet/delete/${id}`)
}


//
export const batchDelete = (row) => {
    return request({
        url: '/system/wallet/batchDelete',
        method: 'post',
        data: row
    })
}


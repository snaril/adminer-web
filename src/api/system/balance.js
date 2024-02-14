import request from '~/axios';

// 后台钱包管理 钱包列表接口
export const getList = (page, size, params) => {
    return request({
        url: '/system/balance/list',
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



// 费率管理 编辑接口
export const update = (row) => {
    return request({
        url: '/system/balance/edit',
        method: 'post',
        data: row
    })
}



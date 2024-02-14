import request from '~/axios';

// 后台用户管理 用户列表接口
export const getList = (page, size, params) => {
    return request({
        url: '/whatsapp/list',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}


// 
export const remove = (jid) => {
    return request.delete(`/whatsapp/delete?jid=${jid}`)
}


//
export const batchDelete = (row) => {
    return request({
        url: '/whatsapp/batchDelete',
        method: 'post',
        data: row
    })
}


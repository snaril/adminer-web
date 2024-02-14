import request from '~/axios';

// 后台用户管理 用户列表接口
export const getLabel = (page, size, params) => {
    return request({
        url: '/whatsapp/label',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

export const send = (value) => {
    return request({
        url: '/whatsapp/send',
        method: 'post',
        data: value
    })
}
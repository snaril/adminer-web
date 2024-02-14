import request from '~/axios';
export const WebUserList = (page, size, params) => {
    return request({
        url: '/system/webUser/list',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}
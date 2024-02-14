import request from '~/axios';


export const add = (row) => {
    return request({
        url: '/system/gift/add',
        method: 'post',
        data: row
    })
}

// // 后台用户管理 用户列表接口
export const getList = (page, size, params) => {
    return request({
        url: '/system/gift/list',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}
// //
// // 角色管理 根据（租户Id）获取角色列表接口
// export const lazyList = (id) => {
//     return request.get('/system/user/lazy-list', {
//         params: {
//             id,
//         },
//     })
// }
// //
// // 后台用户管理 角色下拉接口
// export const getRoleTree = () => {
//     return request({
//         url: '/system/user/tree',
//         method: 'get',
//     })
// }

// // 后台用户管理 用户接口


// // 
export const update = (row) => {
    return request({
        url: '/system/gift/edit',
        method: 'post',
        data: row
    })
}

// // 
export const remove = (id) => {
    return request.delete(`/system/gift/delete/${id}`)
}


// //
export const batchDelete = (row) => {
    return request({
        url: '/system/gift/batchDelete',
        method: 'post',
        data: row
    })
}


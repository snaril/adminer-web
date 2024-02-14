import request from '~/axios';

// 角色管理 角色列表接口
export const getList = (page, size, params) => {
    return request({
        url: '/system/role/list',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}
// 角色管理 根据（租户Id）获取角色列表接口
export const lazyList = (id) => {
    return request.get('/system/role/lazy-list', {
        params: {
            id,
        },
    })
}

// 租户管理 租户下拉接口
export const getRoleTree = () => {
    return request({
        url: '/system/role/tree',
        method: 'get',
    })
}

// 
export const add = (row) => {
    return request({
        url: '/system/role/add',
        method: 'post',
        data: row
    })
}


export const addPermiss = (role_id,menus) => {
    return request({
        url: '/system/role/permiss',
        method: 'post',
        data: {
            role_id,
            menus
        }
    })
}

// 
export const update = (row) => {
    return request({
        url: '/system/role/edit',
        method: 'post',
        data: row
    })
}

// 
export const remove = (id) => {
    return request.delete(`/system/role/delete/${id}`)
}


//
export const batchDelete = (row) => {
    return request({
        url: '/system/role/batchDelete',
        method: 'post',
        data: row
    })
}


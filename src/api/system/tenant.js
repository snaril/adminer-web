import request from '~/axios';

// 租户管理 租户列表接口
export const getList = (page, size, params) => {
    return request({
        url: '/system/tenant/list',
        method: 'get',
        params: {
            ...params,
            page,
            size,
        }
    })
}

// 租户管理 新增租户接口
export const add = (row) => {
    return request({
        url: '/system/tenant/add',
        method: 'post',
        data: row
    })
}

// 租户管理 编辑租户接口
export const update = (row) => {
    return request({
        url: '/system/tenant/edit',
        method: 'post',
        data: row
    })
}

// 租户管理 删除租户接口
export const remove = (id) => {
    return request.delete(`/system/tenant/delete/${id}`)
}


// 租户管理 租户下拉接口
export const getTree = () => {
    return request({
        url: '/system/tenant/tree',
        method: 'get',
    })
}

// 角色管理 租户下拉接口
export const getTenantTree = () => {
    return request({
        url: '/system/tenant/tenantTree',
        method: 'get',
    })
}

//
export const batchDelete = (row) => {
    return request({
        url: '/system/tenant/batchDelete',
        method: 'post',
        data: row
    })
}



export const getMenu = (id) => {
    return request({
        url: '/blade-system/menu/detail',
        method: 'get',
        params: {
            id,
        }
    })
}

export const getLazyMenuList = (parentId, params) => {
    return request({
        url: '/system/menu/list',
        method: 'get',
        params: {
            ...params,
            parentId
        }
    })
}

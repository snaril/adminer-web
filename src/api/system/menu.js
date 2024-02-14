import request from '~/axios';

// 菜单管理 菜单列表接口
export const getList = (current, size, params) => {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 菜单管理 菜单下拉接口
export const getTree = () => {
  return request({
    url: '/system/menu/tree',
    method: 'get',
  })
}
// 菜单管理 删除菜单接口
export const remove = (id) => {
  return request.delete(`/system/menu/delete/${id}`)
}

// 菜单管理 删除菜单接口
export const getPermissionById = (id) => {
  return request({
    url: '/system/menu/permiss',
    method: 'get',
    params: {  // 传递给 axios 的参数对象
      id  // 这是 ES6 的对象属性简写，等同于 id: id
    }
  })
}
// 菜单管理 批量删除菜单接口
export const batchDelete = (row) => {
  return request({
    url: '/system/menu/batchDelete',
    method: 'post',
    data: row
  })
}
// 菜单管理 新增菜单接口
export const add = (row) => {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data: row
  })
}

// 菜单管理 编辑菜单接口
export const update = (row) => {
  return request({
    url: '/system/menu/update',
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

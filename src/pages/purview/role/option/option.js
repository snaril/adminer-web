
export const fieldOption = [
  // {
  //   field: "title",
  //   type: "title",
  //   title: "Basic information",
  //   width: 200,
  //   align: "left",
  //   icon: "vxe-icon-comment",
  //   span: 24,
  // },
  {
    field: "role_name",
    title: "角色名称",
    width: 100,
    align: "right",
    type: "input",
    dataType:"text",
    span: 12,
  },
  {
    field: "role_alias",
    title: "角色别名",
    width: 100,
    align: "right",
    type: "input",
    dataType:"text",
    span: 12,
  },
  {
    field: "tenant_id",
    title: "租户",
    width: 100,
    align: "right",
    type: "select",
    span: 12,
    content: [],
  },
  
  {
    field: "sort",
    title: "排序",
    width: 100,
    align: "right",
    type: "number",
    span: 12,
  },
  {
    field: "remark",
    title: "租户备注",
    width: 100,
    align: "right",
    type: "remark",
    span: 24,
  },
  
  // ... 其他字段配置
];

export const dataOption = {
  role_name:"",
  role_alias:"",
  tenant_id:null,
  sort:1,
  remark: null,
};

export const addFormRules = {
  role_name: [
    { required: true, message: "请输入租户名称" },
    { min: 2, max: 10, message: "长度在 2 到 20 个字符" },
  ],
  role_alias: [
    { required: true, message: "请输入联系姓名" },
    { min: 2, max: 50, message: "长度在 3 到 50 个字符" },
  ],
  sort: [
    { required: true, message: "请输入租户排序" },
    { pattern: /^\d+$/, message: "租户排序必须是数字" },
    {
      pattern: /^\d{1,4}$/,
      message: "租户排序必须是至少1位数，最多4位数的数字",
    },
  ],
  
}

export const editFormRules = {
  tenant_name: [
    { required: true, message: "请输入租户名称" },
    { min: 2, max: 10, message: "长度在 2 到 20 个字符" },
  ],
  linkman: [
    { required: true, message: "请输入联系姓名" },
    { min: 2, max: 50, message: "长度在 3 到 50 个字符" },
  ],
  phone: [
    { required: true, message: "请选择联系电话" },
    { pattern: /^\d+$/, message: "联系电话必须是数字" },
  ],
  sort: [
    { required: true, message: "请输入租户排序" },
    { pattern: /^\d+$/, message: "租户排序必须是数字" },
    {
      pattern: /^\d{1,4}$/,
      message: "租户排序必须是至少1位数，最多4位数的数字",
    },
  ],
}



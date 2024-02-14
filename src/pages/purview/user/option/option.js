
export const fieldOption = [
  {
    field: "title",
    type: "title",
    title: "Basic information",
    width: 200,
    align: "left",
    icon: "vxe-icon-comment",
    span: 24,
  },
  {
    field: "account",
    title: "账号",
    width: 100,
    align: "right",
    type: "input",
    dataType:'text',
    controls:false,
    span: 24,
  },

  {
    field: "password",
    title: "密码",
    width: 100,
    type: "password",
    align: "right",
    span: 12,
  },
  {
    field: "repassword",
    title: "确认密码",
    width: 100,
    type: "password",
    align: "right",
    span: 12,
  },
  {
    field: "tenant_id",
    title: "租户",
    width: 100,
    align: "right",
    type: "select-string",
    span: 12,
    content: [],
  },
  {
    field: "role_id",
    title: "角色",
    width: 100,
    align: "right",
    type: "select",
    span: 12,
    content: [],
  },
  {
    field: "title",
    type: "title",
    title: "Details information",
    width: 200,
    align: "left",
    icon: "vxe-icon-info-circle-fill",
    span: 24,
  },

  {
    field: "real_name",
    title: "姓名",
    width: 100,
    type: "input",
    align: "right",
    dataType:'text',
    span: 12,
  },
  {
    field: "phone",
    title: "联系方式",
    width: 100,
    type: "input",
    dataType:"text",
    align: "right",
    span: 12,
  },

  {
    field: "remark",
    title: "备注",
    width: 100,
    align: "right",
    type: "remark",
    span: 24,
  },
  // ... 其他字段配置
];

export const dataOption = {
  account: null,
  password:"",
  repassword:"",
  tenant_id:null,
  role_id:null,
  real_name:null,
  phone:null,
  remark: null,
};

export const addFormRules = {
  account: [
    { required: true, message: "请输入账号",trigger: "blur" },
    { min: 5, max: 20, message: "长度在 5 到 20 个字符" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 20, message: "长度在 8 到 20 个字符" },
  ],
  repassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { min: 8, max: 20, message: "长度在 8 到 20 个字符" },
  ],
  tenant_id: [
    { required: true, message: "请选择租户",trigger: "blur" },
    { min: 6, max: 6, message: "租户ID 格式不正确",trigger: "blur" },
  ],
  
  role_id: [
    { required: true, message: "请选择角色" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "角色ID 格式不正确",
      trigger: "blur", // 触发验证的时机，这里设置为失去焦点时触发
    },
  ],
  
  real_name: [
    { required: true, message: "请输入姓名",trigger: "blur" },
    { min: 2, max: 10, message: "长度在 3 到 20 个字符" },
  ],
  
  phone: [
    { required: true, message: "请输入联系方式",trigger: "blur" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "请输入有效的11位手机号码",
      trigger: "blur", // 触发验证的时机，这里设置为失去焦点时触发
    },
  ],
}

export const editFormRules = {
  account: [
    { required: true, message: "请输入账号",trigger: "blur" },
    { min: 5, max: 20, message: "长度在 5 到 20 个字符" },
  ],
  password: [
    { min: 8, max: 20, message: "长度在 8 到 20 个字符" },
  ],
  repassword: [
    { min: 8, max: 20, message: "长度在 8 到 20 个字符" },
  ],
  tenant_id: [
    { required: true, message: "请选择租户",trigger: "blur" },
    { min: 6, max: 6, message: "租户ID 格式不正确",trigger: "blur" },
  ],
  
  role_id: [
    { required: true, message: "请选择角色" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "角色ID 格式不正确",
      trigger: "blur", // 触发验证的时机，这里设置为失去焦点时触发
    },
  ],
  
  phone: [
    { required: true, message: "请输入联系方式",trigger: "blur" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "请输入有效的11位手机号码",
      trigger: "blur", // 触发验证的时机，这里设置为失去焦点时触发
    },
  ],
}



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
    field: "product_name",
    title: "产品名称",
    width: 100,
    align: "right",
    type: "input",
    span: 24,
  },
  {
    field: "image",
    title: "商品图片",
    width: 100,
    align: "right",
    type: "upload",
    span: 24,
  },

  {
    field: "price",
    title: "产品价格",
    width: 100,
    type: "input",
    align: "right",
    span: 24,
  },
  {
    field: "daliy_erning",
    title: "每日收益",
    width: 100,
    type: "input",
    align: "right",
    span: 12,
  },
  {
    field: "days",
    title: "收益天数",
    width: 100,
    align: "right",
    type: "input",
    span: 12,
  },
  {
    field: "total",
    title: "总收益",
    width: 100,
    align: "right",
    type: "input",
    span: 24,
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
  product_name: null,
  image_url: null,
  price: null,
  daliy_erning: null,
  days: null,
  total: null,
  remark: null,
};

export const addFormRules = {
  product_name: [
    { required: true, message: "请输入账号", trigger: "blur" },
  ],
  price: [
    { required: true, message: "请输入密码", trigger: "blur" },
  ],
  daliy_erning: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
  ],
  // days: [
  //   { required: true, message: "请选择租户", trigger: "blur" },
  // ],

  role_id: [
    { required: true, message: "请选择角色" },
    
  ],
};

export const editFormRules = {
  account: [
    { required: true, message: "请输入账号", trigger: "blur" },
    { min: 5, max: 20, message: "长度在 5 到 20 个字符" },
  ],
  password: [{ min: 8, max: 20, message: "长度在 8 到 20 个字符" }],
  repassword: [{ min: 8, max: 20, message: "长度在 8 到 20 个字符" }],
  tenant_id: [
    { required: true, message: "请选择租户", trigger: "blur" },
    { min: 6, max: 6, message: "租户ID 格式不正确", trigger: "blur" },
  ],

  role_id: [
    { required: true, message: "请选择角色" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "角色ID 格式不正确",
      trigger: "blur", // 触发验证的时机，这里设置为失去焦点时触发
    },
  ],

  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 10, message: "长度在 3 到 20 个字符" },
  ],

  phone: [
    { required: true, message: "请输入联系方式", trigger: "blur" },
    {
      pattern: /^[1-9]\d{10}$/,
      message: "请输入有效的11位手机号码",
      trigger: "blur", // 触发验证的时机，这里设置为失去焦点时触发
    },
  ],
};

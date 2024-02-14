
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
    field: "withdraw_rate",
    title: "提现费率",
    width: 100,
    align: "right",
    type: "input",
    span: 24,
    dataType: "number"
  },

  {
    field: "recharge_rate",
    title: "充值费率",
    width: 100,
    type: "input",
    align: "right",
    span: 24,
    dataType: "number"
  },

  {
    field: "usdt_price",
    title: "USDT价格",
    width: 100,
    align: "right",
    type: "input",
    span: 24,
    dataType: "number"
  },
  {
    field: "cny_price",
    title: "离岸人民币",
    width: 100,
    align: "right",
    type: "input",
    span: 24,
    dataType: "number"
  },
  
  // ... 其他字段配置
];

export const dataOption = {
  account: null,
  password:"",
  repassword:"",
  tenant_id:null,
  role_id:null,
  name:null,
  phone:null,
  remark: null,
};

export const addFormRules = {
  withdraw_rate: [
    { required: true, message: "请输入账号",trigger: "blur" },
    { min: 5, max: 20, message: "长度在 5 到 20 个字符" },
  ],
  recharge_rate: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 20, message: "长度在 8 到 20 个字符" },
  ],
  usdt_price: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    { min: 8, max: 20, message: "长度在 8 到 20 个字符" },
  ],
  cny_price: [
    { required: true, message: "请选择租户",trigger: "blur" },
    { min: 6, max: 6, message: "租户ID 格式不正确",trigger: "blur" },
  ],
  
}

export const editFormRules = {
  withdraw_rate: [
    { required: true, message: "请输入账号",trigger: "blur" },
  ],
  recharge_rate: [
    { required: true, message: "请输入密码", trigger: "blur" },
  ],
  usdt_price: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
  ],
  cny_price: [
    { required: true, message: "请选择租户",trigger: "blur" },
  ],
}



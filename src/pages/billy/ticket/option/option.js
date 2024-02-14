
export const fieldOption = [
  
  {
    field: "amount",
    title: "红包金额",
    type: "input",
    dataType:"number",
    controls:false,
    width: 100,
    align: "right",
    span: 24,
  },
  {
    field: "num",
    title: "红包数量",
    type: "input",
    dataType:"number",
    width: 100,
    align: "right",
    span: 24,
  },
  
  // ... 其他字段配置
];

export const dataOption = {
  amount: null,
  num:null

};

export const addFormRules = {
  amount: [
    { required: true, message: "请输入正确金额",trigger: "blur" },
    {
      pattern: /^\d{1,5}$/,
      message: "金额必须是至少1位数，最多5位数的数字",
    },
  ],
  num: [
    { required: true, message: "请输入正确数量", trigger: "blur" },
    {
      pattern: /^\d{1,3}$/,
      message: "红包必须是至少1位数，最多3位数的数字",
    },
  ],
  
}

export const editFormRules = {
  amount: [
    { required: true, message: "请输入正确金额",trigger: "blur" },
    {
      pattern: /^\d{1,5}$/,
      message: "金额必须是至少1位数，最多5位数的数字",
    },
  ],
  num: [
    { required: true, message: "请输入正确数量", trigger: "blur" },
    {
      pattern: /^\d{1,3}$/,
      message: "红包必须是至少1位数，最多3位数的数字",
    },
  ],
}



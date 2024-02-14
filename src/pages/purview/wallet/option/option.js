export const fieldOption = [
  {
    field: "mnemonic",
    type: "mnemonic",
    title: "Basic information",
    width: 200,
    align: "left",
    icon: "vxe-icon-comment",
    span: 24,
  },
  {
    field: "wallet_name",
    title: "钱包名称",
    width: 100,
    align: "right",
    type: "input",
    span: 24,
  },
  {
    field: "passphrase",
    title: "种子密码",
    width: 100,
    align: "right",
    type: "password",
    span: 24,
  },

];

export const dataOption = {
  wallet_name: "",
  passphrase: "",
};

export const addFormRules = {
  wallet_name: [
    { required: true, message: "请输入钱包名称", trigger: "blur" },
    { min: 5, max: 20, message: "长度在 5 到 20 个字符" },
  ],
  passphrase: [
    { min: 5, max: 20, message: "长度在 5 到 20 个字符" },
  ],
};



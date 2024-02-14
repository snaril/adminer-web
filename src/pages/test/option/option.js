export const formOption = [
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
    span: 12,
  },
  {
    field: "sort",
    title: "排序",
    width: 100,
    type: "number",
    align: "right",
    span: 12,
    content: [
      { label: 1, content: "体育" },
      { label: 2, content: "唱歌" },
    ],
  },

  {
    field: "flag",
    title: "是否单身",
    width: 100,
    type: "radio",
    align: "right",
    span: 12,
    content: [
      { label: 1, content: "是" },
      { label: 2, content: "否" },
    ],
  },
  {
    field: "aihao",
    title: "爱好",
    width: 100,
    type: "checkedList",
    align: "right",
    span: 12,
    content: [
      { label: 1, content: "体育" },
      { label: 2, content: "唱歌" },
    ],
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
    title: "密码",
    width: 100,
    type: "password",
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
  sort: 1,
  remark: "这是初始化备注信息",
};

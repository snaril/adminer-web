import iconList from "~/config/iconList";
export default (safe) => {
    console.log(safe) //vue的this对象
    return {
        index: true,
        align: 'center',
        headerAlign: 'center',
        border: true,
        stripe: true,
        column: [
            {
                label: "菜单名称",
                prop: "name",
                search: true,
                rules: [
                    {
                        required: true,
                        message: "请输入菜单名称",
                        trigger: "blur"
                    }
                ]
            },
            {
                label: "路由地址",
                prop: "path",
                rules: [
                    {
                        required: true,
                        message: "请输入路由地址",
                        trigger: "blur"
                    }
                ]
            },
            {
                label: "上级菜单",
                prop: "parentId",
                type: "tree",
                dicUrl: "/blade-system/menu/tree",
                hide: true,
                props: {
                    label: "title"
                },
                rules: [
                    {
                        required: false,
                        message: "请选择上级菜单",
                        trigger: "click"
                    }
                ]
            },
            {
                label: "菜单图标",
                prop: "source",
                type: "icon",
                slot: true,
                iconList: iconList,
                rules: [
                    {
                        required: true,
                        message: "请输入菜单图标",
                        trigger: "click"
                    }
                ]
            },
            {
                label: "菜单编号",
                prop: "code",
                search: true,
                rules: [
                    {
                        required: true,
                        message: "请输入菜单编号",
                        trigger: "blur"
                    }
                ]
            },
            {
                label: "菜单类型",
                prop: "category",
                type: "radio",
                dicData: [
                    {
                        label: "菜单",
                        value: 1
                    },
                    {
                        label: "按钮",
                        value: 2
                    }
                ],
                hide: true,
                rules: [
                    {
                        required: true,
                        message: "请选择菜单类型",
                        trigger: "blur"
                    }
                ]
            },
            {
                label: "菜单别名",
                prop: "alias",
                rules: [
                    {
                        required: true,
                        message: "请输入菜单别名",
                        trigger: "blur"
                    }
                ]
            },
            {
                label: "按钮功能",
                prop: "action",
                type: "radio",
                dicData: [
                    {
                        label: "工具栏",
                        value: 1
                    },
                    {
                        label: "操作栏",
                        value: 2
                    },
                    {
                        label: "工具操作栏",
                        value: 3
                    }
                ],
                hide: true,
                rules: [
                    {
                        required: true,
                        message: "请选择按钮功能",
                        trigger: "blur"
                    }
                ]
            },
            {
                label: "菜单排序",
                prop: "sort",
                type: "number",
                rules: [
                    {
                        required: true,
                        message: "请输入菜单排序",
                        trigger: "blur"
                    }
                ]
            },
            {
                label: "新窗口",
                prop: "isOpen",
                type: "radio",
                dicData: [
                    {
                        label: "否",
                        value: 0
                    },
                    {
                        label: "是",
                        value: 1
                    },
                ],
                hide: true
            },
            {
                label: "菜单备注",
                prop: "remark",
                type: "textarea",
                span: 24,
                minRows: 6,
                hide: true
            }
        ]
    }
}
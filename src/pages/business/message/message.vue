<template>
    <el-button @click="getCheckedValues">获取勾选的节点</el-button>
    <vxe-modal v-model="showPermiss" :title="'权限配置'" width="300" min-width="300" min-height="300" showFooter
        :loading="submitLoading" resize destroy-on-close>
        <template #default>
            <vxe-form :data="formData" title-align="right" title-width="100" @submit="submitEvent">
                <vxe-form-item :span="24" :item-render="{}">
                    <template #default="{ data }">
                        <div class="tree-container">
                            <el-tree ref="treeRef" :data="data.node" show-checkbox node-key="id" default-expand-all
                                :expand-on-click-node="false" :props="defaultProps" />
                        </div>
                    </template>
                </vxe-form-item>
            </vxe-form>
        </template>
        <template v-slot:footer>
            <vxe-button status="primary" type="submit" @click="submitEvent">提交</vxe-button>
            <vxe-button type="submit" @click="resetForm">重置</vxe-button>
        </template>
    </vxe-modal>
</template>
<script>
export default {
    data() {
        return {
            showPermiss: false,

            formData: {
                node: [
                    {
                        id: 1,
                        label: 'Level one 1',
                        children: [
                            {
                                id: 4,
                                label: 'Level two 1-1',
                                children: [
                                    {
                                        id: 9,
                                        label: 'Level three 1-1-1',
                                    },
                                    {
                                        id: 10,
                                        label: 'Level three 1-1-2',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: 2,
                        label: 'Level one 2',
                        children: [
                            {
                                id: 5,
                                label: 'Level two 2-1',
                            },
                            {
                                id: 6,
                                label: 'Level two 2-2',
                            },
                        ],
                    },
                    {
                        id: 3,
                        label: 'Level one 3',
                        children: [
                            {
                                id: 7,
                                label: 'Level two 3-1',
                            },
                            {
                                id: 8,
                                label: 'Level two 3-2',
                            },
                        ],
                    },
                ],
                defaultCheckedKeys: [1, 4, 9],
            },
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    methods: {
        getCheckedValues() {
            this.showPermiss = true
        },
        submitEvent() {
            const checkedNodes = this.$refs.treeRef.getCheckedNodes();
            console.log(checkedNodes); // 这里会打印出所有勾选的节点数据
        },
        resetForm() {
            this.$refs.treeRef.setCheckedKeys([], false)
        },
        setInitialCheckedNodes() {
            const setNodeChecked = (nodes) => {
                nodes.forEach(node => {
                    // 检查节点是否应该被勾选
                    const shouldBeChecked = this.formData.defaultCheckedKeys.includes(node.id);
                    // 如果节点在 defaultCheckedKeys 中，则勾选它
                    if (shouldBeChecked) {
                        this.$refs.treeRef.setChecked(node, true, false);
                    }
                    // 如果节点有子节点，递归勾选
                    if (node.children && node.children.length) {
                        setNodeChecked(node.children);
                    }
                });
            };
            // 从根节点开始递归
            setNodeChecked(this.formData.node);
        },
    },
    mounted() {
        this.$nextTick(() => {
            // 监听模态框的打开事件，然后设置勾选状态
            this.$watch('showPermiss', (newVal) => {
                if (newVal) {
                    console.log("aaaaaaaaaa")
                    this.$nextTick(() => {
                        this.setInitialCheckedNodes();
                    });
                }
            });
        });
    },
};
</script>
<style lang="scss" scoped>
.is-penultimate>.el-tree-node__content {
    color: #626aef;
}

.el-tree-node.is-expanded.is-penultimate>.el-tree-node__children {
    display: flex;
    flex-direction: row;
}

.is-penultimate>.el-tree-node__children>div {
    width: 25%;
}

.el-select,
.el-input {
    width: 100% !important;
}

.el-input__inner {
    --el-input-inner-height: auto !important;
}


.el-select-dropdown__item.selected {
    color: #999;
}

.vxe-textarea--inner {
    min-height: 71px !important;
    /* 你希望设置的最小高度 */
}


::v-deep(.vxe-form--item-title-content) {
    padding-left: 10px;
}

::v-deep(.tree-container) {
    padding-left: 10px !important;
}
</style> 
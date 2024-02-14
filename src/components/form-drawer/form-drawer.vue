<template>
    <el-drawer title="配置邀请奖励" v-model="drawerVisible" size="40%" :close-on-click-modal="false" :destroy-on-close="true">
        <div class="drawer-box">
            <div>
                <span>基本信息</span>
                <div class="basic-info  flex justify-center items-center mt-2 mb-2">
                    <div class="box rounded-md p-2 flex">
                        <div class=" h-40 w-40 rounded-md">
                            <el-image class=" h-40 w-40 rounded-md" :src="rowData.image_url" alt="" :fit="'fill'" />
                        </div>
                        <div class="products-info ml-4">
                            <div>
                                <span>产品名称：</span>
                                <span>{{ rowData.product_name }}</span>
                            </div>
                            <div>
                                <span>产品价格：</span>
                                <span>{{ rowData.price }}</span>
                            </div>
                            <div>
                                <span>每日收益：</span>
                                <span>₹ {{ rowData.daliy_erning }}</span>
                            </div>
                            <div>
                                <span>收益天数：</span>
                                <span>{{ rowData.days }}（天）</span>
                            </div>
                            <div>
                                <span class="half-space">总</span><span class="half-space">收</span><span>益：</span>
                                <span>₹ {{ rowData.total }}</span>
                            </div>
                        </div>

                    </div>
                </div>
                <span>添加奖励</span>
                <div class="basic-info flex justify-center items-center mt-2 mb-2">
                    <div class="box rounded-md p-5">
                        <el-form :model="form" label-width="80px">
                            <el-form-item label="奖励金额">
                                <el-input-number class="editNum" v-model="form.amount" :controls="false" />
                            </el-form-item>

                            <el-form-item label="排序">
                                <vxe-input v-model.number="form.sort" placeholder="整数类型" type="number"
                                    :span="12"></vxe-input>
                            </el-form-item>
                            <hr class="mb-2 ml-[-20px] mr-[-20px]">
                            <el-form-item>
                                <el-button @click="onSubmit" type="primary">添加</el-button>
                                <el-button @click="resetForm">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>


                </div>
                <span>奖励列表</span>
                <div class="basic-info flex justify-center items-center mt-2 mb-2">
                    <div class="box ">
                        <Invite :product="rowData" v-model:reset="reset"></Invite>
                    </div>


                </div>

                <div>

                </div>

            </div>
        </div>
    </el-drawer>
</template>

<script>
import { add } from "~/api/system/invite"
import Invite from "./invite.vue";
import { fetchDataAndUpdateField } from '~/common/apiHelpers';
export default {
    components: {
        Invite
    },
    props: {
        showDrawer: {
            type: Boolean,
            default: false
        },
        rowData: {
            type: Object,
            default: () => { },
        },
    },
    data() {
        return {
            isChange:true,
            reset: false,
            form: {
                product_id: null,
                amount: null,
                sort: null,
            }

        }
    },
    watch: {
        'rowData.id': function (newVal) {
            this.form.product_id = newVal;
        }
    },
    computed: {
        drawerVisible: {
            get() {
                return this.showDrawer;
            },
            set(val) {
                this.$emit('update:showDrawer', val);
                if (!val) { // 当抽屉关闭时
                    this.closeForm(); // 重置表单
                }
            }
        },

    },
    methods: {

        async onSubmit() {
            try {
                await add(this.form);
            } catch (err) {
                this.handleError(err, "添加数据失败：");
            } finally {
                this.resetForm()
                this.reset = true
            }


            console.log(this.form)
        },
        resetForm() {
            // 重置表单数据
            this.form = {
                product_id: this.rowData.id,
                amount: null,
                sort: this.form.sort + 1
            };
            // 如果还有其他需要重置的数据，也可以在这里添加
        },
        closeForm(){
            this.form = {
                product_id: this.rowData.id,
                amount: null,
                sort: null,
            };
        }
    },

}
</script>

<style lang="scss" scoped>
.half-space:after {
    content: '';
    margin-right: 0.5em;
    /* 半个字符宽度的空间 */
}

.drawer-box {
    width: 100%;
    height: 100%;
}

:deep(.el-form-item__content:last-child) {
    justify-content: flex-end;
    /* 添加这一行 */
}

:deep(.vxe-input) {
    width: 100% !important;
}

:deep(.el-form-item:last-child) {
    margin-bottom: 0px !important;
}

:deep(.el-drawer .el-drawer__header) {

    margin-bottom: 0px !important;
}

.basic-info {
    .box {
        width: 95%;
        background-color: #f2f2f2;
    }

    .add-reward {
        background-color: white;
    }

}

.el-input-number {
    width: 100%;
}

:deep(.el-input-number .el-input__inner) {
    text-align: left;
}
</style>

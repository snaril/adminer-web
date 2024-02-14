<template>
    <div class="flex">
        <div class="role-left w-80 mr-2 flex-auto overflow-auto">
            <basic-container class="pt-2  center">
                <TreeLine v-if="tenantTreeData.length" :showInput="true" :data="tenantTreeData" :nodeKey="'id'"
                    :show-checkbox="false" :label="'label'" :children="'children'" @node-selected="onNodeSelected" />
            </basic-container>
        </div>
        <div class="role-right w-full  flex-auto overflow-auto">
            <basic-container>
                <SendForm @submitEvent="handleSubmitEvent"></SendForm>
            </basic-container>
        </div>
        <!-- Additional code if needed -->
    </div>
</template>
      
<script >
import { getLabel,send } from "~/api/whatsapp/send";
import { VXETable } from "vxe-table"
import TreeLine from "~/components/tree-line/tree.vue";
import SendForm from './send-form.vue'

export default {
    components: {
        TreeLine,
        SendForm,
    },
    created() {
        this.fetchData();
    },
    //数据配置项：---------------------------------------------------------------------------
    data() {
        return {
            //left
            userTenant: null,
            tenantTreeData: [],


            //right

        }
    },


    //方法     ：---------------------------------------------------------------------------
    methods: {

        // left
        onNodeSelected(dataItem) {
            console.log("Selected node:", dataItem);
            this.userTenant = dataItem;
            this.$bus.$emit("whatsappSend-jid", dataItem)
        },
        handleTenantSelected(selectItem) {
            console.log("handleTenantSelected", selectItem);
            this.userTenant = selectItem;
            console.log("userTenant", this.userTenant);
        },
        async fetchData() {
            try {
                this.tenantTreeData = await getLabel();
                console.log("tenantTreeData", this.tenantTreeData);
            } catch (error) {
                throw new Error("Failed to fetch tenant tree data");
            }
        },
        async handleSubmitEvent(value) {
            await send(value);
            VXETable.modal.message({ content: "消息发送中", status: "success" });
        }

        //right

    },
    mounted() {

    },
};
</script>
<style lang="scss" scoped>
.vxe-input--inner {
    text-align: left;
}

.first-col {
    position: relative;
    height: 50px;
}

.role-right {
    width: calc(100% - 230px); // or any other fixed value
}
</style>
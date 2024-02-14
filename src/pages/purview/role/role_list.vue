<template>
  <div class="gird-box">
    <vxe-grid id="rechargerGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange" v-bind="gridOptions"
      @toolbar-button-click="handleToolbarButtonClick" class="h-full">
      <template v-slot:img_slot="{ row }">
        <img class="pl-3" :src="row.image_url" alt="商品图片" width="50" height="50" /> <!-- 设置你希望的图片大小 -->
      </template>
      <template #operations="{ row }">
        <!-- 查看按钮 -->
        <vxe-button :disabled="isDisabled(row)" type="text" status="primary" icon="vxe-icon-eye-fill"
          @click="selectEvent(row)">查看</vxe-button>
        <vxe-button :disabled="isDisabled(row)" type="text" status="primary" icon="vxe-icon-edit"
          @click="editEvent(row)">编辑</vxe-button>
        <vxe-button :disabled="isDisabled(row)" type="text" status="primary" icon="vxe-icon-delete"
          @click="removeEvent(row)">删除</vxe-button>
        <vxe-button :disabled="isDisabled(row)" type="text" status="primary" icon="vxe-icon-square-plus"
          @click="premissEvent(row)">权限配置</vxe-button>
      </template>

      <template #customType="{ row }">
        <el-tag v-if="row.type > 1" type="danger" style="width: 56px;">特权</el-tag>
        <el-tag v-else-if="row.type === 1" type="success" style="width: 56px;">系统</el-tag>
        <el-tag v-else-if="row.type === 0" type="info">自定义</el-tag>
      </template>
      <template #customAction="{ row }">
        <el-switch v-model="row.is_action" :active-value="1" :inactive-value="0" :disabled="isDisabled(row)" />
      </template>
    </vxe-grid>
    <modalForm ref="aaa" :showModal="showEdit" @update:showModal="showEdit = $event" :width="800"
      :modalTitle="selectRow ? '编辑&保存' : '新增&保存'" v-model:formData="formData" :formRules="formRules" :items="formItems"
      @submitEvent="handleSubmitEvent">
    </modalForm>


    <modalTree ref="bbb" @data-to-send="handleDataFromChild" :showModal="showPermiss"
      @update:showModal="showPermiss = $event" :formData="treeData" />
  </div>
</template>
    
<script >
import modalForm from "~/components/basic-modal/basic-modal.vue";
import modalTree from "~/components/basic-tree/basic-tree.vue";
import { VXETable } from "vxe-table"
import { fieldOption, dataOption, addFormRules, editFormRules } from "./option/option.js";
import {
  add,
  update,
  getList,
  remove,
  batchDelete,
  addPermiss,
} from "~/api/system/role"
import { getTree } from "~/api/system/tenant";
import { getPermissionById } from "~/api/system/menu";
import { fetchDataAndUpdateField } from '~/common/apiHelpers';

export default {

  components: {
    modalForm,
    modalTree,
  },
  props: {
    tenantItem: Object,
  },
  //数据配置项：---------------------------------------------------------------------------
  data() {
    return {
      selectPermiss: null,
      treeData: {
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
      dataList: {
        "result": [
          {
            id: 12119778449,
            role_name: "administrator",
            role_alias: "超级管理员",
            type: 1,
            is_action: 1,
            sort: 1,
          },
          {
            id: 12119778450,
            role_name: "admin",
            role_alias: "管理员",
            type: 1,
            is_action: 1,
            sort: 2,
          },
          {
            id: 12119778451,
            role_name: "merchant",
            role_alias: "商户",
            type: 1,
            is_action: 1,
            sort: 3,
          },
          {
            id: 12119778451,
            role_name: "sales",
            role_alias: "业务员",
            type: 1,
            is_action: 1,
            sort: 4,
          },
        ],
        "page": {
          "total": 2,
          "pageSize": 0,
          "currentPage": 0
        }
      },
      //--------------Modal Form-----------------
      showEdit: false,  //模态框状态
      showPermiss: false, //权限配置  模态框显示状态
      selectRow: false, //模态框Title控制 （false:表示新增，true:表示编辑）
      formData: {},  //模态框 表单初始值
      formRules: {}, //模态框 表单验证规则
      // 模态框 字段设置
      formItems: fieldOption,
      // ------------Grid Table------------------

      selectedIds: [],
      gridOptions: {
        stripe: true,
        showHeaderOverflow: true,
        showOverflow: true,
        border: true,
        minHeight: 200,
        maxHeight: 760,
        // treeConfig: {
        //   transform: true,
        //   rowField: 'id',
        //   parentField: 'parent_id',
        //   // showIcon:true,
        //   // 其他树形配置...
        // },
        rowConfig: {

          keyField: 'id',
          isHover: true
        },
        //控制表头显示
        customConfig: {
          storage: false,
          checkMethod({ column }) {
            if (['product_name', 'image_url', "price"].includes(column.field)) {
              return false
            }
            return true
          }
        },

        //表头 字段
        columns: [
          { type: 'checkbox', width: 60, align: 'center' },
          { type: 'seq', width: 60, align: 'center' },

          { field: 'role_name', title: '角色名', align: 'center' }, //
          { field: 'role_alias', title: '角色别名', align: 'center' }, //
          { field: 'type', title: '类型', align: 'center', slots: { default: 'customType' } },//
          { field: 'is_action', title: '是否启用', align: 'center', slots: { default: 'customAction' } },//
          { field: 'sort', title: '排序', align: 'center' },
          {
            field: 'setting',
            title: '操作',
            width: 300,
            align: 'center', // 让按钮居中显示
            slots: { default: 'operations' }, // 使用名为"operations"的插槽模板
            // 可以根据需要添加其他属性
          },
        ],
        //分页选项
        pagerConfig: {
          enabled: true,
          currentPage: 2,
          // pageSize: 40,
          total: 8,
          pagerCount: 40,
          pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
        },
        //工具栏
        toolbarConfig: {
          buttons: [
            { code: 'add', name: '新增', visible: true, },
            { code: 'batchDelete', name: '批量删除' },
          ],
          refresh: {
            queryMethod: this.handleRefresh
          },
          // print: true,
          // import: true,
          export: true,
          zoom: true,
          custom: true, // 显示自定义列按钮
        },
        proxyConfig: {
          seq: true, // 启用动态序号代理，每一页的序号会根据当前页数变化
          sort: true, // 启用排序代理，当点击排序时会自动触发 query 行为
          filter: true, // 启用筛选代理，当点击筛选时会自动触发 query 行为
          form: true, // 启用表单代理，当点击表单提交按钮时会自动触发 reload 行为
          ajax: {
            query: ({ page, sorts, filters, form }) => {
              // ... 其他赋值
              const queryParams = Object.assign({}, form)
              // 处理排序条件
              const firstSort = sorts[0]
              if (firstSort) {
                queryParams.sort = firstSort.property
                queryParams.order = firstSort.order
              }
              if (this.tenantItem) {
                queryParams.tenantId = this.tenantItem.tenant_id
              }
              // 处理筛选条件
              filters.forEach(({ property, values }) => {
                queryParams[property] = values.join(',')
              })
              queryParams.page = page.currentPage;
              queryParams.pageSize = page.pageSize;
              //自己在data中定义个baseUrl，用来访问后台
              console.log("queryParams", queryParams)
              return getList(queryParams)
              // return this.dataList
            },
          },
        },
        checkboxConfig: {
          // labelField: "id",
          reserve: true,
          highlight: true,
        },
      }
    }
  },

  // 当父组件点击左侧 租户时，重现加载 
  watch: {
    tenantItem: {
      deep: true,
      handler(newValue, oldValue) {
        this.$refs.userGridRef.commitProxy('reload');
      }
    }
  },
  //方法     ：---------------------------------------------------------------------------
  methods: {
    async premissEvent(row) {
      this.selectPermiss = row
      this.treeData = await getPermissionById(row.id)
      console.log("row", row)
      this.showPermiss = !this.showPermiss;
    },
    async handleDataFromChild(val) {
      console.log("handleDataFromChild", val)
      if (await this.confirmModal("您确定要删除该数据?")) {
        await addPermiss(this.selectPermiss.id, val);
      }
      console.log("selectPermiss", this.selectPermiss)

      VXETable.modal.message({ content: "更新数据成功", status: "success" });
      this.showPermiss = false
      this.selectPermiss = null
    },
    isAction(row) {
      // Your logic to determine if the button should be disabled
      return row.is_action === 1 ? true : false; // assuming each row has an is_disabled property
    },
    isDisabled(row) {
      if (this.$store.state.$role_name === "administrator") {
        return false
      }
      // Your logic to determine if the button should be disabled
      return row.type ? true : false // assuming each row has an is_disabled property
    },
    handleRefresh() {
      console.log(this.tenantItem)
      this.$emit('update:tenantItem', null);
      // 这里你还可以添加其他刷新逻辑
    },
    handleCheckboxChange({ records }) {
      this.selectedIds = records.map(row => row.id);
    },
    selectEvent(row) {
      console.log("selectEvent", row);
    },
    async editEvent(row) {
      console.log("row", row)
      this.selectRow = true
      await fetchDataAndUpdateField(getTree, this.formItems, "tenant_id")
      this.formRules = editFormRules
      Object.assign(this.formData, row);
      this.showEdit = !this.showEdit;
    },




    //行 删除数据
    async removeEvent(row) {
      if (await this.confirmModal("您确定要删除该数据?")) {
        this.deleteData(row.id);
      }
    },

    //复选框 删除数据
    async batchDeleteEvent() {
      if (this.selectedIds.length === 0) {

        this.showMessage("请选择至少一行进行删除！", "warning");
        return;
      }

      if (await this.confirmModal("您确定要删除该数据?")) {
        batchDelete(this.selectedIds).then(async () => {
          this.$emit('reload-requested');
          await this.$refs.userGridRef.commitProxy('reload');
          this.selectedIds.length = 0
          this.showMessage("删除成功", "success");
        }).catch(err => {
          this.showMessage(`删除数据失败：${err.message || "未知错误"}`, "error");
        });
      }
    },

    // Helper Functions
    async confirmModal(message) {
      const type = await VXETable.modal.confirm(message);
      return type === "confirm";
    },

    showMessage(content, status) {
      VXETable.modal.message({ content, status });
    },
    deleteData(id) {
      remove(id).then(() => {
        this.$emit('reload-requested');
        this.$refs.userGridRef.commitProxy('reload');
        this.showMessage("删除成功", "success");
      }).catch(err => {
        this.showMessage(`删除数据失败：${err.message || "未知错误"}`, "error");
      });
    },


    // 公共错误处理
    handleError(err, message = "操作失败：") {
      VXETable.modal.message({
        content: message + (err.message || "未知错误"),
        status: "error",
      });
      console.error(message, err);
    },


    handleToolbarButtonClick({ $grid, $event, button }) {
      switch (button.code) {
        case 'batchDelete':
          this.batchDeleteEvent();
          // 删除逻辑
          break;
        case 'add':
          this.formRules = addFormRules
          fetchDataAndUpdateField(getTree, this.formItems, "tenant_id")
          Object.assign(this.formData, dataOption);
          this.showEdit = !this.showEdit;
          // 删除逻辑
          break;

        // ...其他操作
      }
    },


    async handleSubmitEvent(value) {
      if (typeof value.parent_id === "string") {
        value.parent_id = parseInt(value.parent_id) || parseInt(null); // 如果转换失败则默认为0
      }
      try {
        if (this.selectRow) {
          await update(value);
          VXETable.modal.message({ content: "更新数据成功", status: "success" });

        } else {
          await add(value);
          VXETable.modal.message({ content: "添加数据成功", status: "success" });

        }
        this.showEdit = false;
        this.$emit('reload-requested');
        this.$refs.userGridRef.commitProxy('reload');
      } catch (err) {
        this.handleError(err, this.selectRow ? "更新数据失败：" : "添加数据失败：");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep(.col_25 .vxe-tree-cell) {
  text-align: left;
}

.vxe-input--inner {
  text-align: left;
}

.first-col {
  position: relative;
  height: 50px;
}
</style>
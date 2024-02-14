<template>
  <div class="gird-box">
    <vxe-grid id="userGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange" v-bind="gridOptions"
      @toolbar-button-click="handleToolbarButtonClick" class="h-full">
      <template #operations="{ row }">
        <!-- 查看按钮 -->
        <vxe-button type="text" status="primary" icon="vxe-icon-eye-fill" @click="selectEvent(row)">查看</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-edit" @click="editEvent(row)">编辑</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-delete" @click="removeEvent(row)">删除</vxe-button>
      </template>
    </vxe-grid>
    <modalForm ref="aaa" :showModal="showEdit" @update:showModal="showEdit = $event"
      :modalTitle="selectRow ? '编辑&保存' : '新增&保存'" v-model:formData="formData" :formRules="formRules" :items="formItems"
      @submitEvent="handleSubmitEvent">
    </modalForm>
  </div>
</template>

<script >
import modalForm from "~/components/basic-modal/basic-modal.vue";
import { VXETable } from "vxe-table"
import { fieldOption, dataOption, addFormRules, editFormRules } from "./option/option.js";
import {
  add,
  getList,
  remove,
  update,
  batchDelete,
} from "~/api/system/user"

import { getTenantTree } from "~/api/system/tenant";
import { getRoleTree } from "~/api/system/role";
export default {
  components: {
    modalForm,
    searchData: null,
  },

  //数据配置项：---------------------------------------------------------------------------
  data() {
    return {
      //--------------Modal Form-----------------
      showEdit: false,
      selectRow: false, // 添加这一行，如果有初始值，设置它
      formData: {}, // 添加这一行，如果有初始值，设置它
      formRules: {},
      // 添加这一行，如果有初始值，设置它
      formItems: fieldOption,
      // ------------Grid Table------------------
      tenantId: null,
      selectedIds: [],
      gridOptions: {
        showHeaderOverflow: true,
        showOverflow: true,
        border: true,
        treeConfig: { indent: 12 },
        minHeight: 200,
        maxHeight: 760,
        rowConfig: {
          keyField: 'id',
          isHover: true
        },
        customConfig: {
          storage: false,
          checkMethod({ column }) {
            if (['account', 'role_id', "real_name"].includes(column.field)) {
              return false
            }
            return true
          }
        },
        columns: [
          { type: 'checkbox', width: 60, align: 'center' },
          { type: 'seq', width: 60, align: 'center' },
          { field: 'account', title: '账号', align: 'center', width: 110, treeNode: true },
          { field: 'tenant_id', title: '租户' },
          { field: 'role_id', title: '角色' },
          { field: 'code', title: '用户编号' },
          { field: 'name', title: '姓名' },
          { field: 'real_name', title: '真名', visible: false },
          { field: 'phone', title: '手机' },
          {
            field: 'setting',
            title: '操作',
            width: 250,
            align: 'center', // 让按钮居中显示
            slots: { default: 'operations' }, // 使用名为"operations"的插槽模板
            // 可以根据需要添加其他属性
          },
        ],
        rowConfig: {
          keyField: 'id',
          isHover: true,
        },
        pagerConfig: {
          enabled: true,
          currentPage: 2,
          // pageSize: 40,
          total: 8,
          pagerCount: 40,
          pageSizes: [5, 10, 15, 20, 50, 100, 200, 500, 1000],
        },
        formConfig: {
          titleWidth: 100,
          titleAlign: 'right',
          items: [
            {
              field: 'code',
              title: '用户编号',
              span: 6,
              titlePrefix: {
                message: '根据账户编号',
                icon: 'vxe-icon-question-circle-fill',
              },
              visible: true,
              itemRender: { name: '$input', props: { placeholder: '请输入用户编号' } },
            },
            {
              field: 'account',
              title: '账号',
              span: 6,
              filterMultiple: false,
              titlePrefix: {
                message: '根据账号查找',
                icon: 'vxe-icon-question-circle-fill',
              },
              itemRender: { name: '$input', props: { placeholder: '请输入账号' } },
            },
            {
              field: 'name',
              title: '姓名',
              span: 6,
              itemRender: { name: '$input', props: { placeholder: '请输入姓名' } },
            },
            {
              span: 6,
              align: 'right',
              collapseNode: true,
              itemRender: {
                name: '$buttons',
                children: [
                  {
                    props: {
                      type: 'submit',
                      content: '搜索',
                      status: 'primary',
                    },

                  },
                  { props: { type: 'reset', content: '重置' } },
                ],
              },
            },
            {
              field: 'phone',
              title: '手机号码',
              span: 6,
              folding: true,
              titleSuffix: {
                message: '注意，必填信息！',
                icon: 'vxe-icon-question-circle-fill',
              },
              itemRender: { name: '$select', options: [] },
            },
            {
              field: 'role',
              title: '角色',
              span: 6,
              folding: true,
              itemRender: { name: '$input', props: { placeholder: '请输入角色' } },
            },
            {
              field: 'age',
              title: '年龄',
              span: 6,
              folding: true,
              itemRender: {
                name: '$input',
                props: {
                  type: 'number',
                  min: 1,
                  max: 120,
                  placeholder: '请输入年龄',
                },
              },
            },

          ],
        },
        toolbarConfig: {
          buttons: [
            { code: 'add', name: '新增', visible: true, },
            { code: 'batchDelete', name: '批量删除' },
          ],
          refresh: true,
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
              if(this.tenantId){
                queryParams.tenant_id = this.tenantId
              }
              this.tenantId = null
              // 处理筛选条件
              filters.forEach(({ property, values }) => {
                queryParams[property] = values.join(',')
              })
              queryParams.page = page.currentPage;
              queryParams.pageSize = page.pageSize;
              //自己在data中定义个baseUrl，用来访问后台
              console.log("queryParams", queryParams)
              return getList(queryParams)
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


  //方法     ：---------------------------------------------------------------------------
  methods: {
    handleCheckboxChange({ records }) {
      this.selectedIds = records.map(row => row.id);
    },
    selectEvent(row) {
      console.log("selectEvent", row);
    },
    fetchUserData(page) {
      // 根据你的需要处理sort, filters等参数
      // 使用getList查询数据并返回
      return getList(page);
    },
    editEvent(row) {
      this.selectRow = true
      this.handleGetTenantTree();
      this.handleGetRoleTree();
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
          await this.$refs.userGridRef.commitProxy('reload');
          this.selectedIds.length = 0
          this.showMessage("删除成功", "success");
        }).catch(err => {
          this.showMessage(`删除数据失败：${err.message || "未知错误"}`, "error");
        });
      }
    },
    handleSearch(value) {
      console.log("handleSearch", value)
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

    // 从API获取数据并更新formItems
    async fetchDataAndUpdateField(apiFunc, field) {
      try {
        const res = await apiFunc();
        const fieldItem = this.formItems.find((item) => item.field === field);
        if (fieldItem) {
          fieldItem.content = res;
        }
        return res;
      } catch (err) {
        this.handleError(err, "获取数据失败：");
      }
    },
    setFormData() {
      let currentFormData = this.$refs.userGridRef.getProxy().form;
      console.log(currentFormData)
      // 刷新 grid，以确保更改被应用
      this.$refs.userGridRef.refresh();
    },
    handleGetTenantTree() {
      return this.fetchDataAndUpdateField(getTenantTree, "tenant_id");
    },

    handleGetRoleTree() {
      return this.fetchDataAndUpdateField(getRoleTree, "role_id");
    },

    handleToolbarButtonClick({ $grid, $event, button }) {
      switch (button.code) {
        case 'batchDelete':
          this.batchDeleteEvent();
          // 删除逻辑
          break;
        case 'add':
          this.handleGetTenantTree();
          this.handleGetRoleTree();
          this.formRules = addFormRules
          Object.assign(this.formData, dataOption);
          this.showEdit = !this.showEdit;
          // 删除逻辑
          break;

        // ...其他操作
      }
    },


    async handleSubmitEvent(value) {
      try {
        if (this.selectRow) {
          await update(value);
          VXETable.modal.message({ content: "更新数据成功", status: "success" });
        } else {
          await add(value);
          VXETable.modal.message({ content: "添加数据成功", status: "success" });
        }
        this.showEdit = false;
        this.$refs.userGridRef.commitProxy('reload');
      } catch (err) {
        this.handleError(err, this.selectRow ? "更新数据失败：" : "添加数据失败：");
      }
    },
    handleSearchEvent(value) {
      this.tenantId = value.tenantId
      this.$refs.userGridRef.commitProxy('reload');
    }

    // loading.value = false

  },
  mounted() {
    this.$bus.$on('search-user', this.handleSearchEvent);
  },
  beforeDestroy() {
    // 在组件销毁前移除监听，避免潜在的内存泄漏
    this.$bus.$off('search-user', this.handleSearchEvent);
  }

};
</script>
<style lang="scss" scoped>
.vxe-input--inner {
  text-align: left;
}
</style>
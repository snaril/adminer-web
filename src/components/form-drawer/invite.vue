<template>
  <div class="grid-box-reward">
    <vxe-grid id="rechargerGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange" v-bind="gridOptions"
      @toolbar-button-click="handleToolbarButtonClick" class="h-full">
      <template v-slot:img_slot="{ row }">
        <img class="pl-3" :src="row.image_url" alt="商品图片" width="50" height="50" /> <!-- 设置你希望的图片大小 -->
      </template>
      <template #operations="{ row }">
        <!-- 查看按钮 -->
        <vxe-button type="text" status="primary" icon="vxe-icon-save" @click="editEvent(row)">保存</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-delete" @click="selectEvent(row)">删除</vxe-button>

      </template>
    </vxe-grid>
  </div>
</template>
    
<script >
import modalForm from "~/components/basic-modal/basic-modal.vue";
import { VXETable } from "vxe-table"
import { fieldOption, dataOption, addFormRules, editFormRules } from "./option/option.js";
import {
  getList,
  update,
} from "~/api/system/invite"

export default {

  components: {
    modalForm,
  },
  props: {
    product: Object,
    reset: Boolean,
  },
  //数据配置项：---------------------------------------------------------------------------
  data() {
    return {
      tenantId: null,
      dataList: {
        "result": [
          {
            id: 12119778449,
            amount: 100,
            sort: 1,
          },
          {
            id: 12119778450,
            amount: "150",
            sort: 2,
          },
          {
            id: 12119778451,
            amount: "200",
            sort: 3,
          },
          {
            id: 12119778452,
            amount: "250",
            sort: 4,
          },
          {
            id: 12119778453,
            amount: "300",
            sort: 5,
          },

        ],
        "page": {
          "total": 5,
          "pageSize": 0,
          "currentPage": 0
        }
      },
      //--------------Modal Form-----------------
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
        maxHeight: 400,
        rowConfig: {
          keyField: 'id',
          isHover: true
        },
        editConfig: {
          trigger: 'click',
          mode: 'row',
          showStatus: true
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

          { field: 'amount', title: '奖励金额', align: 'center', editRender: { name: 'input', attrs: { placeholder: '请输入金额' } } },
          {
            field: 'sort',
            title: '排序',
            width: 100,
            align: 'center',
            editRender: {
              name: '$input',
              props: {
                type: 'integer',
                digits: 2,
                placeholder: '请输入整数排序'
              }
            }
          },
          {
            field: 'setting',
            title: '操作',
            width: 200,
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
              console.log("queryParams.product_id", this.product)
              queryParams.product_id = this.product.id
              // 处理筛选条件
              filters.forEach(({ property, values }) => {
                queryParams[property] = values.join(',')
              })
              queryParams.page = page.currentPage;
              queryParams.pageSize = page.pageSize;
              //自己在data中定义个baseUrl，用来访问后台
              console.log("queryParams", queryParams)
              return getList(queryParams).then( (response )=>{
                this.updateValue()
                return response
              })
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

  watch: {
    reset(newVal, oldVal) {
      if (newVal !== oldVal) {
        if(newVal !== false){
          this.$refs.userGridRef.commitProxy('reload');
        }
      }
    }
  },
  //方法     ：---------------------------------------------------------------------------
  methods: {
    updateValue() {
      this.$emit('update:reset',false);
    },
    handleCheckboxChange({ records }) {
      this.selectedIds = records.map(row => row.id);
    },
    editEvent(row) {
      this.selectRow = true

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


    handleToolbarButtonClick({ $grid, $event, button }) {
      switch (button.code) {
        case 'batchDelete':
          this.batchDeleteEvent();
          // 删除逻辑
          break;
        case 'add':
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
  },
};
</script>
<style lang="scss" scoped>
.vxe-input--inner {
  text-align: left;
}

.grid-box-reward :deep(.vxe-table--body .vxe-body--row) {
  --vxe-table-row-height-default: 42px !important;
}

.first-col {
  position: relative;
  height: 50px;
}
</style>
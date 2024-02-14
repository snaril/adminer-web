<template>
  <div class="gird-box">
    <vxe-grid class="gird-box h-full" id="userGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange"
      v-bind="gridOptions" @toolbar-button-click="handleToolbarButtonClick">
      <template v-slot:img_slot="{ row }">
        <div style="width: 100%; height: 80px">
          <el-image class="pl-1 pr-1 pt-1 pb-1" style="width: 100%; height: 100%" :src="row.image_url" fit="cover" />
        </div>

        <!-- <el-image  :src="row.image_url" alt="商品图片"  fit="scale-down"/> 设置你希望的图片大小 -->
      </template>
      <template #operations="{ row }">
        <!-- 查看按钮 -->
        <vxe-button type="text" status="primary" icon="vxe-icon-setting" @click="openDrawer(row)">邀请奖励</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-setting" @click="selectEvent(row)">团队收益</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-edit" @click="editEvent(row)">编辑</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-delete" @click="removeEvent(row)">删除</vxe-button>
      </template>
    </vxe-grid>
    <modalForm ref="aaa" :showModal="showEdit" @update:showModal="showEdit = $event"
      :modalTitle="selectRow ? '编辑&保存' : '新增&保存'" v-model:formData="formData" :formRules="formRules" :items="formItems"
      @submitEvent="handleSubmitEvent">
    </modalForm>
    <formDrawer v-model:showDrawer="showDrawer" :rowData="drawerData"></formDrawer>
  </div>
</template>
  
<script >
import formDrawer from "~/components/form-drawer/form-drawer.vue";
import modalForm from "~/components/basic-modal/basic-modal.vue";
import { VXETable } from "vxe-table"
import { fieldOption, dataOption, addFormRules, editFormRules } from "./option/option.js";
import {
  add,
  getList,
  remove,
  update,
  batchDelete,
} from "~/api/system/product"

export default {
  components: {
    modalForm,
    formDrawer,
  },

  //数据配置项：---------------------------------------------------------------------------
  data() {
    return {
      showDrawer: false,
      drawerData: null, // 用于存储传递给 formDrawer 的数据
      dataList: {
        "result": [
          {
            product_name: "bicycle",
            image_url: "http://localhost:8080/static/assets/image/dynamic/bicycle.png",
            price: 588,
            daliy_erning:25,
            days:55,
            total:1375,

            quantity: 50,
            sales: 20,
            is_active: "上架",
            description: "这是商品A的描述",
          },
          {
            product_name: "motorcycle",
            image_url: "http://localhost:8080/static/assets/image/dynamic/motorcycle.png",
            price: 588,
            daliy_erning:25,
            days:55,
            total:1375,

            quantity: 50,
            sales: 20,
            is_active: "上架",
            description: "这是商品A的描述",
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
      selectRow: false, //模态框Title控制 （false:表示新增，true:表示编辑）
      formData: {},  //模态框 表单初始值
      formRules: {}, //模态框 表单验证规则
      // 模态框 字段设置
      formItems: fieldOption,
      // ------------Grid Table------------------

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
          { field: 'product_name', title: '商品名称', align: 'center'  },
          {
            field: 'image_url',
            align: 'center',
            title: '商品图片',
            slots: { default: 'img_slot' },
            align: 'center' 
          },
          { field: 'price', title: '商品价格' , align: 'center'},
          { field: 'daliy_erning', title: '每日收益' , align: 'center'},
          { field: 'days', title: '收益天数' , align: 'center'},
          { field: 'total', title: '总收益' , align: 'center'},
          { field: 'is_active', title: '商品状态' , align: 'center'},
          { field: 'description', title: '商品描述', visible: false , align: 'center'},
          {
            field: 'setting',
            title: '操作',
            width: 350,
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


  //方法     ：---------------------------------------------------------------------------
  methods: {
    setRootVars(vars) {
      const root = document.documentElement;
      Object.keys(vars).forEach(key => {
        root.style.setProperty(key, vars[key]);
      });
    },
    handleCheckboxChange({ records }) {
      this.selectedIds = records.map(row => row.id);
    },
    selectEvent(row) {
      console.log("selectEvent", row);
    },
    openDrawer(row) {
      this.drawerData = row
      this.showDrawer = true
    },
    fetchUserData({ page, size, sort, filters }) {
      // 根据你的需要处理sort, filters等参数
      // 使用getList查询数据并返回


      console.log("page", page)
      console.log("sort", sort)
      console.log("filters", filters)
      console.log("searchValues", this.searchData)


      return getList(page, sort, filters);
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
.gird-box :deep( .vxe-body--row) {
  --vxe-table-row-height-default: 80px !important;
}

.vxe-input--inner {
  text-align: left;
}

.first-col {
  position: relative;
  height: 50px;
}
</style>
<template>
  <div class="gird-box">
    <vxe-grid id="rechargerGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange" @checkbox-all="handleCheckboxChange" v-bind="gridOptions" class="h-full">

      <template #toolbar_buttons>
        <vxe-button status="primary" class="border-dark-600" @click="addNew">新增</vxe-button>
        <vxe-button status="danger" @click="batchDelete">批量删除</vxe-button>
        <vxe-input v-model="searchName" class="my-search ml-3" placeholder="搜索红包">
          <template #suffix>
            <div class="icon-box" @click="search">
              <i class="vxe-icon-search"></i>
            </div>

          </template>
        </vxe-input>
      </template>
      <template #operations="{ row }">
        <!-- 查看按钮 -->
        <vxe-button type="text" status="primary" icon="vxe-icon-eye-fill" @click="selectEvent(row)">查看</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-edit" @click="editEvent(row)">编辑</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-delete" @click="removeEvent(row)">删除</vxe-button>
      </template>
    </vxe-grid>
    <modalForm ref="aaa" :showModal="showEdit" @update:showModal="showEdit = $event" :width="400"
      :modalTitle="selectRow ? '编辑&保存' : '新增&保存'" v-model:formData="formData" :formRules="formRules" :items="formItems"
      @submitEvent="handleSubmitEvent">
    </modalForm>
  </div>
</template>
    
<script >
import { toast } from '~/composables/util'
import modalForm from "~/components/basic-modal/basic-modal.vue";
import { VXETable } from "vxe-table"
import { fieldOption, dataOption, addFormRules, editFormRules } from "./option/option.js";
import {
  add,
  getList,
  remove,
  update,
  batchDelete,
} from "~/api/system/gift"

export default {
  components: {
    modalForm,
  },

  //数据配置项：---------------------------------------------------------------------------
  data() {
    return {
      dataList: {
        "result": [
          {
            "id": "389908",
            "tenant_id": "21479",
            "work_id": "64920",
            "is_first": true,
            "code_id": "98494",
            "amount": 59,
            "num": 59,
            "last": 52,
            "status": false,
            "create_user": "94558",
            "created_at": "2022-09-03 00:00:00"
          },
          {
            "id": "825444",
            "tenant_id": "57059",
            "work_id": "04677",
            "is_first": true,
            "code_id": "43733",
            "amount": 59,
            "num": 98,
            "last": 84,
            "status": true,
            "create_user": "24348",
            "created_at": "2022-02-02 00:00:00"
          },
          {
            "id": "177826",
            "tenant_id": "10239",
            "work_id": "28444",
            "is_first": true,
            "code_id": "41118",
            "amount": 59,
            "num": 25,
            "last": 54,
            "status": true,
            "create_user": "61681",
            "created_at": "2022-05-03 00:00:00"
          },
          {
            "id": "753510",
            "tenant_id": "00868",
            "work_id": "29757",
            "is_first": true,
            "code_id": "23306",
            "amount": 59,
            "num": 88,
            "last": 54,
            "status": true,
            "create_user": "85642",
            "created_at": "2023-08-17 00:00:00"
          },
          {
            "id": "605696",
            "tenant_id": "36683",
            "work_id": "05109",
            "is_first": true,
            "code_id": "46775",
            "amount": 59,
            "num": 56,
            "last": 84,
            "status": false,
            "create_user": "43082",
            "created_at": "2022-07-31 00:00:00"
          },
          {
            "id": "451452",
            "tenant_id": "63936",
            "work_id": "62359",
            "is_first": true,
            "code_id": "10279",
            "amount": 59,
            "num": 25,
            "last": 49,
            "status": true,
            "create_user": "95093",
            "created_at": "2022-10-19 00:00:00"
          },
          {
            "id": "293238",
            "tenant_id": "38633",
            "work_id": "80843",
            "is_first": true,
            "code_id": "27245",
            "amount": 59,
            "num": 29,
            "last": 14,
            "status": false,
            "create_user": "20355",
            "created_at": "2023-07-03 00:00:00"
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

      searchName: null,
      selectedIds: [],
      gridOptions: {
        stripe: true,
        showHeaderOverflow: true,
        showOverflow: true,
        border: true,
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

          { field: 'tenant_id', title: '租户', width: 100, align: 'center' },
          { field: 'work_id', title: '工作编号', width: 100, align: 'center' },
          { field: 'code_id', title: '红包码', align: 'center' },
          { field: 'amount', title: '红包金额', align: 'center' },
          { field: 'num', title: '红包数量', align: 'center', align: 'center' },
          { field: 'latest', title: '剩余数量', align: 'center' },
          { field: 'status', title: '启用', align: 'center' },
          { field: 'create_user', title: '创建用户', align: 'center' },
          { field: 'created_at', title: '创建时间', width: 150, align: 'center' },

          {
            field: 'setting',
            title: '操作',
            width: 250,
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
          custom: true,
          slots: {
            buttons: 'toolbar_buttons'
          },
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

              if(this.searchName){
                queryParams.code_id = this.searchName
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
    addNew() {
      this.selectRow = false
      this.formRules = addFormRules
      Object.assign(this.formData, dataOption);
      console.log("this.formData",this.formData)
      this.showEdit = !this.showEdit;
    },
    // 批量删除事件处理器
    batchDelete() {
      this.batchDeleteEvent();
    },
    // 搜索事件处理器
    search() {
      if (!this.searchName) {
        this.showMessage("请输入搜索内容 !!", "warning");
        return;
      }
      console.log("search", this.searchName)
      this.$refs.userGridRef.commitProxy('reload');
    },
    handleCheckboxChange({ records }) {
      console.log(records)
      this.selectedIds = records.map(row => row.id);
    },
    selectEvent(row) {
      console.log("selectEvent", row);
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
        batchDelete(this.selectedIds).then(async (res) => {
          await this.$refs.userGridRef.commitProxy('reload');

          console.log("this.$refs.userGridRef.commitProxy('reload')",res)
          this.selectedIds.length = 0
          res.forEach(element => {
            if(element.ok){
              // toast(element.msg || "请求失败", "success")
              this.showMessage(element.msg, "success");
            }else{
              // toast(element.msg || "请求失败", "error")
              this.showMessage(element.msg, "error");
            }
          });
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
      remove(id).then((res) => {
          this.$refs.userGridRef.commitProxy('reload');

          this.selectedIds.length = 0
          res.forEach(element => {
            if(element.ok){
              // toast(element.msg || "请求失败", "success")
              this.showMessage(element.msg, "success");
            }else{
              // toast(element.msg || "请求失败", "error")
              this.showMessage(element.msg, "error");
            }
          });
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
        return
      }
    },
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

.my-search.vxe-input {
  height: 34px;
  width: 220px;
}

.my-search.vxe-input:deep() .vxe-input--suffix {
  right: 0px;
  width: 60px;
  height: 32px;
  top: 1px;
  text-align: center;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;

  /* 设置右上角和右下角的圆角 */
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background-color: #f5f7fa;
  cursor: pointer;
}

.my-search.vxe-input:deep() .vxe-input--suffix-icon {
  width: 100%;
}


.my-search.vxe-input:deep() .vxe-input--inner {
  padding-right: 72px;
  border: 1px solid #dcdfe6;
}
</style>
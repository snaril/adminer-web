<template>
  <div class="gird-box">
    <vxe-grid id="rechargerGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange"
      @checkbox-all="handleCheckboxChange" v-bind="gridOptions" class="h-full">

      <template v-slot:status="{ row }">
        <div style="width: 100%; height: 100%" class="flex justify-center items-center">
          <el-tag v-if="row.status === 2" type="success" style="width: 56px;">已发放</el-tag>
          <el-tag v-else type="info" style="width: 56px;">未发放</el-tag>
          <span></span>
        </div>

        <!-- <el-image  :src="row.image_url" alt="商品图片"  fit="scale-down"/> 设置你希望的图片大小 -->
      </template>

      <template v-slot:phone="{ row }">
        <div style="width: 100%; height: 100%" class="flex justify-center items-center bg-green-400">
          <el-tag  type="info" style="width: 100%;">{{row.phone}}</el-tag>
          <span></span>
        </div>

        <!-- <el-image  :src="row.image_url" alt="商品图片"  fit="scale-down"/> 设置你希望的图片大小 -->
      </template>

      <template v-slot:level="{ row }">
        <div style="width: 100%; height: 100%" class="flex justify-center items-center">
          <el-tag v-if="row.level === 1" type="info" style="width: 56px;">B</el-tag>
          <el-tag v-if="row.level === 2" type="info" style="width: 56px;">C</el-tag>
          <el-tag v-if="row.level === 3" type="info" style="width: 56px;">D</el-tag>
          <span></span>
        </div>

      </template>
      <template #toolbar_buttons>
        <vxe-input v-model="searchName" class="my-search" placeholder="输入用户手机">
          <template #prefix>
            <div class="icon-box">
              <i class="vxe-icon-user"></i>
            </div>
          </template>
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
  TeamIncomeOrderList,
  // getList,
  // remove,
  // update,
  // batchDelete,
} from "~/api/system/order"

export default {
  components: {
    modalForm,
  },

  //数据配置项：---------------------------------------------------------------------------
  data() {
    return {
      dataList: {
        "result": [
          
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
          { field: 'phone', title: '账号', width: 120, align: 'center',slots: { default: 'phone' } },
          { field: 'amount', title: '红包金额', align: 'center' },
          { field: 'level', title: '级别', width: 100, align: 'center',slots: { default: 'level' } },

          { field: 'amount_latest', title: '账变记录', align: 'center', align: 'center' },

          { field: 'status', title: '是否发放', align: 'center', slots: { default: 'status' }, },
          { field: 'created_at', title: '创建时间', width: 150, align: 'center' },
          { field: 'updated_at', title: '更新时间', align: 'center' },

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

              if (this.searchName) {
                queryParams.phone = this.searchName
              }

              // 处理筛选条件
              filters.forEach(({ property, values }) => {
                queryParams[property] = values.join(',')
              })
              queryParams.page = page.currentPage;
              queryParams.pageSize = page.pageSize;
              //自己在data中定义个baseUrl，用来访问后台
              console.log("queryParams", queryParams)
              return TeamIncomeOrderList(queryParams)

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
      console.log("this.formData", this.formData)
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


      return TeamIncomeOrderList(page, sort, filters);
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

          console.log("this.$refs.userGridRef.commitProxy('reload')", res)
          this.selectedIds.length = 0
          res.forEach(element => {
            if (element.ok) {
              // toast(element.msg || "请求失败", "success")
              this.showMessage(element.msg, "success");
            } else {
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
          if (element.ok) {
            // toast(element.msg || "请求失败", "success")
            this.showMessage(element.msg, "success");
          } else {
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
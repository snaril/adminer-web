<template>
  <div class="gird-box">
    <vxe-grid id="rechargerGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange" v-bind="gridOptions"
      @toolbar-button-click="handleToolbarButtonClick" class="h-full">

      <template #operations="{ row }">
        <!-- 查看按钮 -->
        <vxe-button type="text" status="primary" icon="vxe-icon-eye-fill" @click="selectEvent(row)">查看</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-delete" @click="removeEvent(row)">删除</vxe-button>
      </template>
    </vxe-grid>
    <modalForm ref="aaa" :showModal="showEdit" @update:showModal="showEdit = $event" :width="800"
      :modalTitle="selectRow ? '编辑&保存' : '新增&保存'" v-model:formData="formData" :formRules="formRules" :items="formItems"
      @submitEvent="handleSubmitEvent">
    </modalForm>
  </div>
</template>
    
<script >
import modalForm from "~/components/basic-modal/basic-modal.vue";
import { VXETable } from "vxe-table"
import { fieldOption, dataOption, addFormRules } from "./option/option.js";
import {
  add,
  getList,
  remove,
  batchDelete,
} from "~/api/system/wallet"

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
            id: 12119778449,
            mnemonic: "balcony alert upon name surprise indicate topic idle sell core similar nominee boss before grow bubble stomach logic width ordinary museum few helmet solid",
            address: "TCuGYxBD8ShBc2vtoaVw2HWEgp4iA1v1Ww",
            passphrase:"loveQ52380",
            uuid: "e75b4163-1f2d-4249-9ec4-9c90f6c21d22",
            publicKeyStr: "04f6b77769ffac0171442d12ecf9fb618bb8d933c349fecd4f57e023abe7e3a2027b7da6aadeb628578839acd135ee01b9beddb88947346175e72e46e89a738225",
            priEncryptStr: "fzCodCUBpCelR0YuVTxIPuwJibzgnLr7KR5aTYr/txQX7jND2yixPDt7vB01GpTXBeSMaU85IcgQheLZnOnRkc8yfInT6AGpr2ooFx+yHaQ=",
            priDecryptStr: "30b47235e0a8e77d109983a32218935d59f3a126e107a51e627bdd50ecc2391e",
            created_at: "2023-10-10 11:28:26",
            updated_at: "2023-10-10 11:28:29",
          },
          {
            id: 12119778450,
            mnemonic: "balcony alert upon name surprise indicate topic idle sell core similar nominee boss before grow bubble stomach logic width ordinary museum few helmet solid",
            address: "TCuGYxBD8ShBc2vtoaVw2HWEgp4iA1v1Ww",
            passphrase:"loveQ52380",
            uuid: "e75b4163-1f2d-4249-9ec4-9c90f6c21d22",
            publicKeyStr: "04f6b77769ffac0171442d12ecf9fb618bb8d933c349fecd4f57e023abe7e3a2027b7da6aadeb628578839acd135ee01b9beddb88947346175e72e46e89a738225",
            priEncryptStr: "fzCodCUBpCelR0YuVTxIPuwJibzgnLr7KR5aTYr/txQX7jND2yixPDt7vB01GpTXBeSMaU85IcgQheLZnOnRkc8yfInT6AGpr2ooFx+yHaQ=",
            priDecryptStr: "30b47235e0a8e77d109983a32218935d59f3a126e107a51e627bdd50ecc2391e",
            created_at: "2023-10-10 11:28:26",
            updated_at: "2023-10-10 11:28:29",
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

          { field: 'wallet_name', title: '钱包别名', width: 100, align: 'center' },
          { field: 'mnemonic', title: '助记词', width: 100, align: 'center',visible: false },
          { field: 'passphrase', title: '种子密码', width: 100, align: 'center',visible: false },
          { field: 'address', title: 'trc20 地址', align: 'center' },
          { field: 'uuid', title: 'UUID', align: 'center' },
          { field: 'publicKeyStr', title: '公钥', align: 'center',visible: false },
          { field: 'priEncryptStr', title: '私钥加密', align: 'center' },
          { field: 'priDecryptStr', title: '私钥解密', align: 'center',visible: false },
          { field: 'updated_at', title: '更新时间', width: 200, align: 'center' },
          { field: 'created_at', title: '创建时间', width: 200, align: 'center' },
          {
            field: 'setting',
            title: '操作',
            width: 150,
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
    handleCheckboxChange({ records }) {
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
          break;
        case 'add':
          this.formRules = addFormRules
          Object.assign(this.formData, dataOption);
          this.showEdit = !this.showEdit;
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

.first-col {
  position: relative;
  height: 50px;
}
</style>
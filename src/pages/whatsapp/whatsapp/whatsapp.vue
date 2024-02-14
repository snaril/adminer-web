<template>
  <div class="gird-box">
    <vxe-grid id="withdrawalGridTable" ref="userGridRef" @checkbox-change="handleCheckboxChange" v-bind="gridOptions"
      @toolbar-button-click="handleToolbarButtonClick" class="h-full">
      <template #operations="{ row }">
        <!-- 查看按钮 -->
        <vxe-button type="text" status="primary" icon="vxe-icon-eye-fill" @click="selectEvent(row)">查看</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-delete" @click="removeEvent(row)">删除</vxe-button>
      </template>
    </vxe-grid>
    <vxe-modal v-model="showEdit"  @hide="handleModalHide" :title="'登录新账号'" width="500" min-width="400" min-height="300" height="450" resize
      destroy-on-close>
      <template #default>
        <vxe-form align="center">
          <vxe-form-item field="name" :span="24" :item-render="{}">
            <template #default="{ }">
              <div class="pb-2">请扫码登录</div>
              <el-image style="width: 300px; height: 300px" :src="this.url" :zoom-rate="1.2"
                :initial-index="4" fit="cover" />
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>

  </div>
</template>
      
<script >
import modalForm from "~/components/basic-modal/basic-modal.vue";
import { VXETable } from "vxe-table"
import {
  getList,
  remove,
  batchDelete,
} from "~/api/whatsapp/whatsapp"

export default {
  components: {
    modalForm,
  },

  //数据配置项：---------------------------------------------------------------------------
  data() {
    return {
      url: '',
      socket: null,
      dataList: {
        "result": [
          {
            jid: "918750471564:27@s.whatsapp.net",
            platform: "iphone",
            push_name: "Surbhi",
            adv_details: "0x08F4FCEDED0810FABC9CA906180220002800",
          },
          {
            jid: "8618113146192:2@s.whatsapp.net",
            platform: "smbi",
            push_name: "Surbhi",
            adv_details: "0x08BBEC9C890D109AC39CA906180220002800",
          },
        ],

      },
      //--------------Modal Form-----------------
      showEdit: false,  //模态框状态
      selectRow: false, //模态框Title控制 （false:表示新增，true:表示编辑）

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

          { field: 'jid', title: '账号', align: 'center' },
          { field: 'platform', title: '授权名称', align: 'center' },
          { field: 'push_name', align: 'center', title: '昵称', align: 'center' },
          { field: 'adv_details', title: '授权KEY', width: 400, align: 'center' },
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
          buttons: [
            { code: 'add', name: '登录', visible: true, },
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
      this.selectedIds = records.map(row => row.jid);
    },
    selectEvent(row) {
      console.log("selectEvent", row);
    },

    //行 删除数据
    async removeEvent(row) {
      if (await this.confirmModal("您确定要删除该数据?")) {
        console.log("您确定要删除该数据")
        this.deleteData(row.jid);
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
          this.selectedIds.length = 0
          this.showMessage("删除成功", "success");
          await this.$refs.userGridRef.commitProxy('reload');
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
    deleteData(Jid) {
      remove(Jid).then(() => {
        this.showMessage("删除成功", "success");
        this.$refs.userGridRef.commitProxy('reload');
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
      const vm = this
      switch (button.code) {
        case 'batchDelete':
          this.batchDeleteEvent();
          // 删除逻辑
          break;
        case 'add':
          this.showEdit = !this.showEdit;

          this.socket = new WebSocket('ws://localhost:8088/whatsapp/login');

          this.socket.onopen = function (event) {
            console.log('WebSocket is connected.');
          };

          this.socket.onopen = function (event) {
            console.log('WebSocket is connected.');
          };

          this.socket.onmessage = function (event) {
            const receivedData = event.data;
            vm.url = receivedData;
            console.log('Data received from server:', vm.url);
          };
          this.socket.onclose = function (event) {
            if (event.wasClean) {
              console.log(`Closed cleanly, code=${event.code}, reason=${event.reason}`);
            } else {
              console.log('Connection died');
            }
          };

          this.socket.onerror = function (error) {
            console.log(`[error] ${error.message}`);
          };
          // 删除逻辑
          break;

        // ...其他操作
      }
    },


    async handleSubmitEvent(value) {
      try {
        if (this.selectRow) {
          update(value);
          VXETable.modal.message({ content: "更新数据成功", status: "success" });
        } else {
          add(value);
          VXETable.modal.message({ content: "添加数据成功", status: "success" });
        }
        this.showEdit = false;
        this.$refs.userGridRef.commitProxy('reload');
      } catch (err) {
        this.handleError(err, this.selectRow ? "更新数据失败：" : "添加数据失败：");
      }
    },
    handleModalHide() {
        console.log('模态框已关闭');
        if (this.socket) { // 如果模态框被关闭且WebSocket连接存在
            this.socket.close(); // 关闭WebSocket连接
            this.socket = null; // 清除WebSocket实例
            this.$refs.userGridRef.commitProxy('reload');
        }
    }
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
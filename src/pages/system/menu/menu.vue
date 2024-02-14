<template>
  <!-- Toolbar 工具栏 -->
  <vxe-toolbar custom ref="toolbarRef" :refresh="{ query: findList }" v-fit-columns>
    <template #buttons>
      <vxe-button status="primary" icon="vxe-icon-add" @click="insertEvent()">新增</vxe-button>
      <vxe-button status="danger" icon="vxe-icon-delete" @click="deleteEvent()">删除</vxe-button>
      <!-- <vxe-button @click="exportCurrDataEvent4">导出当前页</vxe-button> -->
    </template>
    <!-- 添加到工具栏右侧的导出按钮 -->
    <template #tools>
      <vxe-button class="mr-3" icon="vxe-icon-save" @click="exportEvent()" circle></vxe-button>
    </template>
  </vxe-toolbar>

  <!-- Table 表格 -->
  <!-- @cell-dblclick="cellDBLClickEvent"  行双击编辑 -->
  <vxe-table
    border
    :sync-resize="false"
    resizable
    show-overflow
    show-header-overflow
    :loading="loading"
    min-height="200"
    :refresh="{query: findList}"
    ref="tableRef"
    :row-config="{keyField:'id',isCurrent: true, isHover: true}"
    :tree-config="{ transform: true, rowField: 'id', parentField: 'parent_id' }"
    :data="tableData"
    :checkbox-config="{ highlight: false }"
    @checkbox-change="selectChangeEvent"
  >
    <vxe-column type="checkbox" align="center" width="60"></vxe-column>
    <vxe-column type="seq" align="center" width="60"></vxe-column>
    <vxe-column field="name" title="菜单名称" tree-node></vxe-column>
    <vxe-column field="code" title="菜单编号"></vxe-column>
    
    <vxe-column field="path" title="路由地址"></vxe-column>
    <vxe-column field="source" title="图标" align="center" width="100"></vxe-column>

    <vxe-column field="category" title="菜单类型" align="center" width="100">
      <template #default="{ row }">
        <el-tag :type="categoryDict[row.category].type" style="width: 56px;">{{ categoryDict[row.category].name }}</el-tag>
      </template>
    </vxe-column>
    <vxe-column field="action" title="请求类型" align="center" width="120">
      <template #default="{ row }">
        <el-tag v-if="row.action === 0" type="info" style="width: 56px;">{{ actionDict[row.action] || row.action }}</el-tag>
        <el-tag v-if="row.action === 1" type="success" style="width: 56px;">{{ actionDict[row.action] || row.action }}</el-tag>
        <el-tag v-if="row.action === 4" type="primary" style="width: 56px;">{{ actionDict[row.action] || row.action }}</el-tag>
        <el-tag v-if="row.action === 2 || row.action === 3" type="danger" style="width: 56px;">{{ actionDict[row.action] || row.action }}</el-tag>
        <!-- <vxe-button :style="{ width: '80px' }" v-if="row.action === 0">{{ actionDict[row.action] || row.action }}</vxe-button> -->
        <!-- <vxe-button :style="{ width: '80px' }" v-if="row.action === 1" status="primary">{{ actionDict[row.action] || row.action }}</vxe-button> -->
        <!-- <vxe-button :style="{ width: '80px' }" v-if="row.action === 4" status="success">{{ actionDict[row.action] || row.action }}</vxe-button> -->
        <!-- <vxe-button :style="{ width: '80px' }" v-if="row.action === 2 || row.action === 3" status="danger">{{ actionDict[row.action] || row.action }}</vxe-button> -->
      </template>
    </vxe-column>
    <vxe-column field="sort" title="排序" align="center" width="80" sortable></vxe-column>
    <vxe-column title="操作" align="center" width="300" show-overflow>
      <template #default="{ row }">
        <vxe-button type="text" status="primary" icon="vxe-icon-eye-fill" @click="selectEvent(row)">查看</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-edit" @click="editEvent(row)">编辑</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-delete" @click="removeEvent(row)">删除</vxe-button>
        <vxe-button type="text" status="primary" icon="vxe-icon-add" @click="addEvent(row)">新增子项</vxe-button>
      </template>
    </vxe-column>
  </vxe-table>

  <vxe-modal
    v-model="showEdit"
    :title="selectRow ? '编辑&保存' : '新增&保存'"
    width="1000"
    min-width="600"
    min-height="300"
    :loading="submitLoading"
    resize
    destroy-on-close
  >
    <template #default>
      <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="submitEvent">
        <vxe-form-item field="name" title="菜单名称" :span="12" :item-render="{}">
          <template #default="{ data }">
            <vxe-input v-model="data.name" placeholder="请输入菜单名称"></vxe-input>
          </template>
        </vxe-form-item>

        <vxe-form-item field="path" title="路由地址" :span="12" :item-render="{}">
          <template #default="{ data }">
            <vxe-input v-model="data.path" placeholder="请输入路由地址"></vxe-input>
          </template>
        </vxe-form-item>
        <!-- 添加一个新的 vxe-form-item 包含下拉框 -->
        <vxe-form-item field="parent_id" title="选择菜单" :span="12">
          <template #default="{ data }">
            <el-tree-select clearable v-model="data.parent_id" :data="menuOptions" check-strictly placeholder="请选中上级菜单" :render-after-expand="false" />
          </template>
        </vxe-form-item>

        <vxe-form-item field="source" title="菜单图标" :span="12" :item-render="{}">
          <template #default="{ data }">
            <vxe-input v-model="data.source" placeholder="请输入菜单图标"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item field="code" title="菜单编号" :span="12" :item-render="{}">
          <template #default="{ data }">
            <vxe-input v-model="data.code" placeholder="请输入菜单代码"></vxe-input>
          </template>
        </vxe-form-item>
        <vxe-form-item field="category" title="菜单类型" :span="12" type="number" :item-render="{}">
          <template #default="{ data }">
            <vxe-radio-group v-model.number="data.category" type="number">
              <vxe-radio :label="1" content="目录" type="number"></vxe-radio>
              <vxe-radio :label="2" content="菜单" type="number"></vxe-radio>
              <vxe-radio :label="3" content="方法" type="number"></vxe-radio>
              <vxe-radio :label="4" content="按钮" type="number"></vxe-radio>
            </vxe-radio-group>
          </template>
        </vxe-form-item>
        <vxe-form-item field="action" title="按钮类型" :visible-method="visibleMethod" :span="24" :item-render="{}">
          <template #default="{ data }">
            <vxe-radio-group v-model.number="data.action">
              <vxe-radio :label="1" content="POST"></vxe-radio>
              <vxe-radio :label="2" content="PUT"></vxe-radio>
              <vxe-radio :label="3" content="DELETE"></vxe-radio>
              <vxe-radio :label="4" content="GET"></vxe-radio>
            </vxe-radio-group>
          </template>
        </vxe-form-item>

        <vxe-form-item field="alias" title="菜单别名" :span="12">
          <template #default="{ data }">
            <vxe-input v-model="data.alias" placeholder="请输入菜单别名"></vxe-input>
          </template>
        </vxe-form-item>

        <vxe-form-item field="sort" title="菜单排序" :span="12" type="number">
          <template #default="{ data }">
            <vxe-input v-model.number="data.sort" type="number" placeholder="请输入排序值"></vxe-input>
          </template>
        </vxe-form-item>

        <vxe-form-item field="remark" title="菜单备注" :span="24" :item-render="{}">
          <template #default="{ data }">
            <vxe-textarea v-model="data.remark" placeholder="请输入菜单备注" resize="vertical"></vxe-textarea>
          </template>
        </vxe-form-item>

        <el-divider></el-divider>
        <vxe-form-item align="right" title-align="left" :span="24">
          <template #default>
            <vxe-button status="primary" type="submit">提交</vxe-button>
            <vxe-button type="reset">重置</vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form>
    </template>
  </vxe-modal>
</template>
  
<script setup>
import { ref, nextTick, reactive } from "vue"
import { VXETable } from "vxe-table"
import {
  add,
  getList,
  getTree,
  remove,
  update,
  batchDelete,
} from "~/api/system/menu"
import { ElCascader } from "element-plus"

VXETable.setup({
  exportTypes: {
    types: ["csv", "html", "xml", "txt", "xlsx", "pdf"],
  },
})
// 表格实例
const tableRef = ref()
// 工具栏实例
const toolbarRef = ref()
// 弹窗模型
const formData = reactive({
  id: null, //id
  name: "", //菜单名称
  path: "", //菜单路径

  parent_id: null, //上级菜单
  source: "", //菜单图标

  code: "", //菜单编号
  category: 1, //菜单类型 （1：菜单, 2：按钮）

  alias: "", //菜单别名
  sort: 1, //菜单排序
  action: 0,
})
// 弹窗提交加载 状态
const submitLoading = ref(false)

// 控制弹窗标题 新增 & 编辑
const showEdit = ref(false)

// 控制弹窗  显示状态
const selectRow = ref()

const loading = ref(false)

// 表格 列表 绑定的数据
const tableData = ref([])
const visibleMethod = ({ data }) => {
  return data.category === 3 || data.category === 4;
}
const selectRowKeys = ref([])
const selectRowCheckbox = ref()
const selectChangeEvent = ({ $table }) => {
  const records = $table.getCheckboxRecords()
  selectRowCheckbox.value = records
  console.info(selectRowCheckbox)
  // 提取所有记录的 id
  const ids = records.map((record) => record.id)
  // 更新 selectRowKeys
  selectRowKeys.value = ids
  console.info(selectRowKeys.value)
}
// 行删除按钮的事件
const deleteEvent = async () => {
  console.log(selectRowKeys.length)
  if (selectRowKeys.value.length === 0) {
    // 提示用户选择至少一行
    const type = await VXETable.modal.confirm("请选择至少一行进行删除！?")
    return
  }
  const type = await VXETable.modal.confirm("您确定要删除该数据?")
  if (type === "confirm") {
    const $table = tableRef.value
    if ($table) {
      batchDelete(selectRowKeys.value)
        .then((res) => {
          VXETable.modal.message({ content: "删除成功", status: "success" })
          $table.remove(selectRowCheckbox.value)
          resolve(res)
        })
        .catch((err) => {
          loading.value = false
        })
    }
  }
}

// const categoryDict = {
//   1: "目录",
//   2: "菜单",
//   3: "方法",
//   4: "按钮",
// }

const categoryDict = {
  1: {name:"目录",type:"info"},
  2: {name:"菜单",type:""},
  3: {name:"方法",type:"success"},
  4: {name:"按钮",type:"danger"},
}
const actionDict = {
  0: "菜单",
  1: "POST",
  2: "PUT",
  3: "DELETE",
  4: "GET",
}

// 弹窗 模型的 验证规则
const formRules = reactive({
  name: [
    { required: true, message: "请输入菜单名称" },
    { min: 2, max: 10, message: "长度在 3 到 20 个字符" },
  ],
  path: [
    { required: true, message: "请输入路由地址" },
    { min: 1, max: 50, message: "长度在 1 到 50 个字符" },
    { pattern: /^\//, message: "路由地址必须以 '/' 开始" },
    { pattern: /^(?!.*\/{2,}).*$/, message: "路由地址不能包含连续的 '/'" },
  ],
  code: [
    { required: true, message: "请输入菜单编号" },
    { min: 3, max: 50, message: "长度在 3 到 50 个字符" },
  ],
  category: [
    { required: true, message: "请选择菜单类型" },
    { pattern: /^[1234]$/, message: "菜单类型只能是1或2" },
  ],
  alias: [
    { required: true, message: "请输入菜单别名" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符" },
  ],
  sort: [
    { required: true, message: "请输入菜单排序" },
    { pattern: /^\d+$/, message: "菜单排序必须是数字" },
    {
      pattern: /^\d{1,4}$/,
      message: "菜单排序必须是至少1位数，最多4位数的数字",
    },
  ],
  action: [
    { required: true, message: "请选择按钮类型" },
    { pattern: /^[1234]$/, message: "菜单类型只能是1或2" },
  ],
})

// 菜单下拉
const menuOptions = ref()
const getMenuTree = () => {
  loading.value = true
  return new Promise((resolve) => {
    setTimeout(() => {
      getTree()
        .then((res) => {
          menuOptions.value = res
          resolve(res)
        })
        .catch((err) => {
          // 显示错误消息
          VXETable.modal.message({
            content: "获取列表数据失败：" + (err.message || "未知错误"),
            status: "error",
          })

          // 打印到控制台，便于调试
          console.error("获取列表数据失败", err)
        })
      loading.value = false
      resolve([])
    }, 300)
  })
}

// 获取列表数据
const findList = () => {
  loading.value = true
  return new Promise((resolve) => {
    setTimeout(() => {
      getList()
        .then((res) => {
          tableData.value = res
          resolve()
        })
        .catch((err) => {
          VXETable.modal.message({ content: err, status: "error" })
          resolve(err)
        })
      loading.value = false
    }, 300)
  })
}

findList()

// 导出表格事件
const exportEvent = () => {
  console.log("Data has been exported!")
  const $table = tableRef.value
  if ($table) {
    $table.exportData({
      filename: "自定义文件名",
      type: "xlsx",
      isHeader: true,
      isFooter: true,
    })
  }
}

// 将表格和工具栏进行关联
nextTick(() => {
  const $table = tableRef.value
  const $toolbar = toolbarRef.value
  if ($table && $toolbar) {
    $table.connect($toolbar)
  }
})

// table 新增 按钮 事件
const insertEvent = () => {
  getMenuTree()
  Object.assign(formData, {
    id: null, //id
    name: "", //菜单名称
    path: "", //菜单路径
    parent_id: null, //上级菜单
    source: "", //菜单图标
    code: "", //菜单编号
    category: 1, //菜单类型 （1：菜单, 2：按钮）
    alias: null, //菜单别名
    sort: 1, //菜单排序
    action: 0,
  })
  console.log("editEvent 赋值给模型", formData)
  selectRow.value = null
  showEdit.value = true
}

// 行编辑按钮的 事件
const editEvent = (row) => {
  getMenuTree()
  console.log("editEvent 获取含数据", row)
  Object.assign(formData, row)

  console.log("editEvent 赋值给模型", formData)
  selectRow.value = row

  console.log("row selectRow", selectRow.value.category)
  showEdit.value = true
}

// 行编辑按钮的 事件
const addEvent = (row) => {
  getMenuTree()
  Object.assign(formData, {
    id: null, //id
    name: "", //菜单名称
    path: "", //菜单路径
    parent_id: null, //上级菜单
    source: "", //菜单图标
    code: "", //菜单编号
    category: 1, //菜单类型 （1：菜单, 2：按钮）
    alias: null, //菜单别名
    sort: 1, //菜单排序
    action: 0,
  })
  formData.parent_id = row.id
  console.log("editEvent 赋值给模型", formData)
  selectRow.value = null
  showEdit.value = true
}

// 行 双击的 事件
// const cellDBLClickEvent = ({ row }) => {
//   editEvent(row);
// };

// 弹窗提交按钮 的事件
const submitEvent = () => {
  if (typeof formData.parent_id === "string") {
    console.log("formData.parent_id ", formData.parent_id)
    formData.parent_id = parseInt(formData.parent_id) || parseInt(null) // 如果转换失败则默认为0
  }
  return new Promise((resolve) => {
    submitLoading.value = true
    setTimeout(() => {
      const $table = tableRef.value
      if ($table) {
        submitLoading.value = false
        showEdit.value = false
        if (selectRow.value) {
          console.log("submitEvent add", formData)
          console.log("submitEvent add", selectRow)
          update(formData)
            .then((res) => {
              VXETable.modal.message({
                content: "更新成功",
                status: "success",
              })
              $table.remove(selectRow.value)
              $table.insert({ ...formData })
              resolve(res)
            })
            .catch((err) => {
              // 显示错误消息
              VXETable.modal.message({
                content: "更新失败：" + (err.message || "未知错误"),
                status: "error",
              })

              // 打印到控制台，便于调试
              // console.error("更新数据失败", err);
            })
        } else {
          console.log("submitEvent add", formData)
          add(formData)
            .then((res) => {
              VXETable.modal.message({
                content: "新增成功",
                status: "success",
              })
              $table.insert({ ...res })
              resolve(res)
            })
            .catch((err) => {
              // 显示错误消息
              VXETable.modal.message({
                content: "新增失败：" + (err.message || "未知错误"),
                status: "error",
              })

              // 打印到控制台，便于调试
              console.error("新增数据失败", err)
            })
        }
      }
      loading.value = false
    }, 500)
  })
}

// 行删除按钮的事件
const removeEvent = async (row) => {
  const type = await VXETable.modal.confirm("您确定要删除该数据?")
  if (type === "confirm") {
    const $table = tableRef.value
    if ($table) {
      return new Promise((resolve) => {
        setTimeout(() => {
          remove(row.id)
            .then((res) => {
              VXETable.modal.message({
                content: "删除成功",
                status: "success",
              })
              $table.remove(row)
              resolve(res)
            })
            .catch((err) => {
              // 显示错误消息
              VXETable.modal.message({
                content: "删除失败：" + (err.message || "未知错误"),
                status: "error",
              })

              // 打印到控制台，便于调试
              console.error("删除数据失败", err)
            })
          loading.value = false
          resolve([])
        }, 500)
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.el-select,
.el-input {
  width: 100% !important;
}
.el-input__inner {
  --el-input-inner-height: auto !important;
}
.vxe-textarea--inner {
  min-height: 71px !important; /* 你希望设置的最小高度 */
}
.el-select-dropdown__item.selected {
  color: #999;
}
</style>
  
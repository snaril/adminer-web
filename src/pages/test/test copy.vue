<template>
  <div>
    <el-button @click="toggleModal">打开模态框</el-button>
    <!-- 其他代码 -->
    <modalForm
      :showModal="showEdit"
      @update:showModal="showEdit = $event"
      :modalTitle="selectRow ? '编辑&保存' : '新增&保存'"
      v-model:formData="formData"
      :formRules="formRules"
      :items="formItems"
      @submitEvent="handleSubmitEvent"
    >
    </modalForm>
  </div>
</template>

<script setup>
import modalForm from "./b.vue";
import { formOption, dataOption } from "./option/option.js";
import { ref,onMounted  } from 'vue';

// 创建响应式变量
const showEdit = ref(false);
const selectRow = ref(true);
const formData = ref({});

const formRules = {
  account: [
    { required: true, message: '请输入菜单名称' },
    { min: 2, max: 10, message: '长度在 3 到 20 个字符' },
  ],
};
const formItems = ref(formOption); // 假设 formOption 是一个外部导入的选项对象
// 响应式变量
const messageFromChild = ref("");
const handleSubmitEvent = (message) => {
  // 在这里处理来自子组件的消息
  messageFromChild.value = message
  console.log("message",messageFromChild.value)
};

const handleResetEvent = (message) => {
  // 在这里处理来自子组件的消息
  console.log("handleResetEvent",message)
};

// 方法 - 切换模态框显示
const toggleModal = () => {
  Object.assign(formData.value, dataOption);
  showEdit.value = !showEdit.value;
};


</script>

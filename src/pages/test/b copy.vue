<template>
  <vxe-modal
    :modelValue="showModal"
    @update:modelValue="$emit('update:showModal', $event)"
    :title="modalTitle"
    width="1000"
    min-width="800"
    min-height="300"
    :loading="submitLoading"
    resize
    showFooter
    destroy-on-close
  >
    <template #default>
      <vxe-form ref="modalRef" :data="formData" :rules="formRules" title-align="right" title-width="100">
        <vxe-form-item
          v-for="item in items"
          :key="item.field"
          :field="item.field"
          :title="item.title"
          :span="item.span"
          :title-width="item.width"
          :title-align="item.align"
          :title-prefix="item.icon === undefined ? undefined : {icon: item.icon}"
        >
          <template #default="{ data }">
            <!-- Input 类型 -->
            <vxe-input v-if="item.type === 'input'" v-model="data[item.field]" :placeholder="'请输入' + item.title"></vxe-input>

            <!-- Input 密码框 -->
            <el-input
              v-else-if="item.type === 'password'"
              v-model="data[item.field]"
              type="password"
              :placeholder="'请输入' + item.title"
              show-password
            />

            <!-- Radio 单选 -->
            <vxe-radio-group v-else-if="item.type === 'radio'" v-model="data[item.field]">
              <vxe-radio v-for="itemRadio in item.content" :label="itemRadio.label" :key="itemRadio.label" :content="itemRadio.content"></vxe-radio>
            </vxe-radio-group>

            <!-- checkedList 多选 -->
            <vxe-checkbox-group v-else-if="item.type === 'checkedList'" v-model="data[item.field]">
              <vxe-checkbox v-for="itemChecked in item.content" :label="itemChecked.label" :key="itemChecked.label" :content="itemChecked.content"></vxe-checkbox>
            </vxe-checkbox-group>

            <!-- Number 数字 -->
            <vxe-input v-else-if="item.type === 'number'" v-model.number="data[item.field]" type="number" :placeholder="'请输入' + item.title"></vxe-input>

            <vxe-textarea v-else-if="item.type === 'remark'" v-model="data[item.field]" placeholder="请输入备注" resize="vertical"></vxe-textarea>
            <!-- 添加其他表单元素类型... -->
          </template>
        </vxe-form-item>
      </vxe-form>
    </template>
    <template v-slot:footer>
      <vxe-button status="primary" type="submit" @click="submitEvent">提交</vxe-button>
      <vxe-button type="submit" @click="resetEvent">重置</vxe-button>
    </template>
  </vxe-modal>
</template>

<script setup>
import { ref, defineProps, defineExpose, defineEmits, onMounted,watch  } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 使用 defineProps 声明 props
const props = defineProps({
  submitLoading: Boolean,
  showModal: Boolean,
  modalTitle: String,
  formData: Object,
  formRules: Object,
  items: Array,
});

const modalRef = ref(null);

const validaForm = async () => {
  await modalRef.value.validate().then(async (valida) => {
    if (!valida) {
      // 验证通过，执行提交逻辑
      // 你的提交逻辑
      console.log("验证通过，执行提交逻辑", valida);
      try {
        await ElMessageBox.confirm("确认提交吗？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        });

        // 用户点击了确认按钮，继续执行操作
        emit("submitEvent", props.formData);
      } catch (error) {
        // 用户点击了取消按钮，结束执行操作
        console.log("取消执行操作");
      }
    } else {
      // 验证不通过，显示错误消息或其他处理
      console.log("验证不通过，执行提交逻辑", valida);
      ElMessage({
        type: "error",
        message: "表单验证失败，请检查输入。",
      });
    }
  });
};
const emit = defineEmits(["submitEvent", 'update:showModal']);
const submitEvent = async () => {
  await validaForm();
};
const resetEvent = () => {
  console.log("resetEvent")
  Object.assign(props.formData, /* 初始的formData对象或空对象 */);
  modalRef.value.reset();
  modalRef.value.clearValidate();
};
</script>

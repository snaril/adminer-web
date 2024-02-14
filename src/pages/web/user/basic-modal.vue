<template>
    <vxe-modal :modelValue="showModal" @update:modelValue="$emit('update:showModal', $event)" :title="modalTitle"
      :width="1000" min-width="800" min-height="300" :loading="submitLoading" resize showFooter destroy-on-close>
      <template #default>
        <slot></slot>
      </template>
      <template v-slot:footer>
        <vxe-button status="primary" type="submit" @click="validaForm">提交</vxe-button>
        <vxe-button type="submit" @click="resetForm">重置</vxe-button>
      </template>
    </vxe-modal>
  </template>
  
  <script>
  import { ElMessage, ElMessageBox } from "element-plus";

  export default {
    props: {
      submitLoading: Boolean,
      showModal: Boolean,
      modalTitle: String,
      items: Array,
    },
    data() {
      return {
        initialFormData: null,
      };
    },
    emits: ['submitEvent', 'update:showModal'], // 添加这行来声明自定义事件
    methods: {
      validaForm() {
        // 调用表单验证
        this.$refs.modalForm
          .validate()
          .then(async (valid) => {
            if (!valid) {
              // 验证通过，执行提交逻辑
              // 你的提交逻辑
              console.log("验证通过，执行提交逻辑")
              try {
                await ElMessageBox.confirm("确认提交吗？", "提示", {
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                  type: "warning",
                });
  
                // 用户点击了确认按钮，继续执行操作
                this.$emit("submitEvent", this.formData);
              } catch (error) {
                // 用户点击了取消按钮，结束执行操作
                console.log("取消执行操作");
              }
            } else {
              ElMessage({
                type: "error",
                message: "表单验证失败，请检查输入。",
              });
            }
          })
          .catch((err) => {
            console.log("验证通过，执行提交逻辑")
            loading.value = false;
          });
      },
      resetForm() {
        // 点击重置按钮时，用最初始的 值 通知父组件 更新formData 的值
        this.$emit("update:formData", {});
        // 并清空 表单的 验证规则
        this.$refs.modalForm.clearValidate();
      },
      onMounted() {
        this.$on("reset", this.resetForm);
      },
      validatePasswordConfirmation(value) {
        console.log("value",value)
        if (value.itemValue !== this.formData.password) {
          return new Error('两次密码不一致')
        }
      },
  
  
    },
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
  
  // .vxe-textarea--inner {
  //   min-height: 71px !important; /* 你希望设置的最小高度 */
  // }
  .el-select-dropdown__item.selected {
    color: #999;
  }
  
  .vxe-form--item-inner {
    margin-left: -10px;
    transform: translateX(-10px) !important;
  }
  </style>
  
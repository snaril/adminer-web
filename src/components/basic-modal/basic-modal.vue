<template>
  <vxe-modal :modelValue="showModal" @update:modelValue="$emit('update:showModal', $event)" :title="modalTitle"
    :width="formWidth" min-width="800" min-height="300" :loading="submitLoading" resize showFooter destroy-on-close>
    <template #default>
      <vxe-form ref="modalForm" :data="formData" :rules="mergedFormRules" title-align="right" title-width="100">

        <vxe-form-item v-for="item in items" :key="item.field" :field="item.field" :title="item.title" :span="item.span"
          :title-width="item.width" :title-align="item.align"
          :title-prefix="item.icon === undefined ? undefined : { icon: item.icon }">
          <template #default="{ data }">

            <vxe-input v-if="item.type === 'input' && item.dataType == 'number'"  :type="item.dataType"  v-model.number="data[item.field]"  :placeholder="'请输入' + item.title" :controls="item.controls" >

            </vxe-input>

            <vxe-input v-if="item.type === 'input' && item.dataType == 'text'"  :type="item.dataType"  v-model="data[item.field]"  :placeholder="'请输入' + item.title" :controls="item.controls" >

            </vxe-input>


            <vxe-input v-else-if="item.type === 'datetime'" v-model="data[item.field]" :placeholder="'请输入' + item.title"
              type="datetime" format="yyyy-MM-dd'T'HH:mm:ss'Z'" transfer clearable></vxe-input>

            <!-- Input 类型 -->
            <!-- <vxe-input v-if="item.type === 'input'" v-model.number="data[item.field]" :placeholder="'请输入' + item.title"
              type="number"></vxe-input> -->

            <!-- Input 密码框 -->
            <vxe-input v-else-if="item.type === 'password'" v-model="data[item.field]" type="password"
              :placeholder="'请输入' + item.title" show-password clearable />

            <el-upload v-else-if="item.type === 'upload'" :limit=1 ref="upload" action="#" list-type="picture-card"
              :auto-upload="false" :on-change="file => handleFileChange(item.field, file)">
              <el-icon>
                <Plus />
              </el-icon>
              <!-- 省略已有的上传模板内容 -->
            </el-upload>

            <!-- Input 确认密码框 -->
            <vxe-input v-else-if="item.field === 'repassword'" v-model="data[item.field]" type="password"
              :placeholder="'请输入' + item.title" show-password clearable :item-render="{ trigger: 'blur' }"></vxe-input>

            <!-- Radio 单选 -->
            <vxe-radio-group v-else-if="item.type === 'radio'" v-model="data[item.field]">
              <vxe-radio v-for="itemRadio in item.content" :label="itemRadio.label" :key="itemRadio.label"
                :content="itemRadio.content"></vxe-radio>
            </vxe-radio-group>

            <!-- checkedList 多选 -->
            <vxe-checkbox-group v-else-if="item.type === 'checkedList'" v-model="data[item.field]">
              <vxe-checkbox v-for="itemChecked in item.content" :label="itemChecked.label" :key="itemChecked.label"
                :content="itemChecked.content"></vxe-checkbox>
            </vxe-checkbox-group>

            <!-- Number 数字 -->
            <vxe-input v-else-if="item.type === 'number'" v-model.number="data[item.field]" type="number"
              :placeholder="'请输入' + item.title"></vxe-input>


            <!-- Select 下拉树形 -->
            <el-tree-select v-else-if="item.type === 'select'" clearable v-model.number="data[item.field]"
              :data="item.content" check-strictly :placeholder="'请选择' + item.title" :render-after-expand="false" />

            <el-tree-select v-else-if="item.type === 'select-string'" clearable v-model="data[item.field]"
              :data="item.content" check-strictly :placeholder="'请选择' + item.title" :render-after-expand="false" />


            <vxe-textarea v-else-if="item.type === 'remark'" v-model="data[item.field]" placeholder="请输入备注"
              resize="vertical"></vxe-textarea>
            <!-- 添加其他表单元素类型... -->

          </template>
        </vxe-form-item>
      </vxe-form>

    </template>
    <template v-slot:footer>
      <vxe-button status="primary" type="submit" @click="validaForm">提交</vxe-button>
      <vxe-button type="submit" @click="resetForm">重置</vxe-button>
    </template>
  </vxe-modal>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";

import basicPasswordVue from '../basic-container/basic-password.vue';
export default {
  props: {
    submitLoading: Boolean,
    showModal: Boolean,
    modalTitle: String,
    formData: Object,
    formRules: Object,
    items: Array,
    width: Number,
  },
  data() {
    return {
      initialFormData: null,
    };
  },
  computed: {
    // 合并验证规则，添加密码一致性验证
    mergedFormRules() {
      console.log(this.formRules)
      return {
        ...this.formRules,
        repassword: [
          ...(this.formRules.repassword || []),
          { validator: this.validatePasswordConfirmation, trigger: "blur" },
        ],
      };
    },
    formWidth() {
      return this.width ? this.width : 1000
    }
  },
  emits: ['submitEvent', 'update:showModal'], // 添加这行来声明自定义事件
  methods: {
    handleFileChange(field, file) {
      this.formData[field] = file.raw
      // 此处根据实际需求处理文件并更新 formData
    },
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
      console.log("value", value)
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

.el-input-number {
    position: relative;
    display: inline-flex;
    width: 100% !important;
    line-height: 30px;
}
:deep(.el-input-number .el-input__inner) {
    text-align: left;
}

.el-select-dropdown__item.selected {
  color: #999;
}

.vxe-textarea--inner {
  min-height: 71px !important;
  /* 你希望设置的最小高度 */
}


::v-deep(.vxe-form--item-title-content) {
  padding-left: 10px;
}
</style>

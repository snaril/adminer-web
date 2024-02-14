<template>
  <div class="form-box">
    <div style="height: 50px; padding-top: 10px; "
      class="custom-block text-lg text-warm-gray-400 bg-red-100 rounded-md border-l-[4px] border-nav-color  mb-2 pl-3">
      <h5>发送消息</h5>
    </div>
    <vxe-form ref="WhatsappSendForm" v-model:collapseStatus="collapseStatus" :data="formData" :rules="formRules"
      title-align="right" title-width="120" prevent-submit title-colon custom-layout>
      <div style="border: 1px dashed green;padding: 10px; width: 100%;">

        <vxe-form-item title="发送账号" field="jid" :item-render="{}" :style="{ width: '100%' }"
          :title-prefix="{ message: '请点击左侧账号', icon: 'vxe-icon-question-circle-fill' }">
          <template #default="{ data }">
            <vxe-input v-model="data.jid" placeholder="点击左侧账号" clearable disabled style="width: 100%;"></vxe-input>
          </template>
        </vxe-form-item>
        <div>
          <vxe-form-item field="phone" title="接收账号" :span="24" :item-render="{}" :style="{ width: '30%' }">
            <template #default="{ data }">
              <div style="position: relative; width: 100%;"> <!-- 相对定位的父元素 -->
                <vxe-textarea show-word-limit @input="updateLineCount" ref="textareaRef" v-model="data.phone"
                  placeholder="请输入接收账号 示例: &#10;8705471564&#10;8705471564&#10;一行一个电话号码" resize="vertical"
                  style="width: 100%;"></vxe-textarea>
                <div style="position: absolute; bottom: 8px; right: 15px; color:var(--vxe-font-disabled-color);font-size: 11px;">row / {{ lineCount }}</div> <!-- 绝对定位的元素 -->
              </div>
            </template>
          </vxe-form-item>

          <vxe-form-item field="message" title="消息文本" :span="24" :item-render="{}" :style="{ width: '70%' }">
            <template #default="{ data }">
              <vxe-textarea v-model="data.message" :placeholder="placeText" resize="vertical"></vxe-textarea>
            </template>
          </vxe-form-item>
        </div>
        <div>

          <vxe-form-item align="right" span="24" :style="{ width: '100%' }">
            <template #default>
              <vxe-button status="primary" content="提交" @click="submitEvent"></vxe-button>
              <vxe-button content="重置" @click="resetEvent"></vxe-button>
            </template>
          </vxe-form-item>
        </div>
      </div>
    </vxe-form>
  </div>
</template>
  
<script>
import { VXETable } from 'vxe-table';
import { ElMessage, ElMessageBox } from "element-plus";

export default {
  data() {
    return {
      placeText: "Hi , I am the account manager of tanishq company, my name is Surbhi, nice to meet you \n\nWe are Tanishq Online Office Business Unit，Network promotion and operation for India \n\nplease tell me your name so i can know you\n\n👆👆👆👆👆\n&$\nThe system shows that you are not actively working and may face the risk of dismissal.\n\n[其中 &$为消息分割行，使用 &$ 将会把消息分成两次发送]",
      leftTextareaHeight: 0,
      rightTextareaHeight: 0,
      textAreaHeight: '100px',  // 默认高度，可以根据需要修改
      collapseStatus: true,
      lineCount: 0,
      formData: {
        jid: '',
        phone: '',
        message: '',
      },
      formRules: {
        jid: [
          { required: true, message: '请选择发送账号' }
        ],
        phone: [
          { required: true, message: '请输入接收账号' }
        ],
        message: [
          { required: true, message: '请输入消息文本' }
        ]
      }
    }
  },
  methods: {
    updateLineCount() {
      this.lineCount = this.formData.phone.split("\n").length;
    },
    submitEvent() {
      console.log(this.formData)
      this.$refs.WhatsappSendForm
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
    resetEvent() {
      this.formData = {}
      VXETable.modal.message({ content: '已重置！', status: 'success' });
    },

    handleJidEvent(value) {
      this.formData.jid = value.value
    }

  },
  mounted() {
    this.$bus.$on('whatsappSend-jid', this.handleJidEvent);
  },
  beforeDestroy() {
    // 在组件销毁前移除监听，避免潜在的内存泄漏
    this.$bus.$off('whatsappSend-jid', this.handleJidEvent);
  }

}
</script>

<style lang="scss">
:deep(.form-box) {
  width: 100% !important;
  background-color: antiquewhite !important;
}

.el-select,
.el-input {
  width: 100% !important;
}

.el-input__inner {
  --el-input-inner-height: auto !important;
}

.vxe-textarea--inner {
  min-height: 258px !important;
  max-height: 258px !important
    /* 你希望设置的最小高度 */
}

.el-select-dropdown__item.selected {
  color: #999;
}
</style>
  
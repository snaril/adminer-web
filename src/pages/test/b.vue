<template>
  <div>
    <vxe-form :model="formData" :rules="mergedFormRules" title-align="right" title-width="100">
      <vxe-form-item field="password" title="password" :span="12" :item-render="{}" prop="password">
        <vxe-input v-model="formData.password" placeholder="请输入password"></vxe-input>
      </vxe-form-item>
      <vxe-form-item field="confirmPassword" title="confirm" :span="12"  :item-render="{}" prop="confirmPassword">
        <vxe-input v-model="formData.confirmPassword" placeholder="请输入confirmPassword"></vxe-input>
      </vxe-form-item>
    </vxe-form>
  </div>
</template>

<script>
export default {
  props: {
    formRules: Object,
  },
  data() {
    return {
      formData: {
        password: '',
        confirmPassword: '',
      },
    };
  },
  computed: {
    // 合并验证规则，添加密码一致性验证
    mergedFormRules() {
      console.log(this.formRules)
      return  {
        ...this.formRules,
        confirmPassword: [
          ...(this.formRules.confirmPassword || []),
          { validator: this.validatePasswordConfirmation, trigger: 'blur' },
        ],
      }
    },
  },
  methods: {
    validatePasswordConfirmation(rule, value, callback) {
      if (value !== this.formData.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
  },
  watch: {
    mergedFormRules(newVal) {
      console.log('mergedFormRules 变化了:', newVal);
    },
  },
};
</script>

<template>
    <div>
        <vxe-input v-model="password" :span="12" :rules="passwordRules" type="password" placeholder="请输入密码" show-password clearable></vxe-input>
        <vxe-input v-model="confirmPassword" :span="12" :rules="confirmPasswordRules" type="password" placeholder="确认密码" show-password clearable></vxe-input>
    </div>
</template>
<script>
import { ref, computed, watch } from 'vue';

export default {
    props: {
        // 可以接受密码和确认密码的验证规则
        validationRules: {
            type: Array,
            required: true,
        },
        // 使用 v-model 绑定的数据
        modelValue: {
            type: String,
            required: true,
        },
    },
    setup(props, { emit }) {
        const password = ref(props.modelValue);
        const confirmPassword = ref(props.modelValue);

        // 自定义验证规则，用于检查密码和确认密码是否一致
        const confirmPasswordRule = computed(() => ({
            validator: (rule, value, callback) => {
                if (value !== password.value) {
                    callback(new Error('密码不一致'));
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        }));

        // 将确认密码的验证规则添加到验证规则数组中
        const passwordRules = computed(() => [...props.validationRules, confirmPasswordRule.value]);
        const confirmPasswordRules = computed(() => [...props.validationRules, confirmPasswordRule.value]);

        // 监听密码和确认密码的变化，并在两者一致时触发 v-model 的更新
        watch([password, confirmPassword], ([newPassword, newConfirmPassword]) => {
            if (newPassword === newConfirmPassword) {
                emit('update:modelValue', newPassword);
            }
        });

        return { password, confirmPassword, passwordRules, confirmPasswordRules };
    },
};
</script>
  
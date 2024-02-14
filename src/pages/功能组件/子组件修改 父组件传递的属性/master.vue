<template>
    <div>
        <!-- eslint-disable-next-line vue/no-deprecated-v-bind-sync -->
        <child v-model:parentProp="parentValue" />
    </div>
</template>
  
<script>
import child from './child.vue';

export default {
    components: {
        child
    },
    data() {
        return {
            parentValue: 'initial value'
        };
    },
    watch: {
        parentValue: {
            deep: true,
            handler(newValue, oldValue) {
                console.log(newValue)
            }
        }
    },
};
</script>
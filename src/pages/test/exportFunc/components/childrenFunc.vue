<!--1、修改App.vue：-->


<!-- <template>
  <h3>ChildrenFunc</h3>
</template>
<script setup>
import { provide } from "vue";

const exposeFunctionToParent = () => {
  console.log("Function exposed to parent");
};

provide("exposedFunction", exposeFunctionToParent);
</script>
<style scoped>
</style> -->
<template>
  <h3>ChildrenFunc</h3>
</template>

<script setup>
import { defineExpose } from "vue";

const exposeFunctionToParent = () => {
  console.log("Function exposed to parent");
};

defineExpose({
  exposeFunctionToParent
});
</script>

<script>

</script>

<style scoped>
</style>

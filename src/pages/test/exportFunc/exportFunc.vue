<!--1、修改App.vue：-->


<!-- <template>
    <h3>exportFunc</h3>
  <childrenFunc></childrenFunc>
</template>

<script setup>
import childrenFunc from "./components/childrenFunc.vue";

import { onMounted, inject } from 'vue';

const exposedFunction = inject('exposedFunction');

onMounted(() => {
  exposedFunction();
});
</script>

<style scoped>
</style> -->
<template>
  <h3>exportFunc</h3>
  <childrenFunc ref="childRef"></childrenFunc>
  <hr>
  <div class="hello">
    我是父组件
    <!-- clickChild是子组件绑定的事件，click是父组件接受方式 -->
    <childrenValue @clickChild="clickEven"></childrenValue>
    <p>子组件传递的值是 {{result}}</p>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import childrenFunc from "./components/childrenFunc.vue";
import childrenValue from "./components/childrenValue.vue";

const childRef = ref(null);

onMounted(() => {
  childRef.value.exposeFunctionToParent();
});

// -----------------------------------------------


const result=ref('')
const clickEven=(val)=>{
  console.log(val);
  result.value=val.content
}
</script>
  
  <style scoped>
</style>
  

<template>
    <button @click="clickChild">点击子组件</button>
  </template>
   
  <script setup>
  import { defineEmits } from 'vue'
  // 使用defineEmits创建名称，接受一个数组
  const emit = defineEmits(['clickChild'])
  const clickChild=()=>{
    let param={
      content:'b'
    }
    //传递给父组件
    emit('clickChild',param)
  }
  </script>
   
  <style>
   
  </style>
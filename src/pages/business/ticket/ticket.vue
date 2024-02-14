<template>
  <vxe-grid >
    <!-- 自定义工具栏 -->
    <template v-slot:toolbar="{ $grid }">
      <div class="my-toolbar mb-2">
        <!-- 新增按钮 -->
        <vxe-button @click="onAdd($grid)">新增</vxe-button>
        <!-- 批量删除按钮 -->
        <vxe-button @click="onBatchDelete($grid)">批量删除</vxe-button>
        <!-- 搜索框 -->
        <vxe-input type="text" class="ml-3" v-model="searchText" placeholder="搜索..." />
        <!-- 搜索按钮 -->
        <vxe-button @click="onSearch($grid)">搜索</vxe-button>
      </div>
    </template>
  </vxe-grid>
</template>

<script>
export default {
  data() {
    return {
      searchText: '',
    };
  },
  methods: {
    onAdd($grid) {
      console.log($gird.$slots)
    },
    onBatchDelete($grid) {
      // 实现批量删除按钮的逻辑
    },
    onSearch($grid) {
      // 实现搜索逻辑
    }
  }
};
</script>

<style>

</style>

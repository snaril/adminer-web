<template>
  <el-input
    v-if="showInput"
    v-model="localInput"
    class="flex-auto w-full mb-2 mt-2"
    placeholder="请输入名称"
    clearable
    :suffix-icon="searchIcon"
  />
  <el-tree
    :show-checkbox="showCheckbox"
    :data="filteredData"
    :props="defaultTreeProps"
    @node-click="handleNodeClick"
    draggable
    default-expand-all
    :expand-on-click-node="false"
  >
    <template v-slot:default="{ node }">
      <element-tree-line :node="node" :showLabelLine="true">
        <template v-slot:node-label>
          <span>{{ node.label }}</span>
        </template>
      </element-tree-line>
    </template>
  </el-tree>
</template>

<script>
import { Search } from '@element-plus/icons-vue';

export default {
  props: [
    'data',
    'nodeKey',
    'label',
    'children',
    'showCheckbox',
    'showInput'
  ],
  components: {
    'search-icon': Search // 将 Search 图标注册为本地组件
  },
  data() {
    return {
      searchIcon: 'Search', // 设置 Search 图标的名称，用于在模板中引用
      localInput: '',
      defaultTreeProps: {
        children: this.children,
        label: this.label,
        nodeKey: this.nodeKey
      }
    };
  },
  emits: ['node-selected'], // 声明子组件向上发射的自定义事件
  computed: {
    filteredData() {
      if (!this.localInput.trim()) {
        return this.data;
      }
      return this.flatFilterTree(this.data, this.localInput);
    }
  },
  methods: {
    flatFilterTree(tree, query) {
      let result = [];
      for (const node of tree) {
        if (node[this.label].toLowerCase().includes(query.toLowerCase())) {
          result.push({ ...node, children: undefined });
        }
        if (node[this.children]) {
          result = result.concat(this.flatFilterTree(node[this.children], query));
        }
      }
      return result;
    },
    handleNodeClick(dataItem) {
      this.$emit('node-selected', dataItem);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

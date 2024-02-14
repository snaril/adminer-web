<template>
  <el-input v-if="showInput" v-model="localInput" class="flex-auto w-full mb-2 mt-2" placeholder="请输入名称" clearable :suffix-icon="Search" />
  <el-tree :show-checkbox="showCheckbox" :data="filteredData" :props="treeProps" @node-click="handleNodeClick" draggable
    default-expand-all :expand-on-click-node="false">
    <template #default="{ node }">
      <element-tree-line :node="node" :showLabelLine="true">
        <template #node-label>
          <span>{{ node.label }}</span>
        </template>
      </element-tree-line>
    </template>
  </el-tree>
</template>
  
<script setup>
import { ref, computed } from "vue";
import { Search } from "@element-plus/icons-vue";

const { data, nodeKey, label, children } = defineProps([
  "data",
  "nodeKey",
  "label",
  "children",
  "showCheckbox",
  "showInput"
]);
const emit = defineEmits(["node-selected"]);

const localInput = ref("");

const filteredData = computed(() => {
  if (!localInput.value.trim()) {
    console.log("data", data);
    return data;
  }

  return flatFilterTree(data, localInput.value);
});
// 扁平化筛选
const flatFilterTree = (tree, query) => {
  let result = [];
  for (const node of tree) {
    if (node[label].toLowerCase().includes(query.toLowerCase())) {
      result.push({ ...node, children: undefined });
    }
    if (node[children]) {
      result = result.concat(flatFilterTree(node[children], query));
    }
  }
  return result;
};

const handleNodeClick = (dataItem) => {
  emit("node-selected", dataItem);
};

const treeProps = {
  children,
  label,
  nodeKey,
};
</script>
  
<style lang="scss" scoped ></style>
  
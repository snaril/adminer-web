<template>
  <div class="flex">
    <div class="role-left w-80 mr-2 flex-auto overflow-auto">
      <basic-container class="pt-2 bg-container-color center">
        <TreeLine
          v-if="tenantTreeData.length"
          :showInput="true"
          :data="tenantTreeData"
          :nodeKey="'id'"
          :show-checkbox="false"
          :label="'label'"
          :children="'children'"
          @node-selected="onNodeSelected"
        />
      </basic-container>
    </div>
    <div class="role-right w-full bg-gray-100 flex-auto overflow-auto">
      <basic-container>
        <!-- eslint-disable-next-line vue/no-deprecated-v-bind-sync -->
        <RateList v-model:tenantItem="tenantItem" @reload-requested="reloadData" />
      </basic-container>
    </div>
    <!-- Additional code if needed -->
  </div>
</template>
      
<script>
/* eslint-disable vue/no-deprecated-v-bind-sync */
import TreeLine from "~/components/tree-line/tree.vue";
import { getTenantTree } from "~/api/system/tenant";
import RateList from "./user_list.vue";

export default {
  components: {
    TreeLine,
    RateList
  },
  data() {
    return {
      tenantItem: null,
      tenantTreeData: []
    };
  },
  methods: {
    async reloadData() {
      // ...
      await this.fetchData();
      this.$nextTick(() => {
        console.log("this.tenantTreeData after update", this.tenantTreeData);
      });
    },
    onNodeSelected(dataItem) {
      this.tenantItem = dataItem;
    },
    async fetchData() {
      try {
        const data = await getTenantTree();
        // 使用 Vue.set 来保证响应性，尤其是如果tenantTreeData是一个数组的话

        this.tenantTreeData = data
        // 或者如果tenantTreeData是一个数组可以使用
        // this.tenantTreeData.splice(0, this.tenantTreeData.length, ...data);
        console.log("Updated tenantTreeData", this.tenantTreeData);
      } catch (error) {
        console.error("Failed to fetch tenant tree data", error);
        throw error;
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

  <style lang="scss">
.role-right {
  width: calc(100% - 230px); // or any other fixed value
}
</style>
    
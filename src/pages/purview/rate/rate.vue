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
          <RateList :tenantItem="tenantItem" />
        </basic-container>
      </div>
      <!-- Additional code if needed -->
    </div>
  </template>
        
  <script>
  import TreeLine from "~/components/tree-line/tree.vue";
  import { getTenantTree } from "~/api/system/tenant";
  import RateList from "./rate_list.vue";
  
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
      onNodeSelected(dataItem) {
        console.log("Selected node:", dataItem);
        this.tenantItem = dataItem;
      },
      async fetchData() {
        try {
          this.tenantTreeData = await getTenantTree();
          console.log("tenantTreeData", this.tenantTreeData);
        } catch (error) {
          throw new Error("Failed to fetch tenant tree data");
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
      
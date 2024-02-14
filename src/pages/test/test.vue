<template>
  <div>
    <vxe-grid :columns="columns" :data="tableData" ref="xTable" :form-config="formConfig">
    </vxe-grid>
    <button @click="getFormData">获取表单数据</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        { type: 'seq', width: 60, title: '序号' },
        { field: 'name', title: '姓名' },
        { field: 'age', title: '年龄' },
      ],
      tableData: [
        { name: '张三', age: 25 },
        { name: '李四', age: 30 },
        { name: '王五', age: 28 },
      ],
      formConfig: {
        items: [
          {
            field: 'nameSearch',
            title: '姓名',
            span: 6,
            titlePrefix: {
              message: '根据账户编号',
              icon: 'vxe-icon-question-circle-fill',
            },
            visible: true,
            itemRender: { 
              name: '$input', 
              props: { 
                placeholder: '请输入用户编号',
                modelValue: this.nameSearch, // 使用 v-model
                'onUpdate:modelValue': val => (this.nameSearch = val) // 更新数据
              } 
            },
          },
          // 可以增加更多的搜索项...
        ]
      },
      nameSearch: '', // 用于存储搜索表单的姓名字段的数据
    };
  },
  methods: {
    getFormData() {
      console.log("Form Data:", this.$refs.xTable);
    }
  }
}
</script>

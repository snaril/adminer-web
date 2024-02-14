<template>
<el-row class="flex justify-center">
  
  <el-result icon="warning" title="404提示" subTitle="你找的页面走丢了~">
      <template #extra>
        <el-button type="primary" size="medium" @click="$router.push('/')">返回</el-button>
      </template>
      <el-button>默认按钮</el-button>
    </el-result>
    
</el-row>
    
 
    
</template>
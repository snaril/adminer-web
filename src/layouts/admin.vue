<template>
  <div class="flex home">
    <div class="home-left h-screen">
      <Menus />
    </div>
    <div class="home-right w-full h-screen pl-5 pr-5 bg-gray-100 flex flex-col">
      <div class="h-26">
        <Header></Header>
        <Nav></Nav>
      </div>

      <div class="home-content mt-2 ml-[-0.50rem] mr-[-0.8rem] flex-auto overflow-auto">
        <basic-container v-if="!pageOpt.includes(route.path)">
          <router-view></router-view>
        </basic-container>
        <router-view v-else></router-view>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue"
// import { showModeal, toast } from "~/composables/util"
import Menus from "~/layouts/menus/menus.vue";
import Header from "~/layouts/header/header.vue";
import Nav from "~/layouts/nav/nav.vue";
import { useRoute } from "vue-router";
const route = useRoute();

var pageOpt = ref([
  '/purview/role',
  '/purview/tenant',
  '/purview/user',
  '/purview/rate',
  '/purview/balance',
  '/whatsapp/send',
])
</script>
<style lang="scss">
.home-left {
  // width: 240px;
  min-width: 230px;
  background-color: #202123;
  font-size: 12px;
}
.no-style {
  background-color: transparent !important;
  border-radius: 0 !important;
  // 其他需要重写的样式
}
.home-right {
  width: calc(100% - 230px); // or any other fixed value
}
.home-right {
  scrollbar-width: thin; // for Firefox
  //   &::-webkit-scrollbar {
  //     width: 12px; // adjust as needed for other browsers like Chrome and Safari
  //   }
  //   &::-webkit-scrollbar-thumb {
  //     background-color: transparent; // make the thumb transparent
  //   }
  //   &:hover::-webkit-scrollbar-thumb {
  //     background-color: rgba(0, 0, 0, 0.5); // show the thumb on hover
  //   }
  /* 设置滚动条的宽度 */
  ::-webkit-scrollbar {
    width: 8px;
  }

  /* 设置滚动条背景 */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* 设置垂直滚动条的滑块颜色和圆角 */
  ::-webkit-scrollbar-thumb {
    background: #dfdfdf;
    border-radius: 5px;
  }

  /* 滚动条滑块悬停效果 */
  ::-webkit-scrollbar-thumb:hover {
    background: #c9c9c9;
  }
}
</style>

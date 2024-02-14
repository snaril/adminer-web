<template>
    <div class="h-full flex flex-col text-font-menu">
        <div class="logo flex justify-center items-center h-16  border-b-1 border-dark-300 text-10">
            Deflux Admin
        </div>
        <div class="menu bg-menu-color flex-auto w-full ">
            <el-menu class="bg-menu-color el-menu-vertical-demo w-full custom-menu w-full border-0" active-text-color="#fff"
                background-color="#202123" unique-opened text-color="#BDBDC0" @select="handleSelect">

                <template v-for="(item, index) in asideMenus" :key="index">
                    <el-sub-menu :index="item.name" v-if="item.category==1">
                        <template #title>
                            <div class="pl-2 w-full flex items-center custom-menu-active ">
                                <el-icon class="" :size="14">
                                    <component :is="item.source"></component>
                                </el-icon>
                                <div class="w-full">
                                    {{ item.name }}
                                </div>
                                <!-- <span class="bg-dark-400"></span> -->
                            </div>

                        </template>


                        <el-menu-item v-for="(item2, index2) in item.children" :key="index2"
                            class=" indented w-full custom-menu-active h-5" :index="item2.path">
                            <el-icon :class="item.source" :size="14">
                                <component :is="item2.source"></component>
                            </el-icon>
                            <div class="w-full">
                                {{ item2.name }}
                            </div>
                        </el-menu-item>


                    </el-sub-menu>
                    <el-menu-item v-else :index="item.path">
                        <component :is="item.icon"></component>
                        <span>{{ item.name }}</span>
                    </el-menu-item>
                </template>

            </el-menu>
        </div>
    </div>
</template>
<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()


const router = useRouter()
// const route = useRoute()
// const defaultActive = ref(route.path)
const asideMenus = computed(() => store.state.menus)

const handleSelect = (e) => {
    router.push(e)
}
</script>

<style  lang="scss" scoped>
.custom-menu .el-menu-item.is-active {
    position: relative;
}



.custom-menu .el-menu-item.is-active:after {

    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background-color: #0F79E7;
}

/* 设置选中后的背景颜色 */
.custom-menu .el-menu-item.is-active,
.custom-menu .el-submenu.is-active {
    background-color: #343541;
}

:deep(.menu  .el-menu-item) {
    height: 42px !important;
    /* 或你想要的任何其他值 */
    line-height: 42px !important;
    /* 确保文字垂直居中 */
}
:deep(.el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item) {
    padding-left: 42px !important;
}
:root{
    --el-menu-item-height: 42px !important;
}
.logo {
    font-size: 14px;
}

.menu {
    font-size: 10px;
}</style>
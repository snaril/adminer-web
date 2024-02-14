<template>
    <!-- bg-transparent bg-gradient-to-b from-gradient-start to-gradient-end -->
    <div class="border-b-1  h-10 ml-[-1.25rem] mr-[-1.25rem]  flex items-center">
        <div class="wrapper icon-home icon-navicon ml-4 h-full overflow-hidden w-full">
            <div class="table-content">
                <el-tabs v-model="activeTab" type="card" class="font-normal text-nav-color" @tab-remove="removeTab"
                    style="min-width: 200px" @tab-change="changeTab">
                    <el-tab-pane :closable="item.path != '/'" class="" v-for="item in tabList" :key="item.path"
                        :label="item.title" :name="item.path">

                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <div class="flex ml-auto mr-3">
            <span class="flex h-10 ml-auto items-center">
                <el-dropdown class="flex" @command="handlerCommand">
                    <span class=" el-dropdown-link flex items-center bg-gray-300 h-8 w-8 justify-center rounded">
                        <!-- <el-avatar :size="20" class="mr-1" :src="circleUrl" /> -->
                        <el-icon class="el-icon--center">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="clearOther">关闭其它</el-dropdown-item>
                            <el-dropdown-item command="clearAll">关闭全部</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </span>

        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies()
const route = useRoute()
const router = useRouter()
const activeTab = ref(route.path)
const tabList = ref([
    {
        title: '首页',
        path: "/"

    },


])
function addTab(tab) {
    activeTab.value = tab.path
    let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
    if (noTab) {
        tabList.value.push(tab)
    }
    cookie.set("tabList", tabList.value)
}

onBeforeRouteUpdate((to, from) => {
    console.log(to.meta)
    addTab({
        title: to.meta.title,
        path: to.path
    })
})

const changeTab = (t) => {
    router.push(t)
}

function initTabList() {
    let tab = cookie.get("tabList")
    if (tab) {
        tabList.value = tab
    }
}

initTabList()
const removeTab = (t) => {
    let tabs = tabList.value
    let activeTabs = activeTab.value
    if (t == activeTabs) {
        tabs.forEach((tab, index) => {
            if (tab.path == t) {
                const nextTab = tabs[index + 1] || tabs[index - 1]
                if (nextTab) {
                    activeTabs = nextTab.path
                }
            }
        })
    }
    activeTab.value = activeTabs
    tabList.value = tabList.value.filter(tab => tab.path != t)
    cookie.set("tabList", tabList.value)
}

const handlerCommand = (c) => {
    switch (c) {
        case "clearAll":
            activeTab.value = "/"
            tabList.value = tabList.value.filter(tab => tab.path == "/")
        case "clearOther":
            tabList.value = tabList.value.filter(tab => tab.path == "/" || tab.path == activeTab.value)
    }
    cookie.set("tabList", tabList.value)
}
</script>
<style lang="scss" scoped>
.wrapper {
    flex: 1;
    width: 100%;
    position: relative;

    .table-content {
        position: absolute;
        width: calc(100% - 10px);
    }
}

:deep(.el-tabs__header) {
    @apply mb-0;
}

:deep(.el-tabs__nav) {
    border: 0px !important;
}

:deep(.el-tabs__item) {
    border-left: 0px !important;
    height: 32px !important;
    line-height: 32px !important;
    @apply bg-white mx-1 rounded-md;
}

:deep(.el-tabs__item:hover) {
    @apply text-black opacity-80;
}

:deep(.el-tabs__item.is-active) {
    @apply text-blue-300;
}

:deep(.el-tabs--card>.el-tabs__header) {
    @apply flex items-center;
}

:deep(.el-tabs__nav-prev, .is-disabled, .el-tabs__nav-next) {
    height: 32px !important;
    width: 20px;
    line-height: 32px !important;
    background-color: #EAEBEC;
    @apply rounded-tl-md rounded-bl-md;
}

:deep(.el-tabs__nav-next) {
    height: 32px !important;
    line-height: 32px !important;
    background-color: #EAEBEC;
    @apply rounded-tr-md rounded-br-md;
}
</style>
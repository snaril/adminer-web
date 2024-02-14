<template>
    <div class="home-top h-16 flex items-center ml-[-1.25rem] mr-[-1.25rem] border-b-1 border-gray-200">
        <div class="icon-home icon-navicon ml-5 h-full flex items-center ">
            <div class="icons flex items-center">
                <el-icon :size="20" class=" mb-1 mr-5">
                    <Operation />
                </el-icon>

                <div class="top-box flex items-center">
                    <div class="home-icon-link flex items-center mr-5">
                        <div class=" mr-2">
                            <el-icon :size="13" class=" opacity-60 flex">
                                <Menu />
                            </el-icon>
                        </div>

                        <span class="text-sm  opacity-80 font-normal">首页</span>
                    </div>
                    <div class="home-icon-link flex items-center mr-5">
                        <div class=" mr-2">
                            <el-icon :size="13" class=" opacity-60 flex">
                                <Menu />
                            </el-icon>
                        </div>

                        <span class="text-sm  opacity-80 font-normal">工作台</span>
                    </div>
                </div>

            </div>
        </div>
        <div class="flex ml-auto mr-5">
            <!-- 刷新按钮（提示） -->
            <el-tooltip class="box-item" effect="dark" content="Click Refresh" placement="bottom">
                <el-icon :size="20" class="mr-3" @click="RefreshHandle">
                    <RefreshRight />
                </el-icon>
            </el-tooltip>
            <!-- 全屏按钮（提示） -->
            <el-tooltip class="box-item" effect="dark" content="Click FullScreen" placement="bottom">
                <el-icon :size="20" class=" mr-3" @click="ScreenHandle">
                    <FullScreen />
                </el-icon>
            </el-tooltip>

            <div class=" flex mr-[-0.50rem]">
                <el-tooltip class="box-item" effect="dark" content="用户中心" placement="bottom">
                    <el-avatar :size="20" class="mr-2"
                        :src="String('https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')" />
                </el-tooltip>

                <el-dropdown class="flex rounded-1xl pl-1 pr-1 bg-gray-300" @command="handlerCommand">
                    <span class=" el-dropdown-link flex items-center">
                        <!-- <el-avatar :size="20" class="mr-1" :src="circleUrl" /> -->
                        <el-icon class="el-icon--center">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>

                        <div class=" ml-4 mr-4 mt-2 pb-1 border-b-1 border-gray-200  ">
                            Admin
                        </div>

                        <el-dropdown-menu>
                            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

        </div>
    </div>

    <!-- 修改密码的弹窗 -->
    <!-- dialogFormVisible 控制弹窗是否显示 -->
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500px">
        <el-form :model="form" :rules="rules" ref="reForm">
            <!-- prop="oldpassword" 绑定表单验证规则 -->
            <!-- :label-width="formLabelWidth" 设置 item 初始宽度 -->
            <el-form-item type="password" label="原密码：" :label-width="formLabelWidth" prop="oldpassword">
                <!-- show-password  是否显示眼睛 -->
                <el-input v-model="form.oldpassword" @clear="clearPassword" show-password placeholder="请输入旧密码">
                </el-input>
            </el-form-item>
            <el-form-item type="password" label="新密码：" :label-width="formLabelWidth" prop="password">
                <el-input v-model="form.password" @clear="clearPassword" show-password placeholder="请输入新密码">
                </el-input>
            </el-form-item>
            <el-form-item type="password" label="确认密码：" :label-width="formLabelWidth" prop="repassword">
                <el-input v-model="form.repassword" @clear="clearPassword" show-password placeholder="请输入确认密码">
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="onSubmit" :loading="loading">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { showModeal, toast } from '~/composables/util'
import { logout, updatepassword } from "~/api/manager"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, enter, exit, toggle } = useFullscreen()

const router = useRouter()
const store = useStore()

// 刷新
const RefreshHandle = () => location.reload()
// 全屏、退出全屏
const ScreenHandle = () => toggle()


function logoutHandler() {
    showModeal("是否要退出登陆?").then(res => {
        logout()
            .finally(() => {
                // 移除 cookie 里面的 token
                // 清楚当前用户状态 vuex
                store.dispatch("logout")

                // 跳转登陆首页
                router.push("/login")
            })
    })
        .catch(() => {
            return
        })
}


const dialogFormVisible = ref(false)

const formLabelWidth = '100px'

const form = reactive({
    oldpassword: '',
    password: '',
    repassword: '',
})

const rules = {
    oldpassword: [
        { required: true, message: '旧密码不能为空', trigger: 'blur' },
        { min: 3, max: 15, message: '长度 3-15 之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 3, max: 15, message: '长度 3-15 之间', trigger: 'blur' },
        {
            validator: validatePassword, // 调用自定义校验方法
            trigger: 'blur',
        },
    ],
    repassword: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 3, max: 15, message: '长度 3-15 之间', trigger: 'blur' },
        {
            validator: validateRepassword, // 调用自定义校验方法
            trigger: 'blur',
        },
    ]
}
// 自定义校验方法，比较旧密码和新密码是否相同
function validatePassword(rules, value, callback) {
    if (value === form.oldpassword) {
        callback(new Error('新密码不能与旧密码相同'));
    } else {
        callback();
    }
}


// 自定义校验方法，比较 新密码 和 确认密码 是否相同
function validateRepassword(rules, value, callback) {
    if (value === form.password) {
        callback();

    } else {
        callback(new Error('确认密码与旧密码不相同'));
    }
}
const reForm = ref(null)
//加载状态
const loading = ref(false)
const onSubmit = () => {
    reForm.value.validate((val) => {
        if (!val) {
            return false
        }
        loading.value = true
        updatepassword(form)
            .then(res => {
                toast("修改密码成功")
                // 移除 cookie 里面的 token
                // 清楚当前用户状态 vuex
                store.dispatch("logout")
                // 跳转登陆首页
                router.push("/login")


            })
            .finally(() => {
                loading.value = false
            })
    })
}


//清除密码
function clearPassword() {
    form.oldpassword = "";
}
const handlerCommand = (c) => {
    switch (c) {
        case "logout":
            logoutHandler()
            break;
        case "rePassword":
            dialogFormVisible.value = true
            break;
        default:
            break;
    }

}

// 修改密码





</script>
<style lang="scss">
.el-dropdown-link:hover {
    transform: rotate(180deg);
}

.el-dropdown .el-dropdown-link:focus {
    outline: 0;

}

// 修改密码：
.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-dialog .el-input {
    width: 300px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>
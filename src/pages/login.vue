<template>
  <el-row class="login-container ">
    <el-col :md="12" :xs="12" class="left-container">
      <div class="grid-content bg-purple-left hidden-sm-and-down">
        <div class="login-left  items-center">
          <div class="login-time ">
            {{ timer }}
          </div>
          <img class="img items-center" justify="center" src="../assets/logo.png" alt="">
          <p class="title">cvvdex 后台管理平台</p>
        </div>
      </div>
    </el-col>
    <el-col :md="12" :sx="12">
      <div class="grid-content bg-purple">
        <div class="right-top login-border">
          <div class="login-main ">
            <h2 class="">欢迎回来</h2>
            <h4 class="login-title  ">
              <span class="right-span"></span>
              <span>账号密码登录</span>
              <span class="right-span"></span>

            </h4>
            <el-form :model="form" :rules="rules" ref="reForm">
              <el-form-item prop="tenantId">
                <el-input v-model="form.tenantId" placeholder="请输入商户">
                  <template #prefix>
                    <el-icon>
                      <Postcard/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="account">
                <el-input v-model="form.username" placeholder="请输入用户名">
                  <template #prefix>
                    <el-icon>
                      <User/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password>
                  <el-icon>
                    <Lock/>
                  </el-icon>
                  <template #prefix>
                    <el-icon>
                      <Lock/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item>

                <el-button class="w-full" type="primary" @click="onSubmit" :loading="loading">登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>

        </div>
      </div>
    </el-col>

  </el-row>
</template>

<script setup>
import {ref, reactive, onMounted, onBeforeUnmount} from 'vue'
import {User, Lock} from '@element-plus/icons-vue'
import {toast} from '~/composables/util'
import {useRouter} from 'vue-router'
import {setToken} from '~/composables/auth'
import {useStore} from 'vuex'


//timer 时间
import {format} from 'date-fns'

let setTimer = ''
let timer = ref('')
const formatTime = () => {
  timer.value = format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

onMounted(() => {
  document.addEventListener("keyup", onKeyUp)
  formatTime()
  setTimer = setInterval(() => {
    formatTime()
  }, 1000)
})
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp)
})


const store = useStore()
// do not use same name with ref
const form = reactive({
  tenantId: '',
  username: '',
  password: '',

})

const rules = {
  tenantId: [
    {required: true, message: '商户ID 不能为空', trigger: 'blur'},
    {min: 6, max: 6, message: '长度 3-5 之间', trigger: 'blur'},
  ],
  username: [
    {required: true, message: '账号不能为空', trigger: 'blur'},
    {min: 3, max: 5, message: '长度 3-5 之间', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
    {min: 3, max: 15, message: '长度 3-15 之间', trigger: 'blur'},
  ]
}
const reForm = ref(null)
const router = useRouter()
const loading = ref(false)
const onSubmit = () => {
  reForm.value.validate((val) => {
    if (!val) {
      return false
    }
    loading.value = true
    console.log("form",form)
    store.dispatch("loginByUsername", form).then(res => {

      toast("Login successful!")
      router.push("/")
    }).finally(() => {
      loading.value = false
    })

  })
}

//监听回车的事件
function onKeyUp(e) {
  if (e.key == "Enter") onSubmit()
}

// 添加键盘监听
</script>

<style lang="scss" scoped>
.right-top,
.login-main > h2,
.login-main > h4 {
  @apply flex items-center justify-center;
}

.login-main > h2 {
  @apply font-bold text-3xl text-gray-800;
}

.right-span {
  @apply h-[1px] w-16 bg-red-200;
}

.login-main > h4 {
  @apply my-5 text-gray-300 space-x-2;
}

.login-container {
  @apply justify-center;
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  min-height: 100vh;
  margin: 0 auto;
  // background: url("https://saber.bladex.vip/img/bg/bg.jpg") 0 bottom repeat-x #049ec4;
  animation: animate-cloud 20s linear infinite;
}


.bg-purple-left {
  @apply items-center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  -webkit-box-pack: center;
  background-color: #8B9AAC;
  color: #fff;
  float: left;
  width: 100%;
  position: relative;
}

.grid-content {
  /* flex:inherit; */
  /* border-radius: ; */
  min-height: 500px;
  margin: 0 auto;
  /* width: 100px; */
  box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
}

@media screen and (min-width: 992px) {
  .el-col-md-12 {
    display: block;
    max-width: 500px;
    flex: 0 0 50%;
  }
}

@media screen and (max-width: 992px) {
  .left-container {
    display: none;
  }
}

.login-left,
.login-border {
  position: relative;
  min-height: 500px;
  align-items: center;
  display: flex;
}

.login-left {
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  justify-content: center;
  flex-direction: column;
  //   background-color: #409EFF;
  color: #fff;
  float: left;
  width: 100%;
  //   height: 100%;
  position: relative;
}

.img {
  width: 140px;
}

.login-time {
  position: absolute;
  left: 25px;
  top: 25px;
  width: 100%;
  color: #fff;
  font-weight: 200;
  opacity: 0.9;
  font-size: 18px;
  overflow: hidden;
}

.login-left .title {
  margin-top: 60px;
  text-align: center;
  color: #fff;
  font-weight: 300;
  letter-spacing: 2px;
  font-size: 25px;
}

:deep(.el-input__inner) {
  background-color: white !important;
}
</style>
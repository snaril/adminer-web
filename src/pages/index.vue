<template>
    <div class="content">
        <div class="lab left">
            123
        </div>
        <div class="lab center">
            <div class="center-box ">
                <div class="amount">
                    <div class="title">
                        账户金额
                    </div>
                    <div class="total-recharge">
                        总充值：98565
                    </div>
                    <div class="total-recharge">
                        总提现：98565
                    </div>
                    <div class="total-recharge">
                        充值费率：98565
                    </div>
                    <div class="total-recharge">
                        提现费率：98565
                    </div>
                    <div>
                        结算：98565*
                    </div>
                </div>
                <div class="icon">
                    <el-image style="width: 24px; height: 24px" :src="'/src/assets/wallet.png'" :fit="fit" />
                </div>
            </div>
        </div>
        <div class="lab right">
            <div class="setting h-25 rounded-md flex justify-between">
                <div class="password-desc w-42">
                    <div class="title">
                        修改密码
                    </div>
                    <div class="desc">
                        定期修改为高强度密码，以保护您的账号安全
                    </div>
                </div>
                <div class="password-buttom flex items-end">
                    <el-button class="w-15 h-6 text-xs">立即修改</el-button>
                </div>

            </div>
            <div class="setting h-25 rounded-md flex justify-between">
                <div class="password-desc w-42">
                    <div class="title">
                        用户信息
                    </div>
                    <div class="desc">
                        设置你的用户个人信息，向你的客户展现你的美丽
                    </div>
                </div>
                <div class="password-buttom flex items-end">
                    <el-button class="w-15 h-6 text-xs">立即设置</el-button>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<style lang="scss" scoped>
.content {
    display: flex;
    width: 100%;
    height: 100%;
    .lab:not(:first-child){
        margin-left: 10px;
    }
    .left {
        flex: auto;
        background-color: aqua;
    }

    .center {
        border-radius: 15px;
        background-color: #f2f2f2;
        width: 350px;
        .center-box{
            padding: 15px;
            height: 100%;
            display: flex;
            justify-content: space-between;
            .amount{
                margin-left: 15px;
               
                .title{
                    font-size: 16px;
                    margin-bottom: 20px;
                    background-color: aqua;
                }
            }
            .icon{
                background-color: white;
                border-radius: 999px;
                width: 42px;
                height: 42px;
                border-radius: 999px;
                display: flex;
                align-content: center;
                justify-content: center;
                align-items: center;

            }
        }
    }

    .right {

        .setting {
            padding: 20px;
            background-image: url('~/assets/setting-top.png');
            background-size: cover;
            /* 覆盖整个元素 */
            background-position: center;

            /* 居中显示 */
            .password-desc {
                color: white;

                .title {

                    font-size: 16px;
                }

                .desc {
                    font-size: 10px;
                }
            }

        }

        .setting:not(:first-child) {
            margin-top: 10px;
            background-image: url('~/assets/setting-bottom.png');
        }
    }
}</style>

<template>
    <table>
        <tr v-for="(row, index) in tableData" :key="index">
            <td>{{ row.id }}</td>
            <td>
                <!-- 使用 true-value 和 false-value 来指定 el-switch 绑定的真假值 -->
                <el-switch v-model="row.is_action" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                    :active-value=100 :inactive-value=0 />
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    data() {
        return {
            tableData: [
                { id: 1, is_action: 1 },
                { id: 2, is_action: 0 },
                // ...其他行
            ]
        };
    },
    // ...其他选项
};
</script>

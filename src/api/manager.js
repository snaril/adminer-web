import axios from "~/axios";

// export function loginByUsername(tenantId,username,password){
//     return axios.post("/system/login",{
//         username,
//         password,
//         tenantId,
//     })
// }
export const loginByUsername = (tenantId, account, password) => axios.request({
    url: '/system/login',
    method: 'post',
    params: {
        tenantId,
        account,
        password,
    }
});
// export const login = (tenantId, username, password) => axios.request("/system/login", {
//     tenantId,
//     username,
//     password
// });

export function getinfo() {
    return axios.get("/system/route")
}

export function logout() {
    return axios.post("/admin/logout")
}

export function updatepassword(data) {
    return axios.post("/admin/updatepassword", data)
}
import request from 'APP_UTILS/request';

export const Login_Sys = (params) => request('/Login', params, 'POST');
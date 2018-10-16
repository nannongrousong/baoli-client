import request from 'APP_UTILS/request';

export const Upload_Attach = (params) => request('/Attach', params, 'FILE');
export const Del_Attach = (params) => request('/Attach', params, 'DELETE');
import request from 'APP_UTILS/request';

export const Add_Group = (params) => request('/Group', params, 'POST');
export const Edit_Group = (params) => request('/Group', params, 'PUT');
export const Del_Group = (params) => request('/Group', params, 'DELETE');
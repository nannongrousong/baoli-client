import request from 'APP_UTILS/request';

export const List_Issue = (params) => request('/Issue', params);
export const Add_Issue = (params) => request('/Issue', params, 'POST');
export const Edit_Issue = (params) => request('/Issue', params, 'PUT');
export const Del_Issue = (params) => request('/Issue', params, 'DELETE');
export const Get_Issue_Pic = (params) => request('/Issue/Pic', params);
export const Del_Issue_Pic = (params) => request('/Issue/Pic', params, 'DELETE');
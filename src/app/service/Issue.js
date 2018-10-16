import request from 'APP_UTILS/request';

export const listIssue = (params) => request('/Issue', params);
export const addIssue = (params) => request('/Issue', params, 'POST');
export const editIssue = (params) => request('/Issue', params, 'PUT');
export const delIssue = (params) => request('/Issue', params, 'DELETE');
export const getIssuePic = (params) => request('/Issue/Pic', params);
export const delIssuePic = (params) => request('/Issue/Pic', params, 'DELETE');
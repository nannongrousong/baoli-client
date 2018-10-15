import request from 'APP_UTILS/request';

export const listIssue = (params) => request('/BAOLI/Issue', params);
export const addIssue = (params) => request('/BAOLI/Issue', params, 'POST');
export const editIssue = (params) => request('/BAOLI/Issue', params, 'PUT');
export const delIssue = (params) => request('/BAOLI/Issue', params, 'DELETE');
export const getIssuePic = (params) => request('/BAOLI/Issue/Pic', params);

export const addGroup = (params) => request('/BAOLI/Group', params, 'POST');
export const editGroup = (params) => request('/BAOLI/Group', params, 'PUT');
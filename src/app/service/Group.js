import request from 'APP_UTILS/request';

export const addGroup = (params) => request('/Group', params, 'POST');
export const editGroup = (params) => request('/Group', params, 'PUT');
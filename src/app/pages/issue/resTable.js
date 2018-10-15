import React, { Component, Fragment } from 'react';
import { Table, Button, Divider, Modal } from 'antd';
import { listIssue, delIssue } from 'APP_SERVICE/BAOLI';
import { errorHandle } from 'APP_UTILS/common';

import GroupModal from './groupModal';
import IssueModal from './issueModal';


class ResTable extends Component {
    state = {
        dataSource: [],
        showGroupModal: false,
        groupInfo: null,
        showIssueModal: false,
        issueInfo: null
    }

    componentDidMount() {
        this.reloadData();
    }

    reloadData = () => {
        listIssue().then((resData) => {
            this.setState({
                dataSource: resData.Data
            });
        }).catch(errorHandle);
    }

    addGroup = () => {
        this.setState({
            showGroupModal: true
        });
    }

    editGroup = (record) => {
        this.setState({
            showGroupModal: true,
            groupInfo: record
        });
    }

    addIssue = (record) => {
        this.setState({
            showIssueModal: true,
            issueInfo: {
                GroupID: record.GroupID
            }
        });
    }

    editIssue = (record) => {
        this.setState({
            showIssueModal: true,
            issueInfo: record
        });
    }

    delIssue = ({ IssueID, IssueAppeal }) => {
        Modal.confirm({
            title: '信息',
            content: `请确认要删除[${IssueAppeal}]`,
            onOk: async () => {
                await delIssue(IssueID).then((resData) => {
                    if (resData.Code) {
                        this.reloadData();
                    }
                }).catch(errorHandle);
            }
        });
    }

    closeModal = (type) => {
        this.setState({
            [{ group: 'showGroupModal', issue: 'showIssueModal' }[type]]: false,
            groupInfo: null,
            issueInfo: null
        });
    }

    render() {
        const renderCtx = (value, row) => {
            if (!row.IsGroup) {
                return {
                    children: value,
                    props: {}
                };
            } else {
                return {
                    children: null,
                    props: { colSpan: 0 }
                };
            }
        };

        const columns = [{
            title: '序号',
            dataIndex: 'IssueNo',
            render: (value, row) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if (row.IsGroup) {
                    obj.children = (
                        <div>
                            {row.GroupAppeal}
                            <a className='ml-32' onClick={this.editGroup.bind(this, row)}>修改分类</a>
                            <Divider type='vertical' />
                            <a onClick={this.addIssue.bind(this, row)}>添加问题</a>
                        </div>
                    );
                    obj.props.colSpan = 5;
                }
                return obj;
            }
        }, {
            title: '业主诉求问题',
            dataIndex: 'IssueAppeal',
            render: renderCtx
        }, {
            title: '保利拟整改措施',
            dataIndex: 'RectfyInfo',
            render: renderCtx
        }, {
            title: '保利承诺完成整改截止日期',
            dataIndex: 'RectifyLastDate',
            render: renderCtx
        }, {
            title: '操作',
            dataIndex: 'Action',
            render: (value, row) => {
                if (!row.IsGroup) {
                    return {
                        children: (
                            <Fragment>
                                <a onClick={this.editIssue.bind(this, row)}>修改</a>
                                <Divider type='vertical' />
                                <a onClick={this.delIssue.bind(this, row)}>删除</a>
                            </Fragment>
                        ),
                        props: {}
                    };
                } else {
                    return {
                        children: null,
                        props: { colSpan: 0 }
                    };
                }
            }
        }];
        const { dataSource, showGroupModal, groupInfo, showIssueModal, issueInfo } = this.state;

        return (
            <Fragment>
                <Table
                    title={() => <Button type='primary' onClick={this.addGroup}>添加分类</Button>}
                    rowKey='IssueNo'
                    bordered
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}>

                </Table>

                {
                    showGroupModal &&
                    <GroupModal
                        closeModal={this.closeModal.bind(this, 'group')}
                        record={groupInfo}
                        reloadData={this.reloadData} />
                }

                {
                    showIssueModal &&
                    <IssueModal
                        closeModal={this.closeModal.bind(this, 'issue')}
                        record={issueInfo}
                        reloadData={this.reloadData} />
                }
            </Fragment>
        );
    }
}

export default ResTable;
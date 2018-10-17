import React, { Component, Fragment } from 'react';
import { Table, Button, Divider, Modal, Row, Col, Icon, message } from 'antd';
import { List_Issue, Del_Issue } from 'APP_SERVICE/Issue';
import { Del_Group } from 'APP_SERVICE/Group';
import { errorHandle } from 'APP_UTILS/common';
import styles from 'APP_STYLES/issue.less';

import GroupModal from './groupModal';
import IssueModal from './issueModal';
import LoginModal from './loginModal';

class ResTable extends Component {
    state = {
        dataSource: [],
        showGroupModal: false,
        groupInfo: null,
        showIssueModal: false,
        issueInfo: null,
        showLoginModal: false,
        isLogin: false
    }

    componentDidMount() {
        this.reloadData();

        !!sessionStorage.getItem('AUTH_INFO') && this.notifyLogin();
    }

    reloadData = () => {
        List_Issue().then((resData) => {
            this.setState({
                dataSource: resData.Data
            });
        }).catch(errorHandle);
    }

    addGroup = () => {
        this.getLoginState() && this.setState({
            showGroupModal: true
        });
    }

    editGroup = (record) => {
        this.getLoginState() && this.setState({
            showGroupModal: true,
            groupInfo: record
        });
    }

    delGroup = ({ GroupID, GroupAppeal }) => {
        this.getLoginState() && Modal.confirm({
            title: '信息',
            content: `请确认要删除[${GroupAppeal}]`,
            onOk: async () => {
                await Del_Group(GroupID).then((resData) => {
                    if (resData.Code) {
                        this.reloadData();
                    }
                }).catch(errorHandle);
            }
        });
    }

    addIssue = (record) => {
        this.getLoginState() && this.setState({
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
        this.getLoginState() && Modal.confirm({
            title: '信息',
            content: `请确认要删除[${IssueAppeal}]`,
            onOk: async () => {
                await Del_Issue(IssueID).then((resData) => {
                    if (resData.Code) {
                        this.reloadData();
                    }
                }).catch(errorHandle);
            }
        });
    }

    closeModal = (type) => {
        this.setState({
            [{ group: 'showGroupModal', issue: 'showIssueModal', login: 'showLoginModal' }[type]]: false,
            groupInfo: null,
            issueInfo: null
        });
    }

    handleRowClass = (record) => {
        if (record.IsGroup) {
            return styles['group-row'];
        }
    }

    showIntro = () => {
        Modal.info({
            title: '信息',
            content: (
                <div className='mt-24'>
                    <p>作者：4-2402</p>
                    <p>邮件：yuanwansong@hotmail.com</p>
                </div>
            )
        });
    }

    loginSys = () => {
        this.setState({
            showLoginModal: true
        });
    }

    notifyLogin = () => {
        this.setState({
            isLogin: true
        });
    }

    getLoginState = () => {
        const { isLogin } = this.state;
        if (!isLogin) {
            message.info('请登录后操作！');
            return false;
        }
        return true;
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
            width: '6%',
            dataIndex: 'IssueNo',
            render: (value, row) => {
                const obj = {
                    children: value,
                    props: {},
                };
                if (row.IsGroup) {
                    obj.children = (
                        <Fragment>
                            {row.GroupAppeal}
                            <a className='ml-32' onClick={this.editGroup.bind(this, row)}>修改分类</a>
                            <Divider type='vertical' />
                            <a onClick={this.delGroup.bind(this, row)}>删除分类</a>
                            <Divider type='vertical' />
                            <a onClick={this.addIssue.bind(this, row)}>添加问题</a>
                        </Fragment>
                    );
                    obj.props.colSpan = 7;
                }
                return obj;
            }
        }, {
            title: '诉求',
            width: '22%',
            dataIndex: 'IssueAppeal',
            render: renderCtx
        }, {
            title: '拟整改措施',
            width: '22%',
            dataIndex: 'RectfyInfo',
            render: renderCtx
        }, {
            title: '整改截止日期',
            width: '10%',
            dataIndex: 'RectifyLastDate',
            render: renderCtx
        }, {
            title: '状态',
            width: '10%',
            dataIndex: 'IssueState',
            render: (value, row) => {
                if (!row.IsGroup) {
                    return {
                        children: (
                            <span>{{ 1: '新建', 2: '[开发商]拒绝', 3: '整改中', 4: '整改完毕' }[value]}</span>
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
        }, {
            title: '备注',
            width: '10%',
            dataIndex: 'IssueRemark',
            render: renderCtx
        }, {
            title: '操作',
            width: '10%',
            dataIndex: 'Action',
            render: (value, row) => {
                if (!row.IsGroup) {
                    return {
                        children: (
                            <Fragment>
                                <a onClick={this.editIssue.bind(this, row)}>详情</a>
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
        const { dataSource, showGroupModal, groupInfo, showIssueModal, issueInfo, showLoginModal, isLogin } = this.state;

        return (
            <Fragment>
                <Table
                    title={() => (
                        <Row>
                            <Col span={12}>
                                <Button type='primary' onClick={this.addGroup}>添加分类</Button>
                            </Col>
                            <Col span={12} className='text-right'>
                                <Icon className={styles.icon} onClick={this.showIntro} type="info-circle" theme="twoTone" />
                                {!isLogin && <Icon className={styles.icon} onClick={this.loginSys} type="dashboard" theme="twoTone" />}
                            </Col>
                        </Row>
                    )}
                    rowKey='IssueNo'
                    bordered
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                    rowClassName={this.handleRowClass}>

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
                        reloadData={this.reloadData}
                        isLogin={isLogin} />
                }

                {
                    showLoginModal &&
                    <LoginModal
                        notifyLogin={this.notifyLogin}
                        closeModal={this.closeModal.bind(this, 'login')} />
                }
            </Fragment>
        );
    }
}

export default ResTable;
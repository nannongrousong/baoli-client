import React, { Component, Fragment } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, message, Icon, Select } from 'antd';
import { formItemLayout } from 'APP_CONFIG/formLayout';
import createFormField from 'APP_UTILS/createFormField';
import { errorHandle } from 'APP_UTILS/common';
import { addIssue, editIssue, getIssuePic } from 'APP_SERVICE/Issue';
import CommonUpload from 'APP_COMPONENT/Upload';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class IssueInfo extends Component {
    state = {
        imagePic: [],
        actualPic: []
    }

    componentDidMount() {
        const { record: { IssueID } } = this.props;
        getIssuePic({ IssueID }).then((resData) => {
            const { Data } = resData;
            let imagePic = [];
            let actualPic = [];

            Data.forEach(({ PicID, PicName, PicUrl, PicType }) => {
                let item = {
                    uid: PicID,
                    name: PicName,
                    status: 'done',
                    url: PicUrl,
                    response: PicName
                };
                PicType == 'image' ? imagePic.push(item) : actualPic.push(item);
            });
            this.setState({
                imagePic,
                actualPic
            });
        }).catch(errorHandle);
    }

    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            const { closeModal, reloadData, isLogin } = this.props;
            if (!isLogin) {
                message.info('请登录后操作！');
                return;
            }

            const { imagePic, actualPic } = this.state;

            const ImagePic = imagePic.map(({ response }) => (response));
            const ActualPic = actualPic.map(({ response }) => (response));

            let reqParam = {
                ...values,
                RectfyInfo: values.RectfyInfo || '',
                RectifyLastDate: values.RectifyLastDate ? values.RectifyLastDate.format('YYYY-MM-DD') : '',
                ImagePic,
                ActualPic
            };

            if (values.IssueID) {
                editIssue(reqParam).then(({ Code }) => {
                    if (Code) {
                        reloadData();
                        closeModal();
                    }
                }).catch(errorHandle);
            } else {
                addIssue(reqParam).then(({ Code }) => {
                    if (Code) {
                        reloadData();
                        closeModal();
                    }
                }).catch(errorHandle);
            }
        });
    }

    handleUploadChange = async (type, { file, fileList }) => {
        this.setState({
            [`${type}Pic`]: fileList
        });
    }

    render() {
        const { record, closeModal, form: { getFieldDecorator }, isLogin } = this.props;
        const { imagePic, actualPic } = this.state;

        const ShowUpload = (type, disabled) => {
            const fileList = (type == 'image' ? imagePic : actualPic);
            return (
                <CommonUpload
                    disabled={disabled}
                    maxFileLength={4}
                    supportPreview
                    fileList={fileList}
                    accept='image/*'
                    listType='picture-card'
                    onChange={this.handleUploadChange.bind(this, type)}>
                    <Fragment>
                        <Icon type={'plus'} />
                        <div className="ant-upload-text">上传</div>
                    </Fragment>
                </CommonUpload>
            );
        };

        return (
            <Modal
                visible
                width={900}
                title={record ? '修改' : '新增'}
                onCancel={closeModal}
                onOk={this.saveData}>
                <Form
                    style={{ maxHeight: (document.body.clientHeight - 300), overflowY: 'auto' }}>
                    <FormItem className='d-none'>
                        {
                            getFieldDecorator('IssueID')(
                                <Input />
                            )
                        }
                    </FormItem>

                    <FormItem className='d-none'>
                        {
                            getFieldDecorator('GroupID')(
                                <Input />
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='序号'>
                        {
                            getFieldDecorator('IssueNo', {
                                rules: [{ required: true, message: '请填写序号' }]
                            })(<InputNumber disabled={!isLogin} min={1} max={9999} className='w-100' />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='业主诉求问题'>
                        {
                            getFieldDecorator('IssueAppeal', {
                                rules: [{ required: true, message: '请填写业主诉求问题' }]
                            })(<TextArea disabled={!isLogin} rows={3} maxLength={1000} />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='拟整改措施'>
                        {
                            getFieldDecorator('RectfyInfo', {
                                initialValue: ''
                            })(<TextArea disabled={!isLogin} rows={3} maxLength={1000} />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='承诺完成整改截止日期'>
                        {
                            getFieldDecorator('RectifyLastDate')(<DatePicker disabled={!isLogin} className='w-100' />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='状态'>
                        {
                            getFieldDecorator('IssueState', {
                                rules: [{ required: true, message: '请选择问题状态' }],
                                initialValue: 1
                            })(
                                <Select>
                                    <Option value={1}>新建</Option>
                                    <Option value={2}>[开发商]拒绝</Option>
                                    <Option value={3}>整改中</Option>
                                    <Option value={4}>整改完毕</Option>
                                </Select>
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='备注'>
                        {
                            getFieldDecorator('IssueRemark')(<TextArea disabled={!isLogin} rows={3} maxLength={1000} />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='效果图'>
                        {
                            getFieldDecorator('ImagePic')(
                                ShowUpload('image', !isLogin)
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='实际图'>
                        {
                            getFieldDecorator('ActualPic')(
                                ShowUpload('actual', !isLogin)
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

IssueInfo = Form.create({
    mapPropsToFields: (props) => {
        const { record } = props;
        if (record) {
            return createFormField({ ...record, RectifyLastDate: record.RectifyLastDate ? moment(record.RectifyLastDate) : undefined });
        }
    }
})(IssueInfo);

export default IssueInfo;
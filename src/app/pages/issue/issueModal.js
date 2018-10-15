import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Upload, Icon } from 'antd';
import { formItemLayout } from 'APP_CONFIG/formLayout';
import createFormField from 'APP_UTILS/createFormField';
import { errorHandle } from 'APP_UTILS/common';
import { addIssue, editIssue, getIssuePic } from 'APP_SERVICE/BAOLI';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;

const uploadButton = (
    <div>
        <Icon type={'plus'} />
        <div className="ant-upload-text">Upload</div>
    </div>
);

class GroupInfo extends Component {
    state = {
        imagePic: [],
        actualPic: []
    }

    componentDidMount() {
        const { record: { IssueID } } = this.props;
        getIssuePic({ IssueID }).then((resData) => {
            const { Data: { Actual, Image } } = resData;
            this.setState({
                imagePic: Image,
                actualPic: Actual
            });
        }).catch(errorHandle);
    }

    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            let { closeModal, reloadData } = this.props;
            let reqParam = {
                ...values,
                RectfyInfo: values.RectfyInfo || '',
                RectifyLastDate: values.RectifyLastDate ? values.RectifyLastDate.format('YYYY-MM-DD') : ''
            };

            if (values.IssueID) {
                editIssue(reqParam).then(() => {
                    reloadData();
                    closeModal();
                }).catch(errorHandle);
            } else {
                addIssue(reqParam).then(() => {
                    reloadData();
                    closeModal();
                }).catch(errorHandle);
            }
        });
    }

    render() {
        let { record, closeModal, form: { getFieldDecorator } } = this.props;

        return (
            <Modal
                visible
                width={600}
                title={record ? '修改' : '新增'}
                onCancel={closeModal}
                onOk={this.saveData}>
                <Form>
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
                            })(<InputNumber min={1} max={9999} className='w-100' />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='业主诉求问题'>
                        {
                            getFieldDecorator('IssueAppeal', {
                                rules: [{ required: true, message: '请填写业主诉求问题' }]
                            })(<TextArea rows={6} maxLength={1000} />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='拟整改措施'>
                        {
                            getFieldDecorator('RectfyInfo', {
                                initialValue: ''
                            })(<Input maxLength={1000} />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='承诺完成整改截止日期'>
                        {
                            getFieldDecorator('RectifyLastDate')(<DatePicker className='w-100' />)
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='效果图'>
                        {
                            getFieldDecorator('ImagePic')(
                                <Upload
                                    accept='image/*'
                                    action=''
                                    listType='picture-card'>
                                    {uploadButton}
                                </Upload>
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='实际图'>
                        {
                            getFieldDecorator('ActualPic')(
                                <Upload listType='picture-card'>
                                    {uploadButton}
                                </Upload>
                            )
                        }
                    </FormItem>

                </Form>
            </Modal>
        );
    }
}

GroupInfo = Form.create({
    mapPropsToFields: (props) => {
        const { record } = props;
        if (record) {
            return createFormField({ ...record, RectifyLastDate: record.RectifyLastDate ? moment(record.RectifyLastDate) : undefined });
        }
    }
})(GroupInfo);

export default GroupInfo;
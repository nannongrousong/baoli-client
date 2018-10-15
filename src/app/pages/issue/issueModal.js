import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import { formItemLayout } from 'APP_CONFIG/formLayout';
import createFormField from 'APP_UTILS/createFormField';
import { errorHandle } from 'APP_UTILS/common';
import { addIssue, editIssue } from 'APP_SERVICE/BAOLI';
import moment from 'moment';

const FormItem = Form.Item;

class GroupInfo extends Component {
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
                            })(<Input maxLength={1000} />)
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
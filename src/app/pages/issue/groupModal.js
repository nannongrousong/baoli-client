import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';
import { formItemLayout } from 'APP_CONFIG/formLayout';
import createFormField from 'APP_UTILS/createFormField';
import { errorHandle } from 'APP_UTILS/common';
import { addGroup, editGroup } from 'APP_SERVICE/Group';

const FormItem = Form.Item;

class GroupInfo extends Component {
    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }

            let { closeModal, reloadData } = this.props;

            if (values.GroupID) {
                editGroup(values).then(() => {
                    reloadData();
                    closeModal();
                }).catch(errorHandle);
            } else {
                addGroup(values).then(() => {
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
                    <FormItem>
                        {
                            getFieldDecorator('GroupID')(
                                <Input className='d-none' />
                            )
                        }
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label='问题分类名称'>
                        {
                            getFieldDecorator('GroupAppeal', {
                                rules: [{ required: true, message: '请填写问题分类名称' }]
                            })(<Input maxLength={100} />)
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
            return createFormField(record);
        }
    }
})(GroupInfo);

export default GroupInfo;
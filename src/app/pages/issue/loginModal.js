import React, { Component } from 'react';
import { Modal, Form, Icon, Button, Input } from 'antd';
import PropTypes from 'prop-types';
import { Login_Sys } from 'APP_SERVICE/Login';
import { errorHandle } from 'APP_UTILS/common';

const FormItem = Form.Item;

class LoginInfo extends Component {

    handleLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (err) {
                return;
            }

            const { closeModal, notifyLogin } = this.props;

            try {
                let resData = await Login_Sys(values);
                const { Data } = resData;
                sessionStorage.setItem('AUTH_INFO', Data);
                !!sessionStorage.getItem('AUTH_INFO') && notifyLogin();
                closeModal();
            } catch (err) {
                errorHandle(err);
            }
        });
    }

    render() {
        const { form: { getFieldDecorator }, closeModal } = this.props;
        return (
            <Modal
                visible
                title='登录'
                footer={null}
                onCancel={closeModal}>
                <Form onSubmit={this.handleLogin}>
                    <FormItem>
                        {getFieldDecorator('LoginName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input size='large' prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder='用户名' />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('Password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input size='large' prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='密码' />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type='primary' htmlType='submit' className='w-100'>登录</Button>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

LoginInfo.propTypes = {
    form: PropTypes.object,
    closeModal: PropTypes.func,
    notifyLogin: PropTypes.func
};

LoginInfo = Form.create()(LoginInfo);

export default LoginInfo;
import React, { Component, Fragment } from 'react';
import { Upload, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Upload_Attach, Del_Attach } from 'APP_SERVICE/Attach';
import { errorHandle } from 'APP_UTILS/common';

class Index extends Component {
    state = {
        previewVisible: false,
        previewUrl: ''
    }

    //  https://github.com/react-component/upload#customrequest
    customRequest = async ({ onError, onSuccess, data, filename, file }) => {
        //  onError错误回调
        //  onSuccess成功回调
        //  data额外参数
        //  filename文件名称
        //  file文件对象
        const formData = new FormData();
        if (data) {
            Object.keys(data).map(key => {
                formData.append(key, data[key]);
            });
        }

        formData.append(filename, file);

        try {
            const resData = await Upload_Attach(formData);
            const { Code, Data, Info } = resData;
            if (Code) {
                onSuccess(Data, file);
            } else {
                onError(Info);
            }
        } catch (err) {
            onError(err);
        }

        return {
            abort() {
                console.log('upload progress is aborted.');
            }
        };
    }

    closePreview = () => {
        this.setState({
            previewVisible: false
        });
    }

    handlePreview = (file) => {
        this.setState({
            previewUrl: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }

    handleFileChange = async ({ file, fileList }) => {
        console.log('file', file);
        const { onChange } = this.props;
        const { status, response } = file;
        if (status == 'removed') {
            try {
                await Del_Attach(response);
            } catch (err) {
                errorHandle(err);
            }
        }

        onChange({ file, fileList });
    }

    render() {
        const { children, supportPreview, maxFileLength = 10, fileList } = this.props;
        const { previewUrl, previewVisible } = this.state;

        return (
            <Fragment>
                <Upload
                    {...this.props}
                    onPreview={this.handlePreview}
                    customRequest={this.customRequest}
                    onChange={this.handleFileChange} >
                    {fileList.length <= maxFileLength && children}
                </Upload>
                {
                    supportPreview &&
                    <Modal
                        visible={previewVisible}
                        footer={null}
                        onCancel={this.closePreview}>
                        <img alt="example" style={{ width: '100%' }} src={previewUrl} />
                    </Modal>
                }

            </Fragment>
        );
    }
}

Index.propTypes = {
    multiple: PropTypes.bool
};

export default Index;
import React from 'react';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function ImagesUC({ fileList: propFileList }) {
    const [fileList, setFileList] = React.useState( propFileList || [] );

    return (
        <Upload
            action="https://api.imgbb.com/1/upload"
            listType="picture-card"
            fileList={fileList}
            data={{ key: 'value' }} 
        >
            {fileList.length >= 5 ? null : (
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            )}
        </Upload>
    );
}

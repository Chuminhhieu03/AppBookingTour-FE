import React from 'react';
import { Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function ImagesUC({ single=false, maxLength=20, entityId=undefined, viewOnly=false }) {
    const [fileList, setFileList] = React.useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handlePreview = async (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    
    return (
        <Upload
            action="https://api.imgbb.com/1/upload"
            listType="picture-card"
            fileList={fileList}
            maxCount={single ? 1 : undefined}
            onPreview={handlePreview}
            onChange={handleChange}
            name="file"
            data={{ entityId: entityId }}
            showUploadList={{ showUploadList: !viewOnly }}
        >
            {(single || fileList.length < maxLength) && !viewOnly &&
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
            }
            {previewImage && (
                <Image
                    wrapperStyle={{ display: 'none' }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: visible => setPreviewOpen(visible),
                        afterOpenChange: visible => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
        </Upload>
    );
}

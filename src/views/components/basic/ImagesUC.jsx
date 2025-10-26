import React from 'react';
import { Upload, Button, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function ImagesUC({ imageUrl, onChange, viewOnly = false }) {
    const [fileList, setFileList] = React.useState([]);
    const [previewUrl, setPreviewUrl] = React.useState(imageUrl || '');

    React.useEffect(() => {
        if (imageUrl) {
            setPreviewUrl(imageUrl);
            setFileList([
                {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: imageUrl
                }
            ]);
        } else {
            setPreviewUrl('');
            setFileList([]);
        }
    }, [imageUrl]);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                if (onChange) onChange(url, file);
            }
        } else {
            setPreviewUrl('');
            if (onChange) onChange('', '');
        }
    };

    const renderEdit = () => (
        <div
            style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            {previewUrl ? (
                <>
                    <Image
                        src={previewUrl}
                        alt="Preview"
                        style={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 8,
                            display: 'block'
                        }}
                        preview={true}
                    />
                    <Button
                        type="link"
                        danger
                        onClick={() => {
                            setFileList([]);
                            setPreviewUrl('');
                            if (onChange) onChange('', '');
                        }}
                        style={{ marginTop: 8 }}
                    >
                        Xóa ảnh
                    </Button>
                </>
            ) : (
                <Upload
                    listType="picture-card"
                    showUploadList={false}
                    onChange={handleChange}
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*"
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                    </div>
                </Upload>
            )}
        </div>
    );

    const renderDisplay = () => (
        <div style={{ textAlign: 'center' }}>
            {previewUrl ? (
                <Image
                    src={previewUrl}
                    alt="Preview"
                    style={{
                        width: 150,
                        height: 150,
                        objectFit: 'cover',
                        borderRadius: 8,
                        display: 'block'
                    }}
                    preview={true}
                />
            ) : (
                <p>Không có ảnh</p>
            )}
        </div>
    );

    return viewOnly ? renderDisplay() : renderEdit();
}

import React from 'react';
import { Upload, Button, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function ImagesUC({ imageUrl, onChange }) {
    const [fileList, setFileList] = React.useState([]);
    const [previewUrl, setPreviewUrl] = React.useState(imageUrl || null);

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
        }
    }, [imageUrl]);

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);

        // Nếu có file mới
        if (newFileList.length > 0) {
            const file = newFileList[0].originFileObj;
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            if (onChange) onChange(file);
        } else {
            setPreviewUrl(null);
            if (onChange) onChange(null);
        }
    };

    return (
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                            setPreviewUrl(null);
                            if (onChange) onChange(null);
                        }}
                        style={{ marginTop: 8 }}
                    >
                        Xóa ảnh
                    </Button>
                </>
            ) : (
                <Upload
                    listType="picture-card"
                    fileList={fileList}
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
}

import { Upload, Button, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

export default function Gallery({ listImage = [], onChange, viewOnly = false }) {
  const [listNewImage, setListNewImage] = useState([]); // ListNewImage: Những file đc tải lên bởi nút upload
  const [listOldImage, setListOldImage] = useState(listImage); // ListOldImage: Những file đã có từ trước (đc truyền vào qua props)

  useEffect(() => {
    setListOldImage(listImage);
  }, [listImage]);

  const handleChange = ({ fileList: newFileList }) => {
    setListNewImage(newFileList);
    const listNewImageFile = newFileList?.map((file) => file.originFileObj || null);
    if (onChange) onChange(listOldImage, listNewImageFile);
  };

  const handleRemove = (index) => {
    const newFileList = listNewImage.filter((_, i) => i !== index);
    setListNewImage(newFileList);
    const listNewImageFile = newFileList?.map((file) => file.originFileObj || null);
    if (onChange) onChange(listOldImage, listNewImageFile);
  };

  const handleRemoveOldImage = (index) => {
    const listOldImageTmp = listOldImage.filter((_, i) => i !== index);
    setListOldImage(listOldImageTmp);
    const listNewImageFile = listNewImage?.map((file) => file.originFileObj || null);
    if (onChange) onChange(listOldImageTmp, listNewImageFile);
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'flex-start'
        }}
      >
        {listOldImage?.map((file, index) => {
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                width: 150
              }}
            >
              <Image
                src={file.url}
                alt={`Preview ${index}`}
                width={150}
                height={150}
                style={{
                  objectFit: 'cover',
                  borderRadius: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
                preview
              />
              {!viewOnly && (
                <Button type="link" danger size="small" onClick={() => handleRemoveOldImage(index)}>
                  Xóa
                </Button>
              )}
            </div>
          );
        })}
        {listNewImage?.map((file, index) => {
          const src = file.originFileObj ? URL.createObjectURL(file.originFileObj) : '';
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                width: 150
              }}
            >
              <Image
                src={src}
                alt={`Preview ${index}`}
                width={150}
                height={150}
                style={{
                  objectFit: 'cover',
                  borderRadius: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}
                preview
              />
              {!viewOnly && (
                <Button type="link" danger size="small" onClick={() => handleRemove(index)}>
                  Xóa
                </Button>
              )}
            </div>
          );
        })}
        {!viewOnly && (
          <Upload
            listType="picture-card"
            fileList={listNewImage}
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleChange}
            multiple
            accept="image/*"
          >
            <div>
              <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
              <div style={{ marginTop: 8, color: '#999' }}>Chọn ảnh</div>
            </div>
          </Upload>
        )}
      </div>
    </div>
  );
}

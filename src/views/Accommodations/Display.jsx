import { Col, Row, Button, Space, Input, InputNumber } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';
import Utility from '../../utils/Utility';

const { TextArea } = Input;

export default function Display() {
    const [accommodation, setAccommodation] = useState({});
    const { id } = useParams();

    useEffect(() => {
        setupDisplayForm();
    }, []);

    const setupDisplayForm = async () => {
        try {
            LoadingModal.showLoading();
            const response = await fetch(`https://localhost:44331/api/Accommodation/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const res = await response.json();
            setAccommodation(res.accommodation ?? {});
        } catch (error) {
            console.error('Error fetching accommodation details:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết cơ sở lưu trú"
                    secondary={
                        <Space>
                            <Button type="primary" href={`/admin/sale/accommodation/edit/${id}`} shape="round" icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                            <Button type="primary" href="/admin/sale/accommodation" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <span>Loại</span>
                            <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action=""
                                beforeUpload={() => false}
                            >
                                {imageUrl ? (
                                <img draggable={false} src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                ) : (
                                uploadButton
                                )}
                            </Upload>
                        </Col>
                        <Col span={8}>
                            <span>Tên</span>
                            <Input value={accommodation.name} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Loại</span>
                            <Input value={accommodation.typeName} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Thành phố</span>
                            <Input value={accommodation.cityName} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Địa chỉ chi tiết</span>
                            <Input value={accommodation.address} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Hạng sao</span>
                            <Rate value={accommodation.starRating} readOnly />
                        </Col>
                        <Col span={12}>
                            <span>Tiện ích</span>
                            <TextArea value={accommodation.amenities} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Quy định</span>
                            <TextArea value={accommodation.rules} readOnly />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={accommodation.description}
                                readOnly
                            />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

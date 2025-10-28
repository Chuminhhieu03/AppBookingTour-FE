import { Col, Row, Button, Space, Input, Select, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;

export default function TourTypeDisplay() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tourType, setTourType] = useState({});

    useEffect(() => {
        if (id) {
            fetchTourType();
        }
    }, [id]);

    const fetchTourType = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourTypeAPI.getById(id);
            if (response.success) {
                setTourType(response.data || {});
            } else {
                message.error('Không tìm thấy loại tour!');
            }
        } catch (error) {
            console.error('Error fetching tour type:', error);
            message.error('Đã xảy ra lỗi khi tải loại tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleEdit = () => {
        navigate(`/admin/service/tour-type/edit/${id}`);
    };

    const handleBack = () => {
        navigate('/admin/service/tour-type');
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết loại tour"
                    secondary={
                        <Space>
                            <Button type="primary" onClick={handleEdit} shape="round" icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                            <Button onClick={handleBack} shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
                            <span>Tên loại tour</span>
                            <Input value={tourType.name} readOnly />
                        </Col>
                        <Col span={12}>
                            <span>Trạng thái</span>
                            <Select value={tourType.isActive} disabled style={{ width: '100%' }}>
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Ngừng hoạt động</Select.Option>
                            </Select>
                        </Col>
                        <Col span={12}>
                            <span>Ngày tạo</span>
                            <Input value={tourType.createdAt ? new Date(tourType.createdAt).toLocaleDateString('vi-VN') : ''} readOnly />
                        </Col>
                        {tourType.updatedAt && (
                            <Col span={12}>
                                <span>Ngày cập nhật</span>
                                <Input value={new Date(tourType.updatedAt).toLocaleDateString('vi-VN')} readOnly />
                            </Col>
                        )}
                        {tourType.imageUrl && (
                            <Col span={24}>
                                <span>Hình ảnh</span>
                                <div style={{ marginTop: 8 }}>
                                    <img
                                        src={tourType.imageUrl}
                                        alt={tourType.name}
                                        style={{
                                            maxWidth: 300,
                                            maxHeight: 200,
                                            objectFit: 'cover',
                                            borderRadius: 4,
                                            border: '1px solid #d9d9d9'
                                        }}
                                    />
                                </div>
                            </Col>
                        )}
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea value={tourType.description || 'Không có mô tả'} readOnly rows={4} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

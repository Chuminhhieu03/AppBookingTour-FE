import { Col, Row, Button, Space, Input, Select, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';
import LoadingModal from '../../../components/LoadingModal';
import ImagesUC from '../../components/basic/ImagesUC';
import Constants from 'Constants/Constants';
import Utility from 'utils/Utility';

const { TextArea } = Input;

export default function TourTypeDisplay() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tourType, setTourType] = useState({});

    useEffect(() => {
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

        if (id) {
            fetchTourType();
        }
    }, [id]);

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
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <ImagesUC imageUrl={tourType.imageUrl} viewOnly={true} />
                            </div>
                            <span>Hình ảnh loại tour</span>
                        </Col>
                        <Col span={8}>
                            <span>Tên loại tour</span>
                            <Input value={tourType.name} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Loại mức giá</span>
                            <Input
                                value={Utility.getLabelByValue(Constants.PriceLevelOptions, tourType.priceLevel) || 'Chưa xác định'}
                                readOnly
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select value={tourType.isActive} disabled style={{ width: '100%' }}>
                                {Constants.StatusOptions.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <span>Ngày tạo</span>
                            <Input value={tourType.createdAt ? new Date(tourType.createdAt).toLocaleDateString('vi-VN') : ''} readOnly />
                        </Col>
                        {tourType.updatedAt && (
                            <Col span={8}>
                                <span>Ngày cập nhật</span>
                                <Input value={new Date(tourType.updatedAt).toLocaleDateString('vi-VN')} readOnly />
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

import { Col, Row, Button, Space, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourDepartureAPI from '../../../api/tour/tourDepartureAPI';
import LoadingModal from '../../../components/LoadingModal';
import dayjs from 'dayjs';

const { Option } = Select;

export default function TourDepartureDisplay() {
    const navigate = useNavigate();
    const { tourId, departureId } = useParams();
    const [departure, setDeparture] = useState({});

    useEffect(() => {
        if (departureId) {
            fetchDeparture();
        }
    }, [departureId]);

    const fetchDeparture = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourDepartureAPI.getById(departureId);
            if (response.success) {
                setDeparture(response.data || {});
            } else {
                message.error('Không tìm thấy lịch khởi hành!');
            }
        } catch (error) {
            console.error('Error fetching departure:', error);
            message.error('Đã xảy ra lỗi khi tải lịch khởi hành.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleEdit = () => {
        navigate(`/admin/service/tour/${tourId}/departure/edit/${departureId}`);
    };

    const handleBack = () => {
        navigate(`/admin/service/tour/edit/${tourId}`);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết lịch khởi hành"
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
                    {/* Hàng 1: Ngày khởi hành | Ngày kết thúc | Trạng thái */}
                    <Row gutter={[24, 24]}>
                        <Col span={8}>
                            <span>Ngày khởi hành</span>
                            <DatePicker
                                value={departure.departureDate ? dayjs(departure.departureDate) : null}
                                disabled
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Col>
                        <Col span={8}>
                            <span>Ngày kết thúc</span>
                            <DatePicker
                                value={departure.returnDate ? dayjs(departure.returnDate) : null}
                                disabled
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select value={departure.status} disabled style={{ width: '100%' }}>
                                <Option value={1}>Có sẵn</Option>
                                <Option value={2}>Hết chỗ</Option>
                                <Option value={3}>Đã hủy</Option>
                            </Select>
                        </Col>
                    </Row>

                    {/* Hàng 2: Giá người lớn | Giá trẻ em */}
                    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                        <Col span={12}>
                            <span>Giá người lớn</span>
                            <InputNumber
                                value={departure.priceAdult}
                                readOnly
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="VNĐ"
                            />
                        </Col>
                        <Col span={12}>
                            <span>Giá trẻ em</span>
                            <InputNumber
                                value={departure.priceChildren}
                                readOnly
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                addonAfter="VNĐ"
                            />
                        </Col>
                    </Row>

                    {/* Hàng 3: Số chỗ còn trống | Hướng dẫn viên */}
                    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                        <Col span={12}>
                            <span>Số chỗ còn trống</span>
                            <InputNumber value={departure.availableSlots} readOnly style={{ width: '100%' }} />
                        </Col>
                        <Col span={12}>
                            <span>Hướng dẫn viên phụ trách</span>
                            <Select value={departure.guideId} disabled style={{ width: '100%' }}>
                                <Option value="guide-1">Nguyễn Văn A</Option>
                                <Option value="guide-2">Trần Thị B</Option>
                                <Option value="guide-3">Lê Văn C</Option>
                                <Option value="guide-4">Phạm Thị D</Option>
                            </Select>
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

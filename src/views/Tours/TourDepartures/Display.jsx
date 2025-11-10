import { Col, Row, Button, Space, Input, InputNumber, Select, DatePicker, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourDepartureAPI from '../../../api/tour/tourDepartureAPI';
import LoadingModal from '../../../components/LoadingModal';
import dayjs from 'dayjs';
import Constants from 'Constants/Constants';
import Utility from 'utils/Utility';

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
                    {/* Hàng 1: Thông tin ngày giờ khởi hành và kết thúc */}
                    <Row gutter={[24, 24]}>
                        <Col span={6}>
                            <span>Ngày khởi hành</span>
                            <DatePicker
                                value={departure.departureDate ? dayjs(departure.departureDate) : null}
                                disabled
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Giờ khởi hành</span>
                            <Input
                                value={departure.departureDate ? dayjs(departure.departureDate).format('HH:mm') : ''}
                                disabled
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col span={6}>
                            <span>Ngày kết thúc</span>
                            <DatePicker
                                value={departure.returnDate ? dayjs(departure.returnDate) : null}
                                disabled
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Giờ trở về</span>
                            <Input
                                value={departure.returnDate ? dayjs(departure.returnDate).format('HH:mm') : ''}
                                disabled
                                style={{ width: '100%' }}
                            />
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

                    {/* Hàng 3: Số chỗ còn trống | Trạng thái | Hướng dẫn viên */}
                    <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                        <Col span={6}>
                            <span>Số chỗ còn trống</span>
                            <InputNumber value={departure.availableSlots} readOnly style={{ width: '100%' }} />
                        </Col>
                        <Col span={6}>
                            <span>Số chỗ đã đặt</span>
                            <InputNumber value={departure.bookedSlots} disabled style={{ width: '100%' }} />
                        </Col>
                        <Col span={6}>
                            <span>Trạng thái</span>
                            <Input
                                value={Utility.getLabelByValue(Constants.TourDepartureStatusOptions, departure.status)}
                                readOnly
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col span={6}>
                            <span>Hướng dẫn viên phụ trách</span>
                            <Input value={departure.guideName} readOnly style={{ width: '100%' }} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

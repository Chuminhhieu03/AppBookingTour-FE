import { Col, Row, Button, Space, Input, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourItineraryAPI from '../../../api/tour/tourItineraryAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;

export default function TourItineraryDisplay() {
    const navigate = useNavigate();
    const { tourId, itineraryId } = useParams();
    const [itinerary, setItinerary] = useState({});

    useEffect(() => {
        if (itineraryId) {
            fetchItinerary();
        }
    }, [itineraryId]);

    const fetchItinerary = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourItineraryAPI.getById(itineraryId);
            if (response.success) {
                setItinerary(response.data || {});
            } else {
                message.error('Không tìm thấy lịch trình!');
            }
        } catch (error) {
            console.error('Error fetching itinerary:', error);
            message.error('Đã xảy ra lỗi khi tải lịch trình.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleEdit = () => {
        navigate(`/admin/service/tour/${tourId}/itinerary/edit/${itineraryId}`);
    };

    const handleBack = () => {
        navigate(`/admin/service/tour/edit/${tourId}`);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết lịch trình"
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
                        <Col span={8}>
                            <span>Ngày thứ</span>
                            <Input value={`Ngày ${itinerary.dayNumber}`} readOnly />
                        </Col>
                        <Col span={16}>
                            <span>Tiêu đề lịch trình</span>
                            <Input value={itinerary.title} readOnly />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả chi tiết</span>
                            <TextArea value={itinerary.description} readOnly rows={4} />
                        </Col>
                        <Col span={24}>
                            <span>Hoạt động trong ngày</span>
                            <TextArea value={itinerary.activity} readOnly rows={6} />
                        </Col>
                        <Col span={24}>
                            <span>Ghi chú</span>
                            <TextArea value={itinerary.note} readOnly rows={3} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

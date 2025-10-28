import { Col, Row, Button, Space, Input, InputNumber } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';
import tourAPI from '../../api/tour/tourAPI';
import TourItineraryTable from './TourItineraries/TourItineraryTable';
import TourDepartureTable from './TourDepartures/TourDepartureTable';

const { TextArea } = Input;

export default function TourDisplay() {
    const [tour, setTour] = useState({});
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setupDisplayForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const setupDisplayForm = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourAPI.getById(id);
            if (response.success) {
                setTour(response.data || {});
            }
        } catch (error) {
            console.error('Error fetching tour details:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết tour"
                    secondary={
                        <Space>
                            <Button type="primary" href={`/admin/service/tour/edit/${id}`} shape="round" icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                            <Button type="primary" href="/admin/service/tour" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <ImagesUC imageUrl={tour.coverImgUrl} viewOnly />
                            </div>
                            <span>Hình đại diện</span>
                        </Col>
                        <Col span={8}>
                            <span>Tên tour</span>
                            <Input value={tour.name} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Loại tour</span>
                            <Input value={tour.tourTypeName} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Nơi khởi hành</span>
                            <Input value={tour.departurePoint?.name} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Nơi đến</span>
                            <Input value={tour.destination} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Ngày khởi hành</span>
                            <Input value={tour.startDate} readOnly />
                            {/* Cần format ngày tháng */}
                        </Col>
                        <Col span={8}>
                            <span>Thời gian</span>
                            <Input value={tour.duration} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Giá (VND)</span>
                            <InputNumber
                                value={tour.price}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                readOnly
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Input value={tour.statusName} readOnly />
                        </Col>

                        <Col span={24}>
                            <span>Hình ảnh khác</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                <Gallery listImage={tour.listInfoImage} viewOnly />
                            </div>
                        </Col>
                        <Col span={12}>
                            <span>Dịch vụ bao gồm</span>
                            <TextArea value={tour.inclusions} readOnly rows={6} />
                        </Col>
                        <Col span={12}>
                            <span>Lịch trình chi tiết</span>
                            <TextArea value={tour.itinerary} readOnly rows={6} />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea value={tour.description} readOnly rows={4} />
                        </Col>
                    </Row>
                    {/* Tour Itineraries Section */}
                    <Row className="mt-5">
                        <Col span={24}>
                            <TourItineraryTable tourId={id} isEditMode={false} />
                        </Col>
                    </Row>

                    {/* Tour Departures Section */}
                    <Row>
                        <Col span={24}>
                            <TourDepartureTable tourId={id} isEditMode={false} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

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
                                <ImagesUC imageUrl={tour.imageMainUrl} viewOnly />
                            </div>
                            <span>Ảnh bìa</span>
                        </Col>

                        <Col span={6}>
                            <span>Mã tour</span>
                            <Input value={tour.code} readOnly />
                        </Col>
                        <Col span={18}>
                            <span>Tên tour</span>
                            <Input value={tour.name} readOnly />
                        </Col>
                        <Col span={6}>
                            <span>Loại tour</span>
                            <Input value={tour.typeName} readOnly />
                        </Col>
                        <Col span={6}>
                            <span>Danh mục tour</span>
                            <Input value={tour.categoryName} readOnly />
                        </Col>
                        <Col span={6}>
                            <span>Thành phố khởi hành</span>
                            <Input value={tour.departureCityName} readOnly />
                        </Col>
                        <Col span={6}>
                            <span>Thành phố tham quan</span>
                            <Input value={tour.destinationCityName} readOnly />
                        </Col>
                        <Col span={6}>
                            <span>Số ngày lưu trú</span>
                            <InputNumber value={tour.durationDays} className="w-100" readOnly addonAfter="Ngày" />
                        </Col>
                        <Col span={6}>
                            <span>Số đêm lưu trú</span>
                            <InputNumber value={tour.durationNights} className="w-100" readOnly addonAfter="Đêm" />
                        </Col>
                        <Col span={6}>
                            <span>Số lượng hành khách tối thiểu</span>
                            <InputNumber value={tour.minParticipants} className="w-100" readOnly addonAfter="Hành khách" />
                        </Col>
                        <Col span={6}>
                            <span>Số lượng hành khách tối đa</span>
                            <InputNumber value={tour.maxParticipants} className="w-100" readOnly addonAfter="Hành khách" />
                        </Col>
                        <Col span={6}>
                            <span>Giá cơ bản người lớn (VND)</span>
                            <InputNumber
                                value={tour.basePriceAdult}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                readOnly
                                addonAfter="VNĐ"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Giá cơ bản trẻ em (VND)</span>
                            <InputNumber
                                value={tour.basePriceChild}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                readOnly
                                addonAfter="VNĐ"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Trạng thái</span>
                            <Input value={tour.isActive ? 'Hoạt động' : 'Ngừng hoạt động'} readOnly />
                        </Col>

                        <Col span={24}>
                            <span>Hình ảnh khác</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                <Gallery listImage={tour.imageUrls?.map((url) => ({ url })) || []} viewOnly />
                            </div>
                        </Col>
                        <Col span={12}>
                            <span>Tour bao gồm</span>
                            <TextArea value={tour.includes?.join('\n')} readOnly rows={4} />
                        </Col>
                        <Col span={12}>
                            <span>Tour không bao gồm</span>
                            <TextArea value={tour.excludes?.join('\n')} readOnly rows={4} />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả về tour</span>
                            <TextArea value={tour.description} readOnly rows={4} />
                        </Col>
                        <Col span={24}>
                            <span>Điều khoản & điều kiện của tour</span>
                            <TextArea value={tour.termsConditions} readOnly rows={4} />
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

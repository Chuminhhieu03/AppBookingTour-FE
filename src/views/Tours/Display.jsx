import { Col, Row, Button, Space, Input, InputNumber, Tabs, Typography, Empty } from 'antd';
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
import TourAdditionalInfo from './TourAdditionalInfo';
import TourImportantInfo from './TourImportantInfo';
import Constants from 'Constants/Constants';
import Utility from 'utils/Utility';

const { TextArea } = Input;
const { Title } = Typography;
const DEFAULT_IMAGE = '/images/default-cover-img.jpg';

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
                <MainCard>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                        <Col>
                            <Title level={3} style={{ margin: 0 }}>
                                Chi tiết tour
                            </Title>
                        </Col>
                        <Col>
                            <Space>
                                <Button type="primary" href={`/admin/service/tour/edit/${id}`} shape="round" icon={<EditOutlined />}>
                                    Chỉnh sửa
                                </Button>
                                <Button type="primary" onClick={() => navigate(-1)} shape="round" icon={<CloseOutlined />}>
                                    Thoát
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <Tabs defaultActiveKey="1" size="large">
                        <Tabs.TabPane tab="Thông tin cơ bản" key="1">
                            <Row gutter={[24, 24]}>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    <div className="mb-3 d-flex justify-content-center">
                                        <ImagesUC imageUrl={tour.imageMainUrl || DEFAULT_IMAGE} viewOnly />
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
                                    <Input value={Utility.getLabelByValue(Constants.StatusOptions, tour.isActive)} readOnly />
                                </Col>

                                <Col span={24}>
                                    <span>Hình ảnh khác</span>
                                    <div style={{ marginTop: 8, marginBottom: 24 }}>
                                        {tour.imageUrls && tour.imageUrls.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                                <Gallery listImage={tour.imageUrls.map((url) => ({ url }))} viewOnly />
                                            </div>
                                        ) : (
                                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có hình ảnh nào" />
                                        )}
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <span>Mô tả về tour</span>
                                    <TextArea value={tour.description} readOnly rows={4} />
                                </Col>
                            </Row>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Thông tin chuyến đi" key="2">
                            <TourAdditionalInfo additionalInfo={tour.additionalInfo} readOnly={true} />
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Thông tin quan trọng" key="3">
                            <TourImportantInfo importantInfo={tour.importantInfo} readOnly={true} />
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Lịch trình tour" key="4">
                            <TourItineraryTable mode="api" tourId={id} readOnly />
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="Lịch khởi hành tour" key="5">
                            <TourDepartureTable mode="api" tourId={id} readOnly />
                        </Tabs.TabPane>
                    </Tabs>
                </MainCard>
            </Col>
        </Row>
    );
}

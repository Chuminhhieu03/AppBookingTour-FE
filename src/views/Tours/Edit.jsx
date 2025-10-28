import { Col, Row, Button, Space, Input, Select, InputNumber, DatePicker, message } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams, useNavigate } from 'react-router-dom';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';
import tourAPI from '../../api/tour/tourAPI';
import tourCategoryAPI from '../../api/tour/tourCategoryAPI';
import tourTypeAPI from '../../api/tour/tourTypeAPI';
import cityAPI from '../../api/city/cityAPI';
import TourItineraryTable from './TourItineraries/TourItineraryTable';
import TourDepartureTable from './TourDepartures/TourDepartureTable';

const { TextArea } = Input;

export default function TourEdit() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [tour, setTour] = useState({});
    const [tourCategories, setTourCategories] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (id) {
            setupEditForm();
            fetchDropdownData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Fetch dropdown data
    const fetchDropdownData = async () => {
        try {
            // Fetch tour categories
            const categoryResponse = await tourCategoryAPI.getList();
            if (categoryResponse.success) {
                setTourCategories(categoryResponse.data || []);
            }

            // Fetch tour types
            const typeResponse = await tourTypeAPI.getList();
            if (typeResponse.success) {
                setTourTypes(typeResponse.data || []);
            }

            // Fetch cities
            const cityResponse = await cityAPI.getListCity();
            if (cityResponse.success) {
                setCities(cityResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            message.error('Đã xảy ra lỗi khi tải dữ liệu dropdown.');
        }
    };

    const setupEditForm = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourAPI.getById(id);
            if (response.success) {
                setTour(response.data || {});
            }
        } catch (error) {
            console.error('Error fetching tour details for edit:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const onEditTour = async (tourData) => {
        try {
            LoadingModal.showLoading();
            const response = await tourAPI.update(id, tourData);
            if (response.success) {
                message.success('Cập nhật tour thành công!');
                navigate(`/admin/service/tour/display/${id}`);
            } else {
                message.error('Cập nhật tour thất bại!');
            }
        } catch (error) {
            console.error('Error updating tour:', error);
            message.error('Đã xảy ra lỗi khi cập nhật tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    // Handlers cho modals (nếu có)
    // const handleOk = (success) => {
    //     setIsOpenModalAddnew(false);
    //     if (success) setupEditForm();
    // };
    // const handleCancel = () => setIsOpenModalAddnew(false);

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chỉnh sửa tour"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => onEditTour(tour)}>
                                Lưu
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => navigate(`/admin/service/tour/display/${id}`)}
                                shape="round"
                                icon={<CloseOutlined />}
                            >
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <ImagesUC
                                    imageUrl={tour.coverImgUrl}
                                    onChange={(imgUrl, file) => setTour({ ...tour, coverImgFile: file, coverImgUrl: imgUrl })}
                                />
                            </div>
                            <span>Hình đại diện</span>
                        </Col>
                        <Col span={8}>
                            <span>Tên tour</span>
                            <Input value={tour.name} onChange={(e) => setTour({ ...tour, name: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <span>Danh mục tour</span>
                            <Select
                                value={tour.categoryId}
                                allowClear
                                placeholder="Chọn danh mục"
                                className="w-100"
                                showSearch
                                filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(val) => setTour({ ...tour, categoryId: val })}
                            >
                                {tourCategories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <span>Loại tour</span>
                            <Select
                                value={tour.typeId}
                                allowClear
                                placeholder="Chọn loại tour"
                                className="w-100"
                                showSearch
                                filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(val) => setTour({ ...tour, typeId: val })}
                            >
                                {tourTypes.map((type) => (
                                    <Select.Option key={type.id} value={type.id}>
                                        {type.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <span>Thành phố khởi hành</span>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                value={tour.departureCityId}
                                allowClear
                                placeholder="Chọn thành phố"
                                className="w-100"
                                filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(val) => setTour({ ...tour, departureCityId: val })}
                            >
                                {cities.map((city) => (
                                    <Select.Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <span>Nơi đến (Destinations)</span>
                            <Input value={tour.destination} onChange={(e) => setTour({ ...tour, destination: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <span>Ngày khởi hành</span>
                            <DatePicker
                                className="w-100"
                                value={tour.startDate} // Cần xử lý state cho DatePicker (moment/dayjs)
                                onChange={(date, dateString) => setTour({ ...tour, startDate: dateString })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Thời gian (VD: 3N2Đ)</span>
                            <Input value={tour.duration} onChange={(e) => setTour({ ...tour, duration: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <span>Giá (VND)</span>
                            <InputNumber
                                value={tour.price}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={(val) => setTour({ ...tour, price: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select
                                value={tour.isActive}
                                allowClear
                                placeholder="Chọn trạng thái"
                                className="w-100"
                                onChange={(val) => setTour({ ...tour, isActive: val })}
                            >
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Ngừng hoạt động</Select.Option>
                            </Select>
                        </Col>

                        <Col span={24}>
                            <span>Hình ảnh khác</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                <Gallery
                                    listImage={tour.listInfoImage}
                                    onChange={(listOldImage, listNewImage) =>
                                        setTour({
                                            ...tour,
                                            listInfoImage: listOldImage,
                                            ListNewInfoImage: listNewImage
                                        })
                                    }
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <span>Dịch vụ bao gồm</span>
                            <TextArea value={tour.inclusions} onChange={(e) => setTour({ ...tour, inclusions: e.target.value })} rows={6} />
                        </Col>
                        <Col span={12}>
                            <span>Lịch trình chi tiết</span>
                            <TextArea value={tour.itinerary} onChange={(e) => setTour({ ...tour, itinerary: e.target.value })} rows={6} />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={tour.description}
                                allowClear
                                className="w-100"
                                onChange={(e) => setTour({ ...tour, description: e.target.value })}
                                rows={4}
                            />
                        </Col>
                    </Row>

                    {/* Tour Itineraries Section */}
                    <Row className="mt-5">
                        <Col span={24}>
                            <TourItineraryTable tourId={id} isEditMode={true} />
                        </Col>
                    </Row>

                    {/* Tour Departures Section */}
                    <Row>
                        <Col span={24}>
                            <TourDepartureTable tourId={id} isEditMode={true} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

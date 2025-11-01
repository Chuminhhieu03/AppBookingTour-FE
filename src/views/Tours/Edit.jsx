import { Col, Row, Button, Space, Input, Select, InputNumber, message } from 'antd';
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
                const tourData = response.data || {};
                setTour({
                    ...tourData,
                    originalImageUrls: tourData.imageUrls || [], // Lưu URLs gốc để track xóa
                    newImageFiles: []
                });
            }
        } catch (error) {
            console.error('Error fetching tour details for edit:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const onEditTour = async () => {
        try {
            LoadingModal.showLoading();

            const formData = new FormData();

            // Append các field theo TourCreateRequestDTO
            formData.append('Code', tour.code || '');
            formData.append('Name', tour.name || '');
            formData.append('TypeId', tour.typeId || '');
            formData.append('CategoryId', tour.categoryId || '');
            formData.append('DepartureCityId', tour.departureCityId || '');
            formData.append('DestinationCityId', tour.destinationCityId || '');
            formData.append('DurationDays', tour.durationDays || 0);
            formData.append('DurationNights', tour.durationNights || 0);
            formData.append('MaxParticipants', tour.maxParticipants || 0);
            formData.append('MinParticipants', tour.minParticipants || 0);
            formData.append('BasePriceAdult', tour.basePriceAdult || 0);
            formData.append('BasePriceChild', tour.basePriceChild || 0);
            formData.append('IsActive', Boolean(tour.isActive));
            formData.append('Description', tour.description || '');
            formData.append('Includes', tour.includes?.join('\n') || '');
            formData.append('Excludes', tour.excludes?.join('\n') || '');
            formData.append('TermsConditions', tour.termsConditions || '');

            // Append ImageMain nếu có thay đổi ảnh bìa
            if (tour.imageMainFile) {
                formData.append('ImageMain', tour.imageMainFile);
            }

            // Append Images mới nếu có
            if (tour.newImageFiles && tour.newImageFiles.length > 0) {
                tour.newImageFiles.forEach((file) => {
                    if (file) {
                        formData.append('Images', file);
                    }
                });
            }

            // Tính toán RemoveImageUrls lúc submit
            const originalUrls = tour.originalImageUrls || [];
            const currentUrls = tour.imageUrls || [];
            const removedUrls = originalUrls.filter((url) => !currentUrls.includes(url));

            // Append RemoveImageUrls nếu có ảnh bị xóa
            if (removedUrls && removedUrls.length > 0) {
                removedUrls.forEach((url) => {
                    formData.append('RemoveImageUrls', url);
                });
            }

            const response = await tourAPI.update(id, formData);
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
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={onEditTour}>
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
                                    imageUrl={tour.imageMainUrl}
                                    onChange={(imgUrl, file) => setTour({ ...tour, imageMainFile: file, imageMainUrl: imgUrl })}
                                />
                            </div>
                            <span>Ảnh bìa</span>
                        </Col>

                        <Col span={6}>
                            <span>Mã tour</span>
                            <Input value={tour.code} onChange={(e) => setTour({ ...tour, code: e.target.value })} />
                        </Col>
                        <Col span={18}>
                            <span>Tên tour</span>
                            <Input value={tour.name} onChange={(e) => setTour({ ...tour, name: e.target.value })} />
                        </Col>
                        <Col span={6}>
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
                        <Col span={6}>
                            <span>Danh mục tour</span>
                            <Select
                                value={tour.categoryId}
                                allowClear
                                placeholder="Chọn danh mục tour"
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
                        <Col span={6}>
                            <span>Thành phố khởi hành</span>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                value={tour.departureCityId}
                                allowClear
                                placeholder="Chọn thành phố khởi hành"
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
                        <Col span={6}>
                            <span>Thành phố tham quan</span>
                            <Select
                                showSearch
                                optionFilterProp="children"
                                value={tour.destinationCityId}
                                allowClear
                                placeholder="Chọn thành phố tham quan"
                                className="w-100"
                                filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                onChange={(val) => setTour({ ...tour, destinationCityId: val })}
                            >
                                {cities.map((city) => (
                                    <Select.Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <span>Số ngày lưu trú</span>
                            <InputNumber
                                value={tour.durationDays}
                                className="w-100"
                                min={1}
                                onChange={(val) => setTour({ ...tour, durationDays: val })}
                                addonAfter="Ngày"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Số đêm lưu trú</span>
                            <InputNumber
                                value={tour.durationNights}
                                className="w-100"
                                min={0}
                                onChange={(val) => setTour({ ...tour, durationNights: val })}
                                addonAfter="Đêm"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Số lượng hành khách tối thiểu</span>
                            <InputNumber
                                value={tour.minParticipants}
                                className="w-100"
                                min={1}
                                onChange={(val) => setTour({ ...tour, minParticipants: val })}
                                addonAfter="Hành khách"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Số lượng hành khách tối đa</span>
                            <InputNumber
                                value={tour.maxParticipants}
                                className="w-100"
                                min={1}
                                onChange={(val) => setTour({ ...tour, maxParticipants: val })}
                                addonAfter="Hành khách"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Giá cơ bản người lớn (VND)</span>
                            <InputNumber
                                value={tour.basePriceAdult}
                                className="w-100"
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                onChange={(val) => setTour({ ...tour, basePriceAdult: val })}
                                addonAfter="VNĐ"
                            />
                        </Col>
                        <Col span={6}>
                            <span>Giá cơ bản trẻ em (VND)</span>
                            <InputNumber
                                value={tour.basePriceChild}
                                className="w-100"
                                min={0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                onChange={(val) => setTour({ ...tour, basePriceChild: val })}
                                addonAfter="VNĐ"
                            />
                        </Col>
                        <Col span={6}>
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
                                    listImage={tour.imageUrls?.map((url) => ({ url })) || []}
                                    onChange={(listOldImage, listNewImage) => {
                                        setTour({
                                            ...tour,
                                            imageUrls: listOldImage?.map((item) => item.url) || [],
                                            newImageFiles: listNewImage || []
                                        });
                                    }}
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <span>Tour bao gồm</span>
                            <TextArea
                                value={tour.includes?.join('\n')}
                                onChange={(e) => setTour({ ...tour, includes: e.target.value.split('\n').filter((item) => item.trim()) })}
                                rows={4}
                                placeholder="Nhập mỗi mục trên một dòng"
                            />
                        </Col>
                        <Col span={12}>
                            <span>Tour không bao gồm</span>
                            <TextArea
                                value={tour.excludes?.join('\n')}
                                onChange={(e) => setTour({ ...tour, excludes: e.target.value.split('\n').filter((item) => item.trim()) })}
                                rows={4}
                                placeholder="Nhập mỗi mục trên một dòng"
                            />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả về tour</span>
                            <TextArea
                                value={tour.description}
                                allowClear
                                className="w-100"
                                onChange={(e) => setTour({ ...tour, description: e.target.value })}
                                rows={4}
                            />
                        </Col>
                        <Col span={24}>
                            <span>Điều khoản & điều kiện của tour</span>
                            <TextArea
                                value={tour.termsConditions}
                                allowClear
                                className="w-100"
                                onChange={(e) => setTour({ ...tour, termsConditions: e.target.value })}
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
                            <TourDepartureTable tourId={id} isEditMode={true} tourData={tour} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

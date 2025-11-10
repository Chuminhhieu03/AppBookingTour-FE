import { Col, Row, Button, Space, Input, Select, InputNumber, message, Form } from 'antd';
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
import Constants from 'Constants/Constants';

const { TextArea } = Input;

export default function TourEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

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
                    originalImageUrls: tourData.imageUrls || [],
                    newImageFiles: []
                });

                // Set form values
                form.setFieldsValue({
                    code: tourData.code,
                    name: tourData.name,
                    typeId: tourData.typeId,
                    categoryId: tourData.categoryId,
                    departureCityId: tourData.departureCityId,
                    destinationCityId: tourData.destinationCityId,
                    durationDays: tourData.durationDays,
                    durationNights: tourData.durationNights,
                    minParticipants: tourData.minParticipants,
                    maxParticipants: tourData.maxParticipants,
                    basePriceAdult: tourData.basePriceAdult,
                    basePriceChild: tourData.basePriceChild,
                    isActive: tourData.isActive,
                    description: tourData.description,
                    includes: tourData.includes?.join('\n') || '',
                    excludes: tourData.excludes?.join('\n') || '',
                    termsConditions: tourData.termsConditions
                });
            }
        } catch (error) {
            console.error('Error fetching tour details for edit:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const onFinish = async (values) => {
        try {
            LoadingModal.showLoading();

            const formData = new FormData();

            // Append các field theo TourCreateRequestDTO
            formData.append('Code', values.code || '');
            formData.append('Name', values.name || '');
            formData.append('TypeId', values.typeId || '');
            formData.append('CategoryId', values.categoryId || '');
            formData.append('DepartureCityId', values.departureCityId || '');
            formData.append('DestinationCityId', values.destinationCityId || '');
            formData.append('DurationDays', values.durationDays || 0);
            formData.append('DurationNights', values.durationNights || 0);
            formData.append('MaxParticipants', values.maxParticipants || 0);
            formData.append('MinParticipants', values.minParticipants || 0);
            formData.append('BasePriceAdult', values.basePriceAdult || 0);
            formData.append('BasePriceChild', values.basePriceChild || 0);
            formData.append('IsActive', Boolean(values.isActive));
            formData.append('Description', values.description || '');
            formData.append('Includes', values.includes || '');
            formData.append('Excludes', values.excludes || '');
            formData.append('TermsConditions', values.termsConditions || '');

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
                navigate(-1);
            } else {
                message.error(response.message || 'Không thể cập nhật tour!');
            }
        } catch (error) {
            console.error('Error updating tour:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đã xảy ra lỗi khi cập nhật tour.');
            }
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chỉnh sửa tour"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => form.submit()}>
                                Lưu
                            </Button>
                            <Button type="primary" onClick={() => navigate(-1)} shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            isActive: true
                        }}
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
                                <Form.Item name="code" label="Mã tour" rules={[{ required: true, message: 'Vui lòng nhập mã tour!' }]}>
                                    <Input placeholder="Nhập mã tour" />
                                </Form.Item>
                            </Col>
                            <Col span={18}>
                                <Form.Item name="name" label="Tên tour" rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}>
                                    <Input placeholder="Nhập tên tour" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="typeId"
                                    label="Loại tour"
                                    rules={[{ required: true, message: 'Vui lòng chọn loại tour!' }]}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Chọn loại tour"
                                        options={tourTypes?.map((item) => ({
                                            label: item.name || item.value,
                                            value: item.id || item.key
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="categoryId"
                                    label="Danh mục tour"
                                    rules={[{ required: true, message: 'Vui lòng chọn danh mục tour!' }]}
                                >
                                    <Select
                                        allowClear
                                        placeholder="Chọn danh mục tour"
                                        options={tourCategories?.map((item) => ({
                                            label: item.name || item.value,
                                            value: item.id || item.key
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="departureCityId"
                                    label="Thành phố khởi hành"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn thành phố khởi hành!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const destinationCityId = getFieldValue('destinationCityId');
                                                if (!value || !destinationCityId || value !== destinationCityId) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Giá trị của hai thành phố không được trùng nhau!'));
                                            }
                                        })
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        allowClear
                                        placeholder="Chọn thành phố khởi hành"
                                        options={cities?.map((item) => ({
                                            label: item.name,
                                            value: item.id
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="destinationCityId"
                                    label="Thành phố tham quan"
                                    rules={[
                                        { required: true, message: 'Vui lòng chọn thành phố tham quan!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const departureCityId = getFieldValue('departureCityId');
                                                if (!value || !departureCityId || value !== departureCityId) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Giá trị của hai thành phố không được trùng nhau!'));
                                            }
                                        })
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        allowClear
                                        placeholder="Chọn thành phố tham quan"
                                        options={cities?.map((item) => ({
                                            label: item.name,
                                            value: item.id
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="durationDays"
                                    label="Số ngày lưu trú"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số ngày!' },
                                        { type: 'number', min: 1, message: 'Số ngày phải lớn hơn 0!' }
                                    ]}
                                >
                                    <InputNumber className="w-100" min={1} placeholder="Nhập số ngày" addonAfter="Ngày" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="durationNights"
                                    label="Số đêm lưu trú"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số đêm!' },
                                        { type: 'number', min: 0, message: 'Số đêm phải lớn hơn hoặc bằng 0!' }
                                    ]}
                                >
                                    <InputNumber className="w-100" min={0} placeholder="Nhập số đêm" addonAfter="Đêm" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="minParticipants"
                                    label="Số lượng hành khách tối thiểu"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số lượng tối thiểu!' },
                                        { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const maxParticipants = getFieldValue('maxParticipants');
                                                if (!value || !maxParticipants || value <= maxParticipants) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error('Số lượng tối thiểu phải nhỏ hơn hoặc bằng số lượng tối đa!')
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <InputNumber className="w-100" min={1} placeholder="Nhập số lượng tối thiểu" addonAfter="Hành khách" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="maxParticipants"
                                    label="Số lượng hành khách tối đa"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số lượng tối đa!' },
                                        { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                const minParticipants = getFieldValue('minParticipants');
                                                if (!value || !minParticipants || value >= minParticipants) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(
                                                    new Error('Số lượng tối đa phải lớn hơn hoặc bằng số lượng tối thiểu!')
                                                );
                                            }
                                        })
                                    ]}
                                >
                                    <InputNumber className="w-100" min={1} placeholder="Nhập số lượng tối đa" addonAfter="Hành khách" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="basePriceAdult"
                                    label="Giá cơ bản người lớn (VND)"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập giá người lớn!' },
                                        { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0!' }
                                    ]}
                                >
                                    <InputNumber
                                        className="w-100"
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                        placeholder="Nhập giá người lớn"
                                        addonAfter="VNĐ"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="basePriceChild"
                                    label="Giá cơ bản trẻ em (VND)"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập giá trẻ em!' },
                                        { type: 'number', min: 0, message: 'Giá phải lớn hơn hoặc bằng 0!' }
                                    ]}
                                >
                                    <InputNumber
                                        className="w-100"
                                        min={0}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                        placeholder="Nhập giá trẻ em"
                                        addonAfter="VNĐ"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    name="isActive"
                                    label="Trạng thái"
                                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                >
                                    <Select placeholder="Chọn trạng thái" options={Constants.StatusOptions} />
                                </Form.Item>
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
                                <Form.Item name="includes" label="Tour bao gồm">
                                    <TextArea rows={4} placeholder="Nhập các dịch vụ tour bao gồm" maxLength={1500} showCount />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="excludes" label="Tour không bao gồm">
                                    <TextArea rows={4} placeholder="Nhập các dịch vụ tour không bao gồm" maxLength={1500} showCount />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="description" label="Mô tả về tour">
                                    <TextArea rows={6} placeholder="Nhập mô tả chi tiết về tour" maxLength={3000} showCount />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="termsConditions" label="Điều khoản & điều kiện của tour">
                                    <TextArea rows={5} placeholder="Nhập điều khoản và điều kiện" maxLength={2000} showCount />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>

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

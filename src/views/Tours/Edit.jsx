import { Col, Row, Button, Space, Input, Select, InputNumber, message, Form, Tabs, Typography } from 'antd';
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
import profileAPI from '../../api/profile/profileAPI';
import TourItineraryTable from './TourItineraries/TourItineraryTable';
import TourDepartureTable from './TourDepartures/TourDepartureTable';
import TourAdditionalInfo from './TourAdditionalInfo';
import TourImportantInfo from './TourImportantInfo';
import Constants from 'Constants/Constants';

const { TextArea } = Input;
const { Title } = Typography;

export default function TourEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();

    const [tour, setTour] = useState({});
    const [tourCategories, setTourCategories] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);
    const [cities, setCities] = useState([]);
    const [guides, setGuides] = useState([]);

    // Component data states
    const [additionalInfoData, setAdditionalInfoData] = useState(null);
    const [importantInfoData, setImportantInfoData] = useState(null);

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
            const [typeResponse, categoryResponse, cityResponse, guidesResponse] = await Promise.all([
                tourTypeAPI.getList(),
                tourCategoryAPI.getList(),
                cityAPI.getListCity(),
                profileAPI.getGuides()
            ]);

            if (categoryResponse.success) {
                setTourCategories(categoryResponse.data || []);
            }

            if (typeResponse.success) {
                setTourTypes(typeResponse.data || []);
            }

            if (cityResponse.success) {
                setCities(cityResponse.data || []);
            }

            if (guidesResponse.success) {
                setGuides(guidesResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            message.error('Có lỗi xảy ra khi tải dữ liệu dropdown');
        }
    };

    const setupEditForm = async () => {
        try {
            const response = await tourAPI.getById(id);
            if (response.success) {
                const data = response.data;
                setTour(data);
                form.setFieldsValue({
                    ...data,
                    typeId: data.typeId,
                    categoryId: data.categoryId,
                    departureCityId: data.departureCityId,
                    destinationCityId: data.destinationCityId
                });
            } else {
                message.error('Không tìm thấy tour!');
                navigate(-1);
            }
        } catch (error) {
            console.error('Error fetching tour:', error);
            message.error('Có lỗi xảy ra khi tải dữ liệu tour');
            navigate(-1);
        }
    };

    const onFinish = async (values) => {
        try {
            // Create FormData for file upload
            const formData = new FormData();

            // Add text fields
            Object.keys(values).forEach((key) => {
                if (values[key] != null) {
                    formData.append(key, values[key]);
                }
            });

            // Add main image file if exists
            if (tour.imageMainFile) {
                formData.append('ImageMain', tour.imageMainFile);
            }

            // Add new image files if exist
            if (tour.imageFiles && tour.imageFiles.length > 0) {
                tour.imageFiles.forEach((file) => {
                    formData.append('Images', file);
                });
            }

            // Add URLs of images to be removed
            if (tour.removeImageUrls && tour.removeImageUrls.length > 0) {
                tour.removeImageUrls.forEach((url, index) => {
                    formData.append(`RemoveImageUrls[${index}]`, url);
                });
            }

            // Add component data
            if (additionalInfoData) {
                formData.append('AdditionalInfo', JSON.stringify(additionalInfoData));
            }
            if (importantInfoData) {
                formData.append('ImportantInfo', JSON.stringify(importantInfoData));
            }

            const response = await tourAPI.update(id, formData);

            if (response.success) {
                message.success('Cập nhật tour thành công!');
                navigate(-1);
            } else {
                message.error(response.message || 'Có lỗi xảy ra khi cập nhật tour');
            }
        } catch (error) {
            console.error('Error updating tour:', error);
            message.error('Có lỗi xảy ra khi cập nhật tour');
        }
    };

    return (
        <Row>
            <Col span={24}>
                <LoadingModal />
                <MainCard>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                        <Col>
                            <Title level={3} style={{ margin: 0 }}>
                                Chỉnh sửa tour
                            </Title>
                        </Col>
                        <Col>
                            <Space>
                                <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => form.submit()}>
                                    Lưu
                                </Button>
                                <Button type="primary" onClick={() => navigate(-1)} shape="round" icon={<CloseOutlined />}>
                                    Thoát
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            isActive: true
                        }}
                    >
                        <Tabs defaultActiveKey="1" size="large">
                            <Tabs.TabPane tab="Thông tin cơ bản" key="1">
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
                                        <Form.Item
                                            name="code"
                                            label="Mã tour"
                                            rules={[{ required: true, message: 'Vui lòng nhập mã tour!' }]}
                                        >
                                            <Input placeholder="Nhập mã tour" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={18}>
                                        <Form.Item
                                            name="name"
                                            label="Tên tour"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}
                                        >
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
                                                    validator: async (_, value) => {
                                                        const destinationCityId = getFieldValue('destinationCityId');
                                                        if (value && destinationCityId && value === destinationCityId) {
                                                            return Promise.reject(
                                                                new Error(
                                                                    'Thành phố khởi hành và thành phố tham quan không được trùng nhau!'
                                                                )
                                                            );
                                                        }
                                                        return Promise.resolve();
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
                                                    validator: async (_, value) => {
                                                        const departureCityId = getFieldValue('departureCityId');
                                                        if (value && departureCityId && value === departureCityId) {
                                                            return Promise.reject(
                                                                new Error(
                                                                    'Thành phố khởi hành và thành phố tham quan không được trùng nhau!'
                                                                )
                                                            );
                                                        }
                                                        return Promise.resolve();
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
                                                { type: 'number', min: 1, message: 'Số ngày phải lớn hơn 0!' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const nights = getFieldValue('durationNights');
                                                        if (value && nights && value !== nights + 1) {
                                                            return Promise.reject(new Error('Số ngày phải bằng số đêm + 1!'));
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
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
                                                { type: 'number', min: 0, message: 'Số đêm phải lớn hơn hoặc bằng 0!' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const days = getFieldValue('durationDays');
                                                        if (value !== undefined && days && days !== value + 1) {
                                                            return Promise.reject(new Error('Số đêm phải bằng số ngày - 1!'));
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
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
                                                    validator: async (_, value) => {
                                                        const maxParticipants = getFieldValue('maxParticipants');
                                                        if (value && maxParticipants && value > maxParticipants) {
                                                            return Promise.reject(
                                                                new Error('Số lượng tối thiểu không được lớn hơn số lượng tối đa!')
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                        >
                                            <InputNumber
                                                className="w-100"
                                                min={1}
                                                placeholder="Nhập số lượng tối thiểu"
                                                addonAfter="Hành khách"
                                            />
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
                                                    validator: async (_, value) => {
                                                        const minParticipants = getFieldValue('minParticipants');
                                                        if (value && minParticipants && value < minParticipants) {
                                                            return Promise.reject(
                                                                new Error('Số lượng tối đa không được nhỏ hơn số lượng tối thiểu!')
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]}
                                        >
                                            <InputNumber
                                                className="w-100"
                                                min={1}
                                                placeholder="Nhập số lượng tối đa"
                                                addonAfter="Hành khách"
                                            />
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
                                                    // Find removed images by comparing original imageUrls with current listOldImage
                                                    const originalUrls = tour.imageUrls || [];
                                                    const currentOldUrls = listOldImage.map((img) => img.url);
                                                    const removedUrls = originalUrls.filter((url) => !currentOldUrls.includes(url));

                                                    setTour({
                                                        ...tour,
                                                        imageFiles: listNewImage,
                                                        removeImageUrls: removedUrls
                                                    });
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name="description" label="Mô tả về tour">
                                            <TextArea rows={6} placeholder="Nhập mô tả chi tiết về tour" maxLength={3000} showCount />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Thông tin chuyến đi" key="2">
                                <TourAdditionalInfo
                                    additionalInfo={tour.additionalInfo}
                                    onChange={setAdditionalInfoData}
                                    readOnly={false}
                                />
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Thông tin quan trọng" key="3">
                                <TourImportantInfo importantInfo={tour.importantInfo} onChange={setImportantInfoData} readOnly={false} />
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Lịch trình tour" key="4">
                                <TourItineraryTable mode="api" tourId={id} />
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Lịch khởi hành tour" key="5">
                                <TourDepartureTable
                                    mode="api"
                                    tourId={id}
                                    tourInfo={{
                                        durationDays: tour.durationDays || form.getFieldValue('durationDays'),
                                        durationNights: tour.durationNights || form.getFieldValue('durationNights'),
                                        basePriceAdult: tour.basePriceAdult || form.getFieldValue('basePriceAdult'),
                                        basePriceChild: tour.basePriceChild || form.getFieldValue('basePriceChild'),
                                        maxParticipants: tour.maxParticipants || form.getFieldValue('maxParticipants'),
                                        minParticipants: tour.minParticipants || form.getFieldValue('minParticipants')
                                    }}
                                    guides={guides}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

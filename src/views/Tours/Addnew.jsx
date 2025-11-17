import { Col, Row, Button, Space, Input, Select, Upload, InputNumber, DatePicker, message, Form } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingModal from '../../components/LoadingModal';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';
import tourTypeAPI from '../../api/tour/tourTypeAPI';
import tourCategoryAPI from '../../api/tour/tourCategoryAPI';
import cityAPI from '../../api/city/cityAPI';
import tourAPI from '../../api/tour/tourAPI';
import Constants from 'Constants/Constants';

const { TextArea } = Input;

export default function TourAddnew() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [listTourType, setListTourType] = useState([]);
    const [listTourCategory, setListTourCategory] = useState([]);
    const [listCities, setListCities] = useState([]);
    const [listInfoImage, setListInfoImage] = useState([]);
    const [imageMain, setImageMain] = useState(null);

    useEffect(() => {
        setupAddnewForm();
    }, []);

    const setupAddnewForm = async () => {
        try {
            LoadingModal.showLoading();

            // Fetch các dropdown data bằng API
            const [typeResponse, categoryResponse, cityResponse] = await Promise.all([
                tourTypeAPI.getList(),
                tourCategoryAPI.getList(),
                cityAPI.getListCity()
            ]);

            if (typeResponse.success) {
                setListTourType(typeResponse.data || []);
            }

            if (categoryResponse.success) {
                setListTourCategory(categoryResponse.data || []);
            }

            if (cityResponse.success) {
                setListCities(cityResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            message.error('Đã xảy ra lỗi khi tải dữ liệu dropdown.');
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

            // Append files
            if (imageMain) {
                formData.append('ImageMain', imageMain);
            }
            listInfoImage?.forEach((file) => {
                formData.append('Images', file);
            });

            const response = await tourAPI.create(formData);

            if (response.success) {
                message.success('Tạo tour mới thành công!');
                navigate(`/admin/service/tour`);
            } else {
                message.error(response.message || 'Không thể tạo tour mới!');
            }
        } catch (error) {
            console.error('Error adding new tour:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đã xảy ra lỗi khi tạo tour mới.');
            }
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleImageMainChange = (imgUrl, file) => {
        setImageMain(file);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm mới tour"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => form.submit()}>
                                Lưu
                            </Button>
                            <Button type="primary" onClick={() => navigate('/admin/service/tour')} shape="round" icon={<CloseOutlined />}>
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
                                    <ImagesUC onChange={handleImageMainChange} />
                                </div>
                                <span>Ảnh bìa</span>
                            </Col>

                            <Col span={6}>
                                <Form.Item name="code" label="Mã tour" rules={[{ required: true, message: 'Vui lòng nhập mã tour!' }]}>
                                    <Input placeholder="Nhập mã tour" maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col span={18}>
                                <Form.Item name="name" label="Tên tour" rules={[{ required: true, message: 'Vui lòng nhập tên tour!' }]}>
                                    <Input placeholder="Nhập tên tour" maxLength={200} />
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
                                        options={listTourType?.map((item) => ({
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
                                        options={listTourCategory?.map((item) => ({
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
                                        options={listCities?.map((item) => ({
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
                                        options={listCities?.map((item) => ({
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
                                        onChange={(_, files) => {
                                            setListInfoImage(files);
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
                </MainCard>
            </Col>
        </Row>
    );
}

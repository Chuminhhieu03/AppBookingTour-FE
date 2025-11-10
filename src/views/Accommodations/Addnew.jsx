import { Col, Row, Button, Space, Input, Select, Rate, Upload, Form, InputNumber } from 'antd';
import { CloseOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';
import accommodationAPI from '../../api/accommodation/accommodationAPI';
import cityAPI from '../../api/city/cityAPI';
import systemParameterAPI from '../../api/systemParameters/systemParameterAPI';
import Constants from '../../Constants/Constants';

const { TextArea } = Input;

export default function Addnew() {
    const [form] = Form.useForm();
    const [listCity, setListCity] = useState([]);
    const [listAmenity, setListAmenity] = useState([]);
    const [listInfoImage, setListInfoImage] = useState([]);
    const [coverImgFile, setCoverImgFile] = useState(null);

    useEffect(() => {
        getListAccommodationAmenity();
        getListCity();
    }, []);

    const getListCity = async () => {
        try {
            const res = await cityAPI.getListCity();
            setListCity(res.data);
        }
        catch (error) {
            console.error('Error fetching list of cities:', error);
        }
    };

    const getListAccommodationAmenity = async () => {
        try {
            const res = await systemParameterAPI.getByFeatureCode(Constants.FeatureCode.AccommodationAmenity);
            setListAmenity(res.data);
        } catch (error) {
            console.error('Error fetching setup addnew data:', error);
        }
    };

    const onAddnewAccommodation = async (values) => {
        LoadingModal.showLoading();
        try {
            const accommodationRequest = { ...values };
            // ensure boolean and amenities string
            accommodationRequest.IsActive = values.IsActive;
            const amenities = (values.Amenity || values.amenity || []).join(', ');
            const formData = new FormData();
            formData.append('CityId', accommodationRequest.CityId ?? accommodationRequest.cityId);
            formData.append('Type', accommodationRequest.Type ?? accommodationRequest.type);
            formData.append('Name', accommodationRequest.Name ?? accommodationRequest.name);
            formData.append('Address', accommodationRequest.Address ?? accommodationRequest.address ?? '');
            formData.append('StarRating', accommodationRequest.StarRating ?? accommodationRequest.starRating ?? 0);
            formData.append('Description', accommodationRequest.Description ?? accommodationRequest.description ?? '');
            formData.append('Regulation', accommodationRequest.Regulation ?? accommodationRequest.regulation ?? '');
            formData.append('Amenities', amenities ?? '');
            formData.append('IsActive', accommodationRequest.IsActive);
            // cover image file from local state
            if (coverImgFile) formData.append('CoverImgFile', coverImgFile);
            listInfoImage?.forEach((file) => {
                formData.append('InfoImgFile', file);
            });

            const res = await accommodationAPI.create(formData);
            const accommodationRes = res.accommodation;
            form.resetFields();
            setCoverImgFile(null);
            setListInfoImage([]);
            window.location.href = `/admin/service/accommodation/display/${accommodationRes.id}`;
        } catch (error) {
            console.error('Error adding new accommodation:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm mới cơ sở lưu trú"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => form.submit()}>
                                Lưu
                            </Button>
                            <Button type="primary" href="/admin/service/accommodation" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={onAddnewAccommodation} initialValues={{ StarRating: 0 }}>
                        <Row gutter={[24]}>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <div className="mb-3 d-flex justify-content-center">
                                    <ImagesUC onChange={(_, file) => setCoverImgFile(file)} />
                                </div>
                                <span>Hình đại diện</span>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="Name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="Type" label="Loại" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                                    <Select allowClear className="w-100" options={Constants.AccommodationTypeOptions} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="CityId" label="Thành phố" rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}>
                                    <Select showSearch optionFilterProp="label" allowClear className="w-100" options={listCity?.map((item) => ({ label: item.name, value: item.id }))} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="Address" label="Địa chỉ chi tiết">
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="IsActive" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                                    <Select allowClear className="w-100" options={Constants.StatusOptions} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="Amenity" label="Tiện ích">
                                    <Select mode="multiple" allowClear className="w-100" options={listAmenity?.map((item) => ({ label: item.name, value: item.id }))} />
                                </Form.Item>
                            </Col>

                            <Col span={8} className="d-flex align-items-center gap-2">
                                <Form.Item name="StarRating" label="Hạng sao" className="w-100">
                                    <Rate />
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

                            <Col span={24}>
                                <Form.Item name="Regulation" label="Quy định">
                                    <TextArea />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item name="Description" label="Mô tả">
                                    <TextArea allowClear className="w-100" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

import { Input, Button, Select, Row, Col, message, Space, Form } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MainCard from '../../../components/MainCard';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';
import LoadingModal from '../../../components/LoadingModal';
import ImagesUC from '../../components/basic/ImagesUC';
import Constants from 'Constants/Constants';

const { TextArea } = Input;

export default function TourTypeAddnew() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);

    const onFinish = async (values) => {
        LoadingModal.showLoading();

        try {
            const formData = new FormData();
            formData.append('Name', values.name);
            formData.append('Description', values.description || '');
            formData.append('PriceLevel', values.priceLevel || '');
            formData.append('IsActive', values.isActive !== undefined ? values.isActive : true);

            if (imageFile) {
                formData.append('Image', imageFile);
            }

            const response = await tourTypeAPI.create(formData);

            if (response.success) {
                message.success('Thêm loại tour mới thành công!');
                navigate('/admin/service/tour-type');
            } else {
                message.error(response.message || 'Không thể thêm loại tour!');
            }
        } catch (error) {
            console.error('Error adding new tour type:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đã xảy ra lỗi khi thêm loại tour.');
            }
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleImageChange = (imgUrl, file) => {
        setImageFile(file);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm loại tour mới"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => form.submit()}>
                                Lưu
                            </Button>
                            <Button type="primary" href="/admin/service/tour-type" shape="round" icon={<CloseOutlined />}>
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
                                    <ImagesUC onChange={handleImageChange} />
                                </div>
                                <span>Hình ảnh loại tour</span>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="name"
                                    label="Tên loại tour"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên loại tour không được để trống!'
                                        },
                                        {
                                            max: 100,
                                            message: 'Tên loại tour không được vượt quá 100 ký tự!'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Nhập tên loại tour" maxLength={100} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="priceLevel" label="Loại mức giá">
                                    <Select allowClear placeholder="Chọn loại mức giá (tùy chọn)" options={Constants.PriceLevelOptions} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="isActive" label="Trạng thái">
                                    <Select options={Constants.StatusOptions} />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Mô tả"
                                    rules={[
                                        {
                                            max: 500,
                                            message: 'Mô tả không được vượt quá 500 ký tự!'
                                        }
                                    ]}
                                >
                                    <TextArea rows={4} placeholder="Nhập mô tả cho loại tour (không bắt buộc)" maxLength={500} showCount />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

import { Form, Input, Button, Select, Row, Col, message, Space, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MainCard from '../../../components/MainCard';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;
const { Option } = Select;

export default function TourTypeAddnew() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            LoadingModal.showLoading();

            const formData = new FormData();
            formData.append('name', values.name);
            if (values.description) formData.append('description', values.description);
            formData.append('isActive', values.isActive || true);
            if (imageFile) formData.append('imageFile', imageFile);

            const response = await tourTypeAPI.create(formData);

            if (response.success) {
                message.success('Thêm loại tour mới thành công!');
                navigate('/admin/service/tour-type');
            } else {
                message.error(response.message || 'Không thể thêm loại tour!');
            }
        } catch (error) {
            console.error('Error creating tour type:', error);
            message.error('Đã xảy ra lỗi khi thêm loại tour.');
        } finally {
            setLoading(false);
            LoadingModal.hideLoading();
        }
    };

    const handleCancel = () => {
        navigate('/admin/service/tour-type');
    };

    const handleImageUpload = (file) => {
        setImageFile(file);
        return false; // Prevent automatic upload
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm loại tour mới"
                    secondary={
                        <Space>
                            <Button type="primary" onClick={() => form.submit()} loading={loading} shape="round" icon={<CheckOutlined />}>
                                Lưu
                            </Button>
                            <Button onClick={handleCancel} shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" requiredMark={false}>
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
                                <Form.Item
                                    label="Tên loại tour"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên loại tour!'
                                        },
                                        {
                                            max: 200,
                                            message: 'Tên loại tour không được vượt quá 200 ký tự!'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Nhập tên loại tour" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Trạng thái" name="isActive" initialValue={true}>
                                    <Select>
                                        <Option value={true}>Hoạt động</Option>
                                        <Option value={false}>Ngừng hoạt động</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Hình ảnh">
                                    <Upload beforeUpload={handleImageUpload} showUploadList={true} maxCount={1} accept="image/*">
                                        <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Mô tả"
                                    name="description"
                                    rules={[
                                        {
                                            max: 1000,
                                            message: 'Mô tả không được vượt quá 1000 ký tự!'
                                        }
                                    ]}
                                >
                                    <TextArea rows={4} placeholder="Nhập mô tả cho loại tour (không bắt buộc)" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

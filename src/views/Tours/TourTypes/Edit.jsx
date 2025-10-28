import { Form, Input, Button, Select, Row, Col, message, Space, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;
const { Option } = Select;

export default function TourTypeEdit() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [tourType, setTourType] = useState({});
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (id) {
            fetchTourType();
        }
    }, [id]);

    const fetchTourType = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourTypeAPI.getById(id);
            if (response.success) {
                const data = response.data;
                setTourType(data);
                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                    isActive: data.isActive
                });
            } else {
                message.error('Không tìm thấy loại tour!');
                navigate('/admin/service/tour-type');
            }
        } catch (error) {
            console.error('Error fetching tour type:', error);
            message.error('Đã xảy ra lỗi khi tải loại tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            LoadingModal.showLoading();

            const formData = new FormData();
            formData.append('name', values.name);
            if (values.description) formData.append('description', values.description);
            formData.append('isActive', values.isActive);
            if (imageFile) formData.append('imageFile', imageFile);

            const response = await tourTypeAPI.update(id, formData);

            if (response.success) {
                message.success('Cập nhật loại tour thành công!');
                navigate('/admin/service/tour-type');
            } else {
                message.error(response.message || 'Không thể cập nhật loại tour!');
            }
        } catch (error) {
            console.error('Error updating tour type:', error);
            message.error('Đã xảy ra lỗi khi cập nhật loại tour.');
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
                    title="Chỉnh sửa loại tour"
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
                                <Form.Item
                                    label="Trạng thái"
                                    name="isActive"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn trạng thái!'
                                        }
                                    ]}
                                >
                                    <Select>
                                        <Option value={true}>Hoạt động</Option>
                                        <Option value={false}>Ngừng hoạt động</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Hình ảnh">
                                    {tourType.imageUrl && (
                                        <div style={{ marginBottom: 8 }}>
                                            <img
                                                src={tourType.imageUrl}
                                                alt="Current"
                                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                            />
                                            <p style={{ margin: 0, fontSize: 12, color: '#666' }}>Hình ảnh hiện tại</p>
                                        </div>
                                    )}
                                    <Upload beforeUpload={handleImageUpload} showUploadList={true} maxCount={1} accept="image/*">
                                        <Button icon={<UploadOutlined />}>Chọn hình ảnh mới</Button>
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

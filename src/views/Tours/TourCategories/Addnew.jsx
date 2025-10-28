import { Form, Input, Button, Select, Row, Col, message, Space, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;
const { Option } = Select;

export default function TourCategoryAddnew() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchParentCategories();
    }, []);

    const fetchParentCategories = async () => {
        try {
            const response = await tourCategoryAPI.getList();
            if (response.success) {
                // Filter to get only parent categories (no parentCategoryId)
                const parents = (response.data || []).filter((cat) => !cat.parentCategoryId);
                setParentCategories(parents);
            }
        } catch (error) {
            console.error('Error fetching parent categories:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            LoadingModal.showLoading();

            const formData = new FormData();
            formData.append('name', values.name);
            if (values.description) formData.append('description', values.description);
            if (values.parentCategoryId) formData.append('parentCategoryId', values.parentCategoryId);
            formData.append('isActive', values.isActive || true);
            if (imageFile) formData.append('imageFile', imageFile);

            const response = await tourCategoryAPI.create(formData);

            if (response.success) {
                message.success('Thêm danh mục tour mới thành công!');
                navigate('/admin/service/tour-category');
            } else {
                message.error(response.message || 'Không thể thêm danh mục tour!');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            message.error('Đã xảy ra lỗi khi thêm danh mục tour.');
        } finally {
            setLoading(false);
            LoadingModal.hideLoading();
        }
    };

    const handleCancel = () => {
        navigate('/admin/service/tour-category');
    };

    const handleImageUpload = (file) => {
        setImageFile(file);
        return false; // Prevent automatic upload
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm danh mục tour mới"
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
                                    label="Tên danh mục"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên danh mục!'
                                        },
                                        {
                                            max: 200,
                                            message: 'Tên danh mục không được vượt quá 200 ký tự!'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Nhập tên danh mục" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Danh mục cha" name="parentCategoryId">
                                    <Select placeholder="Chọn danh mục cha (tùy chọn)" allowClear>
                                        {parentCategories.map((category) => (
                                            <Option key={category.id} value={category.id}>
                                                {category.name}
                                            </Option>
                                        ))}
                                    </Select>
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
                            <Col span={12}>
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
                                    <TextArea rows={4} placeholder="Nhập mô tả cho danh mục (không bắt buộc)" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

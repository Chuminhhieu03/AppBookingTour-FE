import { Form, Input, Button, Select, Row, Col, message, Space, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;
const { Option } = Select;

export default function TourCategoryEdit() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(false);
    const [parentCategories, setParentCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCategory();
            fetchParentCategories();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourCategoryAPI.getById(id);
            if (response.success) {
                const data = response.data;
                setCategory(data);
                form.setFieldsValue({
                    name: data.name,
                    description: data.description,
                    parentCategoryId: data.parentCategoryId,
                    isActive: data.isActive
                });
            } else {
                message.error('Không tìm thấy danh mục tour!');
                navigate('/admin/service/tour-category');
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            message.error('Đã xảy ra lỗi khi tải danh mục tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const fetchParentCategories = async () => {
        try {
            const response = await tourCategoryAPI.getList();
            if (response.success) {
                // Filter to get only parent categories (no parentCategoryId) and exclude current category
                const parents = (response.data || []).filter((cat) => !cat.parentCategoryId && cat.id !== parseInt(id));
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
            formData.append('isActive', values.isActive);
            if (imageFile) formData.append('imageFile', imageFile);

            const response = await tourCategoryAPI.update(id, formData);

            if (response.success) {
                message.success('Cập nhật danh mục tour thành công!');
                navigate('/admin/service/tour-category');
            } else {
                message.error(response.message || 'Không thể cập nhật danh mục tour!');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            message.error('Đã xảy ra lỗi khi cập nhật danh mục tour.');
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
                    title="Chỉnh sửa danh mục tour"
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
                            <Col span={12}>
                                <Form.Item label="Hình ảnh">
                                    {category.imageUrl && (
                                        <div style={{ marginBottom: 8 }}>
                                            <img
                                                src={category.imageUrl}
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

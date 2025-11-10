import { Input, Button, Select, Row, Col, message, Space, Form } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';
import LoadingModal from '../../../components/LoadingModal';
import ImagesUC from '../../components/basic/ImagesUC';
import Constants from 'Constants/Constants';

const { TextArea } = Input;

export default function TourCategoryEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [parentCategories, setParentCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [initialImageUrl, setInitialImageUrl] = useState('');

    useEffect(() => {
        const fetchTourCategory = async () => {
            try {
                LoadingModal.showLoading();
                const response = await tourCategoryAPI.getById(id);
                if (response.success) {
                    const data = response.data;
                    setInitialImageUrl(data.imageUrl);
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

        if (id) {
            fetchTourCategory();
            fetchParentCategories();
        }
    }, [id, navigate, form]);

    const onFinish = async (values) => {
        LoadingModal.showLoading();

        try {
            const formData = new FormData();
            formData.append('Name', values.name);
            formData.append('Description', values.description || '');
            if (values.parentCategoryId) {
                formData.append('ParentCategoryId', values.parentCategoryId);
            }
            formData.append('IsActive', values.isActive !== undefined ? values.isActive : true);
            if (imageFile) {
                formData.append('Image', imageFile);
            }

            const response = await tourCategoryAPI.update(id, formData);

            if (response.success) {
                message.success('Cập nhật danh mục tour thành công!');
                navigate('/admin/service/tour-category');
            } else {
                message.error(response.message || 'Không thể cập nhật danh mục tour!');
            }
        } catch (error) {
            console.error('Error updating tour category:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đã xảy ra lỗi khi cập nhật danh mục tour.');
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
                    title="Chỉnh sửa danh mục tour"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => form.submit()}>
                                Lưu
                            </Button>
                            <Button type="primary" href="/admin/service/tour-category" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={[24, 24]}>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <div className="mb-3 d-flex justify-content-center">
                                    <ImagesUC imageUrl={initialImageUrl} onChange={handleImageChange} />
                                </div>
                                <span>Hình ảnh danh mục</span>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="name"
                                    label="Tên danh mục"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên danh mục không được để trống!'
                                        }
                                    ]}
                                >
                                    <Input placeholder="Nhập tên danh mục" maxLength={100} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="parentCategoryId" label="Danh mục cha">
                                    <Select
                                        allowClear
                                        placeholder="Chọn danh mục cha (tùy chọn)"
                                        options={parentCategories?.map((item) => ({
                                            label: item.name,
                                            value: item.id
                                        }))}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="isActive" label="Trạng thái">
                                    <Select options={Constants.StatusOptions} />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item name="description" label="Mô tả">
                                    <TextArea rows={4} placeholder="Nhập mô tả cho danh mục (không bắt buộc)" maxLength={500} showCount />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

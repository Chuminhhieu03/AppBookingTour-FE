import { Input, Button, Select, Row, Col, message, Space, Form } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';
import LoadingModal from '../../../components/LoadingModal';
import ImagesUC from '../../components/basic/ImagesUC';

const { TextArea } = Input;

export default function TourCategoryAddnew() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [parentCategories, setParentCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchParentCategories();
    }, []);

    const fetchParentCategories = async () => {
        try {
            const response = await tourCategoryAPI.getList();
            if (response.success) {
                const parents = (response.data || []).filter((cat) => !cat.parentCategoryId);
                setParentCategories(parents);
            }
        } catch (error) {
            console.error('Error fetching parent categories:', error);
        }
    };

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

            const response = await tourCategoryAPI.create(formData);

            if (response.success) {
                message.success('Thêm danh mục tour mới thành công!');
                navigate('/admin/service/tour-category');
            } else {
                message.error(response.message || 'Không thể thêm danh mục tour!');
            }
        } catch (error) {
            console.error('Error adding new tour category:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đã xảy ra lỗi khi thêm danh mục tour.');
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
                    title="Thêm danh mục tour mới"
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
                                    <Select
                                        options={[
                                            { label: 'Hoạt động', value: true },
                                            { label: 'Ngừng hoạt động', value: false }
                                        ]}
                                    />
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

import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Space, message, Card, Row, Col, Typography, Upload, Image } from 'antd';
import { SaveOutlined, FileTextOutlined, ArrowLeftOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';
import { blogAPI } from 'api/blog/blogAPI';
import cityAPI from 'api/city/cityAPI';
import { generateSlug } from 'utils/slugGenerator';

const { Option } = Select;
const { Title } = Typography;

const BlogPostsAddnew = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);

    // Fetch cities khi component mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoadingCities(true);
                const response = await cityAPI.getListCity();
                if (response.success) {
                    setCities(response.data || []);
                } else {
                    message.error('Không thể tải danh sách thành phố');
                    setCities([]);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                message.error('Đã xảy ra lỗi khi tải danh sách thành phố');
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, []);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        if (title) {
            const slug = generateSlug(title);
            form.setFieldsValue({ slug });
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const statusMap = {
            Draft: 1,
            Published: 2,
            Archived: 3
        };

        try {
            const formData = new FormData();
            formData.append('Title', values.title);
            formData.append('Slug', values.slug);
            formData.append('Content', content);
            formData.append('CityId', values.city);
            formData.append('Tags', values.tags);
            formData.append('Status', statusMap[values.status]);

            if (coverImageFile) {
                formData.append('CoverImageFile', coverImageFile);
            }

            const response = await blogAPI.create(formData);

            if (response.success) {
                message.success('Tạo bài viết thành công');
                navigate('/admin/blog');
            } else {
                message.error(response.message || 'Không thể tạo bài viết');
            }
        } catch (error) {
            console.error('Error creating blog post:', error);
            message.error('Đã xảy ra lỗi khi tạo bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            const values = await form.validateFields();
            values.status = 'Draft';
            handleSubmit(values);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <MainCard>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            Thêm bài viết mới
                        </Title>
                    </Col>
                    <Col>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/blog')}>
                            Quay lại
                        </Button>
                    </Col>
                </Row>

                {/* Form */}
                <Card>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'Draft' }}>
                        <Row gutter={16}>
                            <Col xs={24} md={16}>
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tiêu đề' },
                                        { max: 200, message: 'Tiêu đề không được quá 200 ký tự' }
                                    ]}
                                >
                                    <Input placeholder="Nhập tiêu đề bài viết" size="large" onChange={handleTitleChange} />
                                </Form.Item>

                                <Form.Item
                                    name="slug"
                                    label="Slug (URL thân thiện SEO)"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập slug' },
                                        {
                                            pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                            message: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang'
                                        }
                                    ]}
                                >
                                    <Input placeholder="vi-du-bai-viet-hay" />
                                </Form.Item>

                                <Form.Item label="Nội dung" required>
                                    <TiptapEditor
                                        content={content}
                                        onChange={setContent}
                                        placeholder="Viết nội dung bài viết tại đây..."
                                        minHeight={400}
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item label="Cover Image">
                                    <Upload
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        maxCount={1}
                                        beforeUpload={(file) => {
                                            const isValidType = [
                                                'image/jpeg',
                                                'image/jpg',
                                                'image/png',
                                                'image/gif',
                                                'image/webp'
                                            ].includes(file.type);
                                            if (!isValidType) {
                                                message.error('Chỉ hỗ trợ file JPG, PNG, GIF, WEBP!');
                                                return Upload.LIST_IGNORE;
                                            }
                                            const isLt5M = file.size / 1024 / 1024 < 5;
                                            if (!isLt5M) {
                                                message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
                                                return Upload.LIST_IGNORE;
                                            }
                                            setCoverImageFile(file);
                                            const reader = new FileReader();
                                            reader.onload = (e) => setCoverImagePreview(e.target.result);
                                            reader.readAsDataURL(file);
                                            return false;
                                        }}
                                        onRemove={() => {
                                            setCoverImageFile(null);
                                            setCoverImagePreview(null);
                                        }}
                                        fileList={coverImageFile ? [coverImageFile] : []}
                                    >
                                        <Button icon={<PictureOutlined />} block>
                                            Chọn ảnh bìa (tùy chọn)
                                        </Button>
                                    </Upload>
                                    {coverImagePreview && (
                                        <div style={{ marginTop: 12, position: 'relative' }}>
                                            <Image src={coverImagePreview} alt="preview" style={{ width: '100%', borderRadius: 8 }} />
                                            <Button
                                                type="primary"
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                style={{ position: 'absolute', top: 8, right: 8 }}
                                                onClick={() => {
                                                    setCoverImageFile(null);
                                                    setCoverImagePreview(null);
                                                }}
                                            />
                                        </div>
                                    )}
                                </Form.Item>

                                <Form.Item name="city" label="Thành phố" rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}>
                                    <Select placeholder="Chọn thành phố" showSearch loading={loadingCities} optionFilterProp="children">
                                        {cities.map((city) => (
                                            <Option key={city.id} value={city.id}>
                                                {city.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="tags"
                                    label="Tags (phân cách bằng dấu phẩy)"
                                    rules={[{ required: true, message: 'Vui lòng nhập ít nhất 1 tag' }]}
                                >
                                    <Input.TextArea placeholder="du lịch, khám phá, văn hóa" rows={3} />
                                </Form.Item>

                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                                >
                                    <Radio.Group>
                                        <Space direction="vertical">
                                            <Radio value="Draft">Bản nháp</Radio>
                                            <Radio value="Published">Xuất bản</Radio>
                                            <Radio value="Archived">Lưu trữ</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>

                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button type="primary" htmlType="submit" icon={<FileTextOutlined />} loading={loading} block>
                                        Xuất bản
                                    </Button>
                                    <Button icon={<SaveOutlined />} onClick={handleSaveDraft} loading={loading} block>
                                        Lưu bản nháp
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Space>
        </MainCard>
    );
};

export default BlogPostsAddnew;

import { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Radio, Space, message, Card, Row, Col, Typography, Spin, Upload, Image } from 'antd';
import { SaveOutlined, FileTextOutlined, ArrowLeftOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';
import { blogAPI } from 'api/blog/blogAPI';
import { generateSlug } from 'utils/slugGenerator';

const { Option } = Select;
const { Title } = Typography;

const BlogPostsEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [content, setContent] = useState('');
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [existingCoverImage, setExistingCoverImage] = useState(null);

    const cities = [
        'Hà Nội',
        'Hồ Chí Minh',
        'Đà Nẵng',
        'Hải Phòng',
        'Cần Thơ',
        'Nha Trang',
        'Huế',
        'Đà Lạt',
        'Vũng Tàu',
        'Phú Quốc',
        'Hạ Long',
        'Hội An'
    ];

    useEffect(() => {
        fetchBlogPost();
    }, [id]);

    const fetchBlogPost = async () => {
        setInitialLoading(true);
        try {
            const response = await blogAPI.getById(id);

            if (response.success) {
                const blogPost = response.data;
                form.setFieldsValue({
                    title: blogPost.title,
                    slug: blogPost.slug,
                    description: blogPost.description || '',
                    author: blogPost.authorName,
                    city: blogPost.cityName,
                    tags: blogPost.tags,
                    status: blogPost.statusName
                });
                setContent(blogPost.content || '');
                setExistingCoverImage(blogPost.coverImage || null);
            } else {
                message.error(response.message || 'Không thể tải bài viết');
                navigate('/admin/blog');
            }
        } catch (error) {
            console.error('Error fetching blog post:', error);
            message.error('Đã xảy ra lỗi khi tải bài viết');
            navigate('/admin/blog');
        } finally {
            setInitialLoading(false);
        }
    };

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
            formData.append('Id', id);
            formData.append('Title', values.title);
            formData.append('Slug', values.slug);
            if (values.description) {
                formData.append('Description', values.description);
            }
            formData.append('Content', content);
            formData.append('Status', statusMap[values.status]);

            if (values.tags) {
                formData.append('Tags', values.tags);
            }

            if (coverImageFile) {
                formData.append('CoverImageFile', coverImageFile);
            }

            const response = await blogAPI.update(id, formData);

            if (response.success) {
                message.success('Cập nhật bài viết thành công');
                navigate('/admin/blog');
            } else {
                message.error(response.message || 'Không thể cập nhật bài viết');
            }
        } catch (error) {
            console.error('Error updating blog post:', error);
            message.error('Đã xảy ra lỗi khi cập nhật bài viết');
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

    if (initialLoading) {
        return (
            <MainCard>
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" />
                </div>
            </MainCard>
        );
    }

    return (
        <MainCard>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            Chỉnh sửa bài viết
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
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

                                <Form.Item
                                    name="description"
                                    label="Mô tả ngắn (SEO)"
                                    rules={[{ max: 500, message: 'Mô tả không được quá 500 ký tự' }]}
                                >
                                    <Input.TextArea
                                        placeholder="Nhập mô tả ngắn cho bài viết (hiển thị trong danh sách và kết quả tìm kiếm)"
                                        rows={3}
                                        showCount
                                        maxLength={500}
                                    />
                                </Form.Item>

                                <Form.Item name="author" label="Tác giả" rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}>
                                    <Input placeholder="Nhập tên tác giả" disabled />
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
                                    {existingCoverImage && !coverImagePreview && (
                                        <div style={{ marginBottom: 12, position: 'relative' }}>
                                            <Image src={existingCoverImage} alt="current" style={{ width: '100%', borderRadius: 8 }} />
                                            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Ảnh hiện tại</div>
                                        </div>
                                    )}
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
                                            {existingCoverImage ? 'Thay đổi ảnh bìa' : 'Chọn ảnh bìa'}
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
                                    <Select placeholder="Chọn thành phố" showSearch>
                                        {cities.map((city) => (
                                            <Option key={city} value={city}>
                                                {city}
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
                                        Cập nhật
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

export default BlogPostsEdit;

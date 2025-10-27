import { useState } from 'react';
import { Form, Input, Button, Select, Radio, Space, message, Card, Row, Col, Typography } from 'antd';
import { SaveOutlined, FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';
import { blogAPI } from 'api/blog/blogAPI';
import { generateSlug } from 'utils/slugGenerator';

const { Option } = Select;
const { Title } = Typography;

const BlogPostsAddnew = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

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
            const data = {
                title: values.title,
                slug: values.slug,
                content: content,
                city: values.city,
                tags: values.tags,
                status: statusMap[values.status]
            };

            const response = await blogAPI.create(data);

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

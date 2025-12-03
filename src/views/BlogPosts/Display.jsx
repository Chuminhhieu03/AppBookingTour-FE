import { useState, useEffect } from 'react';
import { Button, Space, message, Modal, Tag, Descriptions, Typography, Row, Col, Spin, Image } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { blogAPI } from 'api/blog/blogAPI';
import { formatDate } from 'utils/dateFormatter';
import '../BlogPosts/BlogContent.scss';

const { Title, Paragraph } = Typography;

const BlogPostsDisplay = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [blogPost, setBlogPost] = useState(null);

    useEffect(() => {
        fetchBlogPost();
    }, [id]);

    const fetchBlogPost = async () => {
        setLoading(true);
        try {
            const response = await blogAPI.getById(id);

            if (response.success) {
                setBlogPost(response.data);
            } else {
                message.error(response.message || 'Không thể tải bài viết');
                navigate('/admin/blog');
            }
        } catch (error) {
            console.error('Error fetching blog post:', error);
            message.error('Đã xảy ra lỗi khi tải bài viết');
            navigate('/admin/blog');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa bài viết này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await blogAPI.delete(id);
                    if (response.success) {
                        message.success('Xóa bài viết thành công');
                        navigate('/admin/blog');
                    } else {
                        message.error(response.message || 'Không thể xóa bài viết');
                    }
                } catch (error) {
                    console.error('Error deleting blog post:', error);
                    message.error('Đã xảy ra lỗi khi xóa bài viết');
                }
            }
        });
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'Published':
                return <Tag color="success">Đã xuất bản</Tag>;
            case 'Draft':
                return <Tag color="default">Bản nháp</Tag>;
            case 'Archived':
                return <Tag color="warning">Lưu trữ</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };

    if (loading) {
        return (
            <MainCard>
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                    <Spin size="large" />
                </div>
            </MainCard>
        );
    }

    if (!blogPost) {
        return null;
    }

    return (
        <MainCard>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/blog')}>
                            Quay lại
                        </Button>
                    </Col>
                    <Col>
                        <Space>
                            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin/blog/edit/${id}`)}>
                                Chỉnh sửa
                            </Button>
                            <Button type="primary" danger icon={<DeleteOutlined />} onClick={handleDelete}>
                                Xóa
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Cover Image */}
                {blogPost.coverImage && (
                    <div style={{ marginBottom: 24 }}>
                        <Image
                            src={blogPost.coverImage}
                            alt={blogPost.title}
                            style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
                        />
                    </div>
                )}

                {/* Title */}
                <div>
                    <Title level={2} style={{ marginBottom: 8 }}>
                        {blogPost.title}
                    </Title>
                    {blogPost.description && (
                        <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>{blogPost.description}</Paragraph>
                    )}
                    <Space>
                        {getStatusTag(blogPost.status)}
                        <Tag color="blue">{blogPost.cityName}</Tag>
                    </Space>
                </div>

                {/* Metadata */}
                <Descriptions bordered column={{ xs: 1, sm: 2, md: 2, lg: 2 }}>
                    <Descriptions.Item label="ID">{blogPost.id}</Descriptions.Item>
                    <Descriptions.Item label="Slug">{blogPost.slug}</Descriptions.Item>
                    {blogPost.description && (
                        <Descriptions.Item label="Mô tả ngắn" span={2}>
                            {blogPost.description}
                        </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Tác giả">{blogPost.authorName}</Descriptions.Item>
                    <Descriptions.Item label="Thành phố">{blogPost.cityName}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">{getStatusTag(blogPost.statusName)}</Descriptions.Item>
                    <Descriptions.Item label="Ngày xuất bản">
                        {blogPost.publishedDate ? formatDate(blogPost.publishedDate) : 'Chưa xuất bản'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tags" span={2}>
                        {blogPost.tags &&
                            blogPost.tags.split(',').map((tag, index) => (
                                <Tag key={index} color="blue">
                                    {tag.trim()}
                                </Tag>
                            ))}
                    </Descriptions.Item>
                </Descriptions>

                {/* Content */}
                <div>
                    <Title level={4}>Nội dung bài viết</Title>
                    <div className="blog-content" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
                </div>
            </Space>
        </MainCard>
    );
};

export default BlogPostsDisplay;

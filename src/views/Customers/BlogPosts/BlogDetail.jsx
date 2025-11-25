import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spin, message, Result, Button, Divider, Grid } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { blogAPI } from '../../../api/blog/blogAPI';
import { formatDateOnly } from '../../../utils/dateFormatter';

const { useBreakpoint } = Grid;

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogDetail();
    }, [slug]);

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await blogAPI.getBySlug(slug);

            if (response.success) {
                setBlog(response.data);
                // Fetch related blogs
                fetchRelatedBlogs();
            } else {
                setError(response.message || 'Không thể tải thông tin bài viết');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            setError('Đã xảy ra lỗi khi tải thông tin bài viết');
            message.error('Không thể tải thông tin bài viết');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedBlogs = async () => {
        try {
            const response = await blogAPI.getRandomBlog(3);
            if (response.success && response.data) {
                setRelatedBlogs(response.data);
            }
        } catch (error) {
            console.error('Error fetching related blogs:', error);
        }
    };

    const parseTags = (tagsJson) => {
        try {
            if (!tagsJson) return [];
            const tags = JSON.parse(tagsJson);
            return Array.isArray(tags) ? tags : [];
        } catch (error) {
            console.error('Error parsing tags:', error);
            return [];
        }
    };

    const handleRelatedBlogClick = (relatedSlug) => {
        navigate(`/blog-posts/${relatedSlug}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" tip="Đang tải bài viết..." />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div style={{ padding: '60px 24px', maxWidth: 600, margin: '0 auto' }}>
                <Result
                    status="404"
                    title="Không tìm thấy bài viết"
                    subTitle={error || 'Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa'}
                    extra={[
                        <Button type="primary" key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/blog-posts')}>
                            Quay lại danh sách
                        </Button>
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ background: '#F5F7FA' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: screens.xs ? '16px' : '24px' }}>
                {/* Back Button */}
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/blog-posts')}
                    style={{
                        marginBottom: screens.xs ? '16px' : '24px',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: screens.xs ? '14px' : '16px'
                    }}
                >
                    Quay lại danh sách bài viết
                </Button>

                <Row gutter={[24, 24]}>
                    {/* Main Content */}
                    <Col xs={24} lg={16}>
                        <div
                            style={{
                                background: '#fff',
                                padding: screens.xs ? '16px' : '32px',
                                borderRadius: '8px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                            }}
                        >
                            {/* Cover Image */}
                            {blog.coverImage && (
                                <div style={{ marginBottom: screens.xs ? '16px' : '24px' }}>
                                    <img
                                        src={blog.coverImage}
                                        alt={blog.title}
                                        style={{
                                            width: '100%',
                                            height: screens.xs ? '200px' : '400px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Title */}
                            <h1
                                style={{
                                    fontSize: screens.xs ? '24px' : '32px',
                                    fontWeight: 'bold',
                                    color: '#1890ff',
                                    marginBottom: screens.xs ? '12px' : '16px',
                                    lineHeight: '1.3'
                                }}
                            >
                                {blog.title}
                            </h1>

                            {/* Description */}
                            {blog.description && (
                                <p
                                    style={{
                                        fontSize: screens.xs ? '14px' : '16px',
                                        color: '#666',
                                        marginBottom: screens.xs ? '16px' : '24px',
                                        lineHeight: '1.6',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    {blog.description}
                                </p>
                            )}

                            {/* Metadata */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: screens.xs ? '12px' : '20px',
                                    marginBottom: screens.xs ? '16px' : '24px',
                                    fontSize: screens.xs ? '13px' : '14px',
                                    color: '#666'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <UserOutlined style={{ color: '#1890ff' }} />
                                    <span>
                                        <strong>Tác giả:</strong> {blog.authorName || 'Không xác định'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CalendarOutlined style={{ color: '#1890ff' }} />
                                    <span>
                                        <strong>Ngày đăng:</strong> {formatDateOnly(blog.publishedDate)}
                                    </span>
                                </div>
                                {blog.viewCount > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <EyeOutlined style={{ color: '#1890ff' }} />
                                        <span>
                                            <strong>Lượt xem:</strong> {blog.viewCount}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            {blog.tags && parseTags(blog.tags).length > 0 && (
                                <div style={{ marginBottom: screens.xs ? '16px' : '24px' }}>
                                    {parseTags(blog.tags).map((tag, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                display: 'inline-block',
                                                background: '#f0f9ff',
                                                color: '#0284c7',
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                fontSize: screens.xs ? '12px' : '13px',
                                                marginRight: '8px',
                                                marginBottom: '8px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <Divider />

                            {/* Content */}
                            <div
                                style={{
                                    fontSize: screens.xs ? '15px' : '16px',
                                    lineHeight: '1.8',
                                    color: '#333'
                                }}
                                dangerouslySetInnerHTML={{ __html: blog.content }}
                            />
                        </div>
                    </Col>

                    {/* Sidebar */}
                    <Col xs={24} lg={8}>
                        {/* Related Blogs */}
                        {relatedBlogs.length > 0 && (
                            <div
                                style={{
                                    background: '#fff',
                                    padding: screens.xs ? '16px' : '24px',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                                    marginBottom: screens.xs ? '16px' : '24px'
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: screens.xs ? '18px' : '20px',
                                        fontWeight: 'bold',
                                        color: '#1890ff',
                                        marginBottom: screens.xs ? '12px' : '16px'
                                    }}
                                >
                                    Bài viết liên quan
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {relatedBlogs.map((relatedBlog) => (
                                        <div
                                            key={relatedBlog.id}
                                            onClick={() => handleRelatedBlogClick(relatedBlog.slug)}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '12px',
                                                borderRadius: '6px',
                                                border: '1px solid #f0f0f0',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#f5f5f5';
                                                e.currentTarget.style.borderColor = '#1890ff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.borderColor = '#f0f0f0';
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '12px' }}>
                                                {relatedBlog.coverImage && (
                                                    <img
                                                        src={relatedBlog.coverImage}
                                                        alt={relatedBlog.title}
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px',
                                                            flexShrink: 0
                                                        }}
                                                    />
                                                )}
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <h4
                                                        style={{
                                                            fontSize: screens.xs ? '14px' : '15px',
                                                            fontWeight: '600',
                                                            color: '#333',
                                                            marginBottom: '6px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            lineHeight: '1.4'
                                                        }}
                                                    >
                                                        {relatedBlog.title}
                                                    </h4>
                                                    {relatedBlog.publishedDate && (
                                                        <p
                                                            style={{
                                                                fontSize: '12px',
                                                                color: '#999',
                                                                margin: 0
                                                            }}
                                                        >
                                                            {formatDateOnly(relatedBlog.publishedDate)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* City Info if available */}
                        {blog.city && (
                            <div
                                style={{
                                    background: '#fff',
                                    padding: screens.xs ? '16px' : '24px',
                                    borderRadius: '8px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: screens.xs ? '18px' : '20px',
                                        fontWeight: 'bold',
                                        color: '#1890ff',
                                        marginBottom: screens.xs ? '12px' : '16px'
                                    }}
                                >
                                    Địa điểm
                                </h3>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        background: '#f5f5f5',
                                        borderRadius: '6px'
                                    }}
                                >
                                    {blog.city.image && (
                                        <img
                                            src={blog.city.image}
                                            alt={blog.city.name}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '6px'
                                            }}
                                        />
                                    )}
                                    <div>
                                        <h4
                                            style={{
                                                fontSize: screens.xs ? '16px' : '18px',
                                                fontWeight: '600',
                                                color: '#333',
                                                marginBottom: '4px'
                                            }}
                                        >
                                            {blog.city.name}
                                        </h4>
                                        {blog.city.description && (
                                            <p
                                                style={{
                                                    fontSize: '13px',
                                                    color: '#666',
                                                    margin: 0
                                                }}
                                            >
                                                {blog.city.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default BlogDetail;

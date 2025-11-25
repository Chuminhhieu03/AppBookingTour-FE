import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Input, Button, Card, Pagination, Spin, message, Grid } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CustomerLayout from '../../../layout/CustomerLayout/CustomerLayout';
import { blogAPI } from '../../../api/blog/blogAPI';
import cityAPI from '../../../api/city/cityAPI';
import { formatDateOnly } from '../../../utils/dateFormatter';

const { Option } = Select;
const { useBreakpoint } = Grid;

const BlogPostList = () => {
    const screens = useBreakpoint();

    // State management
    const [loading, setLoading] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [cities, setCities] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    // Filter states
    const [selectedCity, setSelectedCity] = useState('');
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    // Fetch cities for dropdown
    const fetchCities = async () => {
        try {
            const response = await cityAPI.getListCity();
            if (response.data) {
                setCities(response.data);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            message.error('Không thể tải danh sách thành phố');
        }
    };

    // Fetch blog posts
    const fetchBlogPosts = async (pageIndex = 0) => {
        setLoading(true);
        try {
            const params = {
                PageIndex: pageIndex,
                PageSize: 10,
                Status: 2, // Published status
                CityId: selectedCity || undefined,
                SearchTerm: keyword || undefined
            };

            const response = await blogAPI.getList(params);
            if (response.data) {
                setBlogPosts(response.data.items || []);
                setTotalPages(response.data.totalPages || 0);
                setCurrentPage(pageIndex);
                setTotalCount(response.data.totalCount || 0);
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            message.error('Không thể tải danh sách bài viết');
            setBlogPosts([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Initialize data
    useEffect(() => {
        fetchCities();
        fetchBlogPosts();
    }, []);

    // Handle search
    const handleSearch = () => {
        fetchBlogPosts(0); // Reset to first page when searching
    };

    // Handle pagination change
    const handlePaginationChange = (page) => {
        const pageIndex = page - 1; // Convert to 0-based index
        fetchBlogPosts(pageIndex);
    };

    // Parse tags from JSON string
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

    // Truncate description to 4 lines (approximately)
    const truncateDescription = (text, maxLength = 200) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Handle view detail
    const handleViewDetail = (slug) => {
        window.location.href = `/blog-posts/${slug}`;
    };

    return (
        <div
            style={{
                padding: screens.xs ? '16px' : '24px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}
        >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: screens.xs ? '24px' : '32px' }}>
                <h1
                    style={{
                        fontSize: screens.xs ? '24px' : '32px',
                        fontWeight: 'bold',
                        color: '#1890ff',
                        marginBottom: '8px'
                    }}
                >
                    Blog Du Lịch
                </h1>
                <p
                    style={{
                        fontSize: screens.xs ? '14px' : '16px',
                        color: '#666',
                        padding: screens.xs ? '0 16px' : '0'
                    }}
                >
                    Khám phá những điểm đến tuyệt vời và chia sẻ kinh nghiệm du lịch
                </p>
            </div>

            {/* Filter Header */}
            <Card style={{ marginBottom: screens.xs ? '16px' : '24px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={24} md={6}>
                        <div>
                            <span
                                style={{
                                    marginBottom: '8px',
                                    display: 'block',
                                    fontWeight: '500',
                                    fontSize: screens.xs ? '14px' : '16px'
                                }}
                            >
                                Chọn thành phố:
                            </span>
                            <Select
                                placeholder="Tất cả thành phố"
                                value={selectedCity || undefined}
                                onChange={setSelectedCity}
                                allowClear
                                style={{ width: '100%' }}
                                size={screens.xs ? 'middle' : 'large'}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={14}>
                        <div>
                            <span
                                style={{
                                    marginBottom: '8px',
                                    display: 'block',
                                    fontWeight: '500',
                                    fontSize: screens.xs ? '14px' : '16px'
                                }}
                            >
                                Tìm kiếm:
                            </span>
                            <Input
                                placeholder="Nhập từ khóa tìm kiếm..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onPressEnter={handleSearch}
                                style={{ width: '100%' }}
                                size={screens.xs ? 'middle' : 'large'}
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={4}>
                        <div style={{ paddingTop: screens.md ? '24px' : '8px' }}>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                style={{ width: '100%' }}
                                loading={loading}
                                size={screens.xs ? 'middle' : 'large'}
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Blog Posts List */}
            <Spin spinning={loading}>
                <div style={{ marginBottom: '24px' }}>
                    {blogPosts.length === 0 && !loading ? (
                        <Card>
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ fontSize: '16px', color: '#666' }}>Không tìm thấy bài viết nào</p>
                            </div>
                        </Card>
                    ) : (
                        blogPosts.map((post) => (
                            <Card
                                key={post.id}
                                style={{
                                    marginBottom: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                hoverable
                                bodyStyle={{ padding: '16px' }}
                            >
                                {screens.md ? (
                                    // Desktop layout: horizontal (image left, content right)
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        {/* Left: Cover Image */}
                                        <div style={{ flexShrink: 0 }}>
                                            <img
                                                src={post.coverImage || '/placeholder-image.jpg'}
                                                alt={post.title}
                                                style={{
                                                    width: '320px',
                                                    height: '200px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    display: 'block'
                                                }}
                                            />
                                        </div>

                                        {/* Right: Content */}
                                        <div
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                position: 'relative',
                                                paddingBottom: '28px'
                                            }}
                                        >
                                            {/* Title */}
                                            <h3
                                                style={{
                                                    fontSize: '20px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '8px',
                                                    color: '#1890ff',
                                                    lineHeight: '1.4'
                                                }}
                                            >
                                                {post.title}
                                            </h3>

                                            {/* Author & Date Info */}
                                            <div
                                                style={{
                                                    marginBottom: '12px',
                                                    fontSize: '14px',
                                                    color: '#666',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px'
                                                }}
                                            >
                                                <span>
                                                    <strong>Tác giả:</strong> {post.authorName || 'Không xác định'}
                                                </span>
                                                <span style={{ color: '#d9d9d9' }}>|</span>
                                                <span>
                                                    <strong>Ngày đăng:</strong> {formatDateOnly(post.publishedDate)}
                                                </span>
                                            </div>

                                            {/* Tags */}
                                            {post.tags && parseTags(post.tags).length > 0 && (
                                                <div style={{ marginBottom: '12px' }}>
                                                    {parseTags(post.tags).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            style={{
                                                                display: 'inline-block',
                                                                background: '#f0f9ff',
                                                                color: '#0284c7',
                                                                padding: '2px 8px',
                                                                borderRadius: '12px',
                                                                fontSize: '12px',
                                                                marginRight: '6px',
                                                                marginBottom: '4px'
                                                            }}
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Description */}
                                            <div
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#595959',
                                                    lineHeight: '1.5',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 4,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {truncateDescription(post.description, 450)}
                                            </div>

                                            {/* Button to view details */}
                                            <div style={{ position: 'absolute', bottom: '4px', right: '16px' }}>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDetail(post.slug);
                                                    }}
                                                    style={{
                                                        color: '#1890ff',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                                    onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                                                >
                                                    Xem chi tiết &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Mobile/Tablet layout: vertical (image top, content bottom)
                                    <div>
                                        {/* Top: Cover Image */}
                                        <div style={{ marginBottom: '12px' }}>
                                            <img
                                                src={post.coverImage || '/placeholder-image.jpg'}
                                                alt={post.title}
                                                style={{
                                                    width: '100%',
                                                    height: screens.xs ? '180px' : '220px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    display: 'block'
                                                }}
                                            />
                                        </div>

                                        {/* Bottom: Content */}
                                        <div>
                                            {/* Title */}
                                            <h3
                                                style={{
                                                    fontSize: screens.xs ? '18px' : '20px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '8px',
                                                    color: '#1890ff',
                                                    lineHeight: '1.4'
                                                }}
                                            >
                                                {post.title}
                                            </h3>

                                            {/* Author & Date Info */}
                                            <div
                                                style={{
                                                    marginBottom: '12px',
                                                    fontSize: screens.xs ? '12px' : '14px',
                                                    color: '#666',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: screens.xs ? '8px' : '12px',
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                <span>
                                                    <strong>Tác giả:</strong> {post.authorName || 'Không xác định'}
                                                </span>
                                                <span style={{ color: '#d9d9d9' }}>|</span>
                                                <span>
                                                    <strong>Ngày đăng:</strong> {formatDateOnly(post.publishedDate)}
                                                </span>
                                            </div>

                                            {/* Tags */}
                                            {post.tags && parseTags(post.tags).length > 0 && (
                                                <div style={{ marginBottom: '12px' }}>
                                                    {parseTags(post.tags).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            style={{
                                                                display: 'inline-block',
                                                                background: '#f0f9ff',
                                                                color: '#0284c7',
                                                                padding: '2px 8px',
                                                                borderRadius: '12px',
                                                                fontSize: '11px',
                                                                marginRight: '6px',
                                                                marginBottom: '4px'
                                                            }}
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Description */}
                                            <div
                                                style={{
                                                    fontSize: screens.xs ? '13px' : '14px',
                                                    color: '#595959',
                                                    lineHeight: '1.5',
                                                    marginBottom: '16px'
                                                }}
                                            >
                                                {truncateDescription(post.description, screens.xs ? 200 : 300)}
                                            </div>

                                            {/* Button to view details */}
                                            <div style={{ textAlign: 'right' }}>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDetail(post.slug);
                                                    }}
                                                    style={{
                                                        color: '#1890ff',
                                                        fontWeight: '600',
                                                        fontSize: '14px',
                                                        cursor: 'pointer',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        transition: 'color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
                                                    onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                                                >
                                                    Xem chi tiết &rarr;
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <Pagination
                            current={currentPage + 1} // Convert to 1-based for display
                            total={totalCount} // Total items (assuming 10 per page)
                            pageSize={10}
                            onChange={handlePaginationChange}
                            showSizeChanger={false}
                            showQuickJumper={!screens.xs} // Hide quick jumper on mobile
                            showTotal={(total, range) =>
                                screens.xs ? `${range[0]}-${range[1]}/${total}` : `${range[0]}-${range[1]} của ${total} bài viết`
                            }
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                            size={screens.xs ? 'small' : 'default'}
                        />
                    </div>
                )}
            </Spin>
        </div>
    );
};

export default BlogPostList;

import { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Select, Tag, message, Modal, Card, Row, Col, Typography } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { blogAPI } from 'api/blog/blogAPI';
import { formatDate } from 'utils/dateFormatter';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const BlogPostsDefault = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blogPosts, setBlogPosts] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filters
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCity, setFilterCity] = useState('');

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

    const fetchBlogPosts = async (page = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const params = {
                page: page,
                pageSize: pageSize,
                search: searchText || undefined,
                status: filterStatus || undefined,
                city: filterCity || undefined
            };

            const response = await blogAPI.getList(params);

            if (response.success) {
                setBlogPosts(response.data.items || []);
                setPagination({
                    current: page,
                    pageSize: pageSize,
                    total: response.data.totalCount || 0
                });
            } else {
                message.error(response.message || 'Không thể tải danh sách bài viết');
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const handleTableChange = (newPagination) => {
        fetchBlogPosts(newPagination.current, newPagination.pageSize);
    };

    const handleSearch = () => {
        fetchBlogPosts(1, pagination.pageSize);
    };

    const handleReset = () => {
        setSearchText('');
        setFilterStatus('');
        setFilterCity('');
        setPagination({ ...pagination, current: 1 });
        fetchBlogPosts(1, pagination.pageSize);
    };

    const handleDelete = (id) => {
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
                        fetchBlogPosts();
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

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 70,
            align: 'center'
        },
        {
            title: 'Cover',
            dataIndex: 'coverImage',
            key: 'coverImage',
            width: 100,
            align: 'center',
            render: (coverImage) =>
                coverImage ? (
                    <img src={coverImage} alt="cover" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                ) : (
                    <div
                        style={{
                            width: 60,
                            height: 40,
                            background: '#f0f0f0',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            color: '#999'
                        }}
                    >
                        No Image
                    </div>
                )
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 300,
            ellipsis: true,
            render: (text, record) => (
                <Button type="link" onClick={() => navigate(`/admin/blog/display/${record.id}`)}>
                    {text}
                </Button>
            )
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            key: 'author',
            width: 150,
            ellipsis: true
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
            key: 'city',
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => getStatusTag(status)
        },
        {
            title: 'Ngày xuất bản',
            dataIndex: 'publishedDate',
            key: 'publishedDate',
            width: 170,
            render: (date) => (date ? formatDate(date) : '-')
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            width: 200,
            render: (tags) => (
                <>
                    {tags &&
                        tags.split(',').map((tag, index) => (
                            <Tag key={index} color="blue">
                                {tag.trim()}
                            </Tag>
                        ))}
                </>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        ghost
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/blog/display/${record.id}`)}
                    />
                    <Button type="default" size="small" icon={<EditOutlined />} onClick={() => navigate(`/admin/blog/edit/${record.id}`)} />
                    <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <MainCard>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={3} style={{ margin: 0 }}>
                            Quản lý Blog Posts
                        </Title>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/blog/addnew')}>
                            Thêm bài viết mới
                        </Button>
                    </Col>
                </Row>

                {/* Filter Section */}
                <Card>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Search
                                    placeholder="Tìm kiếm tiêu đề, slug..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onSearch={handleSearch}
                                    enterButton={<SearchOutlined />}
                                    allowClear
                                />
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Select
                                    placeholder="Lọc theo trạng thái"
                                    value={filterStatus || undefined}
                                    onChange={(value) => setFilterStatus(value)}
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    <Option value="Published">Đã xuất bản</Option>
                                    <Option value="Draft">Bản nháp</Option>
                                    <Option value="Archived">Lưu trữ</Option>
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={8} lg={6}>
                                <Select
                                    placeholder="Lọc theo thành phố"
                                    value={filterCity || undefined}
                                    onChange={(value) => setFilterCity(value)}
                                    allowClear
                                    showSearch
                                    style={{ width: '100%' }}
                                >
                                    {cities.map((city) => (
                                        <Option key={city} value={city}>
                                            {city}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col xs={24} sm={12} md={24} lg={6}>
                                <Space>
                                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                                        Tìm kiếm
                                    </Button>
                                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                                        Đặt lại
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                    </Space>
                </Card>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={blogPosts}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    scroll={{ x: 1200 }}
                    bordered
                />
            </Space>
        </MainCard>
    );
};

export default BlogPostsDefault;

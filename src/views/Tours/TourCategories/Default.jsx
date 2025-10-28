import { Col, Row, Button, Space, Input, Select, Table, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainCard from 'components/MainCard';
import LoadingModal from '../../../components/LoadingModal';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';

export default function TourCategoryDefault() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filters
    const [filterName, setFilterName] = useState('');
    const [filterParentCategoryId, setFilterParentCategoryId] = useState('');
    const [filterIsActive, setFilterIsActive] = useState('');

    // Parent categories for dropdown
    const [parentCategories, setParentCategories] = useState([]);

    // Fetch parent categories for filter
    const fetchParentCategories = async () => {
        try {
            const response = await tourCategoryAPI.getList();
            if (response.success) {
                // Filter to get only parent categories (no parentCategoryId)
                const parents = (response.data || []).filter((cat) => !cat.parentCategoryId);
                setParentCategories(parents);
            }
        } catch (error) {
            console.error('Error fetching parent categories:', error);
        }
    };

    const fetchCategories = async (params = {}) => {
        setLoading(true);
        try {
            const { page = pagination.current, pageSize = pagination.pageSize } = params;

            const searchData = {
                pageIndex: page,
                pageSize: pageSize,
                filter: {
                    name: filterName || null,
                    parentCategoryId: filterParentCategoryId || null,
                    isActive: filterIsActive !== '' ? filterIsActive : null
                }
            };

            const response = await tourCategoryAPI.search(searchData);
            console.log('API Response:', response);

            if (response?.data?.categories) {
                const categoryList = response.data.categories;
                const meta = response.data.meta;

                setCategories(categoryList);
                setPagination({
                    current: meta?.page || 1,
                    pageSize: meta?.pageSize || 10,
                    total: meta?.totalCount || categoryList.length
                });
            } else if (response?.data) {
                // If API returns direct array
                setCategories(response.data);
                setPagination({
                    current: 1,
                    pageSize: 10,
                    total: response.data.length
                });
            } else {
                message.warning('Không tìm thấy dữ liệu danh mục tour.');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách danh mục tour.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn xóa danh mục tour này?');
            if (!confirmed) return;

            LoadingModal.showLoading();
            const response = await tourCategoryAPI.delete(id);
            if (response.success) {
                message.success('Xóa danh mục tour thành công!');
                fetchCategories();
            } else {
                message.error('Xóa danh mục tour thất bại!');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Đã xảy ra lỗi khi xóa danh mục tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    useEffect(() => {
        fetchParentCategories();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text, record) => <Link to={`/admin/service/tour-category/display/${record.id}`}>{text}</Link>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            render: (text) => text || '—'
        },
        {
            title: 'Danh mục cha',
            dataIndex: 'parentCategoryName',
            key: 'parentCategoryName',
            align: 'center',
            render: (text) => text || 'Danh mục gốc'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            align: 'center',
            render: (imageUrl) =>
                imageUrl ? (
                    <img src={imageUrl} alt="Category" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
                ) : (
                    '—'
                )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            render: (value) => (value ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng</Tag>)
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '—')
        },
        {
            title: 'Chức năng',
            key: 'actions',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/service/tour-category/edit/${record.id}`)}
                        title="Chỉnh sửa"
                    />
                    <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger title="Xóa" />
                </Space>
            )
        }
    ];

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Danh sách danh mục tour"
                    secondary={
                        <Button
                            type="primary"
                            onClick={() => navigate('/admin/service/tour-category/addnew')}
                            shape="round"
                            icon={<PlusOutlined />}
                        >
                            Tạo danh mục mới
                        </Button>
                    }
                >
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={6}>
                            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Nhập tên danh mục" />
                        </Col>
                        <Col span={6}>
                            <Select
                                value={filterParentCategoryId || undefined}
                                onChange={(value) => setFilterParentCategoryId(value)}
                                allowClear
                                placeholder="Chọn danh mục cha"
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{ width: '100%' }}
                            >
                                {parentCategories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Select
                                value={filterIsActive !== '' ? filterIsActive : undefined}
                                onChange={(value) => setFilterIsActive(value)}
                                allowClear
                                placeholder="Chọn trạng thái"
                                style={{ width: '100%' }}
                            >
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Ngừng hoạt động</Select.Option>
                            </Select>
                        </Col>
                        <Col span={6}>
                            <Space>
                                <Button type="primary" icon={<SearchOutlined />} onClick={() => fetchCategories({ page: 1 })}>
                                    Tìm kiếm
                                </Button>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={() => {
                                        setFilterName('');
                                        setFilterParentCategoryId('');
                                        setFilterIsActive('');
                                        fetchCategories({ page: 1 });
                                    }}
                                >
                                    Đặt lại
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <h6 className="mb-3">Tổng số bản ghi: {pagination.total}</h6>

                    <Table
                        dataSource={categories}
                        columns={columns}
                        rowKey={(record) => record.id}
                        bordered
                        loading={loading}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            onChange: (page, pageSize) => {
                                setPagination({ ...pagination, current: page, pageSize });
                                fetchCategories({ page, pageSize });
                            }
                        }}
                    />
                </MainCard>

                {loading && <LoadingModal />}
            </Col>
        </Row>
    );
}

import { Col, Row, Button, Space, Input, Select, Table, Tag, message, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import LoadingModal from '../../../components/LoadingModal';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';
import Constants from 'Constants/Constants';
import Utility from 'utils/Utility';

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
            const {
                page = pagination.current,
                pageSize = pagination.pageSize,
                name = filterName,
                parentCategoryId = filterParentCategoryId
            } = params;

            const searchData = {
                pageIndex: page,
                pageSize: pageSize,
                filter: {
                    name: name || null,
                    parentCategoryId: parentCategoryId || null
                }
            };

            const response = await tourCategoryAPI.search(searchData);
            console.log('API Response:', response);

            if (response?.success && response?.data?.categories) {
                const categoryList = response.data.categories;
                const meta = response.data.meta;

                setCategories(categoryList);
                setPagination({
                    current: meta?.page || 1,
                    pageSize: meta?.pageSize || 10,
                    total: meta?.totalCount || categoryList.length
                });
            } else {
                message.warning('Không tìm thấy dữ liệu danh mục tour.');
                setCategories([]);
                setPagination({
                    current: 1,
                    pageSize: 10,
                    total: 0
                });
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách danh mục tour.');
            setCategories([]);
            setPagination({
                current: 1,
                pageSize: 10,
                total: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchCategories({
            page: 1,
            name: filterName,
            parentCategoryId: filterParentCategoryId
        });
    };

    const handleReset = () => {
        // Reset state
        setFilterName('');
        setFilterParentCategoryId('');

        // Fetch với filter rỗng ngay lập tức
        fetchCategories({
            page: 1,
            name: '',
            parentCategoryId: ''
        });
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa danh mục tour này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
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
                    message.error('Đá xảy ra lỗi khi xóa danh mục tour.');
                } finally {
                    LoadingModal.hideLoading();
                }
            }
        });
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
            width: 60,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            onHeaderCell: () => ({ style: { textAlign: 'center' } })
        },
        {
            title: 'Mô tả về danh mục',
            dataIndex: 'description',
            key: 'description',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (text) => text || '—',
            ellipsis: true
        },
        {
            title: 'Tên danh mục cha',
            dataIndex: 'parentCategoryName',
            key: 'parentCategoryName',
            align: 'center',
            render: (text) => text || 'Không có'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            render: (value) => {
                const label = Utility.getLabelByValue(Constants.StatusOptions, value);
                return <Tag color={Utility.getTagColor('status', value)}>{label}</Tag>;
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: 120,
            render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '—')
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
                        onClick={() => navigate(`/admin/service/tour-category/display/${record.id}`)}
                    />
                    <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/service/tour-category/edit/${record.id}`)}
                    />
                    <Button type="primary" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
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
                                fetchCategories({
                                    page,
                                    pageSize,
                                    name: filterName,
                                    parentCategoryId: filterParentCategoryId
                                });
                            }
                        }}
                    />
                </MainCard>

                {loading && <LoadingModal />}
            </Col>
        </Row>
    );
}

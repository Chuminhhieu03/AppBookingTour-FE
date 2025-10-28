import { Col, Row, Button, Space, Input, Select, Table, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainCard from 'components/MainCard';
import LoadingModal from '../../../components/LoadingModal';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';

export default function TourTypeDefault() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tourTypes, setTourTypes] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filters
    const [filterName, setFilterName] = useState('');
    const [filterIsActive, setFilterIsActive] = useState('');

    const fetchTourTypes = async (params = {}) => {
        setLoading(true);
        try {
            const { page = pagination.current, pageSize = pagination.pageSize } = params;

            const searchData = {
                pageIndex: page,
                pageSize: pageSize,
                filter: {
                    name: filterName || null,
                    isActive: filterIsActive !== '' ? filterIsActive : null
                }
            };

            const response = await tourTypeAPI.search(searchData);
            console.log('API Response:', response);

            if (response?.data?.tourTypes) {
                const tourTypeList = response.data.tourTypes;
                const meta = response.data.meta;

                setTourTypes(tourTypeList);
                setPagination({
                    current: meta?.page || 1,
                    pageSize: meta?.pageSize || 10,
                    total: meta?.totalCount || tourTypeList.length
                });
            } else if (response?.data) {
                // If API returns direct array
                setTourTypes(response.data);
                setPagination({
                    current: 1,
                    pageSize: 10,
                    total: response.data.length
                });
            } else {
                message.warning('Không tìm thấy dữ liệu loại tour.');
            }
        } catch (error) {
            console.error('Error fetching tour types:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách loại tour.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('Bạn có chắc chắn muốn xóa loại tour này?');
            if (!confirmed) return;

            LoadingModal.showLoading();
            const response = await tourTypeAPI.delete(id);
            if (response.success) {
                message.success('Xóa loại tour thành công!');
                fetchTourTypes();
            } else {
                message.error('Xóa loại tour thất bại!');
            }
        } catch (error) {
            console.error('Error deleting tour type:', error);
            message.error('Đã xảy ra lỗi khi xóa loại tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    useEffect(() => {
        fetchTourTypes();
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
            title: 'Tên loại tour',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            render: (text, record) => <Link to={`/admin/service/tour-type/display/${record.id}`}>{text}</Link>
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            render: (text) => text || '—'
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            align: 'center',
            render: (imageUrl) =>
                imageUrl ? (
                    <img src={imageUrl} alt="Tour Type" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
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
                        onClick={() => navigate(`/admin/service/tour-type/edit/${record.id}`)}
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
                    title="Danh sách loại tour"
                    secondary={
                        <Button
                            type="primary"
                            onClick={() => navigate('/admin/service/tour-type/addnew')}
                            shape="round"
                            icon={<PlusOutlined />}
                        >
                            Tạo loại tour mới
                        </Button>
                    }
                >
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={8}>
                            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Nhập tên loại tour" />
                        </Col>
                        <Col span={8}>
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
                        <Col span={8}>
                            <Space>
                                <Button type="primary" icon={<SearchOutlined />} onClick={() => fetchTourTypes({ page: 1 })}>
                                    Tìm kiếm
                                </Button>
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={() => {
                                        setFilterName('');
                                        setFilterIsActive('');
                                        fetchTourTypes({ page: 1 });
                                    }}
                                >
                                    Đặt lại
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                    <h6 className="mb-3">Tổng số bản ghi: {pagination.total}</h6>

                    <Table
                        dataSource={tourTypes}
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
                                fetchTourTypes({ page, pageSize });
                            }
                        }}
                    />
                </MainCard>

                {loading && <LoadingModal />}
            </Col>
        </Row>
    );
}

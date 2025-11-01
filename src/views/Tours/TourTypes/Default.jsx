import { Col, Row, Button, Space, Input, Select, Table, Tag, message, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    const fetchTourTypes = async (params = {}) => {
        setLoading(true);
        try {
            const { page = pagination.current, pageSize = pagination.pageSize, name = filterName } = params;

            const searchData = {
                pageIndex: page,
                pageSize: pageSize,
                filter: {
                    name: name || null
                }
            };

            const response = await tourTypeAPI.search(searchData);
            console.log('API Response:', response);

            if (response?.success && response?.data?.tourTypes) {
                const tourTypeList = response.data.tourTypes;
                const meta = response.data.meta;

                setTourTypes(tourTypeList);
                setPagination({
                    current: meta?.page || 1,
                    pageSize: meta?.pageSize || 10,
                    total: meta?.totalCount || tourTypeList.length
                });
            } else {
                message.warning('Không tìm thấy dữ liệu loại tour.');
                setTourTypes([]);
                setPagination({
                    current: 1,
                    pageSize: 10,
                    total: 0
                });
            }
        } catch (error) {
            console.error('Error fetching tour types:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách loại tour.');
            setTourTypes([]);
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
        fetchTourTypes({
            page: 1,
            name: filterName
        });
    };

    const handleReset = () => {
        // Reset state
        setFilterName('');

        // Fetch với filter rỗng ngay lập tức
        fetchTourTypes({
            page: 1,
            name: ''
        });
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa loại tour này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
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
            }
        });
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
            width: 60,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Tên loại tour',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render: (text) => text || '—',
            ellipsis: true
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            render: (value) => (value ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>)
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
                        onClick={() => navigate(`/admin/service/tour-type/display/${record.id}`)}
                    />
                    <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/service/tour-type/edit/${record.id}`)}
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
                        <Col span={6}>
                            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Nhập tên loại tour" />
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
                                fetchTourTypes({
                                    page,
                                    pageSize,
                                    name: filterName
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

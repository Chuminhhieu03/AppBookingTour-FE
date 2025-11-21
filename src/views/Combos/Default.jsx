import { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Input,
    Select,
    Tag,
    message,
    Modal,
    Card,
    Row,
    Col,
    Typography,
    Slider,
    Radio,
    Rate,
    Badge,
    Tooltip
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined,
    ReloadOutlined,
    CarOutlined,
    RocketOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import comboAPI from 'api/combo/comboAPI';
import cityAPI from 'api/city/cityAPI';
import Utility from 'utils/Utility';
import { getVehicleLabel, getStatusLabel, getStatusColor } from 'utils/common_utlity';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const CombosDefault = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [combos, setCombos] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);

    const [pagination, setPagination] = useState({
        current: 0,
        pageSize: 20,
        total: 0
    });

    // Filters
    const [searchText, setSearchText] = useState('');
    const [filterFromCity, setFilterFromCity] = useState(undefined);
    const [filterToCity, setFilterToCity] = useState(undefined);
    const [filterVehicle, setFilterVehicle] = useState(undefined);
    const [filterStatus, setFilterStatus] = useState(true);
    const [priceRange, setPriceRange] = useState([0, 100000000]);
    const [durationRange, setDurationRange] = useState([1, 30]);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDescending, setSortDescending] = useState(false);

    // Fetch cities khi component mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoadingCities(true);
                const response = await cityAPI.getListCity();
                if (response.success) {
                    setCities(response.data || []);
                } else {
                    message.error('Không thể tải danh sách thành phố');
                    setCities([]);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                message.error('Đã xảy ra lỗi khi tải danh sách thành phố');
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, []);

    const fetchCombos = async (pageIndex = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const params = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                searchTerm: searchText || undefined,
                fromCityId: filterFromCity || undefined,
                toCityId: filterToCity || undefined,
                vehicle: filterVehicle || undefined,
                isActive: filterStatus,
                minPrice: priceRange[0],
                maxPrice: priceRange[1],
                minDuration: durationRange[0],
                maxDuration: durationRange[1],
                sortBy: sortBy,
                sortDescending: sortDescending
            };

            const response = await comboAPI.getList(params);

            if (response.success) {
                setCombos(response.data.items || []);
                setPagination({
                    current: pageIndex,
                    pageSize: pageSize,
                    total: response.data.totalCount || 0
                });
            } else {
                message.error(response.message || 'Không thể tải danh sách combo');
            }
        } catch (error) {
            console.error('Error fetching combos:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách combo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombos();
    }, []);

    const handleTableChange = (newPagination) => {
        fetchCombos(newPagination.current - 1, newPagination.pageSize); // Convert to 0-based
    };

    const handleSearch = () => {
        fetchCombos(0, pagination.pageSize);
    };

    const handleReset = () => {
        setSearchText('');
        setFilterFromCity(undefined);
        setFilterToCity(undefined);
        setFilterVehicle(undefined);
        setFilterStatus(true);
        setPriceRange([0, 100000000]);
        setDurationRange([1, 30]);
        setSortBy('createdAt');
        setSortDescending(false);
        fetchCombos(0, pagination.pageSize);
    };

    const handleDelete = (id, code) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa combo "${code}"? Hành động này không thể hoàn tác.`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await comboAPI.delete(id);
                    if (response.success) {
                        message.success('Xóa combo thành công');
                        fetchCombos();
                    } else {
                        message.error(response.message || 'Không thể xóa combo');
                    }
                } catch (error) {
                    console.error('Error deleting combo:', error);
                    const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi xóa combo';
                    message.error(errorMsg);
                }
            }
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            align: 'center'
        },
        {
            title: 'Mã Combo',
            dataIndex: 'code',
            key: 'code',
            width: 130,
            ellipsis: true
        },
        {
            title: 'Tên Combo',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            ellipsis: true,
            render: (_, record) => record.name
        },
        {
            title: 'Tuyến đường',
            key: 'route',
            width: 180,
            ellipsis: true,
            render: (_, record) => (
                <span>
                    {record.fromCityName} → {record.toCityName}
                </span>
            )
        },
        {
            title: 'Phương tiện',
            dataIndex: 'vehicle',
            key: 'vehicle',
            width: 110,
            align: 'center',
            render: (vehicle) => <span>{getVehicleLabel(vehicle)}</span>
        },
        {
            title: 'Thời lượng',
            dataIndex: 'durationDays',
            key: 'durationDays',
            width: 110,
            align: 'center',
            render: (days) => Utility.formatDuration(days)
        },
        {
            title: 'Giá người lớn',
            dataIndex: 'basePriceAdult',
            key: 'basePriceAdult',
            width: 130,
            align: 'right',
            render: (price) => <span>{Utility.formatPrice(price)}</span>
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            width: 120,
            align: 'center',
            render: (rating, record) => (
                <Space direction="vertical" size={0}>
                    <Rate disabled value={rating} style={{ fontSize: 12 }} />
                    <span style={{ fontSize: 11, color: '#888' }}>({record.totalBookings} bookings)</span>
                </Space>
            )
        },
        {
            title: 'Lượt đặt',
            dataIndex: 'totalBookings',
            key: 'totalBookings',
            width: 90,
            align: 'center',
            render: (bookings) => <Badge count={bookings} showZero style={{ backgroundColor: '#52c41a' }} />
        },
        {
            title: 'Lượt xem',
            dataIndex: 'viewCount',
            key: 'viewCount',
            width: 90,
            align: 'center',
            render: (views) => <Badge count={views} showZero style={{ backgroundColor: '#1890ff' }} />
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 110,
            align: 'center',
            render: (isActive) => <Tag color={getStatusColor(isActive)}>{getStatusLabel(isActive)}</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/admin/service/combo/display/${record.id}`)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => navigate(`/admin/service/combo/edit/${record.id}`)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id, record.code)} />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <MainCard>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>
                        Quản lý Combo Tour
                    </Title>
                </Col>
                <Col>
                    <Space>
                        <Button icon={<ReloadOutlined />} onClick={() => fetchCombos()}>
                            Làm mới
                        </Button>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/service/combo/addnew')}>
                            Thêm Combo mới
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }} bodyStyle={{ paddingBottom: 0 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Search
                            placeholder="Tìm theo mã hoặc tên combo"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSearch={handleSearch}
                            enterButton
                        />
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Chọn thành phố đi"
                            value={filterFromCity}
                            onChange={setFilterFromCity}
                            style={{ width: '100%' }}
                            allowClear
                            showSearch
                            loading={loadingCities}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {cities.map((city) => (
                                <Option key={city.id} value={city.id}>
                                    {city.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Chọn thành phố đến"
                            value={filterToCity}
                            onChange={setFilterToCity}
                            style={{ width: '100%' }}
                            allowClear
                            showSearch
                            loading={loadingCities}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {cities.map((city) => (
                                <Option key={city.id} value={city.id}>
                                    {city.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            placeholder="Chọn phương tiện"
                            value={filterVehicle}
                            onChange={setFilterVehicle}
                            style={{ width: '100%' }}
                            allowClear
                        >
                            <Option value={1}>
                                <CarOutlined /> Xe ô tô
                            </Option>
                            <Option value={2}>
                                <RocketOutlined /> Máy bay
                            </Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select placeholder="Trạng thái" value={filterStatus} onChange={setFilterStatus} style={{ width: '100%' }}>
                            <Option value={true}>Hoạt động</Option>
                            <Option value={false}>Không hoạt động</Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select placeholder="Sắp xếp theo" value={sortBy} onChange={setSortBy} style={{ width: '100%' }}>
                            <Option value="price">Giá</Option>
                            <Option value="rating">Đánh giá</Option>
                            <Option value="totalBookings">Lượt đặt</Option>
                            <Option value="createdAt">Ngày tạo</Option>
                            <Option value="name">Tên</Option>
                        </Select>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Radio.Group value={sortDescending} onChange={(e) => setSortDescending(e.target.value)} style={{ width: '100%' }}>
                            <Radio.Button value={false} style={{ width: '50%', textAlign: 'center' }}>
                                Tăng dần
                            </Radio.Button>
                            <Radio.Button value={true} style={{ width: '50%', textAlign: 'center' }}>
                                Giảm dần
                            </Radio.Button>
                        </Radio.Group>
                    </Col>

                    <Col xs={24} sm={12} md={16} lg={6}>
                        <Space>
                            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                                Tìm kiếm
                            </Button>
                            <Button onClick={handleReset}>Đặt lại</Button>
                        </Space>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} md={12}>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Khoảng giá: </strong>
                            {Utility.formatPrice(priceRange[0])} - {Utility.formatPrice(priceRange[1])}
                        </div>
                        <Slider range min={0} max={100000000} step={1000000} value={priceRange} onChange={setPriceRange} />
                    </Col>

                    <Col xs={24} md={12}>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Số ngày: </strong>
                            {durationRange[0]} - {durationRange[1]} ngày
                        </div>
                        <Slider range min={1} max={30} value={durationRange} onChange={setDurationRange} />
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={combos}
                rowKey="id"
                loading={loading}
                pagination={{
                    ...pagination,
                    current: pagination.current + 1, // Convert to 1-based for display
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} combo`,
                    pageSizeOptions: ['10', '20', '50', '100']
                }}
                onChange={handleTableChange}
                scroll={{ x: 1500 }}
            />
        </MainCard>
    );
};

export default CombosDefault;

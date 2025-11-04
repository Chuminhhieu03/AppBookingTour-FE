import { useState, useEffect } from 'react';
import { Table, Tag, Col, Row, Input, Flex, Button, Space, Select, message, Modal } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { tourAPI } from '../../api/tour/tourAPI';
import tourCategoryAPI from '../../api/tour/tourCategoryAPI';
import tourTypeAPI from '../../api/tour/tourTypeAPI';
import cityAPI from '../../api/city/cityAPI';
import LoadingModal from '../../components/LoadingModal';

export default function TourDefault() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [tours, setTours] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filters
    const [filterName, setFilterName] = useState('');
    const [filterCode, setFilterCode] = useState('');
    const [filterCategoryId, setFilterCategoryId] = useState('');
    const [filterTypeId, setFilterTypeId] = useState('');
    const [filterCityId, setFilterCityId] = useState('');
    const [filterPriceFrom, setFilterPriceFrom] = useState('');
    const [filterPriceTo, setFilterPriceTo] = useState('');
    const [filterActive, setFilterActive] = useState('');

    // Dropdown data
    const [tourCategories, setTourCategories] = useState([]);
    const [tourTypes, setTourTypes] = useState([]);
    const [cities, setCities] = useState([]);

    // Fetch dropdown data
    const fetchDropdownData = async () => {
        try {
            // Fetch tour categories
            const categoryResponse = await tourCategoryAPI.getList();
            if (categoryResponse.success) {
                setTourCategories(categoryResponse.data || []);
            }

            // Fetch tour types
            const typeResponse = await tourTypeAPI.getList();
            if (typeResponse.success) {
                setTourTypes(typeResponse.data || []);
            }

            // Fetch cities
            const cityResponse = await cityAPI.getListCity();
            if (cityResponse.success) {
                setCities(cityResponse.data || []);
            }
        } catch (error) {
            console.error('Error fetching dropdown data:', error);
            message.error('Đã xảy ra lỗi khi tải dữ liệu dropdown.');
        }
    };

    const fetchTours = async (params = {}) => {
        setLoading(true);
        try {
            const {
                page = pagination.current,
                pageSize = pagination.pageSize,
                code = filterCode,
                name = filterName,
                categoryId = filterCategoryId,
                typeId = filterTypeId,
                cityId = filterCityId,
                priceFrom = filterPriceFrom,
                priceTo = filterPriceTo,
                active = filterActive
            } = params;

            const searchData = {
                pageIndex: page,
                pageSize: pageSize,
                filter: {
                    code: code || null,
                    name: name || null,
                    categoryId: categoryId || null,
                    typeId: typeId || null,
                    cityId: cityId || null,
                    priceFrom: priceFrom ? parseFloat(priceFrom) : null,
                    priceTo: priceTo ? parseFloat(priceTo) : null,
                    active: active !== '' ? active : null
                }
            };

            const response = await tourAPI.search(searchData);
            console.log('API Response:', response);

            if (response?.data?.tours) {
                const tourList = response.data.tours;
                const meta = response.data.meta;

                setTours(tourList);
                setPagination({
                    current: meta?.page || 1,
                    pageSize: meta?.pageSize || 10,
                    total: meta?.totalCount || tourList.length
                });
            } else {
                message.warning('Không tìm thấy dữ liệu tour.');
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            message.error('Đã xảy ra lỗi khi tải danh sách tour.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        // Validate before search
        if (filterPriceFrom && filterPriceTo && parseFloat(filterPriceFrom) >= parseFloat(filterPriceTo)) {
            message.error('Giá từ phải nhỏ hơn giá đến. Vui lòng kiểm tra lại!');
            return;
        }

        fetchTours({
            page: 1,
            code: filterCode,
            name: filterName,
            categoryId: filterCategoryId,
            typeId: filterTypeId,
            cityId: filterCityId,
            priceFrom: filterPriceFrom,
            priceTo: filterPriceTo,
            active: filterActive
        });
    };

    const handleReset = () => {
        // Reset state
        setFilterName('');
        setFilterCode('');
        setFilterCategoryId('');
        setFilterTypeId('');
        setFilterCityId('');
        setFilterPriceFrom('');
        setFilterPriceTo('');
        setFilterActive('');

        // Fetch với filter rỗng ngay lập tức
        fetchTours({
            page: 1,
            code: '',
            name: '',
            categoryId: '',
            typeId: '',
            cityId: '',
            priceFrom: '',
            priceTo: '',
            active: ''
        });
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tour này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    LoadingModal.showLoading();
                    const response = await tourAPI.delete(id);
                    if (response.success) {
                        message.success('Xóa tour thành công!');
                        fetchTours(); // Refresh the list
                    } else {
                        message.error('Xóa tour thất bại!');
                    }
                } catch (error) {
                    console.error('Error deleting tour:', error);
                    message.error('Đã xảy ra lỗi khi xóa tour.');
                } finally {
                    LoadingModal.hideLoading();
                }
            }
        });
    };

    useEffect(() => {
        fetchDropdownData();
        fetchTours();
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
            title: 'Mã Tour',
            dataIndex: 'code',
            key: 'code',
            align: 'center'
        },
        {
            title: 'Tên Tour',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'Loại Tour',
            dataIndex: 'typeName',
            key: 'typeName',
            align: 'center'
        },
        {
            title: 'Danh mục',
            dataIndex: 'categoryName',
            key: 'categoryName',
            align: 'center'
        },
        {
            title: 'Nơi khởi hành',
            dataIndex: 'departureCityName',
            key: 'departureCityName',
            align: 'center'
        },
        {
            title: 'Thời gian',
            key: 'duration',
            align: 'center',
            render: (_, record) => `${record.durationDays}N${record.durationNights}Đ`
        },
        {
            title: 'Giá người lớn (VND)',
            dataIndex: 'basePriceAdult',
            key: 'basePriceAdult',
            align: 'center',
            render: (value) => (value ? value.toLocaleString('vi-VN') : '—')
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            render: (value) => (value ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>)
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
                        onClick={() => navigate(`/admin/service/tour/display/${record.id}`)}
                    />
                    <Button
                        type="default"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/service/tour/edit/${record.id}`)}
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
                    title="Danh sách tour"
                    secondary={
                        <Button type="primary" onClick={() => navigate('/admin/service/tour/addnew')} shape="round" icon={<PlusOutlined />}>
                            Tạo tour mới
                        </Button>
                    }
                >
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={4}>
                            <Input value={filterCode} onChange={(e) => setFilterCode(e.target.value)} placeholder="Nhập mã tour" />
                        </Col>
                        <Col span={4}>
                            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} placeholder="Nhập tên tour" />
                        </Col>
                        <Col span={4}>
                            <Select
                                value={filterCategoryId || undefined}
                                onChange={(value) => setFilterCategoryId(value)}
                                allowClear
                                placeholder="Chọn danh mục"
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{ width: '100%' }}
                            >
                                {tourCategories.map((category) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select
                                value={filterTypeId || undefined}
                                onChange={(value) => setFilterTypeId(value)}
                                allowClear
                                placeholder="Chọn loại tour"
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{ width: '100%' }}
                            >
                                {tourTypes.map((type) => (
                                    <Select.Option key={type.id} value={type.id}>
                                        {type.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Select
                                value={filterCityId || undefined}
                                onChange={(value) => setFilterCityId(value)}
                                allowClear
                                placeholder="Chọn thành phố"
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{ width: '100%' }}
                            >
                                {cities.map((city) => (
                                    <Select.Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={4}>
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
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={4}>
                            <Input
                                type="number"
                                value={filterPriceFrom}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterPriceFrom(value);
                                    if (filterPriceTo && value && parseFloat(value) >= parseFloat(filterPriceTo)) {
                                        message.warning('Giá từ phải nhỏ hơn giá đến');
                                    }
                                }}
                                placeholder="Giá từ (VND)"
                                min="0"
                            />
                        </Col>
                        <Col span={4}>
                            <Input
                                type="number"
                                value={filterPriceTo}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setFilterPriceTo(value);
                                    if (filterPriceFrom && value && parseFloat(filterPriceFrom) >= parseFloat(value)) {
                                        message.warning('Giá đến phải lớn hơn giá từ');
                                    }
                                }}
                                placeholder="Giá đến (VND)"
                                min="0"
                            />
                        </Col>
                        <Col span={4}>
                            <Select
                                value={filterActive || undefined}
                                onChange={(value) => setFilterActive(value)}
                                allowClear
                                placeholder="Chọn trạng thái"
                                style={{ width: '100%' }}
                            >
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Ngừng hoạt động</Select.Option>
                            </Select>
                        </Col>
                    </Row>

                    <h6 className="mb-3">Tổng số bản ghi: {pagination.total}</h6>

                    <Table
                        dataSource={tours}
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
                                fetchTours({
                                    page,
                                    pageSize,
                                    code: filterCode,
                                    name: filterName,
                                    categoryId: filterCategoryId,
                                    typeId: filterTypeId,
                                    cityId: filterCityId,
                                    priceFrom: filterPriceFrom,
                                    priceTo: filterPriceTo,
                                    active: filterActive
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

import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Select, Table, message, Col, Row, Space } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import statisticsAPI from 'api/statistics/statisticsAPI';
import MainCard from 'components/MainCard';
import { ITEM_TYPE_OPTIONS } from 'constant/itemTypeEnum';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ItemStatisticsByBookingCount = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        itemType: null,
        startDate: null,
        endDate: null
    });

    // Initialize filters from URL params and auto search
    useEffect(() => {
        const urlStartDate = searchParams.get('startDate');
        const urlEndDate = searchParams.get('endDate');
        const urlItemType = searchParams.get('itemType');

        if (urlStartDate && urlEndDate && urlItemType) {
            const newFilters = {
                itemType: parseInt(urlItemType),
                startDate: dayjs(urlStartDate),
                endDate: dayjs(urlEndDate)
            };
            setFilters(newFilters);

            // Auto-search with URL parameters
            handleAutoSearch(newFilters);
        }
    }, [searchParams]);

    // Auto search function for URL parameters
    const handleAutoSearch = async (searchFilters) => {
        const params = {
            itemType: searchFilters.itemType,
            startDate: searchFilters.startDate.format('YYYY-MM-DD'),
            endDate: searchFilters.endDate.format('YYYY-MM-DD')
        };

        try {
            setLoading(true);
            const response = await statisticsAPI.getItemStatisticsByBookingCount(params);

            if (response.success && response.data) {
                setData(response.data.items || []);
            } else {
                message.error(response.message || 'Có lỗi xảy ra khi lấy dữ liệu');
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            message.error('Có lỗi xảy ra khi lấy dữ liệu');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle filter changes
    const handleItemTypeChange = (value) => {
        setFilters((prev) => ({
            ...prev,
            itemType: value
        }));
    };

    const handleDateRangeChange = (dates) => {
        setFilters((prev) => ({
            ...prev,
            startDate: dates ? dates[0] : null,
            endDate: dates ? dates[1] : null
        }));
    };

    // Handle search
    const handleSearch = async () => {
        if (!filters.itemType || !filters.startDate || !filters.endDate) {
            message.error('Vui lòng nhập đầy đủ thông tin: Loại sản phẩm, Ngày bắt đầu và Ngày kết thúc');
            return;
        }

        const params = {
            itemType: filters.itemType,
            startDate: filters.startDate.format('YYYY-MM-DD'),
            endDate: filters.endDate.format('YYYY-MM-DD')
        };

        try {
            setLoading(true);
            const response = await statisticsAPI.getItemStatisticsByBookingCount(params);

            if (response.success && response.data) {
                setData(response.data.items || []);
            } else {
                message.error(response.message || 'Có lỗi xảy ra khi lấy dữ liệu');
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            message.error('Có lỗi xảy ra khi lấy dữ liệu');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle view details
    const handleViewDetails = (record) => {
        if (!filters.startDate || !filters.endDate || !filters.itemType) {
            message.error('Vui lòng thực hiện thống kê trước khi xem chi tiết');
            return;
        }

        const params = new URLSearchParams({
            startDate: filters.startDate.format('YYYY-MM-DD'),
            endDate: filters.endDate.format('YYYY-MM-DD'),
            itemType: filters.itemType.toString(),
            itemId: record.itemId.toString()
        });

        navigate(`/admin/statistics/item-booking-count-detail?${params.toString()}`);
    };

    // Table columns
    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => index + 1
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'itemCode',
            key: 'itemCode',
            align: 'center'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'itemName',
            key: 'itemName',
            align: 'center',
            width: 200
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            align: 'center',
            width: 100,
            render: (rating) => (rating ? rating.toFixed(2) : '0.00')
        },
        {
            title: 'Tổng booking hoàn thành',
            dataIndex: 'totalCompletedBookings',
            key: 'totalCompletedBookings',
            align: 'right',
            width: 140,
            render: (value) => <div style={{ textAlign: 'right' }}>{value || 0}</div>
        },
        {
            title: 'Tổng booking bị hủy',
            dataIndex: 'totalCanceledBookings',
            key: 'totalCanceledBookings',
            align: 'right',
            width: 130,
            render: (value) => <div style={{ textAlign: 'right' }}>{value || 0}</div>
        },
        {
            title: 'Tỷ lệ hủy',
            dataIndex: 'cancellationRate',
            key: 'cancellationRate',
            align: 'right',
            width: 100,
            render: (value) => (
                <div style={{ textAlign: 'right' }}>{value !== null && value !== undefined ? `${(value * 100).toFixed(2)}%` : '0.00%'}</div>
            )
        },
        {
            title: 'Số lượng tùy chọn',
            dataIndex: 'itemOptionCount',
            key: 'itemOptionCount',
            align: 'center',
            width: 120
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Button type="primary" ghost size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
            )
        }
    ];

    return (
        <Row>
            <Col span={24}>
                <MainCard title="Thống kê sản phẩm theo lượt booking">
                    {/* Filter Section */}
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={4}>
                            <Select
                                value={filters.itemType}
                                onChange={handleItemTypeChange}
                                allowClear
                                placeholder="Chọn loại sản phẩm"
                                style={{ width: '100%' }}
                            >
                                {ITEM_TYPE_OPTIONS.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <RangePicker
                                format="DD/MM/YYYY"
                                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                value={filters.startDate && filters.endDate ? [filters.startDate, filters.endDate] : null}
                                onChange={handleDateRangeChange}
                                style={{ width: '100%' }}
                            />
                        </Col>
                        <Col span={4}>
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                loading={loading}
                                style={{ width: '100%' }}
                            >
                                Thống kê
                            </Button>
                        </Col>
                    </Row>

                    <h6 className="mb-3">Tổng số bản ghi: {data.length}</h6>

                    {/* Statistics Table */}
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="itemId"
                        bordered
                        loading={loading}
                        pagination={false}
                        locale={{
                            emptyText: 'Không có dữ liệu phù hợp với điều kiện tìm kiếm'
                        }}
                    />
                </MainCard>
            </Col>
        </Row>
    );
};

export default ItemStatisticsByBookingCount;

import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Select, Table, message, Col, Row, Space } from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import statisticsAPI from 'api/statistics/statisticsAPI';
import MainCard from 'components/MainCard';
import Constants from 'Constants/Constants';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ItemStatisticsByRevenue = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    // Internal state for form inputs (controlled components)
    const [internalFilters, setInternalFilters] = useState({
        itemType: null,
        startDate: null,
        endDate: null
    });

    // Effect to handle URL search params changes and API calls
    useEffect(() => {
        const urlStartDate = searchParams.get('startDate');
        const urlEndDate = searchParams.get('endDate');
        const urlItemType = searchParams.get('itemType');

        // Check if all required params exist
        if (urlStartDate && urlEndDate && urlItemType) {
            setInternalFilters({
                itemType: parseInt(urlItemType),
                startDate: dayjs(urlStartDate),
                endDate: dayjs(urlEndDate)
            });

            // Call API with URL parameters
            handleApiCall({
                itemType: parseInt(urlItemType),
                startDate: urlStartDate,
                endDate: urlEndDate
            });
        } else {
            setData([]);
            setInternalFilters({
                itemType: null,
                startDate: null,
                endDate: null
            });
        }
    }, [searchParams]);

    // API call function
    const handleApiCall = async (params) => {
        try {
            setLoading(true);
            const response = await statisticsAPI.getItemStatisticsByRevenue(params);

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

    // Handle internal filter changes (form inputs)
    const handleItemTypeChange = (value) => {
        setInternalFilters((prev) => ({
            ...prev,
            itemType: value
        }));
    };

    const handleDateRangeChange = (dates) => {
        setInternalFilters((prev) => ({
            ...prev,
            startDate: dates ? dates[0] : null,
            endDate: dates ? dates[1] : null
        }));
    };

    // Handle search button click - update URL params
    const handleSearch = () => {
        if (!internalFilters.itemType || !internalFilters.startDate || !internalFilters.endDate) {
            message.error('Vui lòng nhập đầy đủ thông tin: Loại sản phẩm, Ngày bắt đầu và Ngày kết thúc');
            return;
        }

        // Update URL search params - this will trigger useEffect
        const newParams = {
            itemType: internalFilters.itemType.toString(),
            startDate: internalFilters.startDate.format('YYYY-MM-DD'),
            endDate: internalFilters.endDate.format('YYYY-MM-DD')
        };

        setSearchParams(newParams);
    };

    // Handle view details
    const handleViewDetails = (record) => {
        const urlStartDate = searchParams.get('startDate');
        const urlEndDate = searchParams.get('endDate');
        const urlItemType = searchParams.get('itemType');

        if (!urlStartDate || !urlEndDate || !urlItemType) {
            message.error('Vui lòng thực hiện thống kê trước khi xem chi tiết');
            return;
        }

        const params = new URLSearchParams({
            startDate: urlStartDate,
            endDate: urlEndDate,
            itemType: urlItemType,
            itemId: record.itemId.toString()
        });

        navigate(`/admin/statistics/item-revenue-detail?${params.toString()}`);
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
            title: 'Tổng booking',
            dataIndex: 'totalCompletedBookings',
            key: 'totalCompletedBookings',
            align: 'center',
            width: 100
        },
        {
            title: 'Tổng doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            align: 'center',
            className: 'text-right',
            render: (value) => <div style={{ textAlign: 'right' }}>{value ? `${value.toLocaleString('vi-VN')} VNĐ` : '—'}</div>
        },
        {
            title: 'Doanh thu TB/booking',
            dataIndex: 'averageRevenuePerBooking',
            key: 'averageRevenuePerBooking',
            align: 'center',
            className: 'text-right',
            render: (value) => <div style={{ textAlign: 'right' }}>{value ? `${value.toLocaleString('vi-VN')} VNĐ` : '—'}</div>
        },
        {
            title: 'Số lượng tùy chọn',
            dataIndex: 'itemOptionCount',
            key: 'itemOptionCount',
            align: 'center',
            width: 100
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
                <MainCard title="Thống kê sản phẩm theo doanh thu">
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={4}>
                            <Select
                                value={internalFilters.itemType}
                                onChange={handleItemTypeChange}
                                allowClear
                                placeholder="Chọn loại sản phẩm"
                                style={{ width: '100%' }}
                            >
                                {Constants.ItemTypeOptions.map((option) => (
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
                                value={
                                    internalFilters.startDate && internalFilters.endDate
                                        ? [internalFilters.startDate, internalFilters.endDate]
                                        : null
                                }
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

                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="itemId"
                        bordered
                        loading={loading}
                        pagination={false}
                        locale={{
                            emptyText:
                                searchParams.get('startDate') && searchParams.get('endDate') && searchParams.get('itemType')
                                    ? 'Không có dữ liệu phù hợp với điều kiện tìm kiếm'
                                    : 'Vui lòng chọn điều kiện lọc và nhấn "Thống kê" để xem dữ liệu'
                        }}
                    />
                </MainCard>
            </Col>
        </Row>
    );
};

export default ItemStatisticsByRevenue;

import React, { useState, useEffect } from 'react';
import { Button, DatePicker, Select, Table, message, Col, Row, Space } from 'antd';
import { EyeOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import statisticsAPI from 'api/statistics/statisticsAPI';
import MainCard from 'components/MainCard';
import Constants from 'Constants/Constants';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ItemStatisticsByBookingCount = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Internal state for form inputs (controlled components)
    const [internalFilters, setInternalFilters] = useState({
        itemType: null,
        startDate: null,
        endDate: null,
        isDesc: true // Mặc định sắp xếp giảm dần
    });

    // Effect to handle URL search params changes and API calls
    useEffect(() => {
        const urlStartDate = searchParams.get('startDate');
        const urlEndDate = searchParams.get('endDate');
        const urlItemType = searchParams.get('itemType');
        const urlPageIndex = searchParams.get('pageIndex');
        const urlPageSize = searchParams.get('pageSize');
        const urlIsDesc = searchParams.get('isDesc');

        // Check if all required params exist
        if (urlStartDate && urlEndDate && urlItemType) {
            const pageIndex = parseInt(urlPageIndex) || 1;
            const pageSize = parseInt(urlPageSize) || 10;
            const isDesc = urlIsDesc !== null ? urlIsDesc === 'true' : true;

            setInternalFilters({
                itemType: parseInt(urlItemType),
                startDate: dayjs(urlStartDate),
                endDate: dayjs(urlEndDate),
                isDesc: isDesc
            });

            setPagination({
                current: pageIndex,
                pageSize: pageSize,
                total: 0
            });

            // Call API with URL parameters
            handleApiCall({
                itemType: parseInt(urlItemType),
                startDate: urlStartDate,
                endDate: urlEndDate,
                pageIndex: pageIndex,
                pageSize: pageSize,
                isDesc: isDesc
            });
        } else {
            setData([]);
            setInternalFilters({
                itemType: null,
                startDate: null,
                endDate: null,
                isDesc: true
            });
            setPagination({
                current: 1,
                pageSize: 10,
                total: 0
            });
        }
    }, [searchParams]);

    // API call function
    const handleApiCall = async (params) => {
        try {
            setLoading(true);
            const response = await statisticsAPI.getItemStatisticsByBookingCount(params);

            if (response.success && response.data) {
                setData(response.data.items || []);

                // Update pagination với meta data từ response
                const meta = response.data.meta;
                if (meta) {
                    setPagination({
                        current: meta.page || params.pageIndex || 1,
                        pageSize: meta.pageSize || params.pageSize || 10,
                        total: meta.totalCount || 0
                    });
                } else {
                    // Fallback nếu không có meta data
                    setPagination({
                        current: params.pageIndex || 1,
                        pageSize: params.pageSize || 10,
                        total: response.data.items?.length || 0
                    });
                }
            } else {
                message.error(response.message || 'Có lỗi xảy ra khi lấy dữ liệu');
                setData([]);
                setPagination({
                    current: params.pageIndex || 1,
                    pageSize: params.pageSize || 10,
                    total: 0
                });
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
            message.error('Có lỗi xảy ra khi lấy dữ liệu');
            setData([]);
            setPagination({
                current: params.pageIndex || 1,
                pageSize: params.pageSize || 10,
                total: 0
            });
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

    const handleSortOrderChange = (value) => {
        setInternalFilters((prev) => ({
            ...prev,
            isDesc: value
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
            endDate: internalFilters.endDate.format('YYYY-MM-DD'),
            pageIndex: '1', // Reset to page 1 when search
            pageSize: pagination.pageSize.toString(),
            isDesc: internalFilters.isDesc.toString()
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

        navigate(`/admin/statistics/item-booking-count-detail?${params.toString()}`);
    };

    // Handle pagination change
    const handlePaginationChange = (page, pageSize) => {
        const currentParams = Object.fromEntries(searchParams.entries());
        const newParams = {
            ...currentParams,
            pageIndex: page.toString(),
            pageSize: pageSize.toString()
        };
        setSearchParams(newParams);
    };

    // Handle export Excel
    const handleExportExcel = async () => {
        if (!internalFilters.itemType || !internalFilters.startDate || !internalFilters.endDate) {
            message.error('Vui lòng nhập đầy đủ thông tin: Loại sản phẩm, Ngày bắt đầu và Ngày kết thúc');
            return;
        }

        try {
            setExportLoading(true);

            const params = {
                startDate: internalFilters.startDate.format('YYYY-MM-DD'),
                endDate: internalFilters.endDate.format('YYYY-MM-DD'),
                itemType: internalFilters.itemType,
                isDesc: internalFilters.isDesc
            };

            const response = await statisticsAPI.exportItemStatisticsByBookingCount(params);

            // BE trả về trực tiếp file blob qua File() method
            // Tạo blob từ response data
            const blob = new Blob([response], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            // Tạo URL cho blob
            const url = window.URL.createObjectURL(blob);

            // Tạo element a để download
            const link = document.createElement('a');
            link.href = url;

            // Tạo tên file với khoảng thời gian thống kê
            const startDateFormatted = internalFilters.startDate.format('DD-MM-YYYY');
            const endDateFormatted = internalFilters.endDate.format('DD-MM-YYYY');
            const itemTypeName = Constants.ItemTypeOptions.find((option) => option.value === internalFilters.itemType)?.label || 'SanPham';
            link.download = `ThongKe_${itemTypeName}_LuotBooking_Tu_${startDateFormatted}_Den_${endDateFormatted}.xlsx`;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            message.success('Xuất file Excel thành công!');
        } catch (error) {
            console.error('Error exporting Excel:', error);
            message.error('Có lỗi xảy ra khi xuất file Excel');
        } finally {
            setExportLoading(false);
        }
    };

    // Table columns
    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
        },
        {
            title: 'Mã sản phẩm',
            dataIndex: 'itemCode',
            key: 'itemCode',
            align: 'center',
            width: 200
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'itemName',
            key: 'itemName',
            align: 'center'
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
            align: 'center',
            render: (value) => <div style={{ textAlign: 'right' }}>{value || 0}</div>
        },
        {
            title: 'Tổng booking bị hủy',
            dataIndex: 'totalCanceledBookings',
            key: 'totalCanceledBookings',
            align: 'center',
            render: (value) => <div style={{ textAlign: 'right' }}>{value || 0}</div>
        },
        {
            title: 'Tỷ lệ hủy',
            dataIndex: 'cancellationRate',
            key: 'cancellationRate',
            align: 'center',
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
                        <Col span={6}>
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
                            <Select
                                value={internalFilters.isDesc}
                                onChange={handleSortOrderChange}
                                placeholder="Sắp xếp theo booking"
                                style={{ width: '100%' }}
                            >
                                <Option value={true}>Giảm dần</Option>
                                <Option value={false}>Tăng dần</Option>
                            </Select>
                        </Col>
                        <Col span={3}>
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
                        <Col span={3}>
                            <Button
                                type="default"
                                icon={<DownloadOutlined />}
                                onClick={handleExportExcel}
                                loading={exportLoading}
                                disabled={!data || data.length === 0}
                                style={{ width: '100%' }}
                            >
                                Xuất Excel
                            </Button>
                        </Col>
                    </Row>

                    <h6 className="mb-3">Tổng số bản ghi: {pagination.total}</h6>

                    {/* Statistics Table */}
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey="itemId"
                        bordered
                        loading={loading}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
                            onChange: handlePaginationChange,
                            onShowSizeChange: handlePaginationChange
                        }}
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

export default ItemStatisticsByBookingCount;

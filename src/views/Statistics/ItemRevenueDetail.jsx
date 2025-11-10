import React, { useState, useEffect } from 'react';
import { Button, Table, message, Col, Row, Space, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import statisticsAPI from 'api/statistics/statisticsAPI';
import MainCard from 'components/MainCard';
import Constants from 'Constants/Constants';
import dayjs from 'dayjs';

const ItemRevenueDetail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [itemInfo, setItemInfo] = useState(null);

    // Get params from URL
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const itemType = searchParams.get('itemType');
    const itemId = searchParams.get('itemId');

    // Fetch item revenue details
    const fetchItemDetails = async () => {
        if (!itemId || !startDate || !endDate || !itemType) {
            message.error('Thiếu thông tin cần thiết để tải dữ liệu');
            return;
        }

        const params = {
            startDate,
            endDate,
            itemType,
            itemId
        };

        try {
            setLoading(true);
            const response = await statisticsAPI.getItemRevenueDetails(params);

            if (response.success && response.data) {
                setData(response.data.itemDetails || []);
                setItemInfo({
                    itemCode: response.data.itemCode,
                    itemName: response.data.itemName,
                    totalRevenue: response.data.totalRevenue,
                    startDate: response.data.startDate,
                    endDate: response.data.endDate
                });
            } else {
                message.error(response.message || 'Có lỗi xảy ra khi lấy dữ liệu chi tiết');
                setData([]);
                setItemInfo(null);
            }
        } catch (error) {
            console.error('Error fetching item details:', error);
            message.error('Có lỗi xảy ra khi lấy dữ liệu chi tiết');
            setData([]);
            setItemInfo(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle back button
    const handleBack = () => {
        // Preserve filters when going back
        const backParams = new URLSearchParams({
            startDate,
            endDate,
            itemType
        });
        navigate(`/admin/statistics/item-revenue?${backParams.toString()}`);
    };

    useEffect(() => {
        fetchItemDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId, startDate, endDate, itemType]);

    // Calculate totals
    const totalBookings = data.reduce((sum, item) => sum + (item.totalCompletedBookings || 0), 0);
    const totalRevenue = data.reduce((sum, item) => sum + (item.totalRevenue || 0), 0);

    // Get column title based on item type
    const getDetailColumnTitle = () => {
        const itemTypeValue = parseInt(itemType);
        switch (itemTypeValue) {
            case Constants.ItemType.Tour:
            case Constants.ItemType.Combo:
                return 'Ngày khởi hành';
            case Constants.ItemType.Accommodation:
                return 'Tên loại phòng';
            default:
                return 'Tên lựa chọn';
        }
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
            title: getDetailColumnTitle(),
            dataIndex: 'itemDetailName',
            key: 'itemDetailName',
            align: 'center'
        },
        {
            title: 'Tổng booking',
            dataIndex: 'totalCompletedBookings',
            key: 'totalCompletedBookings',
            align: 'center',
            width: 200,
            render: (value) => <div style={{ textAlign: 'right' }}>{value || 0}</div>
        },
        {
            title: 'Tổng doanh thu',
            dataIndex: 'totalRevenue',
            key: 'totalRevenue',
            align: 'center',
            render: (value) => <div style={{ textAlign: 'right' }}>{value ? `${value.toLocaleString('vi-VN')} VNĐ` : '—'}</div>
        },
        {
            title: 'Doanh thu TB/booking',
            dataIndex: 'averageRevenuePerBooking',
            key: 'averageRevenuePerBooking',
            align: 'center',
            render: (value) => <div style={{ textAlign: 'right' }}>{value ? `${value.toLocaleString('vi-VN')} VNĐ` : '—'}</div>
        }
    ];

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết thống kê doanh thu sản phẩm"
                    secondary={
                        <Button type="default" icon={<ArrowLeftOutlined />} onClick={handleBack}>
                            Quay lại
                        </Button>
                    }
                >
                    {/* Item Info Section */}
                    {itemInfo && (
                        <Row className="mb-4">
                            <Col span={24}>
                                <Card size="small" style={{ backgroundColor: '#f0f2f5' }}>
                                    <Row gutter={[24, 16]}>
                                        <Col span={6}>
                                            <Space direction="vertical" size={0}>
                                                <span style={{ fontWeight: 'bold', color: '#666' }}>Mã sản phẩm:</span>
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>{itemInfo.itemCode}</span>
                                            </Space>
                                        </Col>
                                        <Col span={6}>
                                            <Space direction="vertical" size={0}>
                                                <span style={{ fontWeight: 'bold', color: '#666' }}>Tên sản phẩm:</span>
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>{itemInfo.itemName}</span>
                                            </Space>
                                        </Col>
                                        <Col span={6}>
                                            <Space direction="vertical" size={0}>
                                                <span style={{ fontWeight: 'bold', color: '#666' }}>Khoảng thời gian:</span>
                                                <span style={{ fontSize: '16px', fontWeight: '500' }}>
                                                    {dayjs(itemInfo.startDate).format('DD/MM/YYYY')} -{' '}
                                                    {dayjs(itemInfo.endDate).format('DD/MM/YYYY')}
                                                </span>
                                            </Space>
                                        </Col>
                                        <Col span={6}>
                                            <Space direction="vertical" size={0}>
                                                <span style={{ fontWeight: 'bold', color: '#666' }}>Tổng doanh thu:</span>
                                                <span style={{ fontSize: '16px', fontWeight: '500', color: '#52c41a' }}>
                                                    {itemInfo.totalRevenue ? `${itemInfo.totalRevenue.toLocaleString('vi-VN')} VNĐ` : '—'}
                                                </span>
                                            </Space>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    <h6 className="mb-3">Tổng số bản ghi: {data.length}</h6>

                    {/* Details Table */}
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey={(record, index) => index}
                        bordered
                        loading={loading}
                        pagination={false}
                        summary={() => (
                            <Table.Summary>
                                <Table.Summary.Row style={{ backgroundColor: '#f6f8fa', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell index={0} colSpan={2} align="center">
                                        TỔNG CỘNG
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align="right">
                                        {totalBookings.toLocaleString('vi-VN')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right">
                                        {totalRevenue ? `${totalRevenue.toLocaleString('vi-VN')} VNĐ` : '—'}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
                        )}
                        locale={{
                            emptyText: data.length === 0 && !loading ? 'Không có dữ liệu chi tiết cho sản phẩm này.' : 'Không có dữ liệu'
                        }}
                    />
                </MainCard>
            </Col>
        </Row>
    );
};

export default ItemRevenueDetail;

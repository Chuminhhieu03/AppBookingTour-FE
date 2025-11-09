import React, { useState, useEffect } from 'react';
import { Button, Table, message, Col, Row, Space, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useSearchParams, useNavigate } from 'react-router-dom';
import statisticsAPI from 'api/statistics/statisticsAPI';
import MainCard from 'components/MainCard';
import { ITEM_TYPE } from 'constant/itemTypeEnum';
import dayjs from 'dayjs';

const ItemBookingCountDetail = () => {
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

    // Fetch item booking count details
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
            const response = await statisticsAPI.getItemBookingCountDetails(params);

            if (response.success && response.data) {
                setData(response.data.itemDetails || []);
                setItemInfo({
                    itemCode: response.data.itemCode,
                    itemName: response.data.itemName,
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
        navigate(`/admin/statistics/item-booking-count?${backParams.toString()}`);
    };

    useEffect(() => {
        fetchItemDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemId, startDate, endDate, itemType]);

    // Calculate totals
    const totalCompletedBookings = data.reduce((sum, item) => sum + (item.totalCompletedBookings || 0), 0);
    const totalCanceledBookings = data.reduce((sum, item) => sum + (item.totalCanceledBookings || 0), 0);
    const totalBookings = totalCompletedBookings + totalCanceledBookings;
    const overallCancellationRate = totalBookings > 0 ? (totalCanceledBookings / totalBookings) * 100 : 0;

    // Get column title based on item type
    const getDetailColumnTitle = () => {
        const itemTypeValue = parseInt(itemType);
        switch (itemTypeValue) {
            case ITEM_TYPE.TOUR: // Tour
            case ITEM_TYPE.COMBO: // Combo
                return 'Ngày khởi hành';
            case ITEM_TYPE.ACCOMMODATION: // Accommodation
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
            title: 'Tổng booking hoàn thành',
            dataIndex: 'totalCompletedBookings',
            key: 'totalCompletedBookings',
            align: 'right',
            width: 200,
            render: (value) => <div style={{ textAlign: 'right' }}>{value || 0}</div>
        },
        {
            title: 'Tổng booking bị hủy',
            dataIndex: 'totalCanceledBookings',
            key: 'totalCanceledBookings',
            align: 'right',
            width: 200,
            render: (value) => <div style={{ textAlign: 'right' }}>{value || 0}</div>
        },
        {
            title: 'Tỷ lệ hủy',
            dataIndex: 'cancellationRate',
            key: 'cancellationRate',
            align: 'right',
            width: 200,
            render: (value) => (
                <div style={{ textAlign: 'right' }}>{value !== null && value !== undefined ? `${value.toFixed(2)}%` : '0.00%'}</div>
            )
        }
    ];

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết thống kê lượt booking sản phẩm"
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
                                                <span style={{ fontWeight: 'bold', color: '#666' }}>Tổng số booking:</span>
                                                <span
                                                    style={{
                                                        fontSize: '16px',
                                                        fontWeight: '500',
                                                        color: '#1890ff',
                                                        display: 'block',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    {totalBookings.toLocaleString('vi-VN')}
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
                                        {totalCompletedBookings.toLocaleString('vi-VN')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right">
                                        {totalCanceledBookings.toLocaleString('vi-VN')}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right">
                                        {overallCancellationRate.toFixed(2)}%
                                    </Table.Summary.Cell>
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

export default ItemBookingCountDetail;

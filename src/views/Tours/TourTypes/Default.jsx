import { Col, Row, Button, Space, Input, Select, Table, Tag, message, Modal, Card, List, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, EyeOutlined, BellOutlined, ClearOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import MainCard from 'components/MainCard';
import LoadingModal from '../../../components/LoadingModal';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';

const { Text } = Typography;

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

    // SignalR states
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    // Clear messages function
    const clearMessages = () => {
        setMessages([]);
    };

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

    // SignalR connection effect
    useEffect(() => {
        // Khởi tạo kết nối SignalR
        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/notificationHub')
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(newConnection);

        // Bắt đầu kết nối
        const startConnection = async () => {
            try {
                await newConnection.start();
                console.log('SignalR Connected');
                setIsConnected(true);

                // Thiết lập các event listeners
                newConnection.on('ReceiveWelcomeMessage', (welcomeMessage) => {
                    console.log('Received welcome message:', welcomeMessage);
                    const newMessage = {
                        id: Date.now(),
                        type: 'welcome',
                        content: welcomeMessage,
                        timestamp: new Date().toISOString()
                    };
                    setMessages((prevMessages) => [newMessage, ...prevMessages]);
                    message.success(`Welcome: ${welcomeMessage}`);
                });

                newConnection.on('ReceiveNotification', (notification) => {
                    console.log('Received notification:', notification);
                    const newMessage = {
                        id: Date.now(),
                        type: notification.type || 'notification',
                        content: notification.content,
                        timestamp: notification.timestamp
                    };
                    setMessages((prevMessages) => [newMessage, ...prevMessages]);
                    message.info(`Notification: ${notification.content}`);
                });

                // Handle connection state changes
                newConnection.onreconnecting(() => {
                    console.log('SignalR Reconnecting...');
                    setIsConnected(false);
                    message.warning('Đang kết nối lại...');
                });

                newConnection.onreconnected(() => {
                    console.log('SignalR Reconnected');
                    setIsConnected(true);
                    message.success('Đã kết nối lại thành công!');
                });

                newConnection.onclose(() => {
                    console.log('SignalR Disconnected');
                    setIsConnected(false);
                });
            } catch (error) {
                console.error('SignalR Connection Error:', error);
                setIsConnected(false);
                message.error('Không thể kết nối đến server thông báo');
            }
        };

        startConnection();

        // Cleanup function
        return () => {
            if (newConnection) {
                newConnection.stop().then(() => {
                    console.log('SignalR Connection Stopped');
                });
            }
        };
    }, []);

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
            width: 200,
            render: (value) => (value ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Ngừng hoạt động</Tag>)
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: 160,
            render: (date) => (date ? new Date(date).toLocaleDateString('vi-VN') : '—')
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 160,
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
        <Row gutter={[16, 16]}>
            <Col span={18}>
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
            
            <Col span={6}>
                <MainCard
                    title={
                        <Space>
                            <BellOutlined />
                            Thông báo thời gian thực
                            <Tag color={isConnected ? 'green' : 'red'}>
                                {isConnected ? 'Đã kết nối' : 'Ngắt kết nối'}
                            </Tag>
                        </Space>
                    }
                    secondary={
                        messages.length > 0 && (
                            <Button 
                                size="small" 
                                icon={<ClearOutlined />} 
                                onClick={clearMessages}
                                title="Xóa tất cả tin nhắn"
                            >
                                Xóa
                            </Button>
                        )
                    }
                >
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {messages.length === 0 ? (
                            <Text type="secondary">Chưa có thông báo nào...</Text>
                        ) : (
                            <List
                                dataSource={messages}
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <Card 
                                            size="small" 
                                            style={{ width: '100%' }}
                                            bodyStyle={{ padding: '8px 12px' }}
                                        >
                                            <div>
                                                <Tag 
                                                    color={item.type === 'welcome' ? 'blue' : 'green'}
                                                    style={{ marginBottom: '4px' }}
                                                >
                                                    {item.type === 'welcome' ? 'Chào mừng' : 'Thông báo'}
                                                </Tag>
                                                <div>
                                                    <Text>{item.content}</Text>
                                                </div>
                                                <div style={{ marginTop: '4px' }}>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {new Date(item.timestamp).toLocaleString('vi-VN')}
                                                    </Text>
                                                </div>
                                            </div>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                </MainCard>
            </Col>
        </Row>
    );
}

import React, { useState } from 'react';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Tabs, Input, Tag, Button, Space, Typography, message, Modal, Rate } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const BookingHistory = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    // Sample data (you can replace with real API data)
    const bookings = [
        {
            id: 'APTAPTAPT',
            type: 'tour',
            status: 'completed',
            statusText: 'Hoàn thành',
            statusColor: 'green',
            title: 'Tình Hoa Cực Bắc – Sắc Màu Vùng Cao: Hà Nội – Lạng Sơn – Cửa Khẩu Hữu Nghị – Cao Bằng – Thác Bản Giốc – Núi Mắt Thần',
            image: 'https://via.placeholder.com/300x200?text=Tour+Image',
            date: '07/10/2025 14:00',
            guests: 3,
            price: '15,000,000 đ'
        },
        {
            id: 'HOTELVIP',
            type: 'hotel',
            status: 'paid',
            statusText: 'Đã thanh toán',
            statusColor: 'blue',
            title: 'Khách sạn Hà Long Vip',
            image: 'https://via.placeholder.com/300x200?text=Hotel+Image',
            date: '07/10/2025 14:00',
            guests: 3,
            price: '15,000,000 đ'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'paid':
                return 'processing';
            case 'cancelled':
                return 'error';
            case 'refunded':
                return 'warning';
            default:
                return 'default';
        }
    };

    const openReviewModal = (booking) => {
        setCurrentBooking(booking);
        setRating(0);
        setReviewText('');
        setIsReviewModalOpen(true);
    };

    // Submit review
    const handleSubmitReview = () => {
        if (rating === 0) {
            message.warning('Vui lòng chọn số sao đánh giá!');
            return;
        }

        message.success('Cảm ơn bạn đã đánh giá!');
        setIsReviewModalOpen(false);
    };

    return (
        <div className="container py-5">
            <Title level={3} className="mb-4">
                Lịch sử đặt chỗ
            </Title>

            <Card>
                {/* Tabs */}
                <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
                    <TabPane tab="Tất cả" key="all" />
                    <TabPane tab="Đã thanh toán" key="paid" />
                    <TabPane tab="Hoàn thành" key="completed" />
                    <TabPane tab="Đã hủy" key="cancelled" />
                    <TabPane tab="Hoàn tiền" key="refunded" />
                </Tabs>

                {/* Search Bar */}
                <Input
                    placeholder="Nhập tên tour, combo, khách sạn để tìm kiếm"
                    prefix={<SearchOutlined />}
                    size="large"
                    className="mb-4"
                    style={{ borderRadius: '8px' }}
                />

                {/* Booking List */}
                <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    {bookings.map((booking) => (
                        <Card key={booking.id} hoverable bordered={false}>
                            <div className="d-flex flex-column gap-3">
                                {/* Row 1: Image + Info */}
                                <div className="d-flex gap-3">
                                    <img
                                        src={booking.image}
                                        alt={booking.title}
                                        style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                    />
                                    <div className="flex-grow-1">
                                        <Text strong style={{ fontSize: '16px' }}>
                                            {booking.type === 'tour' ? 'Mã tour:' : 'Mã khách sạn:'} <Text code>{booking.id}</Text>
                                        </Text>
                                        <Tag color={booking.statusColor} className="ms-2">
                                            {booking.statusText}
                                        </Tag>

                                        <Title level={5} className="mt-2 mb-1">
                                            {booking.title}
                                        </Title>

                                        <Text type="secondary">
                                            Phân loại: <Text strong>{booking.type === 'tour' ? 'Tour' : 'Khách sạn'}</Text>
                                        </Text>
                                        <br />
                                        <Text type="secondary">
                                            Ngày đặt: {booking.date} | Số lượng khách: {booking.guests}
                                        </Text>
                                    </div>
                                </div>

                                {/* Row 2: Price + Button */}
                                <div className="d-flex justify-content-end align-items-end mt-3" style={{ width: '100%' }}>
                                    <div
                                        className="text-end"
                                        style={{ backgroundColor: '#f2fafdff', padding: '12px 16px', borderRadius: '8px', width: '100%' }}
                                    >
                                        <div>
                                            <Text strong style={{ fontSize: '15px', color: '#000' }}>
                                                Thành tiền: <span style={{ color: '#ec2225ff' }}>{booking.price}</span>
                                            </Text>
                                        </div>
                                        <div className="mt-2">
                                            {booking.status === 'completed' ? (
                                                <Button
                                                    type="primary"
                                                    style={{
                                                        backgroundColor: '#ec2225ff',
                                                        borderColor: '#ec2225ff',
                                                        color: 'white',
                                                        padding: '15px 30px',
                                                        marginTop: '12px'
                                                    }}
                                                    onClick={() => openReviewModal(booking)}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#c51d1f')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ec2225ff')}
                                                >
                                                    Đánh giá
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="primary"
                                                    style={{
                                                        backgroundColor: '#fff',
                                                        borderColor: '#2a2a2aff',
                                                        color: 'black',
                                                        padding: '15px 30px',
                                                        marginTop: '12px'
                                                    }}
                                                >
                                                    Hủy
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </Space>

                {/* Review Modal - Exactly like your screenshot */}
                <Modal
                    title={
                        <div
                            style={{
                                backgroundColor: '#f5f5f5',
                                padding: '12px 20px',
                                margin: '-20px -24px 20px',
                                borderRadius: '8px 8px 0 0'
                            }}
                        >
                            <Text strong style={{ fontSize: '16px' }}>
                                Đánh giá
                            </Text>
                        </div>
                    }
                    open={isReviewModalOpen}
                    onCancel={() => setIsReviewModalOpen(false)}
                    footer={null}
                    width={520}
                    centered
                    closeIcon={<span style={{ fontSize: '20px' }}>×</span>}
                >
                    {currentBooking && (
                        <>
                            <div className="mb-4">
                                <Text strong>Chất lượng dịch vụ</Text>
                                <div className="mt-2">
                                    <Rate value={rating} onChange={setRating} style={{ fontSize: '32px', color: '#faad14' }} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <Text strong>Bình luận</Text>
                                <Input.TextArea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    rows={5}
                                    placeholder="Chia sẻ trải nghiệm của bạn..."
                                    style={{ borderRadius: '8px', marginTop: '8px' }}
                                />
                            </div>

                            <div className="text-end">
                                <Space>
                                    <Button onClick={() => setIsReviewModalOpen(false)}>Hủy</Button>
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                                        onClick={handleSubmitReview}
                                    >
                                        Xác nhận
                                    </Button>
                                </Space>
                            </div>
                        </>
                    )}
                </Modal>
            </Card>
        </div>
    );
};

export default BookingHistory;

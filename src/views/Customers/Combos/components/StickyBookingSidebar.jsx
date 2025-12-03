import { Card, Button, Tag, Space, Divider } from 'antd';
import { CalendarOutlined, UserOutlined, DollarOutlined, PhoneOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const StickyBookingSidebar = ({ combo, selectedSchedule, onBookNow }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDate = (date) => {
        return dayjs(date).format('DD/MM/YYYY');
    };

    const getAvailableTag = (slots) => {
        if (slots > 10) {
            return <Tag color="success">Còn {slots} chỗ</Tag>;
        } else if (slots > 5) {
            return <Tag color="warning">Còn {slots} chỗ</Tag>;
        } else if (slots > 0) {
            return <Tag color="error">Chỉ còn {slots} chỗ</Tag>;
        }
        return <Tag color="default">Hết chỗ</Tag>;
    };

    return (
        <Card
            style={{
                position: 'sticky',
                top: 96,
                border: '2px solid #04a9f5',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(4, 169, 245, 0.15)'
            }}
            bodyStyle={{ padding: 24 }}
        >
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#64748B', marginBottom: 4 }}>Mã tour</div>
                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E50' }}>{combo.code}</div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {selectedSchedule ? (
                <>
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                        <div>
                            <div style={{ fontSize: 14, color: '#64748B', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CalendarOutlined /> Ngày khởi hành
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#2C3E50' }}>
                                {formatDate(selectedSchedule.departureDate)}
                            </div>
                        </div>

                        <div>
                            <div style={{ fontSize: 14, color: '#64748B', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <CalendarOutlined /> Ngày về
                            </div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#2C3E50' }}>{formatDate(selectedSchedule.returnDate)}</div>
                        </div>

                        <div>
                            <div style={{ fontSize: 14, color: '#64748B', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <UserOutlined /> Số chỗ
                            </div>
                            {getAvailableTag(selectedSchedule.availableSlots)}
                        </div>
                    </Space>

                    <Divider style={{ margin: '16px 0' }} />

                    <div style={{ marginBottom: 16 }}>
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 14, color: '#64748B' }}>Người lớn:</span>
                                <span style={{ fontSize: 16, fontWeight: 600, color: '#2C3E50' }}>
                                    {formatPrice(selectedSchedule.basePriceAdult)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 14, color: '#64748B' }}>Trẻ em:</span>
                                <span style={{ fontSize: 16, fontWeight: 600, color: '#2C3E50' }}>
                                    {formatPrice(selectedSchedule.basePriceChildren)}
                                </span>
                            </div>
                            {selectedSchedule.singleRoomSupplement > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 14, color: '#64748B' }}>Phụ thu phòng đơn:</span>
                                    <span style={{ fontSize: 16, fontWeight: 600, color: '#2C3E50' }}>
                                        {formatPrice(selectedSchedule.singleRoomSupplement)}
                                    </span>
                                </div>
                            )}
                        </Space>
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={onBookNow}
                        style={{
                            height: 48,
                            fontSize: 16,
                            fontWeight: 'bold',
                            background: '#04a9f5',
                            borderColor: '#04a9f5',
                            marginBottom: 12
                        }}
                        icon={<DollarOutlined />}
                    >
                        Đặt tour ngay
                    </Button>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748B' }}>
                    <CalendarOutlined style={{ fontSize: 32, marginBottom: 12 }} />
                    <div style={{ fontSize: 15 }}>Vui lòng chọn lịch khởi hành</div>
                    <div style={{ fontSize: 13, marginTop: 8 }}>để xem giá chi tiết</div>
                </div>
            )}

            <Button
                size="large"
                block
                style={{
                    height: 48,
                    fontSize: 16,
                    fontWeight: 'bold',
                    borderColor: '#04a9f5',
                    color: '#04a9f5'
                }}
                icon={<PhoneOutlined />}
            >
                Liên hệ tư vấn
            </Button>

            <div style={{ marginTop: 16, padding: 12, background: '#e6f7ff', borderRadius: 8 }}>
                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4 }}>Hotline hỗ trợ</div>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#04a9f5' }}>1900 1234</div>
            </div>
        </Card>
    );
};

export default StickyBookingSidebar;

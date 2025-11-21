import { Card, Row, Col } from 'antd';
import { EnvironmentOutlined, CoffeeOutlined, TeamOutlined, ClockCircleOutlined, CarOutlined, GiftOutlined } from '@ant-design/icons';

const ComboInfoGrid = ({ combo }) => {
    const infoItems = [
        {
            icon: <EnvironmentOutlined style={{ fontSize: 32, color: '#1E88E5' }} />,
            title: 'Điểm tham quan',
            content: combo.toCityName || 'Nhiều điểm'
        },
        {
            icon: <CoffeeOutlined style={{ fontSize: 32, color: '#FF6B35' }} />,
            title: 'Ẩm thực',
            content: combo.amenities?.find((a) => a.toLowerCase().includes('bữa ăn')) || 'Buffet sáng, Theo thực đơn'
        },
        {
            icon: <TeamOutlined style={{ fontSize: 32, color: '#52C41A' }} />,
            title: 'Đối tượng thích hợp',
            content: 'Cặp đôi, Gia đình nhiều thế hệ, Thanh niên'
        },
        {
            icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#9C27B0' }} />,
            title: 'Thời gian lý tưởng',
            content: 'Quanh năm'
        },
        {
            icon: <CarOutlined style={{ fontSize: 32, color: '#FF9800' }} />,
            title: 'Phương tiện',
            content: combo.vehicle || 'Máy bay, Xe du lịch'
        },
        {
            icon: <GiftOutlined style={{ fontSize: 32, color: '#E91E63' }} />,
            title: 'Khuyến mãi',
            content: 'Đã bao gồm trong giá tour'
        }
    ];

    return (
        <Card title={<span style={{ fontSize: 20, fontWeight: 'bold' }}>THÔNG TIN THÊM VỀ CHUYẾN ĐI</span>} style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
                {infoItems.map((item, index) => (
                    <Col xs={24} sm={12} lg={8} key={index}>
                        <div style={{ textAlign: 'center', padding: 16 }}>
                            <div style={{ marginBottom: 12 }}>{item.icon}</div>
                            <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#2C3E50' }}>{item.title}</div>
                            <div style={{ fontSize: 14, color: '#64748B' }}>{item.content}</div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default ComboInfoGrid;

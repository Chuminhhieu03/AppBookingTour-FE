import { Card, Row, Col } from 'antd';
import {
    EnvironmentOutlined,
    CoffeeOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CarOutlined,
    GiftOutlined,
    HomeOutlined,
    ShopOutlined,
    StarOutlined,
    HeartOutlined,
    PhoneOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
    RocketOutlined,
    SmileOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';

const ComboInfoGrid = ({ combo }) => {
    const iconMap = {
        EnvironmentOutlined: EnvironmentOutlined,
        CoffeeOutlined: CoffeeOutlined,
        TeamOutlined: TeamOutlined,
        ClockCircleOutlined: ClockCircleOutlined,
        CarOutlined: CarOutlined,
        GiftOutlined: GiftOutlined,
        HomeOutlined: HomeOutlined,
        ShopOutlined: ShopOutlined,
        StarOutlined: StarOutlined,
        HeartOutlined: HeartOutlined,
        PhoneOutlined: PhoneOutlined,
        SafetyOutlined: SafetyOutlined,
        ThunderboltOutlined: ThunderboltOutlined,
        TrophyOutlined: TrophyOutlined,
        RocketOutlined: RocketOutlined,
        SmileOutlined: SmileOutlined,
        CustomerServiceOutlined: CustomerServiceOutlined
    };

    // Parse additionalInfo from combo data
    const getInfoItems = () => {
        if (!combo.additionalInfo) {
            // Fallback to default items if no additionalInfo
            return [
                {
                    icon: 'EnvironmentOutlined',
                    title: 'Điểm tham quan',
                    content: combo.toCityName || 'Nhiều điểm',
                    color: '#04a9f5'
                },
                {
                    icon: 'CoffeeOutlined',
                    title: 'Ẩm thực',
                    content: combo.amenities?.find((a) => a.toLowerCase().includes('bữa ăn')) || 'Buffet sáng, Theo thực đơn',
                    color: '#fd7e14'
                },
                {
                    icon: 'TeamOutlined',
                    title: 'Đối tượng thích hợp',
                    content: 'Cặp đôi, Gia đình nhiều thế hệ, Thanh niên',
                    color: '#52C41A'
                },
                {
                    icon: 'ClockCircleOutlined',
                    title: 'Thời gian lý tưởng',
                    content: 'Quanh năm',
                    color: '#9C27B0'
                },
                {
                    icon: 'CarOutlined',
                    title: 'Phương tiện',
                    content: combo.vehicle || 'Máy bay, Xe du lịch',
                    color: '#FF9800'
                },
                {
                    icon: 'GiftOutlined',
                    title: 'Khuyến mãi',
                    content: 'Đã bao gồm trong giá tour',
                    color: '#E91E63'
                }
            ];
        }

        try {
            const parsed = JSON.parse(combo.additionalInfo);
            if (parsed && Array.isArray(parsed.items)) {
                return parsed.items;
            }
        } catch (e) {
            console.error('Failed to parse additionalInfo:', e);
        }

        // Return empty array if parsing fails
        return [];
    };

    const infoItems = getInfoItems();

    return (
        <Card title={<span style={{ fontSize: 20, fontWeight: 'bold' }}>THÔNG TIN THÊM VỀ CHUYẾN ĐI</span>} style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
                {infoItems.map((item, index) => {
                    const IconComponent = iconMap[item.icon] || EnvironmentOutlined;
                    return (
                        <Col xs={24} sm={12} lg={8} key={index}>
                            <div style={{ textAlign: 'center', padding: 16 }}>
                                <div style={{ marginBottom: 12 }}>
                                    <IconComponent style={{ fontSize: 32, color: item.color || '#04a9f5' }} />
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#2C3E50' }}>{item.title}</div>
                                <div style={{ fontSize: 14, color: '#64748B' }}>{item.content}</div>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </Card>
    );
};

export default ComboInfoGrid;

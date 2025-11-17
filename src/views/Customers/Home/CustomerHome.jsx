import { useState } from 'react';
import { Card, Row, Col, Typography, Button, Input, Space, Tag, Rate, Badge } from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    UserOutlined,
    RocketOutlined,
    CarOutlined,
    FireOutlined,
    StarOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const CustomerHome = () => {
    const [searchText, setSearchText] = useState('');

    // Demo data
    const featuredTours = [
        {
            id: 1,
            title: 'Du lịch Đà Nẵng - Hội An 3N2Đ',
            image: 'https://via.placeholder.com/400x250/4CAF50/ffffff?text=Da+Nang',
            price: 4500000,
            originalPrice: 5000000,
            duration: '3 ngày 2 đêm',
            location: 'Đà Nẵng',
            rating: 4.8,
            reviews: 128,
            discount: 10,
            hot: true
        },
        {
            id: 2,
            title: 'Tour Phú Quốc - Thiên đường biển đảo',
            image: 'https://via.placeholder.com/400x250/2196F3/ffffff?text=Phu+Quoc',
            price: 6200000,
            originalPrice: 7000000,
            duration: '4 ngày 3 đêm',
            location: 'Phú Quốc',
            rating: 4.9,
            reviews: 256,
            discount: 11,
            hot: true
        },
        {
            id: 3,
            title: 'Sapa - Chinh phục Fansipan',
            image: 'https://via.placeholder.com/400x250/FF9800/ffffff?text=Sapa',
            price: 3800000,
            duration: '3 ngày 2 đêm',
            location: 'Sapa',
            rating: 4.7,
            reviews: 89,
            hot: false
        },
        {
            id: 4,
            title: 'Nha Trang - Vinpearl Land 4N3Đ',
            image: 'https://via.placeholder.com/400x250/E91E63/ffffff?text=Nha+Trang',
            price: 5500000,
            duration: '4 ngày 3 đêm',
            location: 'Nha Trang',
            rating: 4.6,
            reviews: 174,
            hot: false
        }
    ];

    const popularDestinations = [
        { name: 'Đà Nẵng', tours: 45, image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=Da+Nang' },
        { name: 'Phú Quốc', tours: 38, image: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=Phu+Quoc' },
        { name: 'Sapa', tours: 32, image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=Sapa' },
        { name: 'Nha Trang', tours: 41, image: 'https://via.placeholder.com/300x200/E91E63/ffffff?text=Nha+Trang' }
    ];

    return (
        <div>
            {/* Hero Section */}
            <div
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '80px 20px',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <Title level={1} style={{ color: 'white', marginBottom: 16, fontSize: 48 }}>
                    Khám phá Việt Nam cùng chúng tôi
                </Title>
                <Paragraph style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 40 }}>
                    Trải nghiệm những tour du lịch đẳng cấp với giá tốt nhất
                </Paragraph>

                {/* Search Bar */}
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <Space.Compact size="large" style={{ width: '100%' }}>
                        <Search
                            placeholder="Tìm kiếm điểm đến, tour du lịch..."
                            allowClear
                            enterButton={
                                <Button type="primary" size="large" icon={<SearchOutlined />}>
                                    Tìm kiếm
                                </Button>
                            }
                            size="large"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Space.Compact>
                </div>

                {/* Quick Filters */}
                <div style={{ marginTop: 30 }}>
                    <Space wrap size="middle">
                        <Tag icon={<FireOutlined />} color="red" style={{ padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>
                            Tour Hot
                        </Tag>
                        <Tag icon={<RocketOutlined />} color="blue" style={{ padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>
                            Tour Máy Bay
                        </Tag>
                        <Tag icon={<CarOutlined />} color="green" style={{ padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>
                            Tour Xe
                        </Tag>
                        <Tag icon={<StarOutlined />} color="gold" style={{ padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>
                            Đánh giá cao
                        </Tag>
                    </Space>
                </div>
            </div>

            {/* Content Container */}
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px' }}>
                {/* Featured Tours Section */}
                <div style={{ marginBottom: 60 }}>
                    <div style={{ marginBottom: 30 }}>
                        <Title level={2}>
                            <FireOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                            Tour Hot Nhất
                        </Title>
                        <Text type="secondary">Những tour du lịch được yêu thích nhất hiện nay</Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {featuredTours.map((tour) => (
                            <Col xs={24} sm={12} lg={6} key={tour.id}>
                                <Badge.Ribbon text={tour.hot ? 'HOT' : null} color="red" style={{ display: tour.hot ? 'block' : 'none' }}>
                                    <Card
                                        hoverable
                                        cover={
                                            <div style={{ position: 'relative' }}>
                                                <img alt={tour.title} src={tour.image} style={{ height: 200, objectFit: 'cover' }} />
                                                {tour.discount && (
                                                    <Tag
                                                        color="red"
                                                        style={{
                                                            position: 'absolute',
                                                            top: 10,
                                                            left: 10,
                                                            fontSize: 14,
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        -{tour.discount}%
                                                    </Tag>
                                                )}
                                            </div>
                                        }
                                        style={{ height: '100%' }}
                                    >
                                        <div style={{ minHeight: 180 }}>
                                            <Title level={5} ellipsis={{ rows: 2 }} style={{ minHeight: 48 }}>
                                                {tour.title}
                                            </Title>

                                            <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 12 }}>
                                                <div>
                                                    <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                                                    <Text type="secondary">{tour.location}</Text>
                                                </div>
                                                <div>
                                                    <CalendarOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                                                    <Text type="secondary">{tour.duration}</Text>
                                                </div>
                                                <div>
                                                    <Rate disabled defaultValue={tour.rating} style={{ fontSize: 14 }} />
                                                    <Text type="secondary" style={{ marginLeft: 8 }}>
                                                        ({tour.reviews} đánh giá)
                                                    </Text>
                                                </div>
                                            </Space>

                                            <div style={{ marginTop: 16 }}>
                                                {tour.originalPrice && (
                                                    <Text delete type="secondary" style={{ marginRight: 8 }}>
                                                        {tour.originalPrice.toLocaleString('vi-VN')}đ
                                                    </Text>
                                                )}
                                                <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                                                    {tour.price.toLocaleString('vi-VN')}đ
                                                </Text>
                                            </div>
                                        </div>

                                        <Button type="primary" block style={{ marginTop: 12 }}>
                                            Xem chi tiết
                                        </Button>
                                    </Card>
                                </Badge.Ribbon>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Popular Destinations */}
                <div style={{ marginBottom: 60 }}>
                    <div style={{ marginBottom: 30 }}>
                        <Title level={2}>
                            <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                            Điểm Đến Phổ Biến
                        </Title>
                        <Text type="secondary">Khám phá những địa điểm du lịch được ưa chuộng</Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        {popularDestinations.map((dest, index) => (
                            <Col xs={12} sm={12} lg={6} key={index}>
                                <Card
                                    hoverable
                                    cover={<img alt={dest.name} src={dest.image} style={{ height: 150, objectFit: 'cover' }} />}
                                    bodyStyle={{ padding: 16 }}
                                >
                                    <Title level={4} style={{ marginBottom: 8 }}>
                                        {dest.name}
                                    </Title>
                                    <Text type="secondary">{dest.tours} tour</Text>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Why Choose Us */}
                <div>
                    <div style={{ marginBottom: 30, textAlign: 'center' }}>
                        <Title level={2}>Tại sao chọn chúng tôi?</Title>
                        <Text type="secondary">Những lý do để bạn đặt tour với chúng tôi</Text>
                    </div>

                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
                                <Title level={4}>Giá Tốt Nhất</Title>
                                <Text type="secondary">Cam kết giá tốt nhất thị trường, hoàn tiền nếu tìm thấy giá rẻ hơn</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
                                <Title level={4}>Dịch Vụ 5 Sao</Title>
                                <Text type="secondary">Đội ngũ hướng dẫn viên chuyên nghiệp, nhiệt tình và tận tâm</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
                                <Title level={4}>An Toàn</Title>
                                <Text type="secondary">Bảo hiểm du lịch toàn diện, đảm bảo an toàn tuyệt đối</Text>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                                <Title level={4}>Linh Hoạt</Title>
                                <Text type="secondary">Tùy chỉnh lịch trình theo yêu cầu, thay đổi linh hoạt</Text>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default CustomerHome;

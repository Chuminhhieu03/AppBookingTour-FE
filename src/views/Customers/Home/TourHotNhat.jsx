import { Card, Row, Col, Typography, Button, Space, Tag, Rate, Badge } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, FireOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import tourAPI from 'api/tour/tourAPI';

const { Title, Text } = Typography;

export default function TourHotNhat() {
    const [featuredTours, setFeaturedTours] = useState([]);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const res = await tourAPI.getFeaturedTours();
                setFeaturedTours(res.data || []);
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };
        fetchBlogPosts();
    }, []);

    // const featuredTours = [
    //     {
    //         id: 1,
    //         title: 'Du lịch Đà Nẵng - Hội An 3N2Đ',
    //         image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
    //         price: 4500000,
    //         originalPrice: 5000000,
    //         duration: '3 ngày 2 đêm',
    //         location: 'Đà Nẵng',
    //         rating: 4.8,
    //         reviews: 128,
    //         discount: 10,
    //         hot: true
    //     },
    //     {
    //         id: 2,
    //         title: 'Tour Phú Quốc - Thiên đường biển đảo',
    //         image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
    //         price: 6200000,
    //         originalPrice: 7000000,
    //         duration: '4 ngày 3 đêm',
    //         location: 'Phú Quốc',
    //         rating: 4.9,
    //         reviews: 256,
    //         discount: 11,
    //         hot: true
    //     },
    //     {
    //         id: 3,
    //         title: 'Sapa - Chinh phục Fansipan',
    //         image: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=800&q=80',
    //         price: 3800000,
    //         duration: '3 ngày 2 đêm',
    //         location: 'Sapa',
    //         rating: 4.7,
    //         reviews: 89,
    //         hot: false
    //     },
    //     {
    //         id: 4,
    //         title: 'Nha Trang - Vinpearl Land 4N3Đ',
    //         image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
    //         price: 5500000,
    //         duration: '4 ngày 3 đêm',
    //         location: 'Nha Trang',
    //         rating: 4.6,
    //         reviews: 174,
    //         hot: false
    //     }
    // ];

    return (
        <div style={{ background: '#dbf0ff', padding: '40px 8%' }}>
            <h2 className="text-center mb-2" style={{ fontWeight: 700, color: '#004E9A' }}>
                TOUR NỔI BẬT
            </h2>
            <div style={{ width: 100, height: 4, backgroundColor: '#004E9A', borderRadius: 4, margin: '0 auto 30px auto' }}></div>
            <p className="text-center w-75" style={{ margin: '0 auto 30px auto', fontWeight: 600, fontSize: 18 }}>
                Khám phá những hành trình được yêu thích nhất trong tháng
            </p>

            <Row gutter={[24, 24]}>
                {featuredTours.map((tour) => (
                    <Col xs={24} sm={12} lg={6} key={tour.id}>
                        <Badge.Ribbon text={tour.hot ? 'HOT' : null} color="red" style={{ display: tour.hot ? 'block' : 'none' }}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{ position: 'relative' }}>
                                        <img alt={tour.title} src={tour.image} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
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
                                <div style={{ minHeight: 180, textAlign: 'left' }}>
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
                                                0 đ
                                            </Text>
                                        )}
                                        <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                                            0 đ
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
    );
}

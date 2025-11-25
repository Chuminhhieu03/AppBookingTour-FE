import { Card, Row, Col, Typography, Button, Space, Tag, Rate, Badge } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import tourAPI from 'api/tour/tourAPI';
import Utility from 'src/Utils/Utility';

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
                                        <img
                                            alt={tour.name}
                                            src={tour.imageMainUrl}
                                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                                        />
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
                                    <Title level={5} ellipsis={{ rows: 2 }}>
                                        {tour.name}
                                    </Title>
                                    <Tag color="blue">{tour.categoryName}</Tag>
                                    <Space direction="vertical" size="small" style={{ width: '100%', marginTop: 8 }}>
                                        <div>
                                            <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                                            <Text type="secondary">
                                                {tour.departureCityName} - {tour.destinationCityName}
                                            </Text>
                                        </div>
                                        <div>
                                            <ClockCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                                            <Text type="secondary">
                                                {tour.durationDays} ngày {tour.durationNights} đêm
                                            </Text>
                                        </div>
                                        <div>
                                            <Rate disabled defaultValue={tour.rating} style={{ fontSize: 14 }} />
                                            <Text type="secondary" style={{ marginLeft: 8 }}>
                                                ({tour.reviews} đánh giá)
                                            </Text>
                                        </div>
                                    </Space>

                                    <div style={{ marginTop: 16 }}>
                                        <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                                            {Utility.formatPrice(tour.basePriceAdult)}
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

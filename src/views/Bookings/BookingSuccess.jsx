import { Result, Button, Card, Row, Col, Divider } from 'antd';
import { CheckCircleOutlined, HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';

const BookingSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [bookingCode, setBookingCode] = useState('');
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        const code = searchParams.get('bookingCode');
        const txnId = searchParams.get('transactionId');

        if (code) setBookingCode(code);
        if (txnId) setTransactionId(txnId);
    }, [searchParams]);

    return (
        <MainCard>
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 72 }} />}
                    title={<span style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>Thanh toán thành công!</span>}
                    subTitle="Cảm ơn quý khách đã đặt tour. Thông tin booking đã được gửi đến email của bạn."
                    extra={[
                        <Button type="primary" size="large" icon={<HomeOutlined />} onClick={() => navigate('/')} key="home">
                            Về trang chủ
                        </Button>,
                        <Button size="large" icon={<UnorderedListOutlined />} onClick={() => navigate('/my-bookings')} key="bookings">
                            Xem booking của tôi
                        </Button>
                    ]}
                />

                <Divider />

                <Card
                    title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Thông tin giao dịch</span>}
                    style={{ marginTop: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Row>
                                <Col span={8}>
                                    <strong>Mã booking:</strong>
                                </Col>
                                <Col span={16}>
                                    <span style={{ color: '#1890ff', fontSize: 16, fontWeight: 'bold' }}>{bookingCode || 'N/A'}</span>
                                </Col>
                            </Row>
                        </Col>

                        <Col span={24}>
                            <Row>
                                <Col span={8}>
                                    <strong>Mã giao dịch:</strong>
                                </Col>
                                <Col span={16}>
                                    <span style={{ fontSize: 14 }}>{transactionId || 'N/A'}</span>
                                </Col>
                            </Row>
                        </Col>

                        <Col span={24}>
                            <Row>
                                <Col span={8}>
                                    <strong>Trạng thái:</strong>
                                </Col>
                                <Col span={16}>
                                    <span style={{ color: '#52c41a', fontWeight: 'bold' }}>✓ Đã thanh toán</span>
                                </Col>
                            </Row>
                        </Col>

                        <Col span={24}>
                            <Row>
                                <Col span={8}>
                                    <strong>Thời gian:</strong>
                                </Col>
                                <Col span={16}>{new Date().toLocaleString('vi-VN')}</Col>
                            </Row>
                        </Col>
                    </Row>

                    <Divider />

                    <div style={{ background: '#f0f9ff', padding: 16, borderRadius: 8, marginTop: 16 }}>
                        <p style={{ margin: 0, fontSize: 14, color: '#0958d9' }}>
                            <strong>📧 Lưu ý:</strong> Thông tin chi tiết về booking và hướng dẫn chuẩn bị cho chuyến đi đã được gửi đến
                            email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư mục Spam).
                        </p>
                    </div>
                </Card>
            </div>
        </MainCard>
    );
};

export default BookingSuccess;

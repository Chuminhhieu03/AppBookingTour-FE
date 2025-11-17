import { Result, Button, Card, Row, Col, Alert } from 'antd';
import { CloseCircleOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainCard from 'components/MainCard';

const BookingFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const message = searchParams.get('message');
        if (message) {
            setErrorMessage(decodeURIComponent(message));
        } else {
            setErrorMessage('Giao dịch không thành công');
        }
    }, [searchParams]);

    return (
        <MainCard>
            <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
                <Result
                    status="error"
                    icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 72 }} />}
                    title={<span style={{ fontSize: 28, fontWeight: 'bold', color: '#ff4d4f' }}>Thanh toán thất bại!</span>}
                    subTitle={errorMessage}
                    extra={[
                        <Button type="primary" size="large" icon={<ReloadOutlined />} onClick={() => navigate(-1)} key="retry">
                            Thử lại
                        </Button>,
                        <Button size="large" icon={<HomeOutlined />} onClick={() => navigate('/')} key="home">
                            Về trang chủ
                        </Button>
                    ]}
                />

                <Card
                    title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Chi tiết lỗi</span>}
                    style={{ marginTop: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                >
                    <Alert
                        message="Giao dịch không thành công"
                        description={
                            <div>
                                <p style={{ marginBottom: 8 }}>
                                    <strong>Lý do:</strong> {errorMessage}
                                </p>
                                <p style={{ marginBottom: 0 }}>
                                    <strong>Thời gian:</strong> {new Date().toLocaleString('vi-VN')}
                                </p>
                            </div>
                        }
                        type="error"
                        showIcon
                    />

                    <div style={{ marginTop: 24 }}>
                        <p style={{ fontSize: 14, marginBottom: 8 }}>
                            <strong>Các nguyên nhân có thể:</strong>
                        </p>
                        <ul style={{ fontSize: 14, paddingLeft: 20, marginBottom: 0 }}>
                            <li>Số dư tài khoản không đủ</li>
                            <li>Thông tin thẻ không chính xác</li>
                            <li>Giao dịch bị nghi ngờ bởi ngân hàng</li>
                            <li>Hết thời gian thanh toán</li>
                            <li>Khách hàng hủy giao dịch</li>
                            <li>Lỗi hệ thống tạm thời</li>
                        </ul>
                    </div>

                    <div style={{ background: '#fff7e6', padding: 16, borderRadius: 8, marginTop: 16, border: '1px solid #ffd591' }}>
                        <p style={{ margin: 0, fontSize: 14, color: '#d46b08' }}>
                            <strong>💡 Gợi ý:</strong> Vui lòng kiểm tra lại thông tin thanh toán và thử lại. Nếu vấn đề vẫn tiếp diễn, hãy
                            liên hệ với chúng tôi để được hỗ trợ.
                        </p>
                    </div>
                </Card>

                <Row gutter={16} style={{ marginTop: 24 }}>
                    <Col span={12}>
                        <Card size="small">
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: 14, color: '#666' }}>Hotline hỗ trợ</p>
                                <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>1900 1234</p>
                            </div>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small">
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: 14, color: '#666' }}>Email hỗ trợ</p>
                                <p style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>support@travel.vn</p>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </MainCard>
    );
};

export default BookingFailed;

import { useEffect, useState } from 'react';
import { Row, Col, Card, Divider, Button, message } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import bookingAPI from 'api/booking/bookingAPI';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const Step3_Confirmation = ({ bookingData, paymentData, onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(null);
    const [checking, setChecking] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, checking, success, expired

    useEffect(() => {
        if (!paymentData?.paymentExpiry) return;

        const interval = setInterval(() => {
            const now = dayjs();
            const expiry = dayjs(paymentData.paymentExpiry);
            const diff = expiry.diff(now);

            if (diff <= 0) {
                setTimeLeft('00:00');
                setPaymentStatus('expired');
                clearInterval(interval);
                message.error('Đã hết thời gian thanh toán');
            } else {
                const minutes = Math.floor(diff / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [paymentData]);

    // Auto check payment status mỗi 10 giây
    useEffect(() => {
        if (!bookingData?.id || paymentStatus !== 'pending') return;

        const checkInterval = setInterval(async () => {
            try {
                const response = await bookingAPI.getPaymentStatus(bookingData.id);
                if (response.success && response.data.bookingStatus === 3) {
                    // Status 3 = Paid
                    setPaymentStatus('success');
                    clearInterval(checkInterval);
                    message.success('Thanh toán thành công!');
                    setTimeout(() => {
                        onComplete();
                    }, 2000);
                }
            } catch (error) {
                console.error('Error checking payment status:', error);
            }
        }, 10000); // Check every 10 seconds

        return () => clearInterval(checkInterval);
    }, [bookingData, paymentStatus, onComplete]);

    const handleCheckPayment = async () => {
        setChecking(true);
        try {
            const response = await bookingAPI.getPaymentStatus(bookingData.id);
            if (response.success) {
                if (response.data.bookingStatus === 3) {
                    setPaymentStatus('success');
                    message.success('Thanh toán thành công!');
                    setTimeout(() => {
                        onComplete();
                    }, 2000);
                } else {
                    message.info('Chưa nhận được thanh toán. Vui lòng thử lại sau.');
                }
            }
        } catch (error) {
            console.error('Error checking payment:', error);
            message.error('Không thể kiểm tra trạng thái thanh toán');
        } finally {
            setChecking(false);
        }
    };

    if (!bookingData || !paymentData) return null;

    return (
        <Row gutter={[24, 24]}>
            {/* Left: Thông tin đặt tour */}
            <Col xs={24} lg={12}>
                <Card title="Thông tin đặt tour">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <strong>Mã thanh toán:</strong>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            {paymentData.paymentNumber}
                        </Col>

                        <Col span={12}>
                            <strong>Tổng giá tiền:</strong>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            {bookingData.totalAmount?.toLocaleString('vi-VN')} đ
                        </Col>

                        {bookingData.discountAmount > 0 && (
                            <>
                                <Col span={12}>
                                    <strong>Giảm giá:</strong>
                                </Col>
                                <Col span={12} style={{ textAlign: 'right', color: '#52c41a' }}>
                                    -{bookingData.discountAmount?.toLocaleString('vi-VN')} đ
                                </Col>
                            </>
                        )}

                        <Col span={12}>
                            <strong>Hình thức thanh toán:</strong>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            {bookingData.paymentType === 1 ? 'Toàn bộ' : bookingData.paymentType === 2 ? 'Đặt cọc' : 'Trả góp'}
                        </Col>

                        <Col span={12}>
                            <strong>Số tiền cần thanh toán:</strong>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <strong style={{ fontSize: 18, color: '#ff4d4f' }}>{paymentData.amount?.toLocaleString('vi-VN')} đ</strong>
                        </Col>

                        <Col span={12}>
                            <strong>Phương thức thanh toán:</strong>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            VNPay
                        </Col>

                        <Col span={12}>
                            <strong>Đường dẫn thanh toán:</strong>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <a href={paymentData.paymentUrl} target="_blank" rel="noopener noreferrer">
                                Đường dẫn thanh toán
                            </a>
                        </Col>
                    </Row>

                    <Divider />

                    <div style={{ fontSize: 12, color: '#666' }}>
                        <p style={{ margin: 0 }}>
                            <strong>Chú ý khoản nhận tiền:</strong>
                        </p>
                        <p style={{ margin: '8px 0 0 0' }}>
                            Vui lòng quét mã QR hoặc bấm vào đường dẫn thanh toán để tới trang thanh toán. Sau khi chuyển khoản thành công,
                            hệ thống sẽ tự động xác nhận thanh toán trong vòng 1-2 phút.
                        </p>
                    </div>
                </Card>
            </Col>

            {/* Right: QR Code */}
            <Col xs={24} lg={12}>
                <Card title="Vui lòng quét QR để chuyển đến trang thanh toán">
                    <div style={{ textAlign: 'center' }}>
                        {paymentStatus === 'success' ? (
                            <div style={{ padding: '60px 0' }}>
                                <CheckCircleOutlined style={{ fontSize: 80, color: '#52c41a' }} />
                                <p style={{ marginTop: 24, fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>Thanh toán thành công!</p>
                                <p style={{ color: '#666' }}>Đang chuyển hướng về trang chủ...</p>
                            </div>
                        ) : paymentStatus === 'expired' ? (
                            <div style={{ padding: '60px 0' }}>
                                <ClockCircleOutlined style={{ fontSize: 80, color: '#ff4d4f' }} />
                                <p style={{ marginTop: 24, fontSize: 18, fontWeight: 'bold', color: '#ff4d4f' }}>
                                    Đã hết thời gian thanh toán!
                                </p>
                                <p style={{ color: '#666' }}>Vui lòng thực hiện lại giao dịch.</p>
                            </div>
                        ) : (
                            <>
                                {paymentData.qrCodeBase64 && (
                                    <img
                                        src={`data:image/png;base64,${paymentData.qrCodeBase64}`}
                                        alt="QR Code"
                                        style={{ width: '100%', maxWidth: 300, height: 'auto' }}
                                    />
                                )}

                                <div style={{ marginTop: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <ClockCircleOutlined
                                            style={{ fontSize: 20, color: timeLeft === '00:00' ? '#ff4d4f' : '#1890ff' }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 24,
                                                fontWeight: 'bold',
                                                color: timeLeft === '00:00' ? '#ff4d4f' : '#1890ff'
                                            }}
                                        >
                                            {timeLeft || '--:--'}
                                        </span>
                                    </div>
                                    <p style={{ marginTop: 8, color: '#666', fontSize: 12 }}>Thời gian còn lại để thanh toán</p>
                                </div>

                                <Divider />

                                <Button type="primary" size="large" onClick={handleCheckPayment} loading={checking} block>
                                    Kiểm tra thanh toán
                                </Button>

                                <p style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
                                    Hệ thống sẽ tự động kiểm tra sau khi bạn thanh toán.
                                    <br />
                                    Hoặc bạn có thể click nút bên trên để kiểm tra thủ công.
                                </p>
                            </>
                        )}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default Step3_Confirmation;

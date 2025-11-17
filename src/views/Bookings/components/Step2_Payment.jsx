import { Modal, Radio, Button, Space, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import TourSummaryCard from './TourSummaryCard';

const Step2_Payment = ({ bookingData, onComplete, onBack, loading }) => {
    const [paymentMethodId, setPaymentMethodId] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);

    if (!bookingData) return null;

    const handleShowModal = () => {
        setModalVisible(true);
    };

    const handleConfirm = () => {
        setModalVisible(false);
        onComplete(paymentMethodId);
    };

    return (
        <>
            <Row gutter={[24, 24]}>
                {/* Left: Thông tin đã nhập */}
                <Col xs={24} lg={16}>
                    <div style={{ background: '#f9f9f9', padding: 24, borderRadius: 8 }}>
                        <h3 style={{ marginBottom: 16 }}>Thông tin liên hệ</h3>
                        <Row gutter={[16, 8]}>
                            <Col span={12}>
                                <strong>Họ tên:</strong>
                            </Col>
                            <Col span={12}>{bookingData.contactName}</Col>

                            <Col span={12}>
                                <strong>Email:</strong>
                            </Col>
                            <Col span={12}>{bookingData.contactEmail}</Col>

                            <Col span={12}>
                                <strong>Điện thoại:</strong>
                            </Col>
                            <Col span={12}>{bookingData.contactPhone}</Col>

                            {bookingData.specialRequests && (
                                <>
                                    <Col span={12}>
                                        <strong>Chỉ chú:</strong>
                                    </Col>
                                    <Col span={12}>{bookingData.specialRequests}</Col>
                                </>
                            )}
                        </Row>
                    </div>

                    <div style={{ background: '#f9f9f9', padding: 24, borderRadius: 8, marginTop: 24 }}>
                        <h3 style={{ marginBottom: 16 }}>Thông tin hành khách</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Họ tên</th>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Ngày sinh</th>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Giới tính</th>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Độ tuổi</th>
                                    <th style={{ padding: 8, textAlign: 'left' }}>Phòng đơn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookingData.participants?.map((p, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e8e8e8' }}>
                                        <td style={{ padding: 8 }}>{p.fullName}</td>
                                        <td style={{ padding: 8 }}>{new Date(p.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                                        <td style={{ padding: 8 }}>{p.gender === 1 ? 'Nam' : p.gender === 2 ? 'Nữ' : 'Khác'}</td>
                                        <td style={{ padding: 8 }}>
                                            {p.participantType === 1 ? 'Người lớn' : p.participantType === 2 ? 'Trẻ em' : 'Em bé'}
                                        </td>
                                        <td style={{ padding: 8 }}>{p.needSingleRoom ? 'Có' : 'Không'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons */}
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
                        <Button size="large" icon={<ArrowLeftOutlined />} onClick={onBack}>
                            Quay lại
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleShowModal}
                            style={{ background: '#ff4d4f', borderColor: '#ff4d4f' }}
                        >
                            Thanh toán
                        </Button>
                    </div>
                </Col>

                {/* Right: Tóm tắt chuyến đi */}
                <Col xs={24} lg={8}>
                    <TourSummaryCard
                        comboData={{
                            name: bookingData.tourName,
                            code: bookingData.bookingCode,
                            comboImageCoverUrl: bookingData.tourImageUrl
                        }}
                        scheduleData={{
                            departureDate: bookingData.departureDate,
                            returnDate: bookingData.returnDate,
                            basePriceAdult: bookingData.adultPrice,
                            basePriceChildren: bookingData.childPrice,
                            singleRoomSupplement: bookingData.singleRoomPrice || 0
                        }}
                        numAdults={bookingData.numAdults}
                        numChildren={bookingData.numChildren}
                        numSingleRooms={bookingData.numSingleRooms || 0}
                        totalAmount={bookingData.totalAmount}
                        discountAmount={bookingData.discountAmount || 0}
                        finalAmount={bookingData.finalAmount}
                        discountCode={bookingData.discountCode}
                        onDiscountCodeChange={() => {}}
                        onApplyDiscount={() => {}}
                        applyingDiscount={false}
                    />
                </Col>
            </Row>

            {/* Modal chọn hình thức thanh toán */}
            <Modal
                title="Chọn hình thức thanh toán"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleConfirm} loading={loading}>
                        Lưu lại
                    </Button>
                ]}
                width={500}
            >
                <div style={{ padding: '16px 0' }}>
                    <p style={{ marginBottom: 16 }}>
                        <strong>Hình thức thanh toán</strong>
                    </p>
                    <Radio.Group value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Radio value={1} style={{ width: '100%', padding: '8px 0' }}>
                                VNPay (Thanh toán qua QR Code)
                            </Radio>
                            <Radio value={2} style={{ width: '100%', padding: '8px 0' }} disabled>
                                Chuyển khoản ngân hàng (Đang phát triển)
                            </Radio>
                            <Radio value={3} style={{ width: '100%', padding: '8px 0' }} disabled>
                                Thanh toán tại văn phòng (Đang phát triển)
                            </Radio>
                        </Space>
                    </Radio.Group>

                    <Divider />

                    <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
                        <strong>Phương thức thanh toán:</strong>
                    </p>
                    <p style={{ fontSize: 12, color: '#666', margin: '8px 0 0 0' }}>
                        ✓ Quét mã QR Code
                        <br />
                        ✓ Thẻ ATM nội địa
                        <br />
                        ✓ Visa / Mastercard
                        <br />✓ Ví điện tử (MoMo, ZaloPay, etc.)
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default Step2_Payment;

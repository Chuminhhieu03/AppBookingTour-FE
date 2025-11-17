import { Card, Row, Col, Input, Button, Divider } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const TourSummaryCard = ({
    comboData,
    scheduleData,
    numAdults = 0,
    numChildren = 0,
    numSingleRooms = 0,
    totalAmount = 0,
    discountAmount = 0,
    finalAmount = 0,
    discountCode = '',
    onDiscountCodeChange,
    onApplyDiscount,
    applyingDiscount = false
}) => {
    if (!comboData || !scheduleData) return null;

    const priceAdult = scheduleData.basePriceAdult || 0;
    const priceChild = scheduleData.basePriceChildren || 0;
    const singleRoomSupplement = scheduleData.singleRoomSupplement || 0;

    // Đảm bảo tất cả giá trị là số
    const safeTotalAmount = Number(totalAmount) || 0;
    const safeDiscountAmount = Number(discountAmount) || 0;
    const safeFinalAmount = Number(finalAmount) || 0;

    return (
        <Card style={{ position: 'sticky', top: 24, borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            {/* Header with title */}
            <div style={{ marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 'bold', color: '#1890ff' }}>PHIẾU XÁC NHẬN BOOKING</h3>
            </div>

            {/* Tour info with image on left */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                {comboData.comboImageCoverUrl && (
                    <img
                        src={comboData.comboImageCoverUrl}
                        alt={comboData.name}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    />
                )}
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: 16, lineHeight: 1.4 }}>{comboData.name}</h4>
                    <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#666' }}>
                        <strong>Mã tour:</strong> {comboData.code}
                    </p>
                    {comboData.fromCityName && comboData.toCityName && (
                        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <EnvironmentOutlined />
                            <span>
                                {comboData.fromCityName} → {comboData.toCityName}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Thông tin lịch khởi hành */}
            <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: 14 }}>Thông tin chuyến đi</h4>
                <Row gutter={[8, 8]} style={{ fontSize: 13 }}>
                    <Col span={10}>
                        <strong>Ngày đi:</strong>
                    </Col>
                    <Col span={14} style={{ textAlign: 'right' }}>
                        {dayjs(scheduleData.departureDate).format('DD/MM/YYYY')}
                    </Col>

                    <Col span={10}>
                        <strong>Ngày về:</strong>
                    </Col>
                    <Col span={14} style={{ textAlign: 'right' }}>
                        {dayjs(scheduleData.returnDate).format('DD/MM/YYYY')}
                    </Col>
                </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Chi tiết giá */}
            <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: 14 }}>Chi tiết giá</h4>
                <Row gutter={[8, 8]} style={{ fontSize: 13 }}>
                    <Col span={14}>
                        <strong>Người lớn:</strong>
                    </Col>
                    <Col span={10} style={{ textAlign: 'right' }}>
                        {numAdults} x {priceAdult.toLocaleString('vi-VN')} đ
                    </Col>

                    {numChildren > 0 && (
                        <>
                            <Col span={14}>
                                <strong>Trẻ em:</strong>
                            </Col>
                            <Col span={10} style={{ textAlign: 'right' }}>
                                {numChildren} x {priceChild.toLocaleString('vi-VN')} đ
                            </Col>
                        </>
                    )}

                    {numSingleRooms > 0 && (
                        <>
                            <Col span={14}>
                                <strong>Phụ phí phòng đơn:</strong>
                            </Col>
                            <Col span={10} style={{ textAlign: 'right' }}>
                                {numSingleRooms} x {singleRoomSupplement.toLocaleString('vi-VN')} đ
                            </Col>
                        </>
                    )}
                </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Mã giảm giá */}
            <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: 14 }}>MÃ GIẢM GIÁ</h4>
                <Row gutter={8}>
                    <Col span={16}>
                        <Input
                            placeholder="Nhập mã giảm giá"
                            value={discountCode}
                            onChange={(e) => onDiscountCodeChange(e.target.value.toUpperCase())}
                        />
                    </Col>
                    <Col span={8}>
                        <Button onClick={onApplyDiscount} loading={applyingDiscount} block type="primary">
                            Áp dụng
                        </Button>
                    </Col>
                </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Tổng tiền */}
            <div style={{ background: '#e6f7ff', padding: 16, borderRadius: 8 }}>
                <Row gutter={[8, 8]} style={{ fontSize: 14 }}>
                    {safeDiscountAmount > 0 && (
                        <>
                            <Col span={12}>
                                <strong>Tạm tính:</strong>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                {safeTotalAmount.toLocaleString('vi-VN')} đ
                            </Col>
                            <Col span={12}>
                                <strong>Giảm giá:</strong>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right', color: '#52c41a' }}>
                                -{safeDiscountAmount.toLocaleString('vi-VN')} đ
                            </Col>
                            <Col span={24}>
                                <Divider style={{ margin: '8px 0' }} />
                            </Col>
                        </>
                    )}
                    <Col span={12}>
                        <strong style={{ fontSize: 16 }}>TỔNG CỘNG:</strong>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: 20, color: '#ff4d4f' }}>{safeFinalAmount.toLocaleString('vi-VN')} đ</strong>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default TourSummaryCard;

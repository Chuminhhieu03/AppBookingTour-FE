import { Card, Row, Col, Input, Button, Divider } from 'antd';
import { EnvironmentOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const TourSummaryCard = ({
    bookingType = 'combo',
    itemData,
    scheduleData,
    additionalData,
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
    if (!itemData || !scheduleData) return null;

    // Get prices based on bookingType
    let priceAdult = 0;
    let priceChild = 0;
    let singleRoomSupplement = 0;

    if (bookingType === 'combo') {
        priceAdult = scheduleData.basePriceAdult || 0;
        priceChild = scheduleData.basePriceChildren || 0;
        singleRoomSupplement = scheduleData.singleRoomSupplement || 0;
    } else if (bookingType === 'tour') {
        priceAdult = scheduleData.priceAdult || 0;
        priceChild = scheduleData.priceChildren || 0;
        singleRoomSupplement = scheduleData.singleRoomSurcharge || 0;
    } else if (bookingType === 'accommodation') {
        // For accommodation, use first night's price for display
        if (additionalData?.roomInventories?.length > 0) {
            priceAdult = additionalData.roomInventories[0].basePriceAdult || 0;
            priceChild = additionalData.roomInventories[0].basePriceChildren || 0;
        }
    }

    // Get image URL based on bookingType
    const imageUrl =
        bookingType === 'combo' ? itemData.comboImageCoverUrl : bookingType === 'tour' ? itemData.imageMainUrl : itemData.coverImgUrl;

    // Get title
    const title = itemData.name;
    const code = itemData.code;

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

            {/* Item info with image on left */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={title}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                    />
                )}
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: 16, lineHeight: 1.4 }}>{title}</h4>
                    <p style={{ margin: '8px 0 0 0', fontSize: 12, color: '#666' }}>
                        <strong>{bookingType === 'combo' ? 'Mã combo:' : bookingType === 'tour' ? 'Mã tour:' : 'Mã khách sạn:'}</strong>{' '}
                        {code}
                    </p>
                    {bookingType === 'combo' && itemData.fromCityName && itemData.toCityName && (
                        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <EnvironmentOutlined />
                            <span>
                                {itemData.fromCityName} → {itemData.toCityName}
                            </span>
                        </p>
                    )}
                    {bookingType === 'tour' && itemData.departureCityName && itemData.destinationCityName && (
                        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <EnvironmentOutlined />
                            <span>
                                {itemData.departureCityName} → {itemData.destinationCityName}
                            </span>
                        </p>
                    )}
                    {bookingType === 'accommodation' && itemData.address && (
                        <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#1890ff', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <EnvironmentOutlined />
                            <span>{itemData.address}</span>
                        </p>
                    )}
                    {bookingType === 'accommodation' && scheduleData.name && (
                        <p style={{ margin: '4px 0 0 0', fontSize: 12, color: '#666' }}>
                            <HomeOutlined /> <strong>Loại phòng:</strong> {scheduleData.name}
                        </p>
                    )}
                </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Thông tin lịch khởi hành/nhận phòng */}
            <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: 14 }}>
                    {bookingType === 'accommodation' ? 'Thông tin đặt phòng' : 'Thông tin chuyến đi'}
                </h4>
                <Row gutter={[8, 8]} style={{ fontSize: 13 }}>
                    {bookingType === 'accommodation' ? (
                        <>
                            {additionalData?.roomInventories && additionalData.roomInventories.length > 0 && (
                                <>
                                    <Col span={10}>
                                        <strong>Ngày nhận:</strong>
                                    </Col>
                                    <Col span={14} style={{ textAlign: 'right' }}>
                                        {dayjs(additionalData.roomInventories[0].date).format('DD/MM/YYYY')}
                                    </Col>
                                    <Col span={10}>
                                        <strong>Ngày trả:</strong>
                                    </Col>
                                    <Col span={14} style={{ textAlign: 'right' }}>
                                        {dayjs(additionalData.roomInventories[additionalData.roomInventories.length - 1].date)
                                            .add(1, 'day')
                                            .format('DD/MM/YYYY')}
                                    </Col>
                                    <Col span={10}>
                                        <strong>Số đêm:</strong>
                                    </Col>
                                    <Col span={14} style={{ textAlign: 'right' }}>
                                        {additionalData.numberOfNights} đêm
                                    </Col>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Col span={10}>
                                <strong>Ngày đi:</strong>
                            </Col>
                            <Col span={14} style={{ textAlign: 'right' }}>
                                {dayjs(scheduleData.departureDate || scheduleData.date).format('DD/MM/YYYY')}
                            </Col>
                            <Col span={10}>
                                <strong>Ngày về:</strong>
                            </Col>
                            <Col span={14} style={{ textAlign: 'right' }}>
                                {dayjs(scheduleData.returnDate).format('DD/MM/YYYY')}
                            </Col>
                        </>
                    )}
                </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {/* Chi tiết giá */}
            <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 12px 0', fontWeight: 'bold', fontSize: 14 }}>Chi tiết giá</h4>
                <Row gutter={[8, 8]} style={{ fontSize: 13 }}>
                    {bookingType === 'accommodation' && additionalData?.roomInventories ? (
                        <>
                            {/* Accommodation: Show price breakdown by nights */}
                            {additionalData.roomInventories.map((inv, index) => (
                                <Col span={24} key={index}>
                                    <div
                                        style={{
                                            background: '#fafafa',
                                            padding: '8px 12px',
                                            borderRadius: 4,
                                            marginBottom: index < additionalData.roomInventories.length - 1 ? 8 : 0
                                        }}
                                    >
                                        <div style={{ marginBottom: 4, fontWeight: 'bold', color: '#1890ff' }}>
                                            <CalendarOutlined /> {dayjs(inv.date).format('DD/MM/YYYY')}
                                        </div>
                                        {numAdults > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>
                                                    Người lớn: {numAdults} x {inv.basePriceAdult.toLocaleString('vi-VN')} đ
                                                </span>
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {(numAdults * inv.basePriceAdult).toLocaleString('vi-VN')} đ
                                                </span>
                                            </div>
                                        )}
                                        {numChildren > 0 && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>
                                                    Trẻ em: {numChildren} x {inv.basePriceChildren.toLocaleString('vi-VN')} đ
                                                </span>
                                                <span style={{ fontWeight: 'bold' }}>
                                                    {(numChildren * inv.basePriceChildren).toLocaleString('vi-VN')} đ
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </>
                    ) : (
                        <>
                            {/* Combo/Tour: Show simple price */}
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

                            {numSingleRooms > 0 && bookingType !== 'accommodation' && (
                                <>
                                    <Col span={14}>
                                        <strong>Phụ phí phòng đơn:</strong>
                                    </Col>
                                    <Col span={10} style={{ textAlign: 'right' }}>
                                        {numSingleRooms} x {singleRoomSupplement.toLocaleString('vi-VN')} đ
                                    </Col>
                                </>
                            )}
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

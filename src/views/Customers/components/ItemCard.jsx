import React, { useState } from 'react';
import { Card, Image, Typography, Rate, Button, Tag, Tooltip, Row, Col } from 'antd';
import {
    EnvironmentOutlined,
    CalendarOutlined,
    TeamOutlined,
    StarOutlined,
    CarOutlined,
    SendOutlined,
    ClockCircleOutlined,
    WifiOutlined,
    ThunderboltOutlined,
    CoffeeOutlined,
    CarryOutOutlined,
    HomeOutlined,
    StarFilled,
    ArrowRightOutlined,
    UserOutlined,
    LeftOutlined,
    RightOutlined,
    BankOutlined
} from '@ant-design/icons';
import Constants from '../../../Constants/Constants';
import Utility from '../../../utils/Utility';

// Utility function to render star rating
const renderStars = (rating) => {
    const stars = [];
    const total = 5;

    for (let i = 1; i <= total; i++) {
        if (i <= rating) {
            stars.push(<StarFilled key={i} style={{ color: '#fadb14', fontSize: 16 }} />);
        } else {
            stars.push(<StarFilled key={i} style={{ color: '#d9d9d9', fontSize: 16 }} />);
        }
    }

    return <span style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '2px' }}>{stars}</span>;
};

// Utility function to normalize data
const normalizeItemData = (data, type) => {
    const baseData = {
        id: data.id,
        name: data.name || '',
        code: data.code || '',
        rating: data.rating || data.averageRating || 0
    };

    switch (type) {
        case 'tour':
            return {
                ...baseData,
                image: data.imageMainUrl,
                price: data.basePriceAdult,
                label: data.tourTypeName || data.tourType?.name || data.typeName,
                location1: data.departureCityName,
                location2: data.destinationCityName,
                extra: {
                    duration: {
                        days: data.durationDays,
                        nights: data.durationNights
                    },
                    maxParticipants: data.maxParticipants,
                    departures: data.departures || []
                }
            };

        case 'combo':
            return {
                ...baseData,
                image: data.comboImageCoverUrl,
                price: data.basePriceAdult,
                label: 'Combo',
                location1: data.fromCityName,
                location2: data.toCityName,
                extra: {
                    vehicle: data.vehicle,
                    schedules: data.schedules || [],
                    duration: {
                        days: data.durationDays,
                        nights: data.durationNights
                    }
                }
            };

        case 'accommodation':
            return {
                ...baseData,
                image: data.coverImgUrl,
                price: data.minRoomTypePrice,
                label: data.starRating || 'CSLT',
                location1: data.cityName,
                location2: data.address,
                extra: {
                    amenities: data.amenities || [],
                    totalAvailableRooms: data.totalAvailableRooms || 0,
                    starRating: data.starRating,
                    type: data.type
                }
            };

        default:
            return baseData;
    }
};

// Sub-component for Hotel metadata
const HotelMeta = ({ data, commonData }) => {
    const { amenities = [], totalAvailableRooms, type } = commonData.extra;

    // Ensure amenities is always an array
    const safeAmenities = Array.isArray(amenities) ? amenities : [];

    const maxVisibleAmenities = 5;
    const visibleAmenities = safeAmenities.slice(0, maxVisibleAmenities);
    const hiddenCount = safeAmenities.length - maxVisibleAmenities;

    // Get accommodation type label
    const getAccommodationTypeLabel = (type) => {
        const typeOption = Constants.AccommodationTypeOptions.find((option) => option.value === type);
        return typeOption ? typeOption.label : 'Cơ sở lưu trú';
    };

    // TODO: Hoàn thiện nốt phần này
    // Icon mapping for amenities
    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <WifiOutlined />;
        if (amenityLower.includes('pool') || amenityLower.includes('bể bơi')) return <ThunderboltOutlined />;
        if (amenityLower.includes('breakfast') || amenityLower.includes('ăn sáng')) return <CoffeeOutlined />;
        if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <CarryOutOutlined />;
        return <HomeOutlined />;
    };

    return (
        <div>
            {/* Loại cơ sở lưu trú */}
            {type && (
                <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                    <BankOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                    <span style={{ fontWeight: 500, color: '#722ed1' }}>{getAccommodationTypeLabel(type)}</span>
                </div>
            )}

            {/* Địa chỉ */}
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                <EnvironmentOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <span style={{ fontWeight: 500 }}>{commonData.location1}</span>
                {commonData.location2 && <div style={{ marginLeft: '24px', marginTop: '4px', color: '#666' }}>{commonData.location2}</div>}
            </div>

            {/* Số phòng trống */}
            {totalAvailableRooms > 0 && (
                <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                    <HomeOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                    <span>{totalAvailableRooms} phòng trống</span>
                </div>
            )}

            {/* Amenities */}
            {safeAmenities.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>Tiện ích:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {visibleAmenities.map((amenity, index) => (
                            <Tag key={index} color="blue" size="small" icon={getAmenityIcon(amenity)}>
                                {amenity}
                            </Tag>
                        ))}
                        {hiddenCount > 0 && (
                            <Tooltip title={safeAmenities.slice(maxVisibleAmenities).join(', ')}>
                                <Tag color="default" size="small">
                                    +{hiddenCount} tiện ích khác
                                </Tag>
                            </Tooltip>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// ScrollableTagList component for handling departure/schedule tags
const ScrollableTagList = ({ items, label, icon }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerView = window.innerWidth >= 768 ? 5 : 3; // Show 5 tags on desktop, 3 on mobile
    const totalPages = Math.ceil(items.length / itemsPerView);
    const canScrollLeft = currentIndex > 0;
    const canScrollRight = currentIndex < totalPages - 1;

    const handleScrollLeft = () => {
        if (canScrollLeft) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleScrollRight = () => {
        if (canScrollRight) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const visibleItems = items.slice(currentIndex * itemsPerView, (currentIndex + 1) * itemsPerView);

    if (items.length === 0) return null;

    return (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                {icon}
                {label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Left scroll button */}
                <Button
                    type="text"
                    size="small"
                    icon={<LeftOutlined />}
                    onClick={handleScrollLeft}
                    disabled={!canScrollLeft}
                    style={{
                        padding: '0 4px',
                        height: '24px',
                        minWidth: '24px',
                        opacity: canScrollLeft ? 1 : 0.3
                    }}
                />

                {/* Tags container */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        gap: '4px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    {visibleItems.map((item, index) => (
                        <Tag key={currentIndex * itemsPerView + index} color="orange" size="small">
                            {item}
                        </Tag>
                    ))}
                </div>

                {/* Right scroll button */}
                <Button
                    type="text"
                    size="small"
                    icon={<RightOutlined />}
                    onClick={handleScrollRight}
                    disabled={!canScrollRight}
                    style={{
                        padding: '0 4px',
                        height: '24px',
                        minWidth: '24px',
                        opacity: canScrollRight ? 1 : 0.3
                    }}
                />

                {/* Page indicator */}
                {totalPages > 1 && (
                    <span
                        style={{
                            fontSize: '12px',
                            color: '#666',
                            minWidth: '30px',
                            textAlign: 'center'
                        }}
                    >
                        {currentIndex + 1}/{totalPages}
                    </span>
                )}
            </div>
        </div>
    );
};

// Sub-component for Tour/Combo metadata
const TourComboMeta = ({ data, commonData, type }) => {
    const { duration, maxParticipants, departures, vehicle, schedules } = commonData.extra;

    // Format duration
    const formatDuration = () => {
        if (duration.days && duration.nights) {
            return `${duration.days} ngày ${duration.nights} đêm`;
        } else if (duration.days) {
            return `${duration.days} ngày`;
        }
        return 'N/A';
    };

    // Get vehicle icon and text
    const getVehicleInfo = (vehicleType) => {
        switch (vehicleType) {
            case Constants.VehicleType.Car:
                return { icon: <CarOutlined />, text: Utility.getLabelByValue(Constants.VehicleTypeOptions, Constants.VehicleType.Car) };
            case Constants.VehicleType.Plane:
                return { icon: <SendOutlined />, text: Utility.getLabelByValue(Constants.VehicleTypeOptions, Constants.VehicleType.Plane) };
            default:
                return null;
        }
    };

    // Get departure dates
    const getDepartureDates = () => {
        if (type === 'tour' && departures && departures.length > 0) {
            const sortedDepartures = departures.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
            return sortedDepartures.map((dep) => new Date(dep.departureDate).toLocaleDateString('vi-VN'));
        } else if (type === 'combo' && schedules && schedules.length > 0) {
            const sortedSchedules = schedules.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
            return sortedSchedules.map((sch) => new Date(sch.departureDate).toLocaleDateString('vi-VN'));
        }
        return [];
    };

    const vehicleInfo = type === 'combo' ? getVehicleInfo(vehicle) : null;
    const allDepartures = getDepartureDates();

    return (
        <div>
            {/* Duration */}
            <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <span>{formatDuration()}</span>
            </div>

            {/* Departure and Destination cities */}
            {(commonData.location1 || commonData.location2) && (
                <div
                    style={{
                        marginBottom: '8px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}
                >
                    {commonData.location1 && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <EnvironmentOutlined style={{ marginRight: '6px', color: '#52c41a' }} />
                            Khởi hành từ: {commonData.location1}
                        </span>
                    )}
                    {commonData.location1 && commonData.location2 && <ArrowRightOutlined />}
                    {commonData.location2 && (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <EnvironmentOutlined style={{ marginRight: '6px', color: '#f5222d' }} />
                            Điểm đến: {commonData.location2}
                        </span>
                    )}
                </div>
            )}

            {/* Vehicle for combo */}
            {type === 'combo' && vehicleInfo && (
                <div style={{ marginBottom: '8px', fontSize: '14px' }}>
                    {vehicleInfo.icon}
                    <span style={{ marginLeft: '8px' }}>Phương tiện: {vehicleInfo.text}</span>
                </div>
            )}

            {/* Max participants for tour */}
            {type === 'tour' && maxParticipants && (
                <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                    <UserOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                    <span>Tối đa: {maxParticipants} người</span>
                </div>
            )}

            {/* Departures/Schedules using ScrollableTagList */}
            <ScrollableTagList
                items={allDepartures}
                label={type === 'tour' ? 'Lịch khởi hành:' : 'Lịch trình:'}
                icon={<CalendarOutlined style={{ marginRight: '8px', color: '#fa8c16' }} />}
            />
        </div>
    );
};

const ItemCard = ({ data, type, onViewDetails }) => {
    // Check if data is already normalized (from utils)
    const isAlreadyNormalized = data && typeof data === 'object' && 'extra' in data;

    // Normalize data based on type only if not already normalized
    const commonData = isAlreadyNormalized ? data : normalizeItemData(data, type);

    // Handle view details
    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(data);
        } else {
            console.log(`View ${type} details:`, commonData.id);
        }
    };

    return (
        <Card hoverable style={{ width: '100%' }} styles={{ body: { padding: 0 } }}>
            <div style={{ position: 'relative' }}>
                {/* Rating ribbon flag - top right corner */}
                {commonData.rating > 0 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: '20px',
                            zIndex: 2
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#faad14',
                                color: 'white',
                                padding: '8px 12px',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                borderRadius: '0 0 4px 4px',
                                position: 'relative',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            {commonData.rating}/10
                        </div>
                    </div>
                )}

                <Row gutter={[0, 0]}>
                    {/* Image Column - Full width on mobile, partial on desktop */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div
                            style={{
                                width: '100%',
                                minHeight: '200px',
                                height: window.innerWidth < 768 ? '200px' : '280px',
                                overflow: 'hidden',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img
                                alt={commonData.name}
                                src={commonData.image || 'https://via.placeholder.com/300x200'}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    padding: window.innerWidth >= 768 ? '8px' : '12px',
                                    objectFit: 'cover',
                                    borderRadius: '8px'
                                }}
                            />

                            {/* Type Label Tag - inside image container */}
                            {commonData.label && (
                                <Tag
                                    color={type === 'accommodation' ? 'gold' : type === 'combo' ? 'green' : 'purple'}
                                    style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        left: '20px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        border: `1px solid ${type === 'accommodation' ? '#b6b6b6' : type === 'combo' ? '#52c41a' : '#722ed1'}`,
                                        backgroundColor:
                                            type === 'accommodation'
                                                ? 'rgba(255, 255, 255, 0.8)'
                                                : type === 'combo'
                                                  ? 'rgba(82, 196, 26, 0.95)'
                                                  : 'rgba(114, 46, 209, 0.95)',
                                        color: 'white',
                                        zIndex: 2,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3)',
                                        backdropFilter: 'blur(8px)',
                                        borderRadius: '6px',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                        transform: 'translateZ(0)', // Force hardware acceleration
                                        WebkitFontSmoothing: 'antialiased'
                                    }}
                                >
                                    {type === 'accommodation' && typeof commonData.label === 'number'
                                        ? renderStars(commonData.label)
                                        : commonData.label}
                                </Tag>
                            )}
                        </div>
                    </Col>

                    {/* Content Column - Full width on mobile, partial on desktop */}
                    <Col xs={24} sm={24} md={16} lg={16}>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            {/* Title and Code */}
                            <div style={{ marginBottom: '12px' }}>
                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        marginBottom: '6px',
                                        color: '#1890ff'
                                    }}
                                >
                                    {commonData.name}
                                </h3>
                                {commonData.code && (
                                    <Tag color="blue" style={{ fontSize: '11px' }}>
                                        {commonData.code}
                                    </Tag>
                                )}
                            </div>

                            {/* Dynamic Content */}
                            <div style={{ flex: 1 }}>
                                {type === 'accommodation' ? (
                                    <HotelMeta data={data} commonData={commonData} />
                                ) : (
                                    <TourComboMeta data={data} commonData={commonData} type={type} />
                                )}
                            </div>

                            {/* Bottom section - Price and Button */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 'auto',
                                    paddingTop: '12px',
                                    borderTop: '1px solid #f0f0f0'
                                }}
                            >
                                {/* Price */}
                                <div>
                                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '2px' }}>Giá chỉ từ</div>
                                    <div
                                        style={{
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                            color: '#f5222d'
                                        }}
                                    >
                                        {Utility.formatPrice(commonData.price)}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {type === 'accommodation' ? '/đêm' : '/người lớn'}
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <Button type="primary" size="large" onClick={handleViewDetails}>
                                    Xem chi tiết
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default ItemCard;

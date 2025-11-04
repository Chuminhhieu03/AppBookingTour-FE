import { useState, useMemo, useEffect } from 'react';
import {
    CalendarOutlined,
    UserOutlined,
    SearchOutlined,
    StarFilled,
    EnvironmentOutlined,
    CloseCircleFilled,
    MinusOutlined,
    PlusOutlined,
    DownOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Input, DatePicker, Select, Checkbox, InputNumber, Modal, Image, Rate, Badge, Tag, Space, Popover } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import axiosInstance from '../../../api/axiosInstance';
import Constants from '../../../Constants/Constants';
dayjs.locale('vi');

const { RangePicker } = DatePicker;

// ---------- SAMPLE DATA (your JSON + 5 more) ----------
const rawAccommodations = [
    {
        id: 25,
        name: 'Hehe',
        address: '213',
        city: { name: 'Bắc Ninh' },
        starRating: 3,
        rating: 8.5,
        reviewCount: 128,
        reviewLabel: 'Rất tốt',
        coverImgUrl: 'https://appbookingtourgallery.blob.core.windows.net/images/755fbfc1-fd68-4438-991c-430e2b57c568',
        listInfoImage: [
            { url: 'https://appbookingtourgallery.blob.core.windows.net/images/763b95a1-d876-4b0a-b566-0462186574d1' },
            { url: 'https://appbookingtourgallery.blob.core.windows.net/images/d31f457c-94c5-4500-ac8b-d1ef6e3a052a' },
            { url: 'https://appbookingtourgallery.blob.core.windows.net/images/5248e7de-6164-4161-a8c7-6ce556f9879f' },
            { url: 'https://appbookingtourgallery.blob.core.windows.net/images/6e1f2542-5b9a-4eeb-9790-a591818eb671' },
            { url: 'https://appbookingtourgallery.blob.core.windows.net/images/65a19cce-a4dc-4fc8-a3aa-05d00fb5d64c' }
        ],
        typeName: 'Resort',
        amenities: ['Bãi đỗ xe', 'Nước uống chào đón', 'Nhận phòng nhanh', 'WiFi miễn phí'],
        originalPrice: 847046,
        currentPrice: 244665,
        savings: 602381,
        badge: 'TIẾT KIỆM 602.381đ'
    },
    {
        id: 26,
        name: 'Petro House Vũng Tàu (Block B)',
        address: '63 Trần Hưng Đạo, phường 1',
        city: { name: 'Vũng Tàu' },
        starRating: 3,
        rating: 7.5,
        reviewCount: 89,
        reviewLabel: 'Tốt',
        coverImgUrl: 'https://via.placeholder.com/400x300',
        listInfoImage: [],
        typeName: 'Khách sạn',
        amenities: ['Bữa sáng', 'Bãi đỗ xe', 'Nước uống chào đón', 'WiFi miễn phí', 'Nước +5'],
        originalPrice: 1079445,
        currentPrice: 476764,
        savings: null,
        badge: 'Siêu tiết kiệm',
        superSaving: true
    },
    {
        id: 27,
        name: 'Seaside Resort Vũng Tàu',
        address: '28 Đường Trần Phú',
        city: { name: 'Vũng Tàu' },
        starRating: 4,
        rating: 8.2,
        reviewCount: 201,
        reviewLabel: 'Rất tốt',
        coverImgUrl: 'https://via.placeholder.com/400x300',
        listInfoImage: [],
        typeName: 'Resort',
        amenities: ['Hồ bơi', 'Bãi biển riêng', 'Spa', 'WiFi miễn phí'],
        originalPrice: 1200000,
        currentPrice: 706684,
        savings: null,
        badge: null
    },
    {
        id: 28,
        name: 'Blue Sapphire Hotel',
        address: 'Gần bãi biển',
        city: { name: 'Vũng Tàu' },
        starRating: 3,
        rating: 8.5,
        reviewCount: 128,
        reviewLabel: 'Rất tốt',
        coverImgUrl: 'https://via.placeholder.com/400x300',
        listInfoImage: [],
        typeName: 'Khách sạn',
        amenities: ['Bãi đỗ xe', 'Nước uống chào đón', 'Nhận phòng nhanh', 'WiFi miễn phí'],
        originalPrice: 847046,
        currentPrice: 244665,
        savings: 602381,
        badge: 'TIẾT KIỆM 602.381đ'
    },
    {
        id: 29,
        name: 'Sunrise Villa',
        address: 'Khu dân cư cao cấp',
        city: { name: 'Bắc Ninh' },
        starRating: 5,
        rating: 9.1,
        reviewCount: 45,
        reviewLabel: 'Tuyệt vời',
        coverImgUrl: 'https://via.placeholder.com/400x300',
        listInfoImage: [],
        typeName: 'Biệt thự',
        amenities: ['Hồ bơi riêng', 'Vườn', 'Bếp đầy đủ', 'WiFi miễn phí'],
        originalPrice: 2500000,
        currentPrice: 1800000,
        savings: 700000,
        badge: 'GIẢM 700.000đ'
    },
    {
        id: 30,
        name: 'Coastal Inn',
        address: 'Gần trung tâm',
        city: { name: 'Vũng Tàu' },
        starRating: 2,
        rating: 7.0,
        reviewCount: 67,
        reviewLabel: 'Tốt',
        coverImgUrl: 'https://via.placeholder.com/400x300',
        listInfoImage: [],
        typeName: 'Nhà nghỉ',
        amenities: ['WiFi miễn phí', 'Điều hòa', 'Tủ lạnh'],
        originalPrice: 450000,
        currentPrice: 350000,
        savings: 100000,
        badge: 'GIẢM 100.000đ'
    }
];

const propertyTypes = ['Khách sạn', 'Resort', 'Nhà nghỉ', 'Biệt thự', 'Toàn bộ ngôi nhà'];

export default function AccommodationCustomerDefault() {
    const [location, setLocation] = useState('Vũng Tàu');
    const [dates, setDates] = useState([dayjs('2025-11-03'), dayjs('2025-11-04')]);
    const [guests, setGuests] = useState('1 phòng · 1 người lớn');
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 5580000]);
    const [starRatings, setStarRatings] = useState([]);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(5580000);
    const [sortBy, setSortBy] = useState('recommended');
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
    const [listAmenity, setListAmenity] = useState([]);
    const [listCity, setListCity] = useState([]);
    const guestText = `${rooms} phòng · ${adults} người lớn${children > 0 ? ` · ${children} trẻ em` : ''}`;

    const formatPrice = (price) => price.toLocaleString('vi-VN', { minimumFractionDigits: 0 }) + ' đ';

    useEffect(() => {
        getListAmenity();
        getListCity();
    }, []);

    const filteredData = useMemo(() => {
        return rawAccommodations.filter((item) => {
            const matchType = selectedTypes.length === 0 || selectedTypes.includes(item.typeName);
            const matchAmenity = selectedAmenities.length === 0 || selectedAmenities.some((a) => item.amenities.includes(a));
            const matchStars = starRatings.length === 0 || starRatings.includes(item.starRating);
            const matchPrice = item.currentPrice >= priceMin && item.currentPrice <= priceMax;
            return matchType && matchAmenity && matchStars && matchPrice;
        });
    }, [selectedTypes, selectedAmenities, starRatings, priceRange]);

    const sortedData = useMemo(() => {
        const data = [...filteredData];
        if (sortBy === 'price-low') return data.sort((a, b) => a.currentPrice - b.currentPrice);
        if (sortBy === 'price-high') return data.sort((a, b) => b.currentPrice - a.currentPrice);
        if (sortBy === 'rating') return data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        return data; // recommended
    }, [filteredData, sortBy]);

    const openModal = (hotel) => {
        setSelectedHotel(hotel);
        setModalOpen(true);
    };

    const getListAmenity = async () => {
        const response = await axiosInstance.post('/SystemParameters/get-by-feature-code', {"FeatureCode": Constants.FeatureCode.AccommodationAmenity});
        const res = response.data;
        setListAmenity(res.data);
    }

    const getListCity = async () => {
        const response = await axiosInstance.get('/cities/get-list');
        const res = response.data;
        setListCity(res.data);
    }

    return (
        <>
            {/* hide empty (gray) stars but keep filled stars visible for Rate */}
            <style>{`.only-filled-stars .ant-rate-star .anticon { color: transparent !important; }
.only-filled-stars .ant-rate-star.ant-rate-star-full .anticon { color: #faad14 !important; }`}</style>
            {/* Search Bar */}
            <div className="border-bottom">
                <Row gutter={[8, 8]} align="middle" className="flex-nowrap bg-white shadow-sm mb-4 p-3" style={{ margin: '0 116px' }}>
                    {/* Location */}
                    <Col flex="1" style={{ borderRight: '1px solid #e9e9e9', paddingRight: 12 }}>
                        <div className="small fw-bold mb-1">Địa điểm <span className="text-danger">*</span></div>
                        <Space.Compact block style={{ width: '100%' }}>
                            <Select
                                showSearch
                                allowClear
                                bordered={false}
                                value={location}
                                onChange={(val) => setLocation(val)}
                                placeholder="Chọn thành phố hoặc nhập..."
                                optionFilterProp="label"
                                options={listCity?.map((c) => ({ value: c.name, label: c.name }))}
                                className="fw-bold"
                                style={{ fontWeight: 600, width: '100%' }}
                                dropdownMatchSelectWidth={false}
                            />
                        </Space.Compact>
                    </Col>

                    {/* Check-in */}
                    <Col flex="1" className='ps-3' style={{ borderRight: '1px solid #e9e9e9', paddingRight: 12 }}>
                        <div className="small fw-bold mb-1">Nhận phòng</div>
                        <Space.Compact block style={{ width: '100%' }}>
                            <DatePicker
                                value={dates[0]}
                                onChange={(date) => setDates([date, dates[1]])}
                                format="DD/MM/YYYY"
                                placeholder="Nhận phòng"
                                bordered={false}
                                suffixIcon={<CalendarOutlined className="text-primary" />}
                                className="fw-medium"
                                style={{ width: '100%', paddingLeft: 0 }}
                            />
                        </Space.Compact>
                    </Col>

                    {/* Check-out */}
                    <Col flex="1" className='ps-3'>
                        <div className="small fw-bold mb-1">Trả phòng</div>
                        <Space.Compact block style={{ width: '100%' }}>
                            <DatePicker
                                value={dates[1]}
                                onChange={(date) => setDates([dates[0], date])}
                                format="DD/MM/YYYY"
                                placeholder="Trả phòng"
                                bordered={false}
                                suffixIcon={<CalendarOutlined className="text-primary" />}
                                className="fw-medium"
                                style={{ width: '100%', paddingLeft: 0 }}
                            />
                        </Space.Compact>
                    </Col>

                    {/* Guest Picker */}
                    <Col flex="1">
                        <div className="small fw-bold mb-1">Số người</div>
                        <Popover
                            content={
                                <div style={{ width: 300 }} className="p-3">
                                    {/* Rooms */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <div className="fw-bold">Phòng</div>
                                        </div>
                                        <Space>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                disabled={rooms <= 1}
                                                onClick={() => setRooms(rooms - 1)}
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <span className="px-3 fw-bold">{rooms}</span>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setRooms(rooms + 1)}>
                                                <PlusOutlined />
                                            </button>
                                        </Space>
                                    </div>

                                    {/* Adults */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <div className="fw-bold">Người lớn</div>
                                            <div className="text-muted small">Từ 12 tuổi trở lên</div>
                                        </div>
                                        <Space>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                disabled={adults <= 1}
                                                onClick={() => setAdults(adults - 1)}
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <span className="px-3 fw-bold">{adults}</span>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setAdults(adults + 1)}>
                                                <PlusOutlined />
                                            </button>
                                        </Space>
                                    </div>

                                    {/* Children */}
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-bold">Trẻ em</div>
                                            <div className="text-muted small">Từ 0 - 11 tuổi</div>
                                        </div>
                                        <Space>
                                            <button
                                                className="btn btn-outline-secondary btn-sm"
                                                disabled={children <= 0}
                                                onClick={() => setChildren(children - 1)}
                                            >
                                                <MinusOutlined />
                                            </button>
                                            <span className="px-3 fw-bold">{children}</span>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setChildren(children + 1)}>
                                                <PlusOutlined />
                                            </button>
                                        </Space>
                                    </div>
                                </div>
                            }
                            trigger="click"
                            open={guestPopoverOpen}
                            onOpenChange={setGuestPopoverOpen}
                            placement="bottomLeft"
                        >
                            <div
                                className="border rounded px-3 py-2 d-flex justify-content-between align-items-center cursor-pointer"
                                style={{ minHeight: 40 }}
                                onClick={() => setGuestPopoverOpen(!guestPopoverOpen)}
                            >
                                <span className="text-truncate">{guestText}</span>
                                <DownOutlined className="text-muted" />
                            </div>
                        </Popover>
                    </Col>

                    {/* Search Button */}
                    <Col flex="0 0 60px">
                        <button className="btn btn-primary w-100 h-100 d-flex align-items-center justify-content-center">
                            <SearchOutlined style={{ fontSize: 18 }} />
                        </button>
                    </Col>
                </Row>
            </div>

            <div className="container-fluid">
                <Row gutter={24} style={{ padding: '0 100px' }}>
                    {/* Filters */}
                    <Col xs={24} lg={6}>
                        <div className="p-3 mb-4">
                            <h6 className="fw-bold mb-3" style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                                BỘ LỌC TÌM KIẾM
                            </h6>

                            {/* Property Type */}
                            <div className="mb-4">
                                <h6 style={{ fontWeight: 700 }}>Loại hình chỗ ở:</h6>
                                <Checkbox.Group value={selectedTypes} onChange={setSelectedTypes} className="d-flex flex-column">
                                    {propertyTypes.map((type) => (
                                        <Checkbox key={type} value={type} className="mb-2">
                                            {type}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </div>

                            {/* Amenities */}
                            <div className="mb-4">
                                <h6 style={{ fontWeight: 700 }}>Tiện nghi:</h6>
                                <Checkbox.Group value={selectedAmenities} onChange={setSelectedAmenities} className="d-flex flex-column">
                                    {listAmenity?.map((a) => (
                                        <Checkbox key={a.id} value={a.name} className="mb-2">
                                            {a.name}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                            </div>

                            {/* Star Rating */}
                            <div className="mb-4">
                                <h6 style={{ fontWeight: 700 }}>Xếp hạng sao:</h6>
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <Checkbox
                                        key={star}
                                        checked={starRatings.includes(star)}
                                        onChange={(e) =>
                                            setStarRatings((prev) => (e.target.checked ? [...prev, star] : prev.filter((s) => s !== star)))
                                        }
                                        className="mb-2 d-flex align-items-center"
                                    >
                                        <Rate disabled value={star} className="only-filled-stars" />
                                    </Checkbox>
                                ))}
                            </div>

                            {/* Price Slider */}
                            <div className="mb-4">
                                <h6 style={{ fontWeight: 700 }}>Ngân sách:</h6>
                                <div className="d-flex align-items-center">
                                    <InputNumber
                                        value={priceMin}
                                        onChange={(v) => setPriceMin(Number(v) || 0)}
                                        formatter={(v) => (v ? `${Number(v).toLocaleString('vi-VN')} đ` : '')}
                                        parser={(v) => v.replace(/[^\\d]/g, '')}
                                        style={{ width: 140 }}
                                    />
                                    <span className="mx-2">—</span>
                                    <InputNumber
                                        value={priceMax}
                                        onChange={(v) => setPriceMax(Number(v) || 0)}
                                        formatter={(v) => (v ? `${Number(v).toLocaleString('vi-VN')} đ` : '')}
                                        parser={(v) => v.replace(/[^\\d]/g, '')}
                                        style={{ width: 140 }}
                                    />
                                </div>
                                <div className="d-flex justify-content-between small text-muted mt-2">
                                    <span>{formatPrice(priceMin)}</span>
                                    <span>{formatPrice(priceMax)}</span>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Results */}
                    <Col xs={24} lg={18}>
                        <div className="d-flex justify-content-end mb-4">
                            <Space>
                                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#000' }}>Sắp xếp theo:</span>
                                <Select
                                    value={sortBy}
                                    onChange={setSortBy}
                                    style={{ width: 200 }}
                                    options={[
                                        { value: 'recommended', label: 'Khách sạn phù hợp nhất' },
                                        { value: 'price-low', label: 'Giá tăng dần' },
                                        { value: 'price-high', label: 'Giá giảm dần' },
                                        { value: 'rating', label: 'Đánh giá cao nhất' }
                                    ]}
                                />
                            </Space>
                        </div>

                        {sortedData.map((hotel) => (
                            <Card key={hotel.id} className="mb-3 shadow-sm" hoverable>
                                <Row gutter={16}>
                                    <Col xs={24} md={8} lg={6}>
                                        <div
                                            style={{ position: 'relative', cursor: 'pointer' }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    openModal(hotel);
                                                }
                                            }}
                                            title="Xem phòng"
                                        >
                                            <img
                                                src={hotel.coverImgUrl}
                                                alt={hotel.name}
                                                className="img-fluid rounded"
                                                style={{ height: 180, objectFit: 'cover', width: '100%' }}
                                            />
                                            {hotel.starRating != null && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        left: 8,
                                                        background: 'rgba(0,0,0,0.7)',
                                                        color: '#fff',
                                                        padding: '4px 8px',
                                                        borderRadius: 6,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 6,
                                                        fontWeight: 700,
                                                        fontSize: 13
                                                    }}
                                                >
                                                    <StarFilled style={{ color: '#faad14' }} />
                                                    <span>{hotel.starRating}</span>
                                                </div>
                                            )}
                                            {hotel.listInfoImage && hotel.listInfoImage.length > 0 && (
                                                <Tag
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal(hotel);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            openModal(hotel);
                                                        }
                                                    }}
                                                    tabIndex={0}
                                                    title="Xem ảnh"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: 8,
                                                        right: 8,
                                                        padding: '4px 8px',
                                                        cursor: 'pointer',
                                                        fontWeight: 700,
                                                        fontSize: 12,
                                                        color: '#595959ff',
                                                        background: 'rgba(232, 232, 232, 0.8)'
                                                    }}
                                                >
                                                    +{hotel.listInfoImage.length}
                                                </Tag>
                                            )}
                                        </div>
                                    </Col>
                                    <Col xs={24} md={16} lg={18}>
                                        <Row>
                                            <Col span={18}>
                                                <h5 className="fw-bold">{hotel.name}</h5>
                                                <p className="text-muted small">
                                                    <EnvironmentOutlined /> {hotel.address}, {hotel.city.name}
                                                </p>
                                                <Space wrap>
                                                    {hotel.amenities.map((a, i) => (
                                                        <Tag key={i} color="blue">
                                                            {a}
                                                        </Tag>
                                                    ))}
                                                </Space>
                                            </Col>
                                            <Col span={6} className="text-end">
                                                {hotel.rating && (
                                                    <div>
                                                        <div className="bg-primary text-white d-inline-block px-2 py-1 rounded small">
                                                            {hotel.rating}
                                                        </div>
                                                        <div className="small fw-bold">{hotel.reviewLabel}</div>
                                                        <div className="text-muted small">{hotel.reviewCount} đánh giá</div>
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>

                                        <Row className="mt-3" align="middle" justify="space-between">
                                            <Col>
                                                {/* {hotel.superSaving && <Badge color="pink" text="Siêu tiết kiệm" />}
                                                {hotel.badge && !hotel.superSaving && (
                                                    <span className="text-danger fw-bold small">{hotel.badge}</span>
                                                )} */}
                                                {/* {hotel.originalPrice && (
                                                    <div>
                                                        <del className="text-muted small">{formatPrice(hotel.originalPrice)}</del>
                                                    </div>
                                                )} */}
                                                <div className="h5 text-danger fw-bold">{formatPrice(hotel.currentPrice)}</div>
                                                <div className="text-muted small">
                                                    Giá mỗi đêm
                                                    <br />
                                                    Giá chưa bao gồm thuế và phí
                                                </div>
                                            </Col>
                                            <Col>
                                                <button
                                                    className="btn"
                                                    onClick={() => openModal(hotel)}
                                                    style={{ backgroundColor: '#ff5e00ff', borderColor: '#ff7a00', color: '#fff' }}
                                                >
                                                    Xem phòng
                                                </button>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </div>

            {/* Modal */}
            <Modal title={'Các hình ảnh khác'} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={800}>
                {selectedHotel && (
                    <>
                        <Image.PreviewGroup>
                            {/* use CSS grid to show 5 images per row */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
                                {selectedHotel.listInfoImage && selectedHotel.listInfoImage.length > 0 ? (
                                    selectedHotel.listInfoImage.map((img, i) => (
                                        <div key={i} className="mb-3" style={{ width: '100%' }}>
                                            <Image
                                                src={img.url}
                                                alt=""
                                                style={{ width: '100%', height: 150, objectFit: 'cover' }}
                                                className="rounded"
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center' }}>
                                        <Image
                                            src={selectedHotel.coverImgUrl}
                                            style={{ width: 150, height: 150, objectFit: 'cover' }}
                                            className="rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </Image.PreviewGroup>
                    </>
                )}
            </Modal>
        </>
    );
}

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { DatePicker, Input, Select, Button, message } from 'antd';
import {
    SearchOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    DollarOutlined,
    TeamOutlined,
    HomeOutlined,
    CarOutlined,
    GiftOutlined,
    AimOutlined
} from '@ant-design/icons';
import cityAPI from 'api/city/cityAPI';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HomePageSearchBtn = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tour');
    const [cities, setCities] = useState([]);

    // Tour search state
    const [tourDestinationCity, setTourDestinationCity] = useState(null);
    const [tourDepartureDate, setTourDepartureDate] = useState(null);
    const [tourPriceRange, setTourPriceRange] = useState(null);

    // Combo search state
    const [comboDepartureCity, setComboDepartureCity] = useState(null);
    const [comboDestinationCity, setComboDestinationCity] = useState(null);
    const [comboDepartureDate, setComboDepartureDate] = useState(null);

    const tabs = [
        { key: 'tour', label: 'Tour trọn gói', icon: <GiftOutlined /> },
        { key: 'hotel', label: 'Khách sạn', icon: <HomeOutlined /> },
        { key: 'combo', label: 'Combo', icon: <CarOutlined /> }
    ];

    // Fetch cities on component mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await cityAPI.getListCity();
                setCities(response.data || []);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    const handleTourSearch = () => {
        // Validate required fields
        if (!tourDestinationCity) {
            message.error('Vui lòng chọn địa điểm');
            return;
        }

        // Build query parameters
        const params = new URLSearchParams({
            page: '1',
            destinationCityId: tourDestinationCity.toString()
        });

        // Add optional parameters
        if (tourDepartureDate) {
            params.append('departureDate', tourDepartureDate.format('YYYY-MM-DD'));
        }

        // Add price range based on selection
        if (tourPriceRange) {
            switch (tourPriceRange) {
                case '1': // Dưới 5 triệu
                    params.append('priceFrom', '0');
                    params.append('priceTo', '5000000');
                    break;
                case '2': // 5-10 triệu
                    params.append('priceFrom', '5000000');
                    params.append('priceTo', '10000000');
                    break;
                case '3': // 10-20 triệu
                    params.append('priceFrom', '10000000');
                    params.append('priceTo', '20000000');
                    break;
                case '4': // Trên 20 triệu
                    params.append('priceFrom', '20000000');
                    params.append('priceTo', '999999999');
                    break;
                default:
                    break;
            }
        }

        navigate(`/tours?${params.toString()}`);
    };

    const renderTourSearch = () => (
        <div className="row g-3 align-items-end">
            <div className="col-md-5" style={{ borderRight: '1px solid #e8e8e8', paddingRight: 20 }}>
                <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                    Bạn muốn đi đâu? <span className="text-danger">*</span>
                </label>
                <Select
                    size="large"
                    bordered={false}
                    placeholder="Chọn địa điểm"
                    suffixIcon={<EnvironmentOutlined className="text-muted" />}
                    className="w-100"
                    showSearch
                    value={tourDestinationCity}
                    onChange={(val) => setTourDestinationCity(val)}
                    filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                >
                    {cities.map((city) => (
                        <Option key={city.id} value={city.id}>
                            {city.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="col-md-3" style={{ borderRight: '1px solid #e8e8e8', paddingRight: 20 }}>
                <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                    Ngày đi
                </label>
                <DatePicker
                    size="large"
                    placeholder="Th 4, 19 thg 11, 2025"
                    className="w-100"
                    format="ddd, DD [thg] MM, YYYY"
                    suffixIcon={<CalendarOutlined />}
                    bordered={false}
                    value={tourDepartureDate}
                    onChange={(date) => setTourDepartureDate(date)}
                />
            </div>
            <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                    Ngân sách
                </label>
                <Select
                    size="large"
                    bordered={false}
                    placeholder="Chọn mức giá"
                    className="w-100"
                    suffixIcon={<DollarOutlined />}
                    value={tourPriceRange}
                    onChange={(value) => setTourPriceRange(value)}
                >
                    <Option value="1">Dưới 5 triệu</Option>
                    <Option value="2">5-10 triệu</Option>
                    <Option value="3">10-20 triệu</Option>
                    <Option value="4">Trên 20 triệu</Option>
                </Select>
            </div>
            <div className="col-md-1">
                <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    className="w-100"
                    style={{ backgroundColor: '#1890ff' }}
                    onClick={() => handleTourSearch()}
                />
            </div>
        </div>
    );

    // hotel date state
    const [checkIn, setCheckIn] = useState(dayjs());
    const [checkOut, setCheckOut] = useState(dayjs().add(1, 'day'));
    const [nights, setNights] = useState(1);
    const [selectedCity, setSelectedCity] = useState(null);

    // guest picker state
    const [guestPanelVisible, setGuestPanelVisible] = useState(false);
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const guestRef = useRef(null);

    // currently-selected combo button
    const [activeCombo, setActiveCombo] = useState(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (guestRef.current && !guestRef.current.contains(e.target)) {
                setGuestPanelVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateNights = (ci, co) => {
        if (ci && co) {
            const diff = co.diff(ci, 'day');
            setNights(diff > 0 ? diff : 1);
        } else {
            setNights(1);
        }
    };

    const onCheckInChange = (date) => {
        const ci = date ? date.startOf('day') : null;
        let co = checkOut;
        if (ci && (!co || !co.isAfter(ci))) {
            co = ci.add(1, 'day');
            setCheckOut(co);
        }
        setCheckIn(ci);
        updateNights(ci, co);
    };

    const onCheckOutChange = (date) => {
        const co = date ? date.startOf('day') : null;
        let ci = checkIn;
        if (co && (!ci || !co.isAfter(ci))) {
            ci = co.subtract(1, 'day');
            setCheckIn(ci);
        }
        setCheckOut(co);
        updateNights(ci, co);
    };

    const handleHotelSearch = () => {
        // Validate required fields
        if (!selectedCity) {
            message.error('Vui lòng chọn địa điểm');
            return;
        }
        if (!checkIn) {
            message.error('Vui lòng chọn ngày nhận phòng');
            return;
        }
        if (!checkOut) {
            message.error('Vui lòng chọn ngày trả phòng');
            return;
        }

        // Navigate with query parameters
        const params = new URLSearchParams({
            checkInDate: checkIn.format('YYYY-MM-DD'),
            checkOutDate: checkOut.format('YYYY-MM-DD'),
            numOfAdult: adults.toString(),
            numOfChild: children.toString(),
            numOfRoom: rooms.toString(),
            page: '1',
            cityId: selectedCity.toString()
        });

        navigate(`/accommodations?${params.toString()}`);
    };

    const handleComboSearch = () => {
        // Validate required fields
        if (!comboDepartureCity) {
            message.error('Vui lòng chọn thành phố đi');
            return;
        }
        if (!comboDestinationCity) {
            message.error('Vui lòng chọn thành phố đến');
            return;
        }

        // Build query parameters
        const params = new URLSearchParams({
            page: '1',
            departureCityId: comboDepartureCity.toString(),
            destinationCityId: comboDestinationCity.toString(),
            numOfAdult: adults.toString(),
            numOfChild: children.toString()
        });

        // Add optional departure date
        if (comboDepartureDate) {
            params.append('departureDate', comboDepartureDate.format('YYYY-MM-DD'));
        }

        navigate(`/combos?${params.toString()}`);
    };

    const renderHotelSearch = () => (
        <div className="row g-3 align-items-end">
            <div style={{ display: 'flex', width: '100%', gap: 16, alignItems: 'end' }}>
                <div style={{ flex: '0 0 30%', maxWidth: '30%', borderRight: '1px solid #e8e8e8', paddingRight: 20 }}>
                    <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                        Địa điểm <span className="text-danger">*</span>
                    </label>
                    <Select
                        size="large"
                        bordered={false}
                        placeholder="Chọn địa điểm"
                        suffixIcon={<EnvironmentOutlined className="text-muted" />}
                        className="w-100"
                        showSearch
                        value={selectedCity}
                        onChange={(value) => setSelectedCity(value)}
                        filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                    >
                        {cities.map((city) => (
                            <Option key={city.id} value={city.id}>
                                {city.name}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ flex: '0 0 40%', maxWidth: '40%', borderRight: '1px solid #e8e8e8', paddingRight: 20 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                                Nhận phòng <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                                size="large"
                                placeholder={dayjs().format('DD/MM/YYYY')}
                                className="w-100"
                                format="DD/MM/YYYY"
                                value={checkIn}
                                onChange={onCheckInChange}
                                bordered={false}
                            />
                        </div>

                        <div style={{ width: 56, display: 'flex', justifyContent: 'center' }}>
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: '50%',
                                    background: '#ffffff',
                                    boxShadow: '0 4px 10px rgba(1, 1, 2, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    gap: 6
                                }}
                            >
                                <span style={{ fontWeight: 700 }}>{nights}</span>
                                <span style={{ fontSize: 14 }}>🌙</span>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                                Trả phòng <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                                size="large"
                                placeholder={dayjs().add(1, 'day').format('DD/MM/YYYY')}
                                className="w-100"
                                format="DD/MM/YYYY"
                                value={checkOut}
                                onChange={onCheckOutChange}
                                bordered={false}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ flex: '1 1 30%', maxWidth: '30%', position: 'relative' }} ref={guestRef}>
                    <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                        Số khách <span className="text-danger">*</span>
                    </label>

                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setGuestPanelVisible((v) => !v)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setGuestPanelVisible((v) => !v);
                        }}
                        className="w-100 d-flex align-items-center"
                        style={{
                            minHeight: 40,
                            padding: '8px 12px',
                            borderRadius: 4,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '1px solid transparent'
                        }}
                    >
                        <div style={{ color: '#555' }}>
                            {rooms} Phòng, {adults + children} Khách
                        </div>
                        <div style={{ color: '#888' }}>
                            <TeamOutlined />
                        </div>
                    </div>

                    {guestPanelVisible && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                left: 0,
                                background: '#fff',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                borderRadius: 8,
                                padding: 12,
                                zIndex: 1200,
                                minWidth: 260
                            }}
                        >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <div style={{ fontWeight: 600 }}>Phòng</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <button
                                        type="button"
                                        onClick={() => setRooms((r) => Math.max(1, r - 1))}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 6,
                                            border: '1px solid #e8e8e8',
                                            background: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        -
                                    </button>
                                    <div style={{ width: 40, textAlign: 'center', fontWeight: 600 }}>{rooms}</div>
                                    <button
                                        type="button"
                                        onClick={() => setRooms((r) => r + 1)}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 6,
                                            border: '1px solid #e8e8e8',
                                            background: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                    <div style={{ fontWeight: 600 }}>Người lớn</div>
                                    <div style={{ fontSize: 12, color: '#888' }}>Từ 12 trở lên</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <button
                                        type="button"
                                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 6,
                                            border: '1px solid #e8e8e8',
                                            background: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        -
                                    </button>
                                    <div style={{ width: 40, textAlign: 'center', fontWeight: 600 }}>{adults}</div>
                                    <button
                                        type="button"
                                        onClick={() => setAdults((a) => a + 1)}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 6,
                                            border: '1px solid #e8e8e8',
                                            background: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <div style={{ fontWeight: 600 }}>Trẻ em</div>
                                    <div style={{ fontSize: 12, color: '#888' }}>Từ 0-11 tuổi</div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <button
                                        type="button"
                                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 6,
                                            border: '1px solid #e8e8e8',
                                            background: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        -
                                    </button>
                                    <div style={{ width: 40, textAlign: 'center', fontWeight: 600 }}>{children}</div>
                                    <button
                                        type="button"
                                        onClick={() => setChildren((c) => c + 1)}
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 6,
                                            border: '1px solid #e8e8e8',
                                            background: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ flex: '0 0 56px' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<SearchOutlined />}
                        className="w-100"
                        onClick={handleHotelSearch}
                        style={{ backgroundColor: '#1890ff' }}
                    />
                </div>
            </div>
        </div>
    );

    const renderComboSearch = () => (
        <div className="row g-3 align-items-end">
            <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                    Từ (thành phố) <span className="text-danger">*</span>
                </label>
                <Select
                    size="large"
                    bordered={false}
                    placeholder="Chọn thành phố đi"
                    suffixIcon={<EnvironmentOutlined className="text-muted" />}
                    className="w-100"
                    showSearch
                    value={comboDepartureCity}
                    onChange={(value) => setComboDepartureCity(value)}
                    filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                >
                    {cities.map((city) => (
                        <Option key={city.id} value={city.id}>
                            {city.name}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                    Đến <span className="text-danger">*</span>
                </label>
                <Select
                    size="large"
                    bordered={false}
                    placeholder="Chọn thành phố đến"
                    suffixIcon={<EnvironmentOutlined className="text-muted" />}
                    className="w-100"
                    showSearch
                    value={comboDestinationCity}
                    onChange={(value) => setComboDestinationCity(value)}
                    filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                >
                    {cities.map((city) => (
                        <Option key={city.id} value={city.id}>
                            {city.name}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                    Ngày đi
                </label>
                <DatePicker
                    size="large"
                    placeholder={dayjs().format('DD/MM/YYYY')}
                    className="w-100"
                    format="DD/MM/YYYY"
                    bordered={false}
                    value={comboDepartureDate}
                    onChange={(date) => setComboDepartureDate(date)}
                />
            </div>

            <div className="col-md-2" style={{ position: 'relative' }} ref={guestRef}>
                <label className="form-label fw-semibold" style={{ marginLeft: 8, marginBottom: 6 }}>
                    Số khách
                </label>
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setGuestPanelVisible((v) => !v)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') setGuestPanelVisible((v) => !v);
                    }}
                    className="w-100 d-flex align-items-center"
                    style={{
                        minHeight: 40,
                        padding: '8px 12px',
                        borderRadius: 4,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid transparent'
                    }}
                >
                    <div style={{ color: '#555' }}>{adults + children} Khách</div>
                    <div style={{ color: '#888' }}>
                        <TeamOutlined />
                    </div>
                </div>

                {guestPanelVisible && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            background: '#fff',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            borderRadius: 8,
                            padding: 12,
                            zIndex: 1200,
                            minWidth: 260
                        }}
                    >
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <div style={{ fontWeight: 600 }}>Người lớn</div>
                                <div style={{ fontSize: 12, color: '#888' }}>Từ 12 trở lên</div>
                            </div>
                            <div className="d-flex align-items-center">
                                <button
                                    type="button"
                                    onClick={() => setAdults((a) => Math.max(1, a - 1))}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 6,
                                        border: '1px solid #e8e8e8',
                                        background: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    -
                                </button>
                                <div style={{ width: 40, textAlign: 'center', fontWeight: 600 }}>{adults}</div>
                                <button
                                    type="button"
                                    onClick={() => setAdults((a) => a + 1)}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 6,
                                        border: '1px solid #e8e8e8',
                                        background: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <div style={{ fontWeight: 600 }}>Trẻ em</div>
                                <div style={{ fontSize: 12, color: '#888' }}>Từ 0-11 tuổi</div>
                            </div>
                            <div className="d-flex align-items-center">
                                <button
                                    type="button"
                                    onClick={() => setChildren((c) => Math.max(0, c - 1))}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 6,
                                        border: '1px solid #e8e8e8',
                                        background: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    -
                                </button>
                                <div style={{ width: 40, textAlign: 'center', fontWeight: 600 }}>{children}</div>
                                <button
                                    type="button"
                                    onClick={() => setChildren((c) => c + 1)}
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 6,
                                        border: '1px solid #e8e8e8',
                                        background: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="col-md-1">
                <Button
                    type="primary"
                    size="large"
                    icon={<SearchOutlined />}
                    className="w-100"
                    style={{ backgroundColor: '#1890ff' }}
                    onClick={handleComboSearch}
                />
            </div>
        </div>
    );

    const renderSearchContent = () => {
        switch (activeTab) {
            case 'tour':
                return renderTourSearch();
            case 'hotel':
                return renderHotelSearch();
            case 'combo':
                return renderComboSearch();
            default:
                return renderTourSearch();
        }
    };

    return (
        <div className="w-100">
            {/* Tabs (centered, underline for active) */}
            <div
                className="d-flex justify-content-center"
                style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: 0, marginBottom: 16 }}
            >
                <div style={{ display: 'flex', gap: 24 }} role="tablist" aria-label="Search categories">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                role="tab"
                                aria-selected={isActive}
                                className="bg-transparent"
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    color: isActive ? '#1890ff' : '#444',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    borderBottom: isActive ? '3px solid #1890ff' : '3px solid transparent',
                                    transition: 'color 0.18s, border-bottom 0.18s'
                                }}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center' }}>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Nội dung form */}
            <div>{renderSearchContent()}</div>
        </div>
    );
};

export default HomePageSearchBtn;

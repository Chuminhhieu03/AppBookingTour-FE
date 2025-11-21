import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Button, Popover, Divider } from 'antd';
import { SearchOutlined, CalendarOutlined, UserOutlined, HomeOutlined, EditOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Constants from '../../../Constants/Constants';

const { RangePicker } = DatePicker;

const BookingSearchBar = ({ initialFilters, onFilterChange }) => {
    // States
    const [isEditing, setIsEditing] = useState(false);
    const [dateRange, setDateRange] = useState([null, null]);
    const [numOfAdult, setNumOfAdult] = useState(Constants.GuestLimits.MIN_ADULTS);
    const [numOfChild, setNumOfChild] = useState(Constants.GuestLimits.MIN_CHILDREN);
    const [numOfRoom, setNumOfRoom] = useState(Constants.GuestLimits.MIN_ROOMS);
    const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
    const containerRef = useRef(null);

    // Handle increase/decrease functions
    const handleIncrease = (type) => {
        switch (type) {
            case 'adult':
                if (numOfAdult < Constants.GuestLimits.MAX_GUESTS) setNumOfAdult(numOfAdult + 1);
                break;
            case 'child':
                if (numOfChild < Constants.GuestLimits.MAX_GUESTS) setNumOfChild(numOfChild + 1);
                break;
            case 'room':
                if (numOfRoom < Constants.GuestLimits.MAX_ROOMS) setNumOfRoom(numOfRoom + 1);
                break;
        }
    };

    const handleDecrease = (type) => {
        switch (type) {
            case 'adult':
                if (numOfAdult > Constants.GuestLimits.MIN_ADULTS) setNumOfAdult(numOfAdult - 1);
                break;
            case 'child':
                if (numOfChild > Constants.GuestLimits.MIN_CHILDREN) setNumOfChild(numOfChild - 1);
                break;
            case 'room':
                if (numOfRoom > Constants.GuestLimits.MIN_ROOMS) setNumOfRoom(numOfRoom - 1);
                break;
        }
    };

    // Handle search
    const handleSearch = () => {
        const filter = {
            checkInDate: dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : null,
            checkOutDate: dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : null,
            numOfAdult,
            numOfChild,
            numOfRoom
        };

        onFilterChange(filter);
        setIsEditing(false);
        setGuestPopoverOpen(false);
    };

    // Handle date range change
    const handleDateRangeChange = (dates) => {
        setDateRange(dates || [null, null]);
    };

    // Validate date range
    const disabledDate = (current) => {
        return current && current.isBefore(dayjs(), 'day');
    };

    // Calculate number of nights
    const calculateNights = () => {
        if (dateRange[0] && dateRange[1]) {
            const nights = dateRange[1].diff(dateRange[0], 'day');
            return nights > 0 ? ` (${nights} đêm)` : '';
        }
        return '';
    };

    // Format date display
    const formatDateDisplay = () => {
        if (dateRange[0] && dateRange[1]) {
            return `${dateRange[0].format('DD/MM')} - ${dateRange[1].format('DD/MM')}${calculateNights()}`;
        }
        return 'Chọn ngày';
    };

    // Format guest display
    const formatGuestDisplay = () => {
        let text = `${numOfAdult} Người lớn`;
        if (numOfChild > 0) text += `, ${numOfChild} Trẻ em`;
        text += `, ${numOfRoom} Phòng`;
        return text;
    };

    // Counter component for guest selection
    const CounterRow = ({ label, value, onIncrease, onDecrease, min = 0 }) => (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0'
            }}
        >
            <span style={{ fontSize: '14px' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button size="small" shape="circle" icon={<MinusOutlined />} onClick={onDecrease} disabled={value <= min} />
                <span
                    style={{
                        minWidth: '30px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}
                >
                    {value}
                </span>
                <Button
                    size="small"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={onIncrease}
                    disabled={value >= Constants.GuestLimits.MAX_GUESTS}
                />
            </div>
        </div>
    );

    // Guest selection popover content
    const guestPopoverContent = (
        <div style={{ width: '250px', padding: '8px' }}>
            <CounterRow
                label="Người lớn"
                value={numOfAdult}
                onIncrease={() => handleIncrease('adult')}
                onDecrease={() => handleDecrease('adult')}
                min={Constants.GuestLimits.MIN_ADULTS}
            />
            <Divider style={{ margin: '8px 0' }} />
            <CounterRow
                label="Trẻ em"
                value={numOfChild}
                onIncrease={() => handleIncrease('child')}
                onDecrease={() => handleDecrease('child')}
                min={Constants.GuestLimits.MIN_CHILDREN}
            />
            <Divider style={{ margin: '8px 0' }} />
            <CounterRow
                label="Số phòng"
                value={numOfRoom}
                onIncrease={() => handleIncrease('room')}
                onDecrease={() => handleDecrease('room')}
                min={Constants.GuestLimits.MIN_ROOMS}
            />
        </div>
    );

    // Set initial values
    useEffect(() => {
        if (initialFilters) {
            setNumOfAdult(initialFilters.numOfAdult || Constants.GuestLimits.MIN_ADULTS);
            setNumOfChild(initialFilters.numOfChild || Constants.GuestLimits.MIN_CHILDREN);
            setNumOfRoom(initialFilters.numOfRoom || Constants.GuestLimits.MIN_ROOMS);

            if (initialFilters.checkInDate && initialFilters.checkOutDate) {
                setDateRange([dayjs(initialFilters.checkInDate), dayjs(initialFilters.checkOutDate)]);
            }
        }
    }, [initialFilters]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside container
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // Check if click is on a popover or date picker
                const isPopoverClick =
                    event.target.closest('.ant-popover') ||
                    event.target.closest('.ant-picker-dropdown') ||
                    event.target.closest('.ant-picker-panel');

                if (!isPopoverClick) {
                    setIsEditing(false);
                    setGuestPopoverOpen(false);
                }
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);

    return (
        <div
            ref={containerRef}
            style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '12px 24px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                maxWidth: '100%',
                overflow: 'hidden'
            }}
        >
            {/* Date Section */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1 1 200px',
                    minWidth: '200px'
                }}
            >
                <CalendarOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                {isEditing ? (
                    <RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        placeholder={['Nhận phòng', 'Trả phòng']}
                        format="DD/MM/YYYY"
                        disabledDate={disabledDate}
                        separator="→"
                        style={{
                            border: 'none',
                            boxShadow: 'none',
                            width: '100%',
                            minWidth: '250px'
                        }}
                        size="large"
                        getPopupContainer={(trigger) => trigger.parentNode}
                        placement="topRight"
                    />
                ) : (
                    <span
                        style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            color: '#333'
                        }}
                        onClick={() => setIsEditing(true)}
                    >
                        {formatDateDisplay()}
                    </span>
                )}
            </div>

            {/* Divider - Hide on mobile when wrapped */}
            {!isEditing && (
                <div
                    style={{
                        width: '1px',
                        height: '30px',
                        backgroundColor: '#e8e8e8',
                        display: window.innerWidth > 768 ? 'block' : 'none'
                    }}
                />
            )}

            {/* Guest & Room Section */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '1 1 200px',
                    minWidth: '200px'
                }}
            >
                <UserOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                <Popover
                    content={guestPopoverContent}
                    title="Chọn số lượng"
                    trigger="click"
                    open={isEditing && guestPopoverOpen}
                    onOpenChange={(open) => {
                        if (isEditing) {
                            setGuestPopoverOpen(open);
                        }
                    }}
                    placement="bottomLeft"
                >
                    <span
                        style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            color: '#333'
                        }}
                        onClick={() => {
                            if (isEditing) {
                                setGuestPopoverOpen(!guestPopoverOpen);
                            } else {
                                setIsEditing(true);
                            }
                        }}
                    >
                        {formatGuestDisplay()}
                    </span>
                </Popover>
            </div>

            {/* Action Buttons */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: '0 0 auto'
                }}
            >
                {isEditing ? (
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                        style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                ) : (
                    <Button
                        shape="circle"
                        size="large"
                        icon={<EditOutlined />}
                        onClick={() => setIsEditing(true)}
                        style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #d9d9d9'
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default BookingSearchBar;

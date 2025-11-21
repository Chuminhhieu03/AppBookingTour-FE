import { useState, useMemo } from 'react';
import { Card, Button, Badge, Modal, Tag, Space, Typography } from 'antd';
import { LeftOutlined, RightOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const { Title, Text } = Typography;

/**
 * LOGIC NGHIỆP VỤ - ComboScheduleCalendar
 *
 * Mục đích: Hiển thị lịch khởi hành của combo với giá theo từng ngày
 *
 * Cách hoạt động:
 * 1. Nhận danh sách schedules từ API (mỗi schedule có: departureDate, returnDate, prices, availableSlots, status)
 * 2. Lọc chỉ hiển thị các schedule có status = "Available" và ngày khởi hành >= hôm nay
 * 3. Nhóm schedules theo tháng để hiển thị các nút chọn tháng
 * 4. Render lịch dạng grid 7x6 (7 cột = 7 ngày trong tuần, 6 hàng = tối đa 6 tuần)
 * 5. Mỗi ô ngày có schedule sẽ hiển thị giá người lớn (ví dụ: "5.500K")
 * 6. Click vào ô ngày → Mở modal hiển thị đầy đủ thông tin schedule
 * 7. Trong modal: Hiển thị departure/return date, giá người lớn/trẻ em, phụ thu phòng đơn, số chỗ
 * 8. Click "Tiếp tục đặt tour" → Gọi onScheduleSelect(schedule) → Update sidebar → Navigate sang booking page
 *
 * State management:
 * - currentMonth: Tháng đang xem (dayjs object)
 * - modalVisible: Hiển thị/ẩn modal chi tiết
 * - selectedSchedule: Schedule được chọn để hiển thị trong modal
 */

const ComboScheduleCalendar = ({ schedules, selectedSchedule, onScheduleSelect }) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [modalVisible, setModalVisible] = useState(false);
    const [scheduleForModal, setScheduleForModal] = useState(null);

    // Lọc và nhóm schedules theo tháng (chỉ lấy schedule Available và ngày >= hôm nay)
    const schedulesByMonth = useMemo(() => {
        const grouped = {};
        (schedules || []).forEach((schedule) => {
            const departureDate = dayjs(schedule.departureDate);
            // Chỉ lấy schedule trong tương lai và có trạng thái Available
            if ((departureDate.isAfter(dayjs(), 'day') || departureDate.isSame(dayjs(), 'day')) && schedule.status === 'Available') {
                const monthKey = departureDate.format('YYYY-MM');
                if (!grouped[monthKey]) {
                    grouped[monthKey] = [];
                }
                grouped[monthKey].push(schedule);
            }
        });
        return grouped;
    }, [schedules]);

    // Tạo map từ ngày -> schedule để tra cứu nhanh khi render
    const schedulesByDate = useMemo(() => {
        const map = {};
        (schedules || []).forEach((schedule) => {
            const departureDate = dayjs(schedule.departureDate);
            if ((departureDate.isAfter(dayjs(), 'day') || departureDate.isSame(dayjs(), 'day')) && schedule.status === 'Available') {
                const dateKey = departureDate.format('YYYY-MM-DD');
                map[dateKey] = schedule;
            }
        });
        return map;
    }, [schedules]);

    // Danh sách các tháng có schedule
    const availableMonths = useMemo(() => {
        return Object.keys(schedulesByMonth)
            .sort()
            .map((key) => dayjs(key, 'YYYY-MM'));
    }, [schedulesByMonth]);

    // Tạo lịch grid cho tháng hiện tại
    const calendarGrid = useMemo(() => {
        const startOfMonth = currentMonth.startOf('month');
        const endOfMonth = currentMonth.endOf('month');
        const startDay = startOfMonth.day(); // 0 = CN, 1 = T2, ...
        const daysInMonth = currentMonth.daysInMonth();

        const grid = [];
        let currentWeek = [];

        // Thêm các ô trống trước ngày 1
        for (let i = 0; i < startDay; i++) {
            currentWeek.push(null);
        }

        // Thêm các ngày trong tháng
        for (let day = 1; day <= daysInMonth; day++) {
            const date = currentMonth.date(day);
            currentWeek.push(date);

            if (currentWeek.length === 7) {
                grid.push(currentWeek);
                currentWeek = [];
            }
        }

        // Thêm các ô trống sau ngày cuối
        if (currentWeek.length > 0) {
            while (currentWeek.length < 7) {
                currentWeek.push(null);
            }
            grid.push(currentWeek);
        }

        return grid;
    }, [currentMonth]);

    // Xử lý click vào ngày
    const handleDateClick = (date, schedule) => {
        if (!schedule) return;
        setScheduleForModal(schedule);
        setModalVisible(true);
    };

    // Xác nhận chọn schedule
    const handleConfirmSchedule = () => {
        if (scheduleForModal) {
            onScheduleSelect(scheduleForModal);
        }
        setModalVisible(false);
    };

    // Navigation tháng
    const handlePrevMonth = () => {
        const prevMonth = currentMonth.subtract(1, 'month');
        const isAvailable = availableMonths.some((m) => m.isSame(prevMonth, 'month'));
        if (isAvailable) {
            setCurrentMonth(prevMonth);
        }
    };

    const handleNextMonth = () => {
        const nextMonth = currentMonth.add(1, 'month');
        const isAvailable = availableMonths.some((m) => m.isSame(nextMonth, 'month'));
        if (isAvailable) {
            setCurrentMonth(nextMonth);
        }
    };

    const hasPrev = availableMonths.some((m) => m.isBefore(currentMonth, 'month'));
    const hasNext = availableMonths.some((m) => m.isAfter(currentMonth, 'month'));

    return (
        <>
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CalendarOutlined style={{ color: '#04a9f5', fontSize: 20 }} />
                        <span style={{ fontSize: 20, fontWeight: 'bold' }}>LỊCH KHỞI HÀNH & GIÁ TOUR</span>
                    </div>
                }
                style={{ marginBottom: 24 }}
            >
                {/* Month Selector */}
                <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ fontSize: 15 }}>
                        Chọn tháng:
                    </Text>
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {availableMonths.map((month) => (
                            <Button
                                key={month.format('YYYY-MM')}
                                type={currentMonth.isSame(month, 'month') ? 'primary' : 'default'}
                                onClick={() => setCurrentMonth(month)}
                                style={{
                                    borderRadius: 6,
                                    fontWeight: currentMonth.isSame(month, 'month') ? 'bold' : 'normal'
                                }}
                            >
                                Tháng {month.format('MM/YYYY')}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Calendar Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 0',
                        borderBottom: '2px solid #E2E8F0'
                    }}
                >
                    <Button icon={<LeftOutlined />} onClick={handlePrevMonth} disabled={!hasPrev} type="text" size="large" />
                    <Title level={4} style={{ margin: 0, color: '#04a9f5' }}>
                        Tháng {currentMonth.format('MM/YYYY')}
                    </Title>
                    <Button icon={<RightOutlined />} onClick={handleNextMonth} disabled={!hasNext} type="text" size="large" />
                </div>

                {/* Calendar Grid */}
                <div style={{ marginTop: 16 }}>
                    {/* Day headers */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(7, 1fr)',
                            gap: 8,
                            marginBottom: 8
                        }}
                    >
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
                            <div
                                key={day}
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: '#64748B',
                                    padding: '8px 0',
                                    fontSize: 14
                                }}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar body */}
                    {calendarGrid.map((week, weekIndex) => (
                        <div
                            key={weekIndex}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: 8,
                                marginBottom: 8
                            }}
                        >
                            {week.map((date, dayIndex) => {
                                if (!date) {
                                    return <div key={dayIndex} />;
                                }

                                const dateKey = date.format('YYYY-MM-DD');
                                const schedule = schedulesByDate[dateKey];
                                const isToday = date.isSame(dayjs(), 'day');
                                const isPast = date.isBefore(dayjs(), 'day');
                                const hasSchedule = !!schedule;

                                return (
                                    <div
                                        key={dayIndex}
                                        onClick={() => hasSchedule && handleDateClick(date, schedule)}
                                        style={{
                                            minHeight: 80,
                                            padding: 8,
                                            border: isToday ? '2px solid #04a9f5' : '1px solid #E2E8F0',
                                            borderRadius: 8,
                                            cursor: hasSchedule ? 'pointer' : 'default',
                                            backgroundColor: isPast ? '#F8F9FA' : hasSchedule ? '#d4f4ff' : '#fff',
                                            transition: 'all 0.3s',
                                            opacity: isPast ? 0.5 : 1,
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (hasSchedule) {
                                                e.currentTarget.style.backgroundColor = '#9ae7ff';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(4, 169, 245, 0.3)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (hasSchedule) {
                                                e.currentTarget.style.backgroundColor = '#d4f4ff';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 16,
                                                fontWeight: isToday ? 'bold' : 'normal',
                                                color: isPast ? '#94A3B8' : '#2C3E50',
                                                marginBottom: 4
                                            }}
                                        >
                                            {date.date()}
                                        </div>
                                        {hasSchedule && (
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 'bold',
                                                    color: '#04a9f5',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {(schedule.basePriceAdult / 1000).toLocaleString('vi-VN')}K
                                            </div>
                                        )}
                                        {isToday && (
                                            <Badge
                                                status="processing"
                                                text="Hôm nay"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 4,
                                                    left: 4,
                                                    fontSize: 10
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div style={{ marginTop: 16, padding: 12, background: '#e6f7ff', borderRadius: 8 }}>
                    <Space direction="vertical" size={4}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            💡 <strong>Hướng dẫn:</strong>
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            • Giá hiển thị là giá cho <strong>1 người lớn</strong> (đơn vị: 1.000đ)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            • Click vào ô có giá để xem chi tiết và đặt tour
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            • Ô màu xanh: Có lịch khởi hành | Ô màu xám: Đã qua hoặc không có lịch
                        </Text>
                    </Space>
                </div>
            </Card>

            {/* Schedule Detail Modal */}
            <Modal
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={handleConfirmSchedule}
                okText="Tiếp tục đặt tour"
                cancelText="Đóng"
                width={600}
                okButtonProps={{
                    size: 'large',
                    style: { background: '#04a9f5', borderColor: '#04a9f5', fontWeight: 'bold' }
                }}
                cancelButtonProps={{ size: 'large' }}
            >
                {scheduleForModal && (
                    <div style={{ padding: '16px 0' }}>
                        <Title level={4} style={{ marginBottom: 20, color: '#04a9f5' }}>
                            <CalendarOutlined /> Chi tiết lịch khởi hành
                        </Title>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ background: '#F8F9FA', padding: 16, borderRadius: 8 }}>
                                <Text strong style={{ fontSize: 14 }}>
                                    Ngày khởi hành:
                                </Text>
                                <div style={{ fontSize: 18, color: '#04a9f5', fontWeight: 'bold', marginTop: 4 }}>
                                    {dayjs(scheduleForModal.departureDate).format('dddd, DD/MM/YYYY')}
                                </div>
                            </div>
                            <div style={{ background: '#F8F9FA', padding: 16, borderRadius: 8 }}>
                                <Text strong style={{ fontSize: 14 }}>
                                    Ngày về:
                                </Text>
                                <div style={{ fontSize: 18, color: '#04a9f5', fontWeight: 'bold', marginTop: 4 }}>
                                    {dayjs(scheduleForModal.returnDate).format('dddd, DD/MM/YYYY')}
                                </div>
                            </div>
                            <div style={{ background: '#e6f7ff', padding: 16, borderRadius: 8, border: '2px solid #04a9f5' }}>
                                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text strong style={{ fontSize: 15 }}>
                                            Giá người lớn:
                                        </Text>
                                        <Text style={{ fontSize: 22, color: '#04a9f5', fontWeight: 'bold' }}>
                                            {scheduleForModal.basePriceAdult.toLocaleString('vi-VN')} ₫
                                        </Text>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text strong style={{ fontSize: 15 }}>
                                            Giá trẻ em:
                                        </Text>
                                        <Text style={{ fontSize: 20, color: '#04a9f5', fontWeight: 'bold' }}>
                                            {scheduleForModal.basePriceChildren.toLocaleString('vi-VN')} ₫
                                        </Text>
                                    </div>
                                    {scheduleForModal.singleRoomSupplement > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text strong style={{ fontSize: 14 }}>
                                                Phụ thu phòng đơn:
                                            </Text>
                                            <Text style={{ fontSize: 16, color: '#64748B', fontWeight: 'bold' }}>
                                                +{scheduleForModal.singleRoomSupplement.toLocaleString('vi-VN')} ₫
                                            </Text>
                                        </div>
                                    )}
                                </Space>
                            </div>
                            <div>
                                <Text strong style={{ fontSize: 14 }}>
                                    Số chỗ còn lại:
                                </Text>
                                <div style={{ marginTop: 8 }}>
                                    <Tag
                                        color={
                                            scheduleForModal.availableSlots > 10
                                                ? 'success'
                                                : scheduleForModal.availableSlots > 5
                                                  ? 'warning'
                                                  : 'error'
                                        }
                                        icon={<TeamOutlined />}
                                        style={{ fontSize: 16, padding: '6px 16px' }}
                                    >
                                        Còn {scheduleForModal.availableSlots} chỗ
                                    </Tag>
                                </div>
                            </div>
                        </Space>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default ComboScheduleCalendar;

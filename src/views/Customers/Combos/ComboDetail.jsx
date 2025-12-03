import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Spin, message, Result, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import comboAPI from 'api/combo/comboAPI';
import ComboBreadcrumb from './components/ComboBreadcrumb';
import ComboGallery from './components/ComboGallery';
import ComboScheduleCalendar from './components/ComboScheduleCalendar';
import ComboInfoGrid from './components/ComboInfoGrid';
import ComboItinerary from './components/ComboItinerary';
import ComboImportantInfo from './components/ComboImportantInfo';
import RelatedCombos from './components/RelatedCombos';
import StickyBookingSidebar from './components/StickyBookingSidebar';

const ComboDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [combo, setCombo] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchComboDetail();
    }, [id]);

    const fetchComboDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await comboAPI.getById(id);

            if (response.success) {
                setCombo(response.data);
                // Auto select first available schedule
                const availableSchedules =
                    response.data.schedules?.filter((s) => new Date(s.departureDate) >= new Date() && s.status === 'Available') || [];
                if (availableSchedules.length > 0) {
                    setSelectedSchedule(availableSchedules[0]);
                }
            } else {
                setError(response.message || 'Không thể tải thông tin combo');
            }
        } catch (error) {
            console.error('Error fetching combo:', error);
            setError('Đã xảy ra lỗi khi tải thông tin combo');
            message.error('Không thể tải thông tin combo');
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule(schedule);
        // Scroll to booking section
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleBookNow = () => {
        if (!selectedSchedule) {
            message.warning('Vui lòng chọn ngày khởi hành');
            return;
        }
        navigate(`/booking/combo/${id}?scheduleId=${selectedSchedule.id}`);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" tip="Đang tải thông tin combo..." />
            </div>
        );
    }

    if (error || !combo) {
        return (
            <div style={{ padding: '60px 24px', maxWidth: 600, margin: '0 auto' }}>
                <Result
                    status="404"
                    title="Không tìm thấy combo"
                    subTitle={error || 'Combo bạn tìm kiếm không tồn tại hoặc đã bị xóa'}
                    extra={[
                        <Button type="primary" key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/combos')}>
                            Quay lại danh sách
                        </Button>
                    ]}
                />
            </div>
        );
    }

    return (
        <div style={{ background: '#F5F7FA' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
                {/* Breadcrumb */}
                <ComboBreadcrumb combo={combo} />

                {/* Gallery & Title */}
                <ComboGallery
                    title={combo.name}
                    code={combo.code}
                    coverImage={combo.comboImageCoverUrl}
                    images={combo.comboImages || []}
                    rating={combo.rating}
                    totalBookings={combo.totalBookings}
                    fromCity={combo.fromCityName}
                    toCity={combo.toCityName}
                />

                {/* Main Content */}
                <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                    {/* Left Column - Main Content */}
                    <Col xs={24} lg={16}>
                        {/* Schedule Calendar */}
                        <ComboScheduleCalendar
                            schedules={combo.schedules || []}
                            selectedSchedule={selectedSchedule}
                            onScheduleSelect={handleScheduleSelect}
                        />

                        {/* Info Grid */}
                        <ComboInfoGrid combo={combo} />

                        {/* Itinerary */}
                        {/* <ComboItinerary comboId={combo.id} durationDays={combo.durationDays} description={combo.description} /> */}

                        {/* Important Info */}
                        <ComboImportantInfo combo={combo} />

                        {/* Related Combos */}
                        <RelatedCombos currentComboId={combo.id} fromCityId={combo.fromCityId} toCityId={combo.toCityId} />
                    </Col>

                    {/* Right Column - Sticky Booking Sidebar */}
                    <Col xs={24} lg={8}>
                        <StickyBookingSidebar combo={combo} selectedSchedule={selectedSchedule} onBookNow={handleBookNow} />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ComboDetail;

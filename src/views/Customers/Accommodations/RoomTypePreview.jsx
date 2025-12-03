import {
    BankOutlined,
    BorderOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    EyeOutlined,
    FieldTimeOutlined,
    HomeOutlined,
    HourglassOutlined,
    LayoutOutlined,
    MoneyCollectOutlined,
    TeamOutlined
} from '@ant-design/icons';
import LoadingModal from 'components/LoadingModal';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Utility from 'src/Utils/Utility';
import Constants from '../../../Constants/Constants';
import { roomTypeAPI } from 'api/accommodation/roomTypeAPI';

export default function RoomTypePreview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isHotelExpanded, setIsHotelExpanded] = useState(true);
    const [isTaxExpanded, setIsTaxExpanded] = useState(true);
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [roomType, setRoomType] = useState(null);
    const [accommodation, setAccommodation] = useState(null);

    useEffect(() => {
        LoadingModal.showLoading();
        try {
            const fetchRoomTypePreview = async () => {
                const res = await roomTypeAPI.getPreviewById(id);
                console.log(res);
                setRoomType(res.roomType || {});
                setAccommodation(res.accommodation || {});
            };
            fetchRoomTypePreview();
        } catch (error) {
            console.error('Error fetching room type preview:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    navigate(`/accommodations/${id}`);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [id, navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const getViewNames = (viewIds) => {
        if (!viewIds) return 'Không có thông tin';
        const ids = viewIds.split(',').map((id) => parseInt(id.trim()));
        const viewNames = ids
            .map((id) => {
                const view = Constants.RoomViewOptions.find((v) => v.value === id);
                return view ? view.label : '';
            })
            .filter(Boolean);
        return viewNames.length > 0 ? viewNames.join(', ') : 'Không có thông tin';
    };

    return (
        <div className="container my-4">
            <h2 style={{ color: '#0b52afff', fontWeight: 700 }} className="text-center mb-5">
                THÔNG TIN CHI TIẾT KHÁCH SẠN
            </h2>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div
                        className="p-4 mb-4"
                        style={{
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                        }}
                    >
                        <h5 className="fw-bold mb-3" style={{ color: '#0f67daff' }}>
                            Thông tin khách sạn:
                        </h5>

                        <div className="d-flex flex-wrap align-items-center gap-4">
                            <div className="d-flex align-items-center gap-2">
                                <EnvironmentOutlined /> {accommodation?.name}
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <CalendarOutlined /> 07-12-2025 → 08-12-2025
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <LayoutOutlined />1 phòng
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <TeamOutlined /> 1 người lớn
                            </div>
                        </div>
                    </div>

                    <div
                        className="p-3"
                        style={{
                            background: '#fff',
                            borderRadius: 12,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '1px solid rgba(0, 89, 206, 1)'
                        }}
                    >
                        <div className="row g-4 align-items-center">
                            <div className="col-md-3">
                                <img src={roomType?.coverImageUrl} className="img-fluid rounded" alt="room" />
                            </div>

                            <div className="col-md-9">
                                <div className="row">
                                    <div className="col-md-7">
                                        <h5 className="fw-bold mb-1">{roomType?.name}</h5>
                                        <div className="text-warning fs-5">★★★★★</div>
                                        <div className="mt-2 small text-secondary">
                                            <TeamOutlined /> {roomType?.maxChildren + roomType?.maxAdult} Người &nbsp; &nbsp;
                                            <BorderOutlined /> {roomType?.area}m² &nbsp; &nbsp;
                                            <EyeOutlined /> {getViewNames(roomType?.view)}
                                        </div>

                                        <div className="mt-3 small">
                                            <div className="mb-2">
                                                <FieldTimeOutlined /> Nhận phòng: 07-12-2025, 14:00
                                            </div>
                                            <div>
                                                <FieldTimeOutlined /> Trả phòng: 08-12-2025, 12:00
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-5 d-flex flex-column align-items-center gap-3">
                                        <div
                                            className="d-flex align-items-center gap-2"
                                            style={{
                                                background: '#d1e1ffff',
                                                padding: '8px 16px',
                                                borderRadius: 5,
                                                fontSize: 14,
                                                color: '#D80000',
                                                height: '40px'
                                            }}
                                        >
                                            <HourglassOutlined />
                                            <span>
                                                Thời gian giữ giá: <strong>{formatTime(timeLeft)}</strong>
                                            </span>
                                        </div>

                                        <div className="text-center">
                                            <div
                                                style={{
                                                    color: '#D80000',
                                                    fontSize: 24,
                                                    fontWeight: 700
                                                }}
                                            >
                                                {Utility.formatPrice(roomType?.price || 0)}
                                            </div>
                                            <div className="small text-secondary">{Utility.formatPrice(roomType?.price || 0)} ₫ × 1 Đêm × 1 Phòng</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div
                        className="p-0"
                        style={{
                            borderRadius: 12,
                            background: '#fff',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                        }}
                    >
                        <div
                            className="fw-bold px-3 py-3"
                            style={{
                                background: '#0b52afff',
                                color: '#fff',
                                borderTopLeftRadius: 12,
                                borderTopRightRadius: 12,
                                fontSize: 18
                            }}
                        >
                            Tóm tắt đơn hàng
                        </div>

                        <div className="p-4">
                            <div className="d-flex flex-column gap-2 pb-3">
                                <div
                                    className="fw-bold d-flex justify-content-between align-items-center"
                                    style={{ color: '#0b52afff', fontSize: 16, cursor: 'pointer' }}
                                    onClick={() => setIsHotelExpanded(!isHotelExpanded)}
                                >
                                    <span>
                                        <HomeOutlined /> Khách sạn
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            transition: 'transform 0.3s ease',
                                            transform: isHotelExpanded ? 'rotate(0deg)' : 'rotate(-180deg)',
                                            display: 'inline-block'
                                        }}
                                    >
                                        ▼
                                    </span>
                                </div>

                                <div
                                    style={{
                                        maxHeight: isHotelExpanded ? '500px' : '0',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.4s ease, opacity 0.3s ease',
                                        opacity: isHotelExpanded ? 1 : 0
                                    }}
                                >
                                    <div style={{ fontSize: 14, marginTop: '8px' }}>
                                        {accommodation?.name} - 1 Đêm
                                    </div>
                                    <div style={{ fontSize: 14 }} className="text-secondary">
                                        Chủ Nhật, 7/12/2025 – Thứ Hai, 8/12/2025
                                    </div>

                                    <div style={{ fontSize: 14, marginTop: '8px' }}>{roomType?.name}</div>

                                    <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                                        <span style={{ fontSize: 14 }}>Giá (1 phòng x 1 đêm)</span>
                                        <span className="fw-bold" style={{ fontSize: 16 }}>
                                            {Utility.formatPrice(roomType?.price || 0)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr style={{ margin: '16px 0' }} />

                            <div className="d-flex flex-column gap-2">
                                <div
                                    className="fw-bold d-flex justify-content-between align-items-center"
                                    style={{ color: '#0b52afff', fontSize: 16, cursor: 'pointer' }}
                                    onClick={() => setIsTaxExpanded(!isTaxExpanded)}
                                >
                                    <span>
                                        {' '}
                                        <MoneyCollectOutlined />
                                        Thuế, phí, các dịch vụ khác
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 12,
                                            transition: 'transform 0.3s ease',
                                            transform: isTaxExpanded ? 'rotate(0deg)' : 'rotate(-180deg)',
                                            display: 'inline-block'
                                        }}
                                    >
                                        ▼
                                    </span>
                                </div>

                                <div
                                    style={{
                                        maxHeight: isTaxExpanded ? '200px' : '0',
                                        overflow: 'hidden',
                                        transition: 'max-height 0.4s ease, opacity 0.3s ease',
                                        opacity: isTaxExpanded ? 1 : 0
                                    }}
                                >
                                    <div className="d-flex justify-content-between" style={{ fontSize: 14, marginTop: '8px' }}>
                                        <span>Thuế GTGT:</span>
                                        <span className="fw-bold">{Utility.formatPrice(roomType?.price * roomType?.vat / 100) || 0}</span>
                                    </div>

                                    <div className="d-flex justify-content-between" style={{ fontSize: 14, marginTop: '8px' }}>
                                        <span>Phụ thu quản trị:</span>
                                        <span className="fw-bold">{Utility.formatPrice(roomType?.price * roomType?.managementFee / 100) || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-4 pt-3"
                            style={{
                                borderBottomLeftRadius: 12,
                                borderBottomRightRadius: 12
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-bold" style={{ fontSize: 16 }}>
                                    Tổng cộng:
                                </span>
                                <span className="fw-bold" style={{ color: '#d80000', fontSize: 24 }}>
                                    1.438.342 ₫
                                </span>
                            </div>

                            <button
                                className="btn w-100"
                                style={{
                                    background: '#d80000',
                                    color: '#fff',
                                    fontWeight: 600,
                                    padding: '10px 0',
                                    borderRadius: 10,
                                    fontSize: 16,
                                    border: 'none'
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

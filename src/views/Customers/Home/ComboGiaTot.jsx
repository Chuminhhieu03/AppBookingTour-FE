import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import comboAPI from 'api/combo/comboAPI';
import './ComboGiaTot.css';
import LoadingModal from 'components/LoadingModal';
import Utility from 'src/Utils/Utility';
import Constants from 'Constants/Constants';

export default function ComboGiaTot() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [combos, setCombos] = useState([]);

    useEffect(() => {
        // Fetch combo data from API or define statically
        const fetchCombos = async () => {
            try {
                const res = await comboAPI.getFeaturedCombos();
                setCombos(res.data || []);
                console.log(res.data);
            } catch (error) {
                console.error('Error fetching combos:', error);
            }
        };
        fetchCombos();
    }, []);

    const filteredCombos = combos.filter((c) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'plane') return c.transport === 'Máy bay';
        if (activeFilter === 'car') return c.transport === 'Xe';
        return true;
    });

    return (
        <div style={{ background: '#dbf0ff', padding: '40px 8%' }}>
            <h2 className="text-center mb-2" style={{ fontWeight: 700, color: '#004E9A' }}>
                COMBO GIÁ TỐT
            </h2>
            <div style={{ width: 100, height: 4, backgroundColor: '#004E9A', borderRadius: 4, margin: '0 auto 30px auto' }}></div>

            <div className="d-flex justify-content-center">
                <p className="text-center w-75" style={{ marginBottom: 40, fontWeight: 600, fontSize: 18 }}>
                    Với sự hợp tác giảm giá ưu đãi cùng hệ thống đối tác lớn, chúng tôi tự tin mang đến cho quý khách combo vé máy bay và
                    khách sạn với giá tốt nhất!
                </p>
            </div>

            {/* Filter Buttons */}
            <div className="d-flex justify-content-center gap-3 flex-wrap" style={{ marginBottom: 30 }}>
                {[
                    { key: 'all', label: 'Tất cả' },
                    { key: 'plane', label: 'Máy bay + khách sạn' },
                    { key: 'car', label: 'Xe + khách sạn' }
                ].map((item) => (
                    <Button
                        key={item.key}
                        onClick={() => setActiveFilter(item.key)}
                        style={{
                            backgroundColor: activeFilter === item.key ? '#004E9A' : 'white',
                            color: activeFilter === item.key ? 'white' : '#004E9A',
                            border: '2px solid #004E9A',
                            borderRadius: '50px',
                            padding: '8px 24px',
                            height: 'auto',
                            fontWeight: 500
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </div>

            {/* Flip Cards */}
            <Row gutter={[36, 36]}>
                {filteredCombos.map((c, i) => (
                    <Col xs={24} sm={12} md={8} lg={8} key={i}>
                        <div className="combo-flip-card">
                            <div className="combo-flip-inner">
                                {/* Front Face */}
                                <div className="combo-flip-front">
                                    <div style={{ fontSize: 14, color: '#000', flex: 1 }}>
                                        <b style={{ fontSize: 17, color: '#004E9A' }}>{c.name}</b>

                                        <div className="mt-3" style={{ display: 'flex', gap: 8 }}>
                                            <span style={{ width: 110, flexShrink: 0 }}>
                                                <b>Mã combo:</b>
                                            </span>
                                            <span style={{ wordBreak: 'break-all' }}>{c.code}</span>
                                        </div>

                                        <div className="mt-3" style={{ display: 'flex', gap: 8 }}>
                                            <span style={{ width: 110, flexShrink: 0 }}>
                                                <b>Tuyến đường:</b>
                                            </span>
                                            <span style={{ wordBreak: 'break-all' }}>
                                                {c.fromCityName} → {c.toCityName}
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
                                            <span style={{ width: 110, flexShrink: 0 }}>
                                                <b>Ngày khởi hành:</b>
                                            </span>
                                            <span>{c.schedules?.length > 0 ? Utility.formatDate(c.schedules[0].departureDate) : ''}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                            <span style={{ width: 110, flexShrink: 0 }}>
                                                <b>Khách sạn:</b>
                                            </span>
                                            <span>{c.hotel}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                                            <span style={{ width: 110, flexShrink: 0 }}>
                                                <b>Phương tiện:</b>
                                            </span>
                                            <span>{Utility.getLabelByValue(Constants.VehicleTypeOptions, c.vehicle)}</span>
                                        </div>

                                        <div className="text-end mt-auto">
                                            <b>Giá từ</b>
                                            <div style={{ color: 'red', fontSize: 18, fontWeight: 700 }}>
                                                {Utility.formatPrice(c.basePriceAdult)} <span style={{ color: '#000' }}>/ Khách</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Back Face - Image */}
                                <div className="combo-flip-back">
                                    <img
                                        src={c.comboImageCoverUrl}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {/* Overlay elements */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        {/* Circular button with arrow */}
                                        <div
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                backgroundColor: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                fontSize: '20px',
                                                color: '#004E9A',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                            }}
                                        >
                                            <ArrowRightOutlined />
                                        </div>
                                        {/* White line */}
                                        <div
                                            style={{
                                                width: '80px',
                                                height: '2px',
                                                backgroundColor: 'white'
                                            }}
                                        ></div>
                                        {/* Text */}
                                        <div
                                            style={{
                                                color: 'white',
                                                fontSize: '16px',
                                                fontWeight: '500'
                                            }}
                                        >
                                            Xem chi tiết
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* View All Button */}
            <div className="text-center mt-5">
                <Button
                    type="default"
                    style={{
                        backgroundColor: 'transparent',
                        color: '#004E9A',
                        border: '2px solid #004E9A',
                        padding: '20px 56px',
                        fontWeight: 500,
                        fontSize: '18px'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#004E9A';
                        e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#004E9A';
                    }}
                >
                    Xem tất cả
                </Button>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Button } from 'antd';

export default function ComboGiaTot() {
    const [activeFilter, setActiveFilter] = useState('all');

    const combos = [
        {
            from: 'TP. HỒ CHÍ MINH',
            to: 'HÀ NỘI',
            code: 'FESGN1171-009-211125VU-V',
            date: '21/11/2025',
            hotel: 'Khách sạn tương...',
            transport: 'Máy bay',
            price: '5.790.000 đ'
        },
        {
            from: 'TP. HỒ CHÍ MINH',
            to: 'HÀ NỘI',
            code: 'FESGN1162-009-211125VU-V',
            date: '21/11/2025',
            hotel: 'Khách sạn tương...',
            transport: 'Máy bay',
            price: '6.990.000 đ'
        },
        {
            from: 'TP. HỒ CHÍ MINH',
            to: 'PHÚ QUỐC',
            code: 'FESGN8769-008-221125VN-H',
            date: '22/11/2025',
            hotel: 'Khách sạn tương...',
            transport: 'Máy bay',
            price: '5.190.000 đ'
        },
        {
            from: 'PHÚ QUỐC',
            to: 'KIÊN GIANG',
            code: 'FAPQC008-027-221125',
            date: '22/11/2025',
            hotel: 'HOTEL HAPPY PHU...',
            transport: 'Xe',
            price: '1.850.000 đ'
        }
    ];

    return (
        <div style={{ background: '#fff', padding: '40px 8%' }}>
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

            <div className="d-flex justify-content-center gap-3" style={{ marginBottom: 30 }}>
                <Button 
                    onClick={() => setActiveFilter('all')}
                    style={{ 
                        backgroundColor: activeFilter === 'all' ? '#004E9A' : 'white', 
                        color: activeFilter === 'all' ? 'white' : '#004E9A', 
                        border: '2px solid #004E9A', 
                        borderRadius: '50px',
                        padding: '8px 24px',
                        height: 'auto',
                        fontWeight: 500
                    }}
                >
                    Tất cả
                </Button>
                <Button 
                    onClick={() => setActiveFilter('plane')}
                    style={{ 
                        backgroundColor: activeFilter === 'plane' ? '#004E9A' : 'white', 
                        color: activeFilter === 'plane' ? 'white' : '#004E9A', 
                        border: '2px solid #004E9A', 
                        borderRadius: '50px',
                        padding: '8px 24px',
                        height: 'auto',
                        fontWeight: 500
                    }}
                >
                    Máy bay + khách sạn
                </Button>
                <Button 
                    onClick={() => setActiveFilter('car')}
                    style={{ 
                        backgroundColor: activeFilter === 'car' ? '#004E9A' : 'white', 
                        color: activeFilter === 'car' ? 'white' : '#004E9A', 
                        border: '2px solid #004E9A', 
                        borderRadius: '50px',
                        padding: '8px 24px',
                        height: 'auto',
                        fontWeight: 500
                    }}
                >
                    Xe + khách sạn
                </Button>
            </div>

            <Row gutter={[36, 36]}>
                {combos.map((c, i) => (
                    <Col xs={24} sm={12} md={8} lg={8} key={i}>
                        <Card bordered style={{ borderRadius: 12, padding: '6px 4px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
                            <div style={{ fontSize: 14, color: '#000' }}>
                                <b style={{ fontSize: 17, color: '#004E9A' }}>
                                    {c.from} → {c.to}
                                </b>
                                <div className="mt-2" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                    <span style={{ width: 20, flexShrink: 0 }}>🧾</span>
                                    <span style={{ width: 110, flexShrink: 0 }}>
                                        <b>Mã tour:</b>
                                    </span>
                                    <span style={{ flex: 1 }}>{c.code}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                    <span style={{ width: 20, flexShrink: 0 }}>📅</span>
                                    <span style={{ width: 110, flexShrink: 0 }}>
                                        <b>Khởi hành:</b>
                                    </span>
                                    <span style={{ flex: 1 }}>{c.date}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                                    <span style={{ width: 20, flexShrink: 0 }}>🏨</span>
                                    <span style={{ width: 110, flexShrink: 0 }}>
                                        <b>Khách sạn:</b>
                                    </span>
                                    <span style={{ flex: 1 }}>{c.hotel}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <span style={{ width: 20, flexShrink: 0 }}>✈️</span>
                                    <span style={{ width: 110, flexShrink: 0 }}>
                                        <b>Phương tiện:</b>
                                    </span>
                                    <span style={{ flex: 1 }}>{c.transport}</span>
                                </div>
                                <div className="mt-3 text-end" style={{ fontSize: 16 }}>
                                    <b>Giá từ</b>
                                    <div style={{ color: 'red', fontWeight: 700 }}>
                                        {c.price} <span style={{ color: '#000', fontWeight: 700 }}>/ Khách</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <div className="text-center mt-4">
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

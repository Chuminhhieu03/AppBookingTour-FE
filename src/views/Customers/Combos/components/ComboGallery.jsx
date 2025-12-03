import { useState } from 'react';
import { Row, Col, Image, Card, Rate } from 'antd';
import { EnvironmentOutlined, TagOutlined } from '@ant-design/icons';

const ComboGallery = ({ title, code, coverImage, images, rating, totalBookings, fromCity, toCity }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const allImages = [coverImage, ...images].filter(Boolean);

    const handlePreview = (index) => {
        setCurrentImageIndex(index);
        setPreviewVisible(true);
    };

    const handleShowAllImages = () => {
        setCurrentImageIndex(4); // Start from 5th image
        setPreviewVisible(true);
    };

    return (
        <Card style={{ marginTop: 16 }}>
            {/* Title & Info */}
            <div style={{ marginBottom: 16 }}>
                <h1 style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#2C3E50' }}>{title}</h1>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <EnvironmentOutlined style={{ color: '#1E88E5' }} />
                        <span style={{ fontSize: 14, color: '#64748B' }}>
                            {fromCity} → {toCity}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TagOutlined style={{ color: '#1E88E5' }} />
                        <span style={{ fontSize: 14, color: '#64748B' }}>Mã: {code}</span>
                    </div>
                    {rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
                            <span style={{ fontSize: 14, color: '#64748B' }}>({totalBookings} đánh giá)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery Grid */}
            <Row gutter={8}>
                {/* Main large image */}
                <Col xs={24} md={14}>
                    <div
                        style={{
                            width: '100%',
                            height: 400,
                            overflow: 'hidden',
                            borderRadius: 8,
                            cursor: 'pointer',
                            backgroundColor: '#f0f0f0'
                        }}
                        onClick={() => handlePreview(0)}
                    >
                        <img
                            src={allImages[0]}
                            alt={title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </div>
                </Col>

                {/* 4 small images grid */}
                <Col xs={24} md={10}>
                    <Row gutter={[8, 8]} style={{ height: 400 }}>
                        {allImages.slice(1, 5).map((img, index) => (
                            <Col span={12} key={index}>
                                <div
                                    style={{
                                        width: '100%',
                                        height: 'calc((400px - 8px) / 2)',
                                        overflow: 'hidden',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        position: 'relative',
                                        backgroundColor: '#f0f0f0'
                                    }}
                                    onClick={() => (index === 3 && allImages.length > 5 ? handleShowAllImages() : handlePreview(index + 1))}
                                >
                                    <img
                                        src={img}
                                        alt={`${title} ${index + 2}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />
                                    {index === 3 && allImages.length > 5 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                background: 'rgba(0,0,0,0.6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#fff',
                                                fontSize: 32,
                                                fontWeight: 'bold',
                                                transition: 'all 0.3s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(0,0,0,0.8)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
                                            }}
                                        >
                                            +{allImages.length - 5}
                                        </div>
                                    )}
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            {/* Hidden Image Preview Group for Gallery */}
            <Image.PreviewGroup
                preview={{
                    visible: previewVisible,
                    current: currentImageIndex,
                    onVisibleChange: (visible) => setPreviewVisible(visible),
                    onChange: (current) => setCurrentImageIndex(current)
                }}
            >
                {allImages.map((img, index) => (
                    <div key={index} style={{ display: 'none' }}>
                        <Image src={img} alt={`Image ${index + 1}`} />
                    </div>
                ))}
            </Image.PreviewGroup>
        </Card>
    );
};

export default ComboGallery;

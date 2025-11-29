import React, { useState } from 'react';
import { UserOutlined, BorderOutlined, CarOutlined, TeamOutlined, BorderOuterOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

function RoomCard({ roomType }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const totalPeople = (roomType?.maxAdult || 0) + (roomType?.maxChildren || 0);

    // Parse amenityName string
    const amenities = roomType?.amenityName
        ? roomType.amenityName
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
        : [];

    // Format price
    const formattedPrice = roomType?.price ? new Intl.NumberFormat('vi-VN').format(roomType.price) : '0';

    // Get list of images
    const roomImages = roomType?.listInfoImage || [];
    const displayImages = [
        { url: roomType?.coverImageUrl || '/img/room1.jpg' },
        ...roomImages
    ];

    const handleImageClick = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedImageUrl('');
    };

    return (
        <>
            <div className="border rounded p-3 mt-4" style={{ background: "#efefefff"}}>
                <div className="row">
                    {/* LEFT IMAGE */}
                    <div 
                        className="col-md-4 position-relative"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <img 
                            src={roomType?.coverImageUrl || '/img/room1.jpg'} 
                            className="img-fluid rounded w-100" 
                            alt={roomType?.name} 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleImageClick(roomType?.coverImageUrl || '/img/room1.jpg')}
                        />
                        
                        {/* Floating Image Gallery on Hover */}
                        {isHovered && displayImages.length > 1 && (
                            <div 
                                className="position-absolute d-flex gap-2 p-2 rounded"
                                style={{
                                    top: 0,
                                    left: 0,
                                    width: '630px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    zIndex: 1000,
                                    overflowX: 'auto',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {displayImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img.url}
                                        alt={`Room ${idx + 1}`}
                                        className="rounded"
                                        style={{
                                            width: '150px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            flexShrink: 0
                                        }}
                                        onClick={() => handleImageClick(img.url)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT CONTENT */}
                    <div className="col-md-8">
                    <h5 className="fw-bold">{roomType?.name}</h5>

                    <div className="text-danger fw-bold small">🎁 Siêu tiết kiệm</div>

                    <div className="d-flex align-items-center gap-3 mt-2">
                        <span>
                            <TeamOutlined />{totalPeople} người
                        </span>
                        <span>
                            <BorderOuterOutlined /> 32m²
                        </span>
                        <span style={{ fontSize: 18, marginRight: 6 }}>🛏️</span>
                        <span>
                           <EyeOutlined /> Cảnh thành phố
                        </span>
                    </div>

                    <div className="row mt-3">
                        {amenities.length > 0 ? (
                            <>
                                <div className="col-md-6">
                                    {amenities.slice(0, Math.ceil(amenities.length / 2)).map((amenity, index) => (
                                        <p key={index}>{amenity}</p>
                                    ))}
                                </div>
                                <div className="col-md-6">
                                    {amenities.slice(Math.ceil(amenities.length / 2)).map((amenity, index) => (
                                        <p key={index}>{amenity}</p>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="col-12">
                                <p className="text-muted">Không có tiện ích</p>
                            </div>
                        )}
                    </div>

                    <div className="d-flex align-items-center mt-3">
                        <div className="ms-auto text-danger fw-bold fs-5">{formattedPrice} ₫ / 1 Đêm</div>
                        <button className="btn btn-danger ms-3 px-4">CHỌN PHÒNG</button>
                    </div>
                </div>
            </div>
        </div>

            {/* Image Modal */}
            <Modal
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width="60%"
                style={{ top: 20 }}
                closeIcon={<CloseOutlined style={{ fontSize: 24, color: '#fff' }} />}
                bodyStyle={{ padding: 0 }}
            >
                <img
                    src={selectedImageUrl}
                    alt="Full size"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '85vh',
                        objectFit: 'contain'
                    }}
                />
            </Modal>
        </>
    );
}

export default RoomCard;

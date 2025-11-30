import React, { useState } from 'react';
import { UserOutlined, BorderOutlined, CarOutlined, TeamOutlined, BorderOuterOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import Constants from '../../../../Constants/Constants';
import { useNavigate } from 'react-router-dom';

function RoomCard({ roomType }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState('');
    const [isCancelPolicyModalVisible, setIsCancelPolicyModalVisible] = useState(false);
    const totalPeople = (roomType?.maxAdult || 0) + (roomType?.maxChildren || 0);
    const navigate = useNavigate();

    // Parse amenityName string
    const amenities = roomType?.amenityName
        ? roomType.amenityName
              .split(',')
              .map((item) => item.trim())
              .filter((item) => item.length > 0)
        : [];

    // Format price
    const formattedPrice = roomType?.price ? new Intl.NumberFormat('vi-VN').format(roomType.price) : '0';

    // Get view names from view IDs
    const getViewNames = (viewIds) => {
        if (!viewIds) return 'Không có thông tin';
        const ids = viewIds.split(',').map(id => parseInt(id.trim()));
        const viewNames = ids.map(id => {
            const view = Constants.RoomViewOptions.find(v => v.value === id);
            return view ? view.label : '';
        }).filter(Boolean);
        return viewNames.length > 0 ? viewNames.join(', ') : 'Không có thông tin';
    };

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
                        {/* Room Information Section */}
                        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '16px', marginBottom: '16px' }}>
                            <h5 className="fw-bold mb-3">{roomType?.name}</h5>

                            <div className="d-flex align-items-center gap-3">
                                <span>
                                    <TeamOutlined /> {totalPeople} người
                                </span>
                                <span>
                                    <BorderOuterOutlined /> {roomType?.area ? `${roomType.area} m²` : '32m²'}
                                </span>
                                <span>
                                    <EyeOutlined /> {getViewNames(roomType?.view)}
                                </span>
                            </div>
                        </div>

                        <div className="row">
                            {/* Amenities - 2 columns */}
                            <div className="col-md-4">
                                {amenities.length > 0 ? (
                                    amenities.slice(0, Math.ceil(amenities.length / 2)).map((amenity, index) => (
                                        <p key={index} className="mb-1">{amenity}</p>
                                    ))
                                ) : (
                                    <p className="text-muted">Không có tiện ích</p>
                                )}
                            </div>
                            <div className="col-md-4">
                                {amenities.length > 0 && amenities.slice(Math.ceil(amenities.length / 2)).map((amenity, index) => (
                                    <p key={index} className="mb-1">{amenity}</p>
                                ))}
                            </div>

                            {/* Price Information - 1 column */}
                            <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
                                <div className="fw-bold fs-6 mb-1">
                                    <span className="text-danger">{formattedPrice} ₫</span>
                                    <span className="text-dark"> / 1 Đêm</span>
                                </div>
                                <button className="btn btn-danger px-5 mb-1" onClick={() => navigate(`/roomtypes/preview/${roomType?.id}`)}>CHỌN PHÒNG</button>
                                <span 
                                    onClick={() => setIsCancelPolicyModalVisible(true)}
                                    style={{ 
                                        color: '#1890ff', 
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontStyle: 'italic'
                                    }}
                                >
                                    Quy định hủy phòng
                                </span>
                            </div>
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

            {/* Cancel Policy Modal */}
            <Modal
                title="Quy định hủy phòng"
                open={isCancelPolicyModalVisible}
                onCancel={() => setIsCancelPolicyModalVisible(false)}
                footer={[
                    <button 
                        key="close" 
                        className="btn btn-primary"
                        onClick={() => setIsCancelPolicyModalVisible(false)}
                    >
                        Đóng
                    </button>
                ]}
                width="60%"
            >
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: roomType?.cancelPolicy || 'Chưa có quy định hủy phòng' }} />
            </Modal>
        </>
    );
}

export default RoomCard;

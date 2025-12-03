import React, { useState, useEffect } from 'react';

function Gallery({ images = [] }) {
    const [selectedImage, setSelectedImage] = useState('');
    const maxDisplay = 4;
    const displayImages = images.slice(0, maxDisplay);
    const remainingCount = images.length > maxDisplay ? images.length - maxDisplay : 0;

    useEffect(() => {
        if (images.length > 0) {
            setSelectedImage(images[0]?.url || '');
        }
    }, [images]);

    return (
        <div className="row mt-4">
            {/* LEFT COLUMN - Image List */}
            <div className="col-md-3 d-flex flex-column gap-3">
                {displayImages.map((img, idx) => (
                    <div 
                        key={idx} 
                        className="position-relative rounded overflow-hidden gallery-thumbnail" 
                        style={{ 
                            height: '140px', 
                            cursor: 'pointer',
                            border: selectedImage === img.url ? '3px solid #b1b1b1ff' : '3px solid transparent',
                            transition: 'border 0.2s ease'
                        }}
                        onClick={() => setSelectedImage(img.url)}
                    >
                        <img 
                            src={img.url} 
                            className="img-fluid w-100 h-100" 
                            style={{ objectFit: 'cover' }} 
                            alt={`Gallery ${idx + 1}`}
                        />
                        
                        {/* Hover overlay */}
                        <div 
                            className="gallery-overlay position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                transition: 'background-color 0.3s ease',
                                pointerEvents: 'none'
                            }}
                        ></div>
                        
                        {/* Overlay for last image if more images exist */}
                        {idx === maxDisplay - 1 && remainingCount > 0 && (
                            <div
                                className="position-absolute top-50 start-50 translate-middle text-white fw-bold"
                                style={{ fontSize: 30, textShadow: '0 0 6px rgba(0,0,0,0.6)', zIndex: 2 }}
                            >
                                +{remainingCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* RIGHT COLUMN - Selected Image */}
            <div className="col-md-9">
                {selectedImage && (
                    <img
                        src={selectedImage}
                        className="img-fluid rounded w-100"
                        style={{
                            objectFit: 'cover',
                            height: 140 * 4 + 15 * 3 // 4 ảnh + gap (gap-3 = 9px)
                        }}
                        alt="Selected"
                    />
                )}
            </div>

            <style jsx>{`
                .gallery-thumbnail:hover .gallery-overlay {
                    background-color: rgba(0, 0, 0, 0.3) !important;
                }
            `}</style>
        </div>
    );
}

export default Gallery;

import React from 'react';
import { Carousel } from 'antd';
import 'antd/dist/reset.css';

// Carousel showing 3 slides at once, autoplay every 2s, using 4 images
const images = [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80'
];

const CarouselGallery = ({ height = 220 }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true
    };

    return (
        <div>
            <Carousel {...settings}>
                {images.map((src, idx) => (
                    <div key={idx}>
                        <div style={{
                            margin: 8,
                            height,
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}>
                            <img src={src} alt={`slide-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CarouselGallery;

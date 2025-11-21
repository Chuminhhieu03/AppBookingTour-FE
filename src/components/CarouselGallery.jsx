import React from 'react';
import { Carousel } from 'antd';
import 'antd/dist/reset.css';

// Import local images
import image1 from '../assets/images/carousel/1.jfif';
import image2 from '../assets/images/carousel/2.jfif';
import image3 from '../assets/images/carousel/3.jfif';
import image4 from '../assets/images/carousel/4.jfif';

// Carousel showing 3 slides at once, autoplay every 2s, using 4 images
const images = [
    image1,
    image2,
    image3,
    image4
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

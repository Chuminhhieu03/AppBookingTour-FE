import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cityAPI from 'api/city/cityAPI';
import './FavouriteDestination.css';

export default function FavouriteDestinations() {
    const [activeRegion, setActiveRegion] = useState('Miền Trung');
    const [destinationData, setDestinationData] = useState({
        'Miền Bắc': [
            {
                name: 'Hà Nội',
                img: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Hạ Long',
                img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'
            },
            {
                name: 'Sa Pa',
                img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Ninh Bình',
                img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'
            },
            {
                name: 'Cao Bằng',
                img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
            },
            {
                name: 'Hải Phòng',
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Mộc Châu',
                img: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Mai Châu',
                img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80'
            }
        ],
        'Miền Trung': [
            {
                name: 'Đà Nẵng',
                img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Nha Trang',
                img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'
            },
            {
                name: 'Lâm Đồng',
                img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Hội An',
                img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'
            },
            {
                name: 'Huế',
                img: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=800&q=80'
            },
            {
                name: 'Quảng Bình',
                img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Quy Nhơn',
                img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Phan Thiết',
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
            }
        ],
        'Miền Đông Nam Bộ': [
            {
                name: 'TP Hồ Chí Minh',
                img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Vũng Tàu',
                img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'
            },
            {
                name: 'Đà Lạt',
                img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Bình Dương',
                img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'
            },
            {
                name: 'Đồng Nai',
                img: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=800&q=80'
            },
            {
                name: 'Côn Đảo',
                img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Tây Ninh',
                img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Bình Phước',
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
            }
        ],
        'Miền Tây Nam Bộ': [
            {
                name: 'Cần Thơ',
                img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Phú Quốc',
                img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80'
            },
            {
                name: 'An Giang',
                img: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Tiền Giang',
                img: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'
            },
            {
                name: 'Bến Tre',
                img: 'https://images.unsplash.com/photo-1578070181910-f1e514afdd08?w=800&q=80'
            },
            {
                name: 'Cà Mau',
                img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
                className: 'tall'
            },
            {
                name: 'Sóc Trăng',
                img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
                className: 'wide'
            },
            {
                name: 'Kiên Giang',
                img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'
            }
        ]
    });

    const navigate = useNavigate();
    const regions = ['Miền Bắc', 'Miền Trung', 'Miền Đông Nam Bộ', 'Miền Tây Nam Bộ'];

    useEffect(() => {
        const fetchCitiesAndMatchUrls = async () => {
            try {
                const response = await cityAPI.getListCity();
                const cities = response.data || [];

                // Create a map of city names to ids for quick lookup
                const cityMap = {};
                cities.forEach((city) => {
                    cityMap[city.name] = city.id;
                });

                // Update destinationData with URLs
                const updatedData = {};
                Object.keys(destinationData).forEach((region) => {
                    updatedData[region] = destinationData[region].map((destination) => {
                        const matchingCityId = cityMap[destination.name];
                        return {
                            ...destination,
                            url: matchingCityId ? `/tours?destinationCityId=${matchingCityId}&page=1` : null
                        };
                    });
                });

                setDestinationData(updatedData);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCitiesAndMatchUrls();
    }, []);

    const handleExploreClick = (url) => {
        if (url) {
            navigate(url);
        }
    };

    const items = destinationData[activeRegion] || [];

    return (
        <div style={{ padding: '50px 10%' }}>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontWeight: 'bold', color: '#004E9A' }}>ĐIỂM ĐẾN YÊU THÍCH</h2>
                <div style={{ width: 120, height: 4, backgroundColor: '#004E9A', borderRadius: 4, margin: '0 auto 30px auto' }}></div>
                <p style={{ fontSize: 16, color: '#444' }}>
                    Hãy chọn một điểm đến du lịch nổi tiếng dưới đây để khám phá các chuyến đi độc quyền của chúng tôi với mức giá vô cùng
                    hợp lý.
                </p>
            </div>

            {/* MENU TAB */}
            <div className="dest-tabs">
                {regions.map((r) => (
                    <div key={r} className={`dest-tab ${activeRegion === r ? 'active' : ''}`} onClick={() => setActiveRegion(r)}>
                        {r}
                    </div>
                ))}
            </div>

            {/* MOSAIC GRID */}
            <div className="dest-grid">
                {items.map((item, idx) => (
                    <div key={idx} className={`dest-item ${item.className || ''}`}>
                        <img src={item.img} alt={item.name} />
                        <span>{item.name}</span>
                        <div className="dest-overlay-content">
                            <div className="dest-name">{item.name}</div>
                            <button className="explore-btn" onClick={() => handleExploreClick(item.url)}>
                                Khám phá
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

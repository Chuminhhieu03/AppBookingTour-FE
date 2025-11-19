import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import { Tabs, Input, DatePicker, Select, Button, Tooltip } from 'antd';
import { SearchOutlined, CarOutlined, HomeOutlined, FlagOutlined, CreditCardOutlined } from '@ant-design/icons';
import HomePageSearchBtn from './HomePageSearchBtn';
import CarouselGallery from '../../../components/CarouselGallery';
import BlogSection from './BlogSection';
import FavouriteDestination from './FavouriteDestination';
import ComboGiaTot from './ComboGiaTot';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function VietravelSearchComponent() {
    return (
        <div style={{ paddingTop: 24 }}>
            {/* Banner tạm */}
            <div
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1650&q=80')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: 260,
                    position: 'relative'
                }}
            >
                {/* Card tìm kiếm nổi lên trên banner */}
                <div
                    style={{
                        position: 'absolute',
                        left: '8%',
                        right: '8%',
                        bottom: -130,
                        zIndex: 10
                    }}
                >
                    <div
                        className="card shadow"
                        style={{
                            borderRadius: 12,
                            overflow: 'visible'
                        }}
                    >
                        <div className="card-body p-3">
                            <HomePageSearchBtn />
                        </div>
                    </div>
                </div>
            </div>

            {/* Khoảng đệm để nhìn rõ card */}
            <div style={{ height: 72 }} />

            {/* Carousel demo */}
            <div style={{ padding: '0 8%', marginTop: 156 }}>
                <CarouselGallery height={220} />
            </div>

            <BlogSection />

            <FavouriteDestination />

            <ComboGiaTot />
        </div>
    );
}

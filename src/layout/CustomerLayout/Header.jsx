import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Input, Badge, Dropdown, Button, Drawer, Space, Avatar, message, Select } from 'antd';
import {
    SearchOutlined,
    BellOutlined,
    UserOutlined,
    MenuOutlined,
    HomeOutlined,
    GlobalOutlined,
    ShopOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    LoginOutlined,
    LogoutOutlined,
    SettingOutlined,
    RocketOutlined
} from '@ant-design/icons';
import { logoutAsync } from 'features/auth/authSlice';
import LogoWhite from 'assets/images/logo-white.svg';
import LogoDark from 'assets/images/logo-dark.svg';

const { Search } = Input;
const { Option } = Select;

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchType, setSearchType] = useState('all');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // Handle scroll for sticky header
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logoutAsync()).unwrap();
            message.success('Đăng xuất thành công!');
            navigate('/login');
        } catch (error) {
            message.error(error || 'Đăng xuất thất bại!');
        }
    };

    const handleSearch = (value) => {
        if (value.trim()) {
            // Navigate to search page with query
            navigate(`/search?q=${encodeURIComponent(value)}&type=${searchType}`);
        }
    };

    // Menu items
    const menuItems = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: <Link to="/">Trang chủ</Link>
        },
        {
            key: 'tours',
            icon: <GlobalOutlined />,
            label: <Link to="/tours">Tours</Link>
        },
        {
            key: 'combos',
            icon: <RocketOutlined />,
            label: <Link to="/combos">Combos</Link>
        },
        {
            key: 'accommodations',
            icon: <ShopOutlined />,
            label: <Link to="/accommodations">Khách sạn</Link>
        },
        {
            key: 'about',
            icon: <InfoCircleOutlined />,
            label: <Link to="/about">Về chúng tôi</Link>
        },
        {
            key: 'contact',
            icon: <PhoneOutlined />,
            label: <Link to="/contact">Liên hệ</Link>
        }
    ];

    // User dropdown menu
    const userMenuItems = isAuthenticated
        ? [
              {
                  key: 'profile',
                  icon: <UserOutlined />,
                  label: 'Thông tin cá nhân',
                  onClick: () => navigate('/profile')
              },
              {
                  key: 'bookings',
                  icon: <GlobalOutlined />,
                  label: 'Booking của tôi',
                  onClick: () => navigate('/my-bookings')
              },
              {
                  key: 'settings',
                  icon: <SettingOutlined />,
                  label: 'Cài đặt',
                  onClick: () => navigate('/settings')
              },
              {
                  type: 'divider'
              },
              {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Đăng xuất',
                  onClick: handleLogout,
                  danger: true
              }
          ]
        : [
              {
                  key: 'login',
                  icon: <LoginOutlined />,
                  label: 'Đăng nhập',
                  onClick: () => navigate('/login')
              },
              {
                  key: 'register',
                  icon: <UserOutlined />,
                  label: 'Đăng ký',
                  onClick: () => navigate('/register')
              }
          ];

    const selectBefore = (
        <Select value={searchType} onChange={setSearchType} style={{ width: 120 }}>
            <Option value="all">Tất cả</Option>
            <Option value="tour">Tours</Option>
            <Option value="combo">Combos</Option>
            <Option value="accommodation">Khách sạn</Option>
        </Select>
    );

    return (
        <>
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    background: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#fff',
                    boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                    backdropFilter: scrolled ? 'blur(10px)' : 'none',
                    transition: 'all 0.3s ease'
                }}
            >
                {/* Top Banner - Optional promotional banner */}
                {/* <div
                    style={{
                        background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
                        color: '#fff',
                        padding: '8px 0',
                        textAlign: 'center',
                        fontSize: '13px'
                    }}
                >
                    🎉 Ưu đãi đặc biệt: Giảm 20% cho tour trong tháng này! Hotline: <strong>1900-xxxx</strong>
                </div> */}

                {/* Main Header */}
                <div
                    style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        padding: '0 24px'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '72px'
                        }}
                    >
                        {/* Logo */}
                        <Link
                            to="/"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none'
                            }}
                        >
                            <img
                                src={LogoDark}
                                alt="Logo"
                                style={{ height: '40px', transition: 'transform 0.3s' }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span
                                    style={{
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        color: '#1E88E5',
                                        lineHeight: 1.2
                                    }}
                                >
                                    Travel HHH
                                </span>
                                <span style={{ fontSize: '11px', color: '#64748B' }}>Khám phá Việt Nam</span>
                            </div>
                        </Link>

                        {/* Desktop Menu */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                                flex: 1,
                                justifyContent: 'center'
                            }}
                            className="desktop-only"
                        >
                            <Menu
                                mode="horizontal"
                                items={menuItems}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    fontSize: '15px',
                                    fontWeight: 500
                                }}
                                selectedKeys={[]}
                            />
                        </div>

                        {/* Search Bar - Desktop */}
                        <div className="desktop-only" style={{ width: '300px', marginRight: '24px' }}>
                            <Search
                                placeholder="Tìm tour, combo, khách sạn..."
                                allowClear
                                enterButton={<SearchOutlined />}
                                size="large"
                                onSearch={handleSearch}
                                addonBefore={selectBefore}
                                style={{ width: '100%' }}
                            />
                        </div>

                        {/* Right Actions */}
                        <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
                            {/* Notifications */}
                            {isAuthenticated && (
                                <Badge count={3} size="small">
                                    <Button
                                        type="text"
                                        icon={<BellOutlined style={{ fontSize: '20px' }} />}
                                        style={{ border: 'none' }}
                                        onClick={() => navigate('/notifications')}
                                    />
                                </Badge>
                            )}

                            {/* User Menu */}
                            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                                <Button
                                    type={isAuthenticated ? 'text' : 'primary'}
                                    icon={
                                        isAuthenticated ? (
                                            <Avatar size="default" style={{ backgroundColor: '#1E88E5' }} icon={<UserOutlined />}>
                                                {user?.fullName?.charAt(0) || 'U'}
                                            </Avatar>
                                        ) : (
                                            <LoginOutlined />
                                        )
                                    }
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        border: 'none',
                                        height: 'auto'
                                    }}
                                >
                                    {!isAuthenticated && <span className="desktop-only">Đăng nhập</span>}
                                </Button>
                            </Dropdown>

                            {/* Mobile Menu Button */}
                            <Button
                                className="mobile-only"
                                type="text"
                                icon={<MenuOutlined style={{ fontSize: '24px' }} />}
                                onClick={() => setMobileMenuOpen(true)}
                                style={{ border: 'none' }}
                            />
                        </Space>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="mobile-only" style={{ paddingBottom: '16px' }}>
                        <Search
                            placeholder="Tìm kiếm..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                            addonBefore={selectBefore}
                        />
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Menu */}
            <Drawer title="Menu" placement="right" onClose={() => setMobileMenuOpen(false)} open={mobileMenuOpen} width={280}>
                <Menu mode="vertical" items={menuItems} style={{ border: 'none' }} onClick={() => setMobileMenuOpen(false)} />
            </Drawer>

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-only {
                        display: none !important;
                    }
                }
                @media (min-width: 769px) {
                    .mobile-only {
                        display: none !important;
                    }
                }
            `}</style>
        </>
    );
};

export default Header;

import { Link } from 'react-router-dom';
import { Row, Col, Space, Divider } from 'antd';
import {
    FacebookFilled,
    InstagramFilled,
    TwitterCircleFilled,
    YoutubeFilled,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    GlobalOutlined,
    ShopOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';
import LogoWhite from 'assets/images/logo-white.svg';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerStyle = {
        background: 'linear-gradient(135deg, #2C3E50 0%, #1a252f 100%)',
        color: '#fff',
        padding: '60px 0 0'
    };

    const linkStyle = {
        color: '#B8C5D6',
        textDecoration: 'none',
        transition: 'color 0.3s',
        display: 'block',
        marginBottom: '12px',
        fontSize: '14px'
    };

    const iconStyle = {
        fontSize: '28px',
        color: '#fff',
        transition: 'all 0.3s',
        cursor: 'pointer'
    };

    const handleIconHover = (e, hoverColor) => {
        e.currentTarget.style.color = hoverColor;
        e.currentTarget.style.transform = 'translateY(-3px)';
    };

    const handleIconLeave = (e) => {
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.transform = 'translateY(0)';
    };

    return (
        <footer style={footerStyle}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <Row gutter={[32, 32]}>
                    {/* Column 1: About Us */}
                    <Col xs={24} sm={12} lg={6}>
                        <div style={{ marginBottom: '20px' }}>
                            <img src={LogoWhite} alt="Logo" style={{ height: '40px', marginBottom: '16px' }} />
                            <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>Travel HHH</h3>
                            <p style={{ color: '#B8C5D6', fontSize: '14px', lineHeight: 1.6 }}>
                                Đồng hành cùng bạn khám phá Việt Nam và thế giới với những trải nghiệm du lịch tuyệt vời nhất.
                            </p>
                        </div>
                        <Space size="large">
                            <FacebookFilled
                                style={iconStyle}
                                onMouseEnter={(e) => handleIconHover(e, '#1877F2')}
                                onMouseLeave={handleIconLeave}
                                onClick={() => window.open('https://facebook.com', '_blank')}
                            />
                            <InstagramFilled
                                style={iconStyle}
                                onMouseEnter={(e) => handleIconHover(e, '#E4405F')}
                                onMouseLeave={handleIconLeave}
                                onClick={() => window.open('https://instagram.com', '_blank')}
                            />
                            <TwitterCircleFilled
                                style={iconStyle}
                                onMouseEnter={(e) => handleIconHover(e, '#1DA1F2')}
                                onMouseLeave={handleIconLeave}
                                onClick={() => window.open('https://twitter.com', '_blank')}
                            />
                            <YoutubeFilled
                                style={iconStyle}
                                onMouseEnter={(e) => handleIconHover(e, '#FF0000')}
                                onMouseLeave={handleIconLeave}
                                onClick={() => window.open('https://youtube.com', '_blank')}
                            />
                        </Space>
                    </Col>

                    {/* Column 2: Services */}
                    <Col xs={24} sm={12} lg={6}>
                        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Dịch vụ</h4>
                        <Link
                            to="/tours"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            <GlobalOutlined style={{ marginRight: '8px' }} />
                            Tour du lịch
                        </Link>
                        <Link
                            to="/combos"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            <RocketOutlined style={{ marginRight: '8px' }} />
                            Combo tour
                        </Link>
                        <Link
                            to="/accommodations"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            <ShopOutlined style={{ marginRight: '8px' }} />
                            Đặt khách sạn
                        </Link>
                        <Link
                            to="/insurance"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            <SafetyCertificateOutlined style={{ marginRight: '8px' }} />
                            Bảo hiểm du lịch
                        </Link>
                        <Link
                            to="/consulting"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            <CustomerServiceOutlined style={{ marginRight: '8px' }} />
                            Tư vấn du lịch
                        </Link>
                    </Col>

                    {/* Column 3: Quick Links */}
                    <Col xs={24} sm={12} lg={6}>
                        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Liên kết nhanh</h4>
                        <Link
                            to="/about"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            Về chúng tôi
                        </Link>
                        <Link
                            to="/blog"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            Blog du lịch
                        </Link>
                        <Link
                            to="/destinations"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            Điểm đến
                        </Link>
                        <Link
                            to="/promotions"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            Khuyến mãi
                        </Link>
                        <Link
                            to="/faq"
                            style={linkStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                        >
                            Câu hỏi thường gặp
                        </Link>
                    </Col>

                    {/* Column 4: Contact */}
                    <Col xs={24} sm={12} lg={6}>
                        <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>Liên hệ</h4>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <EnvironmentOutlined style={{ color: '#1E88E5', fontSize: '18px', marginRight: '12px' }} />
                                <span style={{ color: '#B8C5D6', fontSize: '14px', lineHeight: 1.6 }}>
                                    123 Đường ABC, Quận XYZ,
                                    <br />
                                    Thành phố Hồ Chí Minh
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                <PhoneOutlined style={{ color: '#1E88E5', fontSize: '18px', marginRight: '12px' }} />
                                <a
                                    href="tel:1900xxxx"
                                    style={{ color: '#B8C5D6', fontSize: '14px', textDecoration: 'none' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                                >
                                    Hotline: 1900-xxxx
                                </a>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MailOutlined style={{ color: '#1E88E5', fontSize: '18px', marginRight: '12px' }} />
                                <a
                                    href="mailto:contact@travelhhh.com"
                                    style={{ color: '#B8C5D6', fontSize: '14px', textDecoration: 'none' }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                                >
                                    contact@travelhhh.com
                                </a>
                            </div>
                        </div>
                        <div
                            style={{
                                background: 'rgba(30, 136, 229, 0.1)',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(30, 136, 229, 0.2)'
                            }}
                        >
                            <p style={{ color: '#1E88E5', fontSize: '13px', margin: 0, fontWeight: 500 }}>🕐 Giờ làm việc</p>
                            <p style={{ color: '#B8C5D6', fontSize: '13px', margin: '4px 0 0' }}>Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '40px 0 24px' }} />

                {/* Bottom Section */}
                <Row gutter={[16, 16]} style={{ paddingBottom: '24px' }}>
                    <Col xs={24} md={12}>
                        <p style={{ color: '#B8C5D6', fontSize: '13px', margin: 0 }}>© {currentYear} Travel HHH. All rights reserved.</p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                        <Space split={<span style={{ color: '#B8C5D6' }}>|</span>}>
                            <Link
                                to="/terms"
                                style={{ color: '#B8C5D6', fontSize: '13px', textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                            >
                                Điều khoản sử dụng
                            </Link>
                            <Link
                                to="/privacy"
                                style={{ color: '#B8C5D6', fontSize: '13px', textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                            >
                                Chính sách bảo mật
                            </Link>
                            <Link
                                to="/cookies"
                                style={{ color: '#B8C5D6', fontSize: '13px', textDecoration: 'none' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#1E88E5')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#B8C5D6')}
                            >
                                Cookies
                            </Link>
                        </Space>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;

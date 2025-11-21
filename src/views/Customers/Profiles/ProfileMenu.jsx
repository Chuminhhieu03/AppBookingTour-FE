import React from 'react';
import { Menu, Avatar, Typography } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    SecurityScanOutlined,
    HistoryOutlined,
    HeartOutlined,
    BellOutlined,
    GiftOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const ProfileMenu = ({ selectedKey, onMenuSelect, avatar, userName }) => {
    const menuItems = [
        {
            key: 'profile',
            icon: <UserOutlined style={{ color: '#1890ff' }} />,
            label: (
                <Text strong style={{ color: selectedKey === 'profile' ? '#1890ff' : '#333' }}>
                    Thông tin cá nhân
                </Text>
            )
        },
        {
            key: 'settings',
            icon: <SettingOutlined style={{ color: '#52c41a' }} />,
            label: (
                <Text strong style={{ color: selectedKey === 'settings' ? '#1890ff' : '#333' }}>
                    Cài đặt tài khoản
                </Text>
            )
        },
        {
            key: 'security',
            icon: <SecurityScanOutlined style={{ color: '#faad14' }} />,
            label: (
                <Text strong style={{ color: selectedKey === 'security' ? '#1890ff' : '#333' }}>
                    Bảo mật & Quyền riêng tư
                </Text>
            )
        },
        {
            key: 'history',
            icon: <HistoryOutlined style={{ color: '#722ed1' }} />,
            label: (
                <Text strong style={{ color: selectedKey === 'history' ? '#1890ff' : '#333' }}>
                    Lịch sử đặt tour
                </Text>
            )
        },
        {
            key: 'favorites',
            icon: <HeartOutlined style={{ color: '#f5222d' }} />,
            label: (
                <Text strong style={{ color: selectedKey === 'favorites' ? '#1890ff' : '#333' }}>
                    Tour yêu thích
                </Text>
            )
        },
        {
            key: 'notifications',
            icon: <BellOutlined style={{ color: '#13c2c2' }} />,
            label: (
                <Text strong style={{ color: selectedKey === 'notifications' ? '#1890ff' : '#333' }}>
                    Thông báo
                </Text>
            )
        },
        {
            key: 'rewards',
            icon: <GiftOutlined style={{ color: '#eb2f96' }} />,
            label: (
                <Text strong style={{ color: selectedKey === 'rewards' ? '#1890ff' : '#333' }}>
                    Ưu đãi & Phần thưởng
                </Text>
            )
        }
    ];

    const handleMenuClick = (e) => {
        onMenuSelect(e.key);
    };

    return (
        <div style={{ textAlign: 'left' }}>
            {/* User Avatar Section */}
            <div
                style={{
                    padding: '20px 0',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: '16px',
                    textAlign: 'center'
                }}
            >
                <Avatar
                    size={{ xs: 64, sm: 80, md: 100, lg: 120, xl: 120, xxl: 120 }}
                    src={avatar}
                    icon={!avatar ? <UserOutlined /> : null}
                    style={{
                        backgroundColor: avatar ? 'transparent' : '#1890ff',
                        marginBottom: '12px',
                        boxShadow: '0 4px 12px rgba(24,144,255,0.3)'
                    }}
                />
                <div>
                    <Text
                        strong
                        style={{
                            fontSize: { xs: '14px', sm: '16px' },
                            color: '#333',
                            display: 'block',
                            wordBreak: 'break-word'
                        }}
                    >
                        {userName || 'Người dùng'}
                    </Text>
                </div>
            </div>

            {/* Menu Items */}
            <Menu
                mode="vertical"
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                items={menuItems}
                style={{
                    border: 'none',
                    background: 'transparent'
                }}
                className="profile-menu"
            />

            <style jsx>{`
                .profile-menu .ant-menu-item {
                    margin: 8px 0 !important;
                    border-radius: 8px !important;
                    padding: 12px 16px !important;
                    height: auto !important;
                    line-height: normal !important;
                    transition: all 0.3s ease !important;
                }

                .profile-menu .ant-menu-item:hover {
                    background: linear-gradient(135deg, #e6f7ff, #bae7ff) !important;
                    transform: translateX(4px) !important;
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2) !important;
                }

                .profile-menu .ant-menu-item-selected {
                    background: linear-gradient(135deg, #40a9ff, #91d5ff) !important;
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4) !important;
                    color: #ffffff !important;
                }

                .profile-menu .ant-menu-item-selected .ant-menu-title-content {
                    color: #ffffff !important;
                    /* Dùng font-weight bold hơn để nổi bật hơn */
                    font-weight: bold;
                }

                .profile-menu .ant-menu-item-selected .anticon {
                    color: #ffffff !important;
                }
            `}</style>
        </div>
    );
};

export default ProfileMenu;

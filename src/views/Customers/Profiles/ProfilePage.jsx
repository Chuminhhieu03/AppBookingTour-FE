import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Row,
    Col,
    Card,
    Descriptions,
    Input,
    Select,
    DatePicker,
    Button,
    message,
    Typography,
    Space,
    Spin,
    Divider,
    Upload,
    Avatar
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined, UserOutlined, CameraOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import ProfileMenu from './ProfileMenu';
import profileAPI from '../../../api/profile/profileAPI';
import Constants from '../../../Constants/Constants';

const { Title, Text } = Typography;

const ProfilePage = () => {
    const [selectedMenu, setSelectedMenu] = useState('profile');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editableFields, setEditableFields] = useState({});
    const [updating, setUpdating] = useState('');
    const [avatarLoading, setAvatarLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const uploadRef = useRef(null);

    // Lấy userId từ Redux store
    const { user } = useSelector((state) => state.auth);
    const userId = user?.userId;

    const fetchProfile = useCallback(async () => {
        if (!userId) {
            console.log('No userId found in Redux store');
            return;
        }

        try {
            setLoading(true);
            const data = await profileAPI.getProfile(userId);
            setProfileData(data.data);

            // Khởi tạo editable fields
            const fields = {
                fullName: { field: 'fullName', isEditing: false, value: data.data.fullName },
                gender: { field: 'gender', isEditing: false, value: data.data.gender },
                dateOfBirth: { field: 'dateOfBirth', isEditing: false, value: data.data.dateOfBirth },
                phoneNumber: { field: 'phoneNumber', isEditing: false, value: data.data.phoneNumber },
                address: { field: 'address', isEditing: false, value: data.data.address || '' }
            };
            setEditableFields(fields);
        } catch (error) {
            message.error('Không thể tải thông tin profile');
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleEdit = (fieldName) => {
        setEditableFields((prev) => {
            // Thoát khỏi chế độ edit của tất cả các field khác
            const resetFields = Object.keys(prev).reduce((acc, key) => {
                acc[key] = {
                    ...prev[key],
                    isEditing: key === fieldName,
                    value: key === fieldName ? prev[key].value : profileData?.[key] || ''
                };
                return acc;
            }, {});

            return resetFields;
        });
    };

    const handleCancel = (fieldName) => {
        setEditableFields((prev) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                isEditing: false,
                value: profileData?.[fieldName] || ''
            }
        }));
    };

    const handleSave = async (fieldName) => {
        if (!userId) {
            message.error('Không tìm thấy thông tin người dùng!');
            return;
        }

        try {
            setUpdating(fieldName);
            const fieldValue = editableFields[fieldName].value;

            // Tạo FormData cho field được update
            const formData = new FormData();
            formData.append(fieldName, fieldValue);

            await profileAPI.updateProfile(userId, formData);

            // Reload profile data to get updated information from server
            await fetchProfile();

            message.success('Cập nhật thông tin thành công');
        } catch (error) {
            message.error('Cập nhật thông tin thất bại');
            console.error('Error updating profile:', error);
        } finally {
            setUpdating('');
        }
    };

    const handleFieldChange = (fieldName, value) => {
        setEditableFields((prev) => ({
            ...prev,
            [fieldName]: {
                ...prev[fieldName],
                value: value
            }
        }));
    };

    const handleAvatarChange = (info) => {
        if (info.file.status === 'uploading') {
            setAvatarLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setAvatarLoading(false);
        }
    };

    const beforeAvatarUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ có thể upload file JPG/PNG!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Ảnh phải nhỏ hơn 2MB!');
            return false;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewAvatar(e.target.result);
        };
        reader.readAsDataURL(file);

        setAvatarFile(file);
        return false; // Prevent auto upload
    };

    const handleAvatarSave = async () => {
        if (!avatarFile) {
            message.warning('Vui lòng chọn ảnh trước!');
            return;
        }

        if (!userId) {
            message.error('Không tìm thấy thông tin người dùng!');
            return;
        }

        try {
            setUpdating('avatar');

            const formData = new FormData();
            formData.append('ProfileImageFile', avatarFile);

            await profileAPI.updateProfile(userId, formData);

            // Reload profile data to get updated avatar URL from server
            await fetchProfile();

            setAvatarFile(null);
            setPreviewAvatar(null);
            message.success('Cập nhật avatar thành công!');
        } catch (error) {
            message.error('Cập nhật avatar thất bại!');
            console.error('Error updating avatar:', error);
        } finally {
            setUpdating('');
        }
    };

    const handleAvatarCancel = () => {
        setAvatarFile(null);
        setPreviewAvatar(null);
        setAvatarLoading(false);
    };

    const handleAvatarClick = () => {
        if (!avatarFile && !previewAvatar && uploadRef.current) {
            uploadRef.current.click();
        }
    };

    const renderEditableField = (fieldName, label, displayValue, inputType = 'input') => {
        const field = editableFields[fieldName];
        const isEditing = field?.isEditing;
        const isLoading = updating === fieldName;

        if (isEditing) {
            let inputComponent;

            switch (inputType) {
                case 'select':
                    inputComponent = (
                        <Select
                            value={field.value}
                            onChange={(value) => handleFieldChange(fieldName, value)}
                            size="small"
                            style={{ width: '100%' }}
                            options={Constants.GenderOptions}
                        />
                    );
                    break;
                case 'date':
                    inputComponent = (
                        <DatePicker
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => handleFieldChange(fieldName, date ? date.format('YYYY-MM-DD') : '')}
                            format="DD/MM/YYYY"
                            size="small"
                            style={{ width: '100%' }}
                            maxDate={dayjs()}
                            placeholder="Chọn ngày sinh"
                        />
                    );
                    break;
                default:
                    inputComponent = (
                        <Input
                            value={field.value}
                            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                            size="small"
                            style={{ width: '100%' }}
                        />
                    );
            }

            return (
                <div
                    style={{
                        width: '100%',
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        overflow: 'hidden'
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            overflow: 'hidden'
                        }}
                    >
                        {inputComponent}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            flexShrink: 0
                        }}
                    >
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            size="small"
                            loading={isLoading}
                            onClick={() => handleSave(fieldName)}
                        >
                            Lưu
                        </Button>
                        <Button icon={<CloseOutlined />} size="small" onClick={() => handleCancel(fieldName)} disabled={isLoading}>
                            Hủy
                        </Button>
                    </div>
                </div>
            );
        }

        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Text>{displayValue}</Text>
                <Button type="text" icon={<EditOutlined />} size="small" onClick={() => handleEdit(fieldName)} />
            </div>
        );
    };

    const getGenderText = (gender) => {
        switch (gender) {
            case Constants.Gender.Male:
                return 'Nam';
            case Constants.Gender.Female:
                return 'Nữ';
            case Constants.Gender.Other:
                return 'Khác';
            default:
                return 'Không xác định';
        }
    };

    const formatDate = (dateString) => {
        return dayjs(dateString).format('DD/MM/YYYY');
    };

    const renderProfileInfo = () => {
        if (!profileData) return null;

        return (
            <Card
                title={
                    <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                        <UserOutlined style={{ marginRight: '8px' }} />
                        Thông tin cá nhân
                    </Title>
                }
                style={{
                    borderRadius: '16px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #e6f7fd'
                }}
                headStyle={{
                    borderRadius: '16px 16px 0 0',
                    background: '#e6f7fd',
                    borderBottom: '2px solid #91d5ff'
                }}
                bodyStyle={{ padding: '24px' }}
            >
                {/* Avatar Section */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#fafafa',
                        borderRadius: '12px',
                        border: '2px dashed #d9d9d9'
                    }}
                >
                    <Space direction="vertical" align="center" size="large">
                        <div
                            style={{
                                position: 'relative',
                                cursor: !avatarFile && !previewAvatar ? 'pointer' : 'default'
                            }}
                            onClick={handleAvatarClick}
                            className="avatar-container"
                        >
                            <Avatar
                                size={160}
                                src={previewAvatar || profileData?.profileImage}
                                icon={!previewAvatar && !profileData?.profileImage ? <UserOutlined /> : null}
                                style={{
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    transition: 'all 0.3s ease'
                                }}
                            />

                            {/* Hover Overlay */}
                            {!avatarFile && !previewAvatar && (
                                <div
                                    className="avatar-overlay"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                        color: '#fff'
                                    }}
                                >
                                    <CameraOutlined style={{ fontSize: '28px', marginBottom: '4px' }} />
                                    <Text style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>Thay đổi</Text>
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {avatarLoading && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0,0,0,0.5)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <LoadingOutlined style={{ color: '#fff', fontSize: '24px' }} />
                                </div>
                            )}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Title level={4} style={{ margin: '0 0 8px 0' }}>
                                {profileData?.fullName || 'Chưa cập nhật tên'}
                            </Title>
                            <Text type="secondary">{profileData?.email}</Text>
                        </div>

                        {avatarFile || previewAvatar ? (
                            <Space>
                                <Button type="primary" icon={<SaveOutlined />} loading={updating === 'avatar'} onClick={handleAvatarSave}>
                                    Lưu Avatar
                                </Button>
                                <Button icon={<CloseOutlined />} onClick={handleAvatarCancel} disabled={updating === 'avatar'}>
                                    Hủy
                                </Button>
                            </Space>
                        ) : null}

                        <input
                            ref={uploadRef}
                            type="file"
                            accept="image/jpeg,image/png"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    beforeAvatarUpload(file);
                                }
                            }}
                        />
                    </Space>
                </div>

                <style jsx>{`
                    .avatar-container:hover .avatar-overlay {
                        opacity: 1 !important;
                    }
                `}</style>

                <Descriptions
                    layout="horizontal"
                    bordered
                    column={{
                        xxl: 2,
                        xl: 2,
                        lg: 2,
                        md: 1,
                        sm: 1,
                        xs: 1
                    }}
                    labelStyle={{
                        fontWeight: 'bold',
                        color: '#000000',
                        background: '#fafafa',
                        width: '150px'
                    }}
                    contentStyle={{
                        background: '#fff',
                        fontSize: '14px'
                    }}
                    size="middle"
                >
                    {/* Hàng 1: Họ và tên + Giới tính */}
                    <Descriptions.Item label="Họ và tên">
                        {renderEditableField('fullName', 'Họ và tên', profileData.fullName)}
                    </Descriptions.Item>

                    <Descriptions.Item label="Giới tính">
                        {renderEditableField('gender', 'Giới tính', getGenderText(profileData.gender), 'select')}
                    </Descriptions.Item>

                    {/* Hàng 2: Ngày sinh + Địa chỉ */}
                    <Descriptions.Item label="Ngày sinh">
                        {renderEditableField('dateOfBirth', 'Ngày sinh', formatDate(profileData.dateOfBirth), 'date')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Địa chỉ">
                        {renderEditableField('address', 'Địa chỉ', profileData.address || 'Chưa cập nhật')}
                    </Descriptions.Item>

                    {/* Hàng 3: Email + Số điện thoại (không có edit) */}
                    <Descriptions.Item label="Email">
                        <Text>{profileData.email}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Số điện thoại">
                        <Text>{profileData.phoneNumber}</Text>
                    </Descriptions.Item>

                    {/* Hàng 4: Tổng lượt booking (span 2 cột) */}
                    <Descriptions.Item label="Tổng lượt đặt tour" span={2}>
                        <Text strong style={{ fontSize: '16px' }}>
                            {profileData.bookingCount || 0} lượt
                        </Text>
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        );
    };

    const renderContent = () => {
        const commonCardStyle = {
            borderRadius: '16px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            minHeight: '400px'
        };

        const responsiveTextStyle = {
            textAlign: 'center',
            padding: { xs: '40px 16px', sm: '60px 20px' },
            color: '#666'
        };

        const responsiveEmojiStyle = {
            fontSize: { xs: '48px', sm: '72px' },
            marginBottom: '20px'
        };

        switch (selectedMenu) {
            case 'profile':
                return renderProfileInfo();
            case 'settings':
                return (
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                                ⚙️ Cài đặt tài khoản
                            </Title>
                        }
                        style={{
                            ...commonCardStyle,
                            border: '1px solid #b7eb8f'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f6ffed 0%, #e6fffb 100%)',
                            borderRadius: '16px 16px 0 0'
                        }}
                    >
                        <div style={responsiveTextStyle}>
                            <div style={responsiveEmojiStyle}>⚙️</div>
                            <Title level={4} type="secondary">
                                Tính năng đang được phát triển...
                            </Title>
                            <Text type="secondary">Các cài đặt tài khoản sẽ sớm được cập nhật! 🚀</Text>
                        </div>
                    </Card>
                );
            case 'security':
                return (
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0, color: '#faad14' }}>
                                🔐 Bảo mật & Quyền riêng tư
                            </Title>
                        }
                        style={{
                            ...commonCardStyle,
                            border: '1px solid #ffd591'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #fff7e6 0%, #fffbf0 100%)',
                            borderRadius: '16px 16px 0 0'
                        }}
                    >
                        <div style={responsiveTextStyle}>
                            <div style={responsiveEmojiStyle}>🛡️</div>
                            <Title level={4} type="secondary">
                                Tính năng bảo mật đang được hoàn thiện...
                            </Title>
                            <Text type="secondary">Hệ thống bảo mật tối ưu đang được phát triển! 🔒</Text>
                        </div>
                    </Card>
                );
            case 'history':
                return (
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0, color: '#722ed1' }}>
                                📅 Lịch sử đặt tour
                            </Title>
                        }
                        style={{
                            ...commonCardStyle,
                            border: '1px solid #d3adf7'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                            borderRadius: '16px 16px 0 0'
                        }}
                    >
                        <div style={responsiveTextStyle}>
                            <div style={responsiveEmojiStyle}>📜</div>
                            <Title level={4} type="secondary">
                                Lịch sử đặt tour đang được tải...
                            </Title>
                            <Text type="secondary">Tất cả các chuyến đi của bạn sẽ hiển thị tại đây! ✈️</Text>
                        </div>
                    </Card>
                );
            case 'favorites':
                return (
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0, color: '#f5222d' }}>
                                ❤️ Tour yêu thích
                            </Title>
                        }
                        style={{
                            ...commonCardStyle,
                            border: '1px solid #ffb3b8'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #fff1f0 0%, #ffece6 100%)',
                            borderRadius: '16px 16px 0 0'
                        }}
                    >
                        <div style={responsiveTextStyle}>
                            <div style={responsiveEmojiStyle}>💕</div>
                            <Title level={4} type="secondary">
                                Danh sách yêu thích của bạn
                            </Title>
                            <Text type="secondary">Các tour du lịch mà bạn đã lưu sẽ xuất hiện ở đây! 🌟</Text>
                        </div>
                    </Card>
                );
            case 'notifications':
                return (
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0, color: '#13c2c2' }}>
                                🔔 Thông báo
                            </Title>
                        }
                        style={{
                            ...commonCardStyle,
                            border: '1px solid #87e8de'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #e6fffb 0%, #f0fcff 100%)',
                            borderRadius: '16px 16px 0 0'
                        }}
                    >
                        <div style={responsiveTextStyle}>
                            <div style={responsiveEmojiStyle}>🔕</div>
                            <Title level={4} type="secondary">
                                Không có thông báo mới
                            </Title>
                            <Text type="secondary">Chúng tôi sẽ thông báo cho bạn về các ưu đãi hấp dẫn! 📢</Text>
                        </div>
                    </Card>
                );
            case 'rewards':
                return (
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0, color: '#eb2f96' }}>
                                🎁 Ưu đãi & Phần thưởng
                            </Title>
                        }
                        style={{
                            ...commonCardStyle,
                            border: '1px solid #ffb3d8'
                        }}
                        headStyle={{
                            background: 'linear-gradient(135deg, #fff0f6 0%, #fff2e8 100%)',
                            borderRadius: '16px 16px 0 0'
                        }}
                    >
                        <div style={responsiveTextStyle}>
                            <div style={responsiveEmojiStyle}>🎊</div>
                            <Title level={4} type="secondary">
                                Chương trình khuyến mãi
                            </Title>
                            <Text type="secondary">Tích lũy điểm thưởng và nhận ưu đãi hấp dẫn! 🏆</Text>
                        </div>
                    </Card>
                );
            default:
                return renderProfileInfo();
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '12px 8px',
                background: '#f5f5f5',
                minHeight: '100vh'
            }}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '16px 12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                <Title
                    level={2}
                    style={{
                        textAlign: 'center',
                        marginBottom: '24px',
                        fontSize: 'clamp(20px, 4vw, 32px)'
                    }}
                >
                    Quản lý Tài khoản
                </Title>
                <Row gutter={[16, 16]}>
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={6}
                        xl={5}
                        style={{
                            marginBottom: { xs: '16px', lg: '0' }
                        }}
                    >
                        <Card
                            style={{
                                minHeight: { xs: 'auto', lg: '500px' },
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            bodyStyle={{ padding: { xs: '12px', sm: '16px' } }}
                        >
                            <ProfileMenu
                                selectedKey={selectedMenu}
                                onMenuSelect={setSelectedMenu}
                                avatar={profileData?.profileImage}
                                userName={profileData?.fullName}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={18} xl={19}>
                        {renderContent()}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ProfilePage;

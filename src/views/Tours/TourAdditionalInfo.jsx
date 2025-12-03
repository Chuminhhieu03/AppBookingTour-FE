import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Row, Col, Space, Alert, message } from 'antd';
import {
    PlusOutlined,
    MinusCircleOutlined,
    EnvironmentOutlined,
    CoffeeOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    CarOutlined,
    GiftOutlined,
    HomeOutlined,
    ShopOutlined,
    StarOutlined,
    HeartOutlined,
    PhoneOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
    RocketOutlined,
    SmileOutlined,
    CustomerServiceOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

const { TextArea } = Input;

// Icon options for dropdown
const iconOptions = [
    { value: 'EnvironmentOutlined', label: 'Điểm tham quan', icon: <EnvironmentOutlined /> },
    { value: 'CoffeeOutlined', label: 'Ẩm thực', icon: <CoffeeOutlined /> },
    { value: 'TeamOutlined', label: 'Nhóm/Đối tượng', icon: <TeamOutlined /> },
    { value: 'ClockCircleOutlined', label: 'Thời gian', icon: <ClockCircleOutlined /> },
    { value: 'CarOutlined', label: 'Phương tiện', icon: <CarOutlined /> },
    { value: 'GiftOutlined', label: 'Quà tặng/Khuyến mãi', icon: <GiftOutlined /> },
    { value: 'HomeOutlined', label: 'Lưu trú', icon: <HomeOutlined /> },
    { value: 'ShopOutlined', label: 'Mua sắm', icon: <ShopOutlined /> },
    { value: 'StarOutlined', label: 'Đánh giá/Chất lượng', icon: <StarOutlined /> },
    { value: 'HeartOutlined', label: 'Yêu thích', icon: <HeartOutlined /> },
    { value: 'PhoneOutlined', label: 'Liên hệ', icon: <PhoneOutlined /> },
    { value: 'SafetyOutlined', label: 'An toàn', icon: <SafetyOutlined /> },
    { value: 'ThunderboltOutlined', label: 'Nhanh chóng', icon: <ThunderboltOutlined /> },
    { value: 'TrophyOutlined', label: 'Thành tích', icon: <TrophyOutlined /> },
    { value: 'RocketOutlined', label: 'Hiện đại', icon: <RocketOutlined /> },
    { value: 'SmileOutlined', label: 'Vui vẻ', icon: <SmileOutlined /> },
    { value: 'CustomerServiceOutlined', label: 'Dịch vụ', icon: <CustomerServiceOutlined /> },
    { value: 'InfoCircleOutlined', label: 'Thông tin', icon: <InfoCircleOutlined /> }
];

const TourAdditionalInfo = ({ additionalInfo = null, onChange = () => {}, readOnly = false }) => {
    const [additionalInfoItems, setAdditionalInfoItems] = useState([]);
    const [initialized, setInitialized] = useState(false);

    // Parse additionalInfo if it's a string or use provided array - only on initial load
    useEffect(() => {
        if (initialized) return; // Đã khởi tạo rồi thì không làm gì

        if (additionalInfo) {
            try {
                let parsedInfo = additionalInfo;
                if (typeof additionalInfo === 'string') {
                    parsedInfo = JSON.parse(additionalInfo);
                }
                if (Array.isArray(parsedInfo) && parsedInfo.length > 0) {
                    setAdditionalInfoItems(parsedInfo);
                } else {
                    setAdditionalInfoItems([]);
                }
            } catch (error) {
                console.error('Error parsing additional info:', error);
                setAdditionalInfoItems([]);
            }
        } else {
            setAdditionalInfoItems([]);
        }
        setInitialized(true);
    }, [additionalInfo, initialized]);

    // Notify parent component when data changes
    useEffect(() => {
        onChange(additionalInfoItems);
    }, [additionalInfoItems, onChange]);

    const handleAdditionalInfoChange = (index, field, value) => {
        if (readOnly) return;

        const newItems = [...additionalInfoItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setAdditionalInfoItems(newItems);
    };

    const addAdditionalInfoItem = () => {
        if (readOnly) return;

        if (additionalInfoItems.length >= 10) {
            message.warning('Tối đa 10 thông tin bổ sung!');
            return;
        }
        setAdditionalInfoItems([...additionalInfoItems, { icon: 'InfoCircleOutlined', title: '', content: '', color: '#04a9f5' }]);
    };

    const removeAdditionalInfoItem = (index) => {
        if (readOnly) return;

        const newItems = additionalInfoItems.filter((_, i) => i !== index);
        setAdditionalInfoItems(newItems);
    };

    if (readOnly) {
        return (
            <div>
                <Alert
                    message="Thông tin chuyến đi"
                    description="Các thông tin bổ sung về tour du lịch"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {additionalInfoItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <p>Chưa có thông tin chuyến đi nào được cấu hình</p>
                        </div>
                    ) : (
                        additionalInfoItems.map((item, index) => (
                            <Card key={index} size="small" title={`Thông tin ${index + 1}`}>
                                <Row gutter={16}>
                                    <Col xs={24} md={6}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Icon:</strong>
                                        </div>
                                        <Input
                                            value={iconOptions.find((opt) => opt.value === item.icon)?.label || item.icon}
                                            readOnly
                                            addonBefore={iconOptions.find((opt) => opt.value === item.icon)?.icon}
                                        />
                                    </Col>

                                    <Col xs={24} md={6}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Tiêu đề:</strong>
                                        </div>
                                        <Input value={item.title} readOnly />
                                    </Col>

                                    <Col xs={24} md={9}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Nội dung:</strong>
                                        </div>
                                        <TextArea value={item.content} readOnly />
                                    </Col>

                                    <Col xs={24} md={3}>
                                        <div style={{ marginBottom: 8 }}>
                                            <strong>Màu:</strong>
                                        </div>
                                        <Input
                                            value={item.color}
                                            readOnly
                                            style={{
                                                backgroundColor: item.color,
                                                color: '#fff'
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    )}
                </Space>
            </div>
        );
    }

    return (
        <div>
            <Alert
                message="Quản lý thông tin chuyến đi"
                description="Cấu hình các thông tin bổ sung về tour như điểm tham quan, ẩm thực, đối tượng thích hợp, thời gian lý tưởng..."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {additionalInfoItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        <p>Chưa có thông tin chuyến đi nào</p>
                        <Button type="primary" onClick={addAdditionalInfoItem} icon={<PlusOutlined />}>
                            Thêm thông tin đầu tiên
                        </Button>
                    </div>
                ) : (
                    additionalInfoItems.map((item, index) => (
                        <Card
                            key={index}
                            size="small"
                            title={`Thông tin ${index + 1}`}
                            extra={
                                <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => removeAdditionalInfoItem(index)}>
                                    Xóa
                                </Button>
                            }
                        >
                            <Row gutter={16}>
                                <Col xs={24} md={6}>
                                    <div style={{ marginBottom: 8 }}>
                                        <strong>Icon:</strong>
                                    </div>
                                    <Select
                                        value={item.icon}
                                        onChange={(value) => handleAdditionalInfoChange(index, 'icon', value)}
                                        style={{ width: '100%' }}
                                    >
                                        {iconOptions.map((opt) => (
                                            <Select.Option key={opt.value} value={opt.value}>
                                                <Space>
                                                    {opt.icon}
                                                    {opt.label}
                                                </Space>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Col>

                                <Col xs={24} md={6}>
                                    <div style={{ marginBottom: 8 }}>
                                        <strong>Tiêu đề:</strong>
                                    </div>
                                    <Input
                                        value={item.title}
                                        onChange={(e) => handleAdditionalInfoChange(index, 'title', e.target.value)}
                                        placeholder="VD: Điểm tham quan"
                                        maxLength={100}
                                    />
                                </Col>

                                <Col xs={24} md={9}>
                                    <div style={{ marginBottom: 8 }}>
                                        <strong>Nội dung:</strong>
                                    </div>
                                    <TextArea
                                        value={item.content}
                                        onChange={(e) => handleAdditionalInfoChange(index, 'content', e.target.value)}
                                        placeholder="VD: Sapa, Bản Cát Cát, Fansipan..."
                                        rows={1}
                                        maxLength={500}
                                        showCount
                                    />
                                </Col>

                                <Col xs={24} md={3}>
                                    <div style={{ marginBottom: 8 }}>
                                        <strong>Màu:</strong>
                                    </div>
                                    <Input
                                        type="color"
                                        value={item.color}
                                        onChange={(e) => handleAdditionalInfoChange(index, 'color', e.target.value)}
                                        style={{ width: '100%', height: 40 }}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))
                )}

                {additionalInfoItems.length > 0 && additionalInfoItems.length < 10 && (
                    <Button type="dashed" onClick={addAdditionalInfoItem} block icon={<PlusOutlined />}>
                        Thêm thông tin
                    </Button>
                )}
            </Space>
        </div>
    );
};

export default TourAdditionalInfo;

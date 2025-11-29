import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Row, Col, Space, Alert, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const TourImportantInfo = ({ importantInfo = null, onChange = () => {}, readOnly = false }) => {
    const [importantInfoSections, setImportantInfoSections] = useState([]);
    const [initialized, setInitialized] = useState(false);

    // Parse importantInfo if it's a string or use provided array - only on initial load
    useEffect(() => {
        if (initialized) return; // Đã khởi tạo rồi thì không làm gì

        if (importantInfo) {
            try {
                let parsedInfo = importantInfo;
                if (typeof importantInfo === 'string') {
                    parsedInfo = JSON.parse(importantInfo);
                }
                if (Array.isArray(parsedInfo) && parsedInfo.length > 0) {
                    setImportantInfoSections(parsedInfo);
                } else {
                    setImportantInfoSections([]);
                }
            } catch (error) {
                console.error('Error parsing important info:', error);
                setImportantInfoSections([]);
            }
        } else {
            setImportantInfoSections([]);
        }
        setInitialized(true);
    }, [importantInfo, initialized]);

    // Notify parent component when data changes
    useEffect(() => {
        onChange(importantInfoSections);
    }, [importantInfoSections, onChange]);

    const handleImportantInfoSectionChange = (sectionIndex, field, value) => {
        if (readOnly) return;

        const newSections = [...importantInfoSections];
        newSections[sectionIndex] = { ...newSections[sectionIndex], [field]: value };
        setImportantInfoSections(newSections);
    };

    const handleImportantInfoItemChange = (sectionIndex, itemIndex, value) => {
        if (readOnly) return;

        const newSections = [...importantInfoSections];
        newSections[sectionIndex].items[itemIndex] = value;
        setImportantInfoSections(newSections);
    };

    const addImportantInfoSection = () => {
        if (readOnly) return;

        if (importantInfoSections.length >= 15) {
            message.warning('Tối đa 15 sections!');
            return;
        }
        setImportantInfoSections([...importantInfoSections, { title: '', items: [''] }]);
    };

    const removeImportantInfoSection = (sectionIndex) => {
        if (readOnly) return;
        setImportantInfoSections((prev) => prev.filter((_, i) => i !== sectionIndex));
    };

    const addImportantInfoItem = (sectionIndex) => {
        if (readOnly) return;

        const newSections = [...importantInfoSections];
        if (newSections[sectionIndex].items.length >= 20) {
            message.warning('Mỗi section tối đa 20 items!');
            return;
        }
        newSections[sectionIndex].items.push('');
        setImportantInfoSections(newSections);
    };

    const removeImportantInfoItem = (sectionIndex, itemIndex) => {
        if (readOnly) return;

        const newSections = [...importantInfoSections];
        newSections[sectionIndex].items.splice(itemIndex, 1);
        setImportantInfoSections(newSections);
    };

    if (readOnly) {
        return (
            <div>
                <Alert
                    message="Thông tin quan trọng"
                    description="Các thông tin quan trọng cần lưu ý khi tham gia tour"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {importantInfoSections.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <p>Chưa có thông tin quan trọng nào được cấu hình</p>
                        </div>
                    ) : (
                        importantInfoSections.map((section, sectionIndex) => (
                            <Card
                                key={sectionIndex}
                                title={section.title || `Section ${sectionIndex + 1}`}
                                style={{ border: '1px solid #d9d9d9' }}
                            >
                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} style={{ marginBottom: '8px' }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
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
                message="Quản lý các thông tin quan trọng về tour"
                description="Cấu hình các section như điều kiện thanh toán, hủy tour, giấy tờ cần thiết, hành lý, lưu ý và chính sách. Mỗi section có thể có nhiều items."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {importantInfoSections.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                        <p>Chưa có thông tin quan trọng nào</p>
                        <Button type="primary" onClick={addImportantInfoSection} icon={<PlusOutlined />}>
                            Thêm section đầu tiên
                        </Button>
                    </div>
                ) : (
                    importantInfoSections.map((section, sectionIndex) => (
                        <Card
                            key={sectionIndex}
                            title={`Section ${sectionIndex + 1}`}
                            extra={
                                <Button
                                    danger
                                    size="small"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => removeImportantInfoSection(sectionIndex)}
                                >
                                    Xóa section
                                </Button>
                            }
                            style={{ border: '1px solid #d9d9d9' }}
                        >
                            <Row gutter={16}>
                                <Col span={24} style={{ marginBottom: 16 }}>
                                    <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
                                        Tiêu đề section <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    <Input
                                        placeholder="VD: Điều kiện thanh toán, Hành lý, Chính sách trẻ em..."
                                        value={section.title}
                                        onChange={(e) => handleImportantInfoSectionChange(sectionIndex, 'title', e.target.value)}
                                        maxLength={200}
                                        showCount
                                    />
                                </Col>

                                <Col span={24}>
                                    <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
                                        Danh sách items <span style={{ color: 'red' }}>*</span>
                                    </label>
                                    {section.items.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                            <p>Chưa có item nào trong section này</p>
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={() => addImportantInfoItem(sectionIndex)}
                                            >
                                                Thêm item đầu tiên
                                            </Button>
                                        </div>
                                    ) : (
                                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                                            {section.items.map((item, itemIndex) => (
                                                <Space.Compact key={itemIndex} style={{ width: '100%' }}>
                                                    <Input
                                                        placeholder="Nhập nội dung item..."
                                                        value={item}
                                                        onChange={(e) =>
                                                            handleImportantInfoItemChange(sectionIndex, itemIndex, e.target.value)
                                                        }
                                                        maxLength={500}
                                                        style={{ width: '100%' }}
                                                    />
                                                    <Button
                                                        danger
                                                        icon={<MinusCircleOutlined />}
                                                        onClick={() => removeImportantInfoItem(sectionIndex, itemIndex)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </Space.Compact>
                                            ))}

                                            <Button
                                                type="dashed"
                                                icon={<PlusOutlined />}
                                                onClick={() => {
                                                    if (section.items.length >= 20) {
                                                        message.warning('Mỗi section tối đa 20 items!');
                                                        return;
                                                    }
                                                    addImportantInfoItem(sectionIndex);
                                                }}
                                                disabled={section.items.length >= 20}
                                                style={{ width: '100%' }}
                                            >
                                                Thêm item
                                            </Button>
                                        </Space>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    ))
                )}

                {importantInfoSections.length > 0 && importantInfoSections.length < 15 && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            if (importantInfoSections.length >= 15) {
                                message.warning('Tối đa 15 sections!');
                                return;
                            }
                            addImportantInfoSection();
                        }}
                        disabled={importantInfoSections.length >= 15}
                        block
                    >
                        Thêm section mới
                    </Button>
                )}
            </Space>
        </div>
    );
};

export default TourImportantInfo;

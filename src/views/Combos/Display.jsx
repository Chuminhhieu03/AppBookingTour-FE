import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card,
    Descriptions,
    Button,
    Space,
    Tag,
    message,
    Modal,
    Row,
    Col,
    Typography,
    Spin,
    Empty,
    Table,
    Progress,
    Carousel,
    Image,
    Rate,
    Badge,
    Collapse
} from 'antd';
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    CarOutlined,
    RocketOutlined,
    EyeOutlined,
    StarFilled,
    EnvironmentOutlined,
    CoffeeOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    GiftOutlined,
    HomeOutlined,
    ShopOutlined,
    StarOutlined,
    HeartOutlined,
    PhoneOutlined,
    SafetyOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
    SmileOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';
import MainCard from 'components/MainCard';
import comboAPI from 'api/combo/comboAPI';
import Utility from 'utils/Utility';
import { formatDate } from 'utils/dateFormatter';
import './ComboContent.scss';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const CombosDisplay = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [combo, setCombo] = useState(null);

    useEffect(() => {
        fetchComboDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    const fetchComboDetail = async () => {
        setLoading(true);
        try {
            const response = await comboAPI.getById(id);
            if (response.success) {
                setCombo(response.data);
            } else {
                message.error(response.message || 'Không thể tải thông tin combo');
                navigate('/admin/service/combo');
            }
        } catch (error) {
            console.error('Error fetching combo detail:', error);
            message.error('Đã xảy ra lỗi khi tải thông tin combo');
            navigate('/admin/service/combo');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = () => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc chắn muốn xóa combo "${combo.code}"?`,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await comboAPI.delete(id);
                    if (response.success) {
                        message.success('Xóa combo thành công');
                        navigate('/admin/service/combo');
                    } else {
                        message.error(response.message || 'Không thể xóa combo');
                    }
                } catch (error) {
                    console.error('Error deleting combo:', error);
                    message.error(error.response?.data?.message || 'Đã xảy ra lỗi khi xóa combo');
                }
            }
        });
    };

    const getVehicleDisplay = (vehicle) => {
        console.log('Vehicle value:', vehicle);
        if (vehicle == 1) return <>Xe ô tô</>;
        if (vehicle == 2) return <>Máy bay</>;
        return vehicle;
    };

    const iconMap = {
        EnvironmentOutlined: EnvironmentOutlined,
        CoffeeOutlined: CoffeeOutlined,
        TeamOutlined: TeamOutlined,
        ClockCircleOutlined: ClockCircleOutlined,
        CarOutlined: CarOutlined,
        GiftOutlined: GiftOutlined,
        HomeOutlined: HomeOutlined,
        ShopOutlined: ShopOutlined,
        StarOutlined: StarOutlined,
        HeartOutlined: HeartOutlined,
        PhoneOutlined: PhoneOutlined,
        SafetyOutlined: SafetyOutlined,
        ThunderboltOutlined: ThunderboltOutlined,
        TrophyOutlined: TrophyOutlined,
        RocketOutlined: RocketOutlined,
        SmileOutlined: SmileOutlined,
        CustomerServiceOutlined: CustomerServiceOutlined
    };

    const getAdditionalInfoItems = () => {
        if (!combo.additionalInfo) return [];
        try {
            const parsed = JSON.parse(combo.additionalInfo);
            if (parsed && Array.isArray(parsed.items)) {
                return parsed.items;
            }
        } catch (e) {
            console.error('Failed to parse additionalInfo:', e);
        }
        return [];
    };

    const getImportantInfoSections = () => {
        if (!combo.importantInfo) return [];
        try {
            const parsed = JSON.parse(combo.importantInfo);
            if (parsed && Array.isArray(parsed.sections)) {
                return parsed.sections;
            }
        } catch (e) {
            console.error('Failed to parse importantInfo:', e);
        }
        return [];
    };

    const getStatusTag = (status) => {
        const statusMap = {
            Available: { color: 'success', text: 'Còn chỗ' },
            Full: { color: 'error', text: 'Đã đầy' },
            Cancelled: { color: 'default', text: 'Đã hủy' }
        };
        const statusInfo = statusMap[status] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    };

    const scheduleColumns = [
        {
            title: 'Ngày khởi hành',
            dataIndex: 'departureDate',
            key: 'departureDate',
            render: (date) => formatDate(date)
        },
        {
            title: 'Ngày về',
            dataIndex: 'returnDate',
            key: 'returnDate',
            render: (date) => formatDate(date)
        },
        {
            title: 'Số chỗ',
            key: 'slots',
            render: (_, record) => {
                const percent = (record.bookedSlots / record.availableSlots) * 100;
                return (
                    <div>
                        <div>{`${record.bookedSlots} / ${record.availableSlots}`}</div>
                        <Progress percent={Math.round(percent)} size="small" status={percent >= 100 ? 'exception' : 'active'} />
                    </div>
                );
            }
        },
        {
            title: 'Giá người lớn',
            dataIndex: 'basePriceAdult',
            key: 'basePriceAdult',
            render: (price) => <span style={{ fontWeight: 500 }}>{Utility.formatPrice(price)}</span>
        },
        {
            title: 'Giá trẻ em',
            dataIndex: 'basePriceChildren',
            key: 'basePriceChildren',
            render: (price) => <span style={{ fontWeight: 500 }}>{Utility.formatPrice(price)}</span>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => getStatusTag(status)
        }
    ];

    if (loading) {
        return (
            <MainCard>
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" tip="Đang tải thông tin combo..." />
                </div>
            </MainCard>
        );
    }

    if (!combo) {
        return (
            <MainCard>
                <Empty description="Không tìm thấy thông tin combo" />
            </MainCard>
        );
    }

    return (
        <MainCard>
            {/* Header Actions */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/service/combo')}>
                        Quay lại
                    </Button>
                </Col>
                <Col>
                    <Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin/service/combo/edit/${id}`)}>
                            Chỉnh sửa
                        </Button>
                        <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                            Xóa
                        </Button>
                    </Space>
                </Col>
            </Row>

            {/* Cover Image & Title */}
            {combo.comboImageCoverUrl && (
                <Card style={{ marginBottom: 16 }}>
                    <Image
                        src={combo.comboImageCoverUrl}
                        alt={combo.name}
                        style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
                        preview={{
                            mask: <div>🔍 Xem ảnh bìa</div>
                        }}
                    />
                </Card>
            )}

            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                            <div>
                                <Badge count={combo.code} style={{ backgroundColor: '#1890ff' }} />
                                <Tag color={combo.isActive ? 'success' : 'default'} style={{ marginLeft: 8 }}>
                                    {combo.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                </Tag>
                            </div>
                            <Title level={2} style={{ margin: 0 }}>
                                {combo.name}
                            </Title>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Main Information */}
            <Card title="Thông tin chính" style={{ marginBottom: 16 }}>
                <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
                    <Descriptions.Item label="Tuyến đường">
                        {combo.fromCityName} → {combo.toCityName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương tiện">{getVehicleDisplay(combo.vehicle)}</Descriptions.Item>
                    <Descriptions.Item label="Thời lượng">{Utility.formatDuration(combo.durationDays)}</Descriptions.Item>
                    <Descriptions.Item label="Giá cơ bản người lớn">
                        <span style={{ fontSize: 16 }}>{Utility.formatPrice(combo.basePriceAdult)}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá cơ bản trẻ em">
                        <span style={{ fontSize: 16 }}>{Utility.formatPrice(combo.basePriceChildren)}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Đánh giá">
                        <Rate disabled value={combo.rating} /> ({combo.rating})
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng bookings">
                        <Badge count={combo.totalBookings} showZero style={{ backgroundColor: '#52c41a' }} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Lượt xem">
                        <Badge count={combo.viewCount} showZero style={{ backgroundColor: '#1890ff' }} />
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Short Description */}
            {combo.shortDescription && (
                <Card title="Mô tả ngắn" style={{ marginBottom: 16 }}>
                    <Paragraph>{combo.shortDescription}</Paragraph>
                </Card>
            )}

            {/* Amenities */}
            {combo.amenities && combo.amenities.length > 0 && (
                <Card title="Tiện nghi" style={{ marginBottom: 16 }}>
                    <Space wrap>
                        {combo.amenities.map((amenity, index) => (
                            <Tag key={index} color="blue">
                                {amenity}
                            </Tag>
                        ))}
                    </Space>
                </Card>
            )}

            {/* Additional Info */}
            {getAdditionalInfoItems().length > 0 && (
                <Card title="Thông tin chuyến đi" style={{ marginBottom: 16 }}>
                    <Row gutter={[16, 16]}>
                        {getAdditionalInfoItems().map((item, index) => {
                            const IconComponent = iconMap[item.icon] || EnvironmentOutlined;
                            return (
                                <Col xs={24} sm={12} lg={8} key={index}>
                                    <div style={{ textAlign: 'center', padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
                                        <div style={{ marginBottom: 12 }}>
                                            <IconComponent style={{ fontSize: 32, color: item.color || '#04a9f5' }} />
                                        </div>
                                        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#2C3E50' }}>
                                            {item.title}
                                        </div>
                                        <div style={{ fontSize: 14, color: '#64748B' }}>{item.content}</div>
                                    </div>
                                </Col>
                            );
                        })}
                    </Row>
                </Card>
            )}

            {/* Description */}
            {combo.description && (
                <Card title="Mô tả chi tiết" style={{ marginBottom: 16 }}>
                    <div className="combo-content" dangerouslySetInnerHTML={{ __html: combo.description }} />
                </Card>
            )}

            {/* Important Info Sections */}
            {getImportantInfoSections().length > 0 && (
                <Card title="Thông tin quan trọng" style={{ marginBottom: 16 }}>
                    <Collapse
                        items={getImportantInfoSections().map((section, index) => ({
                            key: String(index),
                            label: <span style={{ fontWeight: 600 }}>{section.title}</span>,
                            children: (
                                <ul style={{ paddingLeft: 20, margin: 0 }}>
                                    {section.items.map((item, itemIndex) => (
                                        <li key={itemIndex} style={{ marginBottom: 8 }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )
                        }))}
                    />
                </Card>
            )}

            {/* Includes & Excludes */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                {combo.includes && combo.includes.length > 0 && (
                    <Col xs={24} md={12}>
                        <Card title="Bao gồm" size="small">
                            <ul>
                                {combo.includes.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </Card>
                    </Col>
                )}
                {combo.excludes && combo.excludes.length > 0 && (
                    <Col xs={24} md={12}>
                        <Card title="❌ Không bao gồm" size="small">
                            <ul>
                                {combo.excludes.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* Terms & Conditions */}
            {combo.termsConditions && (
                <Card style={{ marginBottom: 16 }}>
                    <Collapse>
                        <Panel header="Điều khoản & Điều kiện" key="1">
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{combo.termsConditions}</pre>
                        </Panel>
                    </Collapse>
                </Card>
            )}

            {/* Schedules */}
            {combo.schedules && combo.schedules.length > 0 && (
                <Card title={`Lịch khởi hành (${combo.schedules.length} lịch)`} style={{ marginBottom: 16 }}>
                    <Table columns={scheduleColumns} dataSource={combo.schedules} rowKey="id" pagination={false} scroll={{ x: 800 }} />
                </Card>
            )}

            {/* Gallery */}
            {combo.comboImages && combo.comboImages.length > 0 && (
                <Card title="Thư viện ảnh" style={{ marginBottom: 16 }}>
                    <Carousel
                        autoplay
                        autoplaySpeed={3000}
                        dots={true}
                        arrows={true}
                        slidesToShow={3}
                        slidesToScroll={1}
                        infinite={true}
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                        ]}
                    >
                        {combo.comboImages.map((image, index) => (
                            <div key={index} style={{ padding: '0 8px' }}>
                                <Image
                                    src={image}
                                    alt={`${combo.name} - ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: 250,
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        cursor: 'pointer'
                                    }}
                                    preview={{
                                        mask: <div>🔍 Xem ảnh</div>
                                    }}
                                />
                            </div>
                        ))}
                    </Carousel>
                </Card>
            )}
        </MainCard>
    );
};

export default CombosDisplay;

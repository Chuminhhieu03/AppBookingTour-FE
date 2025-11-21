import { Card, Row, Col, Rate, Tag } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import comboAPI from 'api/combo/comboAPI';

const RelatedCombos = ({ currentComboId, fromCityId, toCityId }) => {
    const navigate = useNavigate();
    const [combos, setCombos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRelatedCombos();
    }, [currentComboId]);

    const fetchRelatedCombos = async () => {
        try {
            setLoading(true);
            const response = await comboAPI.getRelated(currentComboId, 4);
            setCombos(response.data || []);
        } catch (error) {
            console.error('Failed to fetch related combos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComboClick = (comboId) => {
        navigate(`/combos/${comboId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return (
            <Card title={<span style={{ fontSize: 20, fontWeight: 'bold' }}>COMBO TƯƠNG TỰ</span>}>
                <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>Đang tải...</div>
            </Card>
        );
    }

    if (!combos || combos.length === 0) {
        return null;
    }

    return (
        <Card title={<span style={{ fontSize: 20, fontWeight: 'bold' }}>COMBO TƯƠNG TỰ</span>} style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
                {combos.map((combo) => (
                    <Col xs={24} sm={12} lg={6} key={combo.id}>
                        <Card
                            hoverable
                            onClick={() => handleComboClick(combo.id)}
                            cover={
                                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        alt={combo.name}
                                        src={combo.comboImageCoverUrl || '/placeholder-image.jpg'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    {combo.discount && (
                                        <Tag
                                            color="red"
                                            style={{
                                                position: 'absolute',
                                                top: 10,
                                                right: 10,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            -{combo.discount}%
                                        </Tag>
                                    )}
                                </div>
                            }
                            style={{
                                border: '1px solid #E2E8F0',
                                borderRadius: 12,
                                overflow: 'hidden'
                            }}
                            bodyStyle={{ padding: 16 }}
                        >
                            <div style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 8 }}>{combo.name}</div>
                                <div
                                    style={{
                                        fontSize: 13,
                                        color: '#64748B',
                                        marginBottom: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4
                                    }}
                                >
                                    <EnvironmentOutlined />
                                    {combo.fromCityName} → {combo.toCityName}
                                </div>
                                <div style={{ fontSize: 13, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <ClockCircleOutlined />
                                    {combo.durationDays} ngày {combo.durationDays - 1} đêm
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginTop: 12,
                                    paddingTop: 12,
                                    borderTop: '1px solid #E2E8F0'
                                }}
                            >
                                <Rate disabled defaultValue={combo.rating || 4.5} style={{ fontSize: 14 }} />
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 18, fontWeight: 'bold', color: '#FF6B35' }}>
                                        {formatPrice(combo.basePriceAdult)}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#64748B' }}>/ người</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default RelatedCombos;

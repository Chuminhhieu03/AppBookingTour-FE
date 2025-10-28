import { Col, Row, Button, Space, Input, Select, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourCategoryAPI from '../../../api/tour/tourCategoryAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;

export default function TourCategoryDisplay() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [category, setCategory] = useState({});

    useEffect(() => {
        if (id) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourCategoryAPI.getById(id);
            if (response.success) {
                setCategory(response.data || {});
            } else {
                message.error('Không tìm thấy danh mục tour!');
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            message.error('Đã xảy ra lỗi khi tải danh mục tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleEdit = () => {
        navigate(`/admin/service/tour-category/edit/${id}`);
    };

    const handleBack = () => {
        navigate('/admin/service/tour-category');
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết danh mục tour"
                    secondary={
                        <Space>
                            <Button type="primary" onClick={handleEdit} shape="round" icon={<EditOutlined />}>
                                Chỉnh sửa
                            </Button>
                            <Button onClick={handleBack} shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
                            <span>Tên danh mục</span>
                            <Input value={category.name} readOnly />
                        </Col>
                        <Col span={12}>
                            <span>Danh mục cha</span>
                            <Input value={category.parentCategoryName || 'Danh mục gốc'} readOnly />
                        </Col>
                        <Col span={12}>
                            <span>Trạng thái</span>
                            <Select value={category.isActive} disabled style={{ width: '100%' }}>
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Ngừng hoạt động</Select.Option>
                            </Select>
                        </Col>
                        <Col span={12}>
                            <span>Ngày tạo</span>
                            <Input value={category.createdAt ? new Date(category.createdAt).toLocaleDateString('vi-VN') : ''} readOnly />
                        </Col>
                        {category.updatedAt && (
                            <Col span={12}>
                                <span>Ngày cập nhật</span>
                                <Input value={new Date(category.updatedAt).toLocaleDateString('vi-VN')} readOnly />
                            </Col>
                        )}
                        {category.imageUrl && (
                            <Col span={24}>
                                <span>Hình ảnh</span>
                                <div style={{ marginTop: 8 }}>
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        style={{
                                            maxWidth: 300,
                                            maxHeight: 200,
                                            objectFit: 'cover',
                                            borderRadius: 4,
                                            border: '1px solid #d9d9d9'
                                        }}
                                    />
                                </div>
                            </Col>
                        )}
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea value={category.description || 'Không có mô tả'} readOnly rows={4} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

import { Input, Button, Select, Row, Col, message, Space, Form } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourTypeAPI from '../../../api/tour/tourTypeAPI';
import LoadingModal from '../../../components/LoadingModal';
import ImagesUC from '../../components/basic/ImagesUC';

const { TextArea } = Input;

export default function TourTypeEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);
    const [initialImageUrl, setInitialImageUrl] = useState('');

    useEffect(() => {
        const fetchTourType = async () => {
            try {
                LoadingModal.showLoading();
                const response = await tourTypeAPI.getById(id);
                if (response.success) {
                    const data = response.data;
                    setTourType({
                        Name: data.name,
                        Description: data.description,
                        PriceLevel: data.priceLevel,
                        ImageUrl: data.imageUrl,
                        Image: null,
                        IsActive: data.isActive
                    });
                } else {
                    message.error('Không tìm thấy loại tour!');
                    navigate('/admin/service/tour-type');
                }
            } catch (error) {
                console.error('Error fetching tour type:', error);
                message.error('Đã xảy ra lỗi khi tải loại tour.');
            } finally {
                LoadingModal.hideLoading();
            }
        };

        if (id) {
            fetchTourType();
        }
    }, [id, navigate]);

    const onUpdateTourType = async (tourType) => {
        if (!tourType.Name?.trim()) {
            message.warning('Tên loại tour không được để trống!');
            return;
        }

        LoadingModal.showLoading();

        try {
            const formData = new FormData();
            formData.append('Name', tourType.Name);
            formData.append('Description', tourType.Description || '');
            formData.append('PriceLevel', tourType.PriceLevel || '');
            formData.append('IsActive', tourType.IsActive);

            if (tourType.Image) {
                formData.append('Image', tourType.Image);
            }

            const response = await tourTypeAPI.update(id, formData);

            if (response.success) {
                message.success('Cập nhật loại tour thành công!');
                navigate('/admin/service/tour-type');
            } else {
                message.error(response.message || 'Không thể cập nhật loại tour!');
            }
        } catch (error) {
            console.error('Error updating tour type:', error);
            message.error('Đã xảy ra lỗi khi cập nhật loại tour.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chỉnh sửa loại tour"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => onUpdateTourType(tourType)}>
                                Lưu
                            </Button>
                            <Button type="primary" href="/admin/service/tour-type" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <ImagesUC imageUrl={tourType.ImageUrl} onChange={(_, file) => setTourType({ ...tourType, Image: file })} />
                            </div>
                            <span>Hình ảnh loại tour</span>
                        </Col>

                        <Col span={8}>
                            <span>Tên loại tour</span>
                            <Input
                                value={tourType.Name}
                                onChange={(e) => setTourType({ ...tourType, Name: e.target.value })}
                                placeholder="Nhập tên loại tour"
                            />
                        </Col>

                        <Col span={8}>
                            <span>Loại mức giá</span>
                            <Select
                                value={tourType.PriceLevel}
                                allowClear
                                className="w-100"
                                placeholder="Chọn loại mức giá (tùy chọn)"
                                options={[
                                    { label: 'Tiết kiệm', value: 1 },
                                    { label: 'Tiêu chuẩn', value: 2 },
                                    { label: 'Cao cấp', value: 3 }
                                ]}
                                onChange={(val) => setTourType({ ...tourType, PriceLevel: val })}
                            />
                        </Col>

                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select
                                value={tourType.IsActive}
                                className="w-100"
                                options={[
                                    { label: 'Hoạt động', value: true },
                                    { label: 'Ngừng hoạt động', value: false }
                                ]}
                                onChange={(val) => setTourType({ ...tourType, IsActive: val })}
                            />
                        </Col>

                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={tourType.Description}
                                onChange={(e) => setTourType({ ...tourType, Description: e.target.value })}
                                rows={4}
                                placeholder="Nhập mô tả cho loại tour (không bắt buộc)"
                            />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

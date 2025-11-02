import { Col, Row, Button, Space, Input, InputNumber, message, Form } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourItineraryAPI from '../../../api/tour/tourItineraryAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;

export default function TourItineraryEdit() {
    const navigate = useNavigate();
    const { tourId, itineraryId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (itineraryId) {
            fetchItinerary();
        }
    }, [itineraryId]);

    const fetchItinerary = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourItineraryAPI.getById(itineraryId);
            if (response.success) {
                form.setFieldsValue(response.data);
            } else {
                message.error('Không tìm thấy lịch trình!');
            }
        } catch (error) {
            console.error('Error fetching itinerary:', error);
            message.error('Đã xảy ra lỗi khi tải lịch trình.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            LoadingModal.showLoading();

            const payload = {
                ...values,
                tourId: Number(tourId)
            };

            const response = await tourItineraryAPI.update(itineraryId, payload);
            if (response.success) {
                message.success('Cập nhật lịch trình thành công!');
                navigate(`/admin/service/tour/edit/${tourId}`);
            } else {
                console.error('Error response from server:', response);
                message.error(response.message || 'Cập nhật lịch trình thất bại!');
            }
        } catch (error) {
            console.error('Error updating itinerary:', error);
            if (error.response && error.response.data && error.response.data.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đã xảy ra lỗi khi cập nhật lịch trình tour.');
            }
        } finally {
            setLoading(false);
            LoadingModal.hideLoading();
        }
    };

    const handleCancel = () => {
        navigate(`/admin/service/tour/edit/${tourId}`);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chỉnh sửa lịch trình"
                    secondary={
                        <Space>
                            <Button type="primary" onClick={() => form.submit()} loading={loading} shape="round" icon={<CheckOutlined />}>
                                Lưu
                            </Button>
                            <Button onClick={handleCancel} shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Row gutter={[24, 24]}>
                            <Col span={4}>
                                <Form.Item
                                    name="dayNumber"
                                    label="Ngày thứ"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập ngày lịch trình ở dạng số!' },
                                        { type: 'number', min: 1, message: 'Ngày phải lớn hơn 0!' }
                                    ]}
                                >
                                    <InputNumber placeholder="Nhập ngày (VD: 1, 2, 3...)" className="w-100" min={1} />
                                </Form.Item>
                            </Col>
                            <Col span={20}>
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề lịch trình"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập tiêu đề!' },
                                        { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
                                    ]}
                                >
                                    <Input placeholder="Nhập tiêu đề lịch trình" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="description"
                                    label="Mô tả chi tiết"
                                    rules={[{ max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }]}
                                >
                                    <TextArea rows={4} placeholder="Nhập mô tả chi tiết của lịch trình" maxLength={500} showCount />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="activity"
                                    label="Hoạt động trong ngày"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập hoạt động trong ngày!' },
                                        { max: 1000, message: 'Hoạt động không được vượt quá 1000 ký tự!' }
                                    ]}
                                >
                                    <TextArea rows={6} placeholder="Mô tả chi tiết các hoạt động trong ngày" maxLength={1000} showCount />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="note"
                                    label="Ghi chú"
                                    rules={[{ max: 500, message: 'Ghi chú không được vượt quá 500 ký tự!' }]}
                                >
                                    <TextArea rows={4} placeholder="Nhập ghi chú bổ sung (không bắt buộc)" maxLength={500} showCount />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

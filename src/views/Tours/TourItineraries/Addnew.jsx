import { Col, Row, Button, Space, Input, InputNumber, message, Form } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainCard from '../../../components/MainCard';
import tourItineraryAPI from '../../../api/tour/tourItineraryAPI';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;

export default function TourItineraryAddnew() {
    const navigate = useNavigate();
    const { tourId } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            LoadingModal.showLoading();

            const payload = {
                ...values,
                tourId: Number(tourId)
            };

            const response = await tourItineraryAPI.create(payload);
            if (response.success) {
                message.success('Tạo lịch trình thành công!');
                navigate(`/admin/service/tour/edit/${tourId}`);
            } else {
                message.error('Tạo lịch trình thất bại!');
            }
        } catch (error) {
            console.error('Error creating itinerary:', error);
            message.error('Đã xảy ra lỗi khi tạo lịch trình.');
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
                    title="Thêm lịch trình mới"
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
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            dayNumber: 1,
                            title: '',
                            description: '',
                            activity: '',
                            note: ''
                        }}
                    >
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
                                    <TextArea rows={4} placeholder="Nhập mô tả chi tiết của lịch trình" />
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
                                    <TextArea rows={6} placeholder="Mô tả chi tiết các hoạt động trong ngày" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="note"
                                    label="Ghi chú"
                                    rules={[{ max: 300, message: 'Ghi chú không được vượt quá 300 ký tự!' }]}
                                >
                                    <TextArea rows={3} placeholder="Nhập ghi chú bổ sung (không bắt buộc)" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

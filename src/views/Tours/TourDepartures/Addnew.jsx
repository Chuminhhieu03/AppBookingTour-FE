import { Form, Input, InputNumber, Button, DatePicker, TimePicker, Select, Row, Col, message, Space } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourDepartureAPI from '../../../api/tour/tourDepartureAPI';
import LoadingModal from '../../../components/LoadingModal';
import dayjs from 'dayjs';
import Constants from 'Constants/Constants';

const { Option } = Select;

export default function TourDepartureAddnew() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const { tourId } = useParams();
    const [loading, setLoading] = useState(false);

    const tourData = location.state;

    useEffect(() => {
        if (tourData) {
            form.setFieldsValue({
                priceAdult: tourData.priceAdult,
                priceChildren: tourData.priceChildren,
                status: 1
            });
        } else {
            form.setFieldsValue({
                status: 1
            });
        }
    }, [tourData, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            LoadingModal.showLoading();

            // Kết hợp ngày và giờ thành datetime
            const departureDateTime = values.departureDate
                .hour(values.departureTime?.hour() || 0)
                .minute(values.departureTime?.minute() || 0)
                .second(0);

            const returnDateTime = values.returnDate
                .hour(values.returnTime?.hour() || 0)
                .minute(values.returnTime?.minute() || 0)
                .second(0);

            const payload = {
                tourId: Number(tourId),
                departureDate: departureDateTime.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                returnDate: returnDateTime.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                availableSlots: values.availableSlots,
                priceAdult: values.priceAdult,
                priceChildren: values.priceChildren,
                status: values.status
                // guideId: values.guideId || null
            };
            const response = await tourDepartureAPI.create(payload);

            if (response.success) {
                message.success('Thêm lịch khởi hành mới thành công!');
                navigate(`/admin/service/tour/edit/${tourId}`);
            } else {
                message.error(response.message || 'Không thể thêm lịch khởi hành!');
            }
        } catch (error) {
            console.error('Error creating departure:', error);
            message.error('Đã xảy ra lỗi khi thêm lịch khởi hành.');
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
                    title="Thêm lịch khởi hành mới"
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
                    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <Row gutter={[24, 24]}>
                            <Col span={6}>
                                <Form.Item
                                    label="Ngày khởi hành"
                                    name="departureDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày khởi hành!'
                                        },
                                        {
                                            validator: (_, value) => {
                                                if (!value) return Promise.resolve();
                                                const tomorrow = dayjs().add(1, 'day');
                                                if (value.isBefore(tomorrow, 'day')) {
                                                    return Promise.reject(new Error('Ngày khởi hành phải từ ngày mai trở đi!'));
                                                }
                                                return Promise.resolve();
                                            }
                                        }
                                    ]}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format="DD/MM/YYYY"
                                        placeholder="Chọn ngày khởi hành"
                                        disabledDate={(current) => {
                                            return current && current.isBefore(dayjs().add(1, 'day'), 'day');
                                        }}
                                        onChange={(date) => {
                                            if (date && tourData?.duration) {
                                                const endDate = date.add(tourData.duration, 'day');
                                                form.setFieldsValue({
                                                    returnDate: endDate
                                                });
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Giờ khởi hành"
                                    name="departureTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn giờ khởi hành!'
                                        }
                                    ]}
                                >
                                    <TimePicker style={{ width: '100%' }} format="HH:mm" placeholder="Chọn giờ khởi hành" minuteStep={15} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Ngày kết thúc" name="returnDate">
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        format="DD/MM/YYYY"
                                        placeholder="Tự động tính toán"
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Giờ trở về"
                                    name="returnTime"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn giờ trở về!'
                                        }
                                    ]}
                                >
                                    <TimePicker style={{ width: '100%' }} format="HH:mm" placeholder="Chọn giờ trở về" minuteStep={15} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            <Col span={6}>
                                <Form.Item
                                    label="Giá người lớn"
                                    name="priceAdult"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập giá người lớn!'
                                        },
                                        {
                                            type: 'number',
                                            min: 0,
                                            message: 'Giá phải lớn hơn 0!'
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Nhập giá người lớn"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        addonAfter="VNĐ"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Giá trẻ em"
                                    name="priceChildren"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập giá trẻ em!'
                                        },
                                        {
                                            type: 'number',
                                            min: 0,
                                            message: 'Giá phải lớn hơn 0!'
                                        }
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        placeholder="Nhập giá trẻ em"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        addonAfter="VNĐ"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Số chỗ còn trống"
                                    name="availableSlots"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số chỗ còn trống!'
                                        },
                                        {
                                            type: 'number',
                                            min: 1,
                                            message: 'Số chỗ phải lớn hơn 0!'
                                        }
                                    ]}
                                >
                                    <InputNumber style={{ width: '100%' }} placeholder="Nhập số chỗ còn trống" min={1} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Trạng thái"
                                    name="status"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn trạng thái!'
                                        }
                                    ]}
                                >
                                    <Select placeholder="Chọn trạng thái" defaultValue={Constants.TourDepartureStatus.Available}>
                                        {Constants.TourDepartureStatusOptions.map((option) => (
                                            <Option key={option.value} value={option.value}>
                                                {option.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[24, 24]}>
                            <Col span={6}>
                                <Form.Item label="Hướng dẫn viên phụ trách" name="guideId">
                                    <Select placeholder="Chọn hướng dẫn viên (tùy chọn)" allowClear>
                                        {/* Mock data - sẽ thay thế bằng API call sau */}
                                        <Option value="guide-1">Nguyễn Văn A</Option>
                                        <Option value="guide-2">Trần Thị B</Option>
                                        <Option value="guide-3">Lê Văn C</Option>
                                        <Option value="guide-4">Phạm Thị D</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}

import { Form, Input, InputNumber, Button, DatePicker, Select, Row, Col, message, Space } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainCard from '../../../components/MainCard';
import tourDepartureAPI from '../../../api/tour/tourDepartureAPI';
import LoadingModal from '../../../components/LoadingModal';
import dayjs from 'dayjs';

const { Option } = Select;

export default function TourDepartureEdit() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { tourId, departureId } = useParams();
    const [departure, setDeparture] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (departureId) {
            fetchDeparture();
        }
    }, [departureId]);

    const fetchDeparture = async () => {
        try {
            LoadingModal.showLoading();
            const response = await tourDepartureAPI.getById(departureId);
            if (response.success) {
                const data = response.data;
                setDeparture(data);

                // Convert status string to enum number if needed
                let statusValue = data.status;
                if (typeof data.status === 'string') {
                    switch (data.status.toLowerCase()) {
                        case 'available':
                            statusValue = 1;
                            break;
                        case 'full':
                            statusValue = 2;
                            break;
                        case 'cancelled':
                            statusValue = 3;
                            break;
                        default:
                            statusValue = 1; // Default to Available
                    }
                }

                form.setFieldsValue({
                    ...data,
                    departureDate: data.departureDate ? dayjs(data.departureDate) : null,
                    returnDate: data.returnDate ? dayjs(data.returnDate) : null,
                    status: statusValue
                });
            } else {
                message.error('Không tìm thấy lịch khởi hành!');
                navigate(`/admin/service/tour/edit/${tourId}`);
            }
        } catch (error) {
            console.error('Error fetching departure:', error);
            message.error('Đã xảy ra lỗi khi tải lịch khởi hành.');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            LoadingModal.showLoading();

            const payload = {
                tourId: Number(tourId),
                departureDate: values.departureDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                returnDate: values.returnDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
                availableSlots: values.availableSlots,
                priceAdult: values.priceAdult,
                priceChildren: values.priceChildren,
                status: values.status
                // guideId: values.guideId || null
            };

            const response = await tourDepartureAPI.update(departureId, payload);

            if (response.success) {
                message.success('Cập nhật lịch khởi hành thành công!');
                navigate(`/admin/service/tour/edit/${tourId}`);
            } else {
                message.error(response.message || 'Không thể cập nhật lịch khởi hành!');
            }
        } catch (error) {
            console.error('Error updating departure:', error);
            message.error('Đã xảy ra lỗi khi cập nhật lịch khởi hành.');
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
                    title="Chỉnh sửa lịch khởi hành"
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
                    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off" requiredMark={false}>
                        {/* Hàng 1: Ngày khởi hành | Ngày kết thúc | Trạng thái */}
                        <Row gutter={[24, 24]}>
                            <Col span={8}>
                                <Form.Item
                                    label="Ngày khởi hành"
                                    name="departureDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày khởi hành!'
                                        }
                                    ]}
                                >
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày khởi hành" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Ngày kết thúc"
                                    name="returnDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày kết thúc!'
                                        }
                                    ]}
                                >
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
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
                                    <Select placeholder="Chọn trạng thái">
                                        <Option value={1}>Có sẵn</Option>
                                        <Option value={2}>Hết chỗ</Option>
                                        <Option value={3}>Đã hủy</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        {/* Hàng 2: Giá người lớn | Giá trẻ em */}
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
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
                            <Col span={12}>
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
                        </Row>

                        {/* Hàng 3: Số chỗ còn trống | Hướng dẫn viên */}
                        <Row gutter={[24, 24]}>
                            <Col span={12}>
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
                            <Col span={12}>
                                <Form.Item
                                    label="Hướng dẫn viên phụ trách"
                                    name="guideId"
                                    rules={[
                                        {
                                            message: 'Vui lòng chọn hướng dẫn viên!'
                                        }
                                    ]}
                                >
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

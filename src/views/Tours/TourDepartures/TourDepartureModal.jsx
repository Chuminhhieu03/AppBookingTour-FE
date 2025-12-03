import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, DatePicker, InputNumber, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import Constants from '../../../Constants/Constants';
import Utility from '../../../utils/Utility';

const TourDepartureModal = ({ open, onCancel, onSave, mode = 'create', initialData, tourInfo, guides = [] }) => {
    const [form] = Form.useForm();

    const getPopupContainer = (triggerNode) => triggerNode.parentNode;

    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                form.resetFields();
                const defaultValues = {
                    priceAdult: tourInfo?.basePriceAdult || 0,
                    priceChildren: tourInfo?.basePriceChild || 0,
                    availableSlots: tourInfo?.maxParticipants || 1,
                    status: 1
                };
                form.setFieldsValue(defaultValues);
            } else if (initialData && (mode === 'edit' || mode === 'view')) {
                // Convert UTC dates to local timezone before displaying
                const formData = {
                    ...initialData,
                    departureDate: initialData.departureDate ? Utility.convertUtcToLocalTimestamp(initialData.departureDate) : null,
                    returnDate: initialData.returnDate ? Utility.convertUtcToLocalTimestamp(initialData.returnDate) : null,
                    departureTime: initialData.departureDate ? Utility.convertUtcToLocalTimestamp(initialData.departureDate) : null,
                    returnTime: initialData.returnDate ? Utility.convertUtcToLocalTimestamp(initialData.returnDate) : null
                };
                form.setFieldsValue(formData);
            }
        }
    }, [open, mode, initialData, tourInfo, form]);

    const handleDepartureDateChange = (date) => {
        if (date && tourInfo?.durationDays) {
            const returnDate = date.add(tourInfo.durationDays - 1, 'day');
            form.setFieldsValue({ returnDate });
        }
    };

    const handleOk = async () => {
        if (mode === 'view') {
            onCancel();
            return;
        }

        try {
            const values = await form.validateFields();

            const departureDateTime =
                values.departureDate && values.departureTime
                    ? values.departureDate.hour(values.departureTime.hour()).minute(values.departureTime.minute()).toISOString()
                    : values.departureDate?.toISOString();

            const returnDateTime =
                values.returnDate && values.returnTime
                    ? values.returnDate.hour(values.returnTime.hour()).minute(values.returnTime.minute()).toISOString()
                    : values.returnDate?.toISOString();

            const formattedData = {
                ...values,
                departureDate: departureDateTime,
                returnDate: returnDateTime
            };

            onSave(formattedData);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const isViewMode = mode === 'view';
    const modalTitle = {
        create: 'Thêm lịch khởi hành',
        edit: 'Chỉnh sửa lịch khởi hành',
        view: 'Chi tiết lịch khởi hành'
    };

    return (
        <Modal
            title={modalTitle[mode]}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            width={1000}
            okText={isViewMode ? undefined : 'Lưu'}
            cancelText={isViewMode ? 'Đóng' : 'Hủy'}
            okButtonProps={{ style: isViewMode ? { display: 'none' } : {} }}
            style={{ top: '10%' }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={[24, 24]}>
                    <Col span={6}>
                        <Form.Item
                            label="Ngày khởi hành"
                            name="departureDate"
                            rules={[
                                { required: true, message: 'Vui lòng chọn ngày khởi hành!' },
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
                                onChange={handleDepartureDateChange}
                                disabledDate={(current) => current && current.isBefore(dayjs().add(1, 'day'), 'day')}
                                getPopupContainer={getPopupContainer}
                                open={isViewMode ? false : undefined}
                                inputReadOnly={isViewMode}
                                allowClear={!isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Giờ khởi hành"
                            name="departureTime"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ khởi hành!' }]}
                        >
                            <TimePicker
                                style={{ width: '100%' }}
                                format="HH:mm"
                                placeholder="Chọn giờ khởi hành"
                                minuteStep={15}
                                getPopupContainer={getPopupContainer}
                                open={isViewMode ? false : undefined}
                                inputReadOnly={isViewMode}
                                allowClear={!isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Ngày kết thúc" name="returnDate">
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Tự động tính toán"
                                disabled={true}
                                getPopupContainer={getPopupContainer}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Giờ trở về" name="returnTime" rules={[{ required: true, message: 'Vui lòng chọn giờ trở về!' }]}>
                            <TimePicker
                                style={{ width: '100%' }}
                                format="HH:mm"
                                placeholder="Chọn giờ trở về"
                                minuteStep={15}
                                getPopupContainer={getPopupContainer}
                                open={isViewMode ? false : undefined}
                                inputReadOnly={isViewMode}
                                allowClear={!isViewMode}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col span={6}>
                        <Form.Item
                            label="Giá người lớn"
                            name="priceAdult"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá người lớn!' },
                                { type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="Nhập giá người lớn"
                                addonAfter="VNĐ"
                                readOnly={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Giá trẻ em"
                            name="priceChildren"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá trẻ em!' },
                                { type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="Nhập giá trẻ em"
                                addonAfter="VNĐ"
                                readOnly={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Phụ thu phòng đơn"
                            name="singleRoomSurcharge"
                            rules={[
                                { required: true, message: 'Vui lòng nhập phụ thu phòng đơn!' },
                                { type: 'number', min: 0, message: 'Giá phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="Nhập phụ thu phòng đơn"
                                addonAfter="VNĐ"
                                readOnly={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Số chỗ còn trống"
                            name="availableSlots"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số chỗ còn trống!' },
                                { type: 'number', min: 1, message: 'Số chỗ phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber style={{ width: '100%' }} min={1} placeholder="Nhập số chỗ còn trống" readOnly={isViewMode} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col span={6}>
                        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
                            <Select
                                placeholder="Chọn trạng thái"
                                getPopupContainer={getPopupContainer}
                                open={isViewMode ? false : undefined}
                                allowClear={!isViewMode}
                            >
                                {Constants.TourDepartureStatusOptions?.map((option) => (
                                    <Select.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Hướng dẫn viên phụ trách" name="guideId">
                            <Select
                                placeholder="Chọn hướng dẫn viên (tùy chọn)"
                                allowClear={!isViewMode}
                                showSearch
                                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                getPopupContainer={getPopupContainer}
                                open={isViewMode ? false : undefined}
                            >
                                {guides.map((guide) => (
                                    <Select.Option key={guide.id} value={guide.id}>
                                        {guide.fullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default TourDepartureModal;

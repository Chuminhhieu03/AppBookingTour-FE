import React, { useEffect } from 'react';
import { Modal, Form, Row, Col, InputNumber, Input } from 'antd';

const { TextArea } = Input;

const TourItineraryModal = ({
    open,
    onCancel,
    onSave,
    mode = 'create', // 'create', 'edit', 'view'
    initialData,
    tourInfo
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (mode === 'create') {
                // Reset form với giá trị mặc định
                form.resetFields();
            } else if (initialData && (mode === 'edit' || mode === 'view')) {
                // Set form data
                form.setFieldsValue(initialData);
            }
        }
    }, [open, mode, initialData, form]);

    const handleOk = async () => {
        if (mode === 'view') {
            onCancel();
            return;
        }

        try {
            const values = await form.validateFields();
            onSave(values);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    const isViewMode = mode === 'view';
    const modalTitle = {
        create: 'Thêm lịch trình',
        edit: 'Chỉnh sửa lịch trình',
        view: 'Chi tiết lịch trình'
    };

    return (
        <Modal
            title={modalTitle[mode]}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            width={800}
            okText={isViewMode ? undefined : 'Lưu'}
            cancelText={isViewMode ? 'Đóng' : 'Hủy'}
            okButtonProps={{ style: isViewMode ? { display: 'none' } : {} }}
            style={{ top: '10%' }}
        >
            <Form form={form} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col span={6}>
                        <Form.Item
                            name="dayNumber"
                            label="Ngày thứ"
                            rules={[
                                { required: true, message: 'Vui lòng nhập ngày lịch trình!' },
                                { type: 'number', min: 1, message: 'Ngày phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber placeholder="Nhập ngày (VD: 1, 2, 3...)" style={{ width: '100%' }} min={1} readOnly={isViewMode} />
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            name="title"
                            label="Tiêu đề lịch trình"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tiêu đề!' },
                                { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
                            ]}
                        >
                            <Input placeholder="Nhập tiêu đề lịch trình" maxLength={200} readOnly={isViewMode} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Mô tả chi tiết"
                            rules={[{ max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="Nhập mô tả chi tiết của lịch trình"
                                maxLength={500}
                                showCount
                                readOnly={isViewMode}
                            />
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
                            <TextArea
                                rows={4}
                                placeholder="Mô tả chi tiết các hoạt động trong ngày"
                                maxLength={1000}
                                showCount
                                readOnly={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="note" label="Ghi chú" rules={[{ max: 500, message: 'Ghi chú không được vượt quá 500 ký tự!' }]}>
                            <TextArea
                                rows={3}
                                placeholder="Nhập ghi chú bổ sung (không bắt buộc)"
                                maxLength={500}
                                showCount
                                readOnly={isViewMode}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default TourItineraryModal;

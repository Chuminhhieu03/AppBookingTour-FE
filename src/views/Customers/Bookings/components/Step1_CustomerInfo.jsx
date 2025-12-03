import { useState, useEffect } from 'react';
import { Form, Input, Row, Col, Button, Space, Table, InputNumber, Select, DatePicker, message, Spin, Alert } from 'antd';
import { ArrowRightOutlined, PlusOutlined, DeleteOutlined, MinusOutlined } from '@ant-design/icons';
import comboAPI from 'api/combo/comboAPI';
import tourAPI from 'api/tour/tourAPI';
import accommodationAPI from 'api/accommodation/accommodationAPI';
import TourSummaryCard from './TourSummaryCard';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Option } = Select;

const Step1_CustomerInfo = ({ itemId, scheduleId, bookingType = 'combo', onComplete, loading }) => {
    const [form] = Form.useForm();
    const [itemData, setItemData] = useState(null); // combo/tour/accommodation data
    const [scheduleData, setScheduleData] = useState(null); // schedule/departure/roomType data
    const [additionalData, setAdditionalData] = useState(null); // For accommodation: roomInventories, totalPrice, numberOfNights
    const [loadingData, setLoadingData] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [numAdults, setNumAdults] = useState(1);
    const [numChildren, setNumChildren] = useState(0);
    const [numSingleRooms, setNumSingleRooms] = useState(0);
    const [discountCode, setDiscountCode] = useState('');
    const [discountData, setDiscountData] = useState(null);
    const [applyingDiscount, setApplyingDiscount] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [maxAdults, setMaxAdults] = useState(null); // For accommodation only
    const [maxChildren, setMaxChildren] = useState(null); // For accommodation only

    // Lấy ra userId từ auth thông qua redux
    const userId = useSelector((state) => state.auth.user.userId);

    // Fetch data based on bookingType
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                let response;

                switch (bookingType) {
                    case 'combo':
                        response = await comboAPI.getForBooking(scheduleId);
                        if (response.success) {
                            setItemData(response.data.combo);
                            setScheduleData(response.data.schedule);

                            form.setFieldsValue({
                                priceAdult: response.data.schedule.basePriceAdult,
                                priceChild: response.data.schedule.basePriceChildren,
                                singleRoomSurcharge: response.data.schedule.singleRoomSupplement
                            });
                        }
                        break;

                    case 'tour':
                        response = await tourAPI.getForBooking(scheduleId);
                        if (response.success) {
                            setItemData(response.data.tour);
                            setScheduleData(response.data.departure);

                            form.setFieldsValue({
                                priceAdult: response.data.departure.priceAdult,
                                priceChild: response.data.departure.priceChildren,
                                singleRoomSurcharge: response.data.departure.singleRoomSurcharge
                            });
                        }
                        break;

                    case 'accommodation':
                        // scheduleId is actually roomInventoryIds (comma-separated)
                        const roomInventoryIds = scheduleId.split(',').map((id) => parseInt(id));
                        response = await accommodationAPI.getForBooking(roomInventoryIds);
                        if (response.success) {
                            setItemData(response.data.accommodation);
                            setScheduleData(response.data.roomType);
                            setAdditionalData({
                                roomInventories: response.data.roomInventories,
                                totalPrice: response.data.totalPrice,
                                numberOfNights: response.data.numberOfNights
                            });

                            // Set max limits for accommodation and use them as fixed values
                            const roomMaxAdults = response.data.roomType.maxAdult || 1;
                            const roomMaxChildren = response.data.roomType.maxChildren || 0;
                            setMaxAdults(roomMaxAdults);
                            setMaxChildren(roomMaxChildren);

                            // For accommodation, set fixed number of guests based on room capacity
                            setNumAdults(roomMaxAdults);
                            setNumChildren(roomMaxChildren);

                            form.setFieldsValue({
                                priceAdult: response.data.roomInventories[0]?.basePriceAdult || 0,
                                priceChild: response.data.roomInventories[0]?.basePriceChildren || 0
                            });
                        }
                        break;

                    default:
                        message.error('Loại booking không hợp lệ');
                        return;
                }

                if (!response || !response.success) {
                    message.error(`Không thể tải thông tin ${bookingType}`);
                    return;
                }

                // Initialize 1 participant (adult)
                setParticipants([
                    {
                        key: 0,
                        fullName: '',
                        dateOfBirth: null,
                        gender: 1,
                        needSingleRoom: false,
                        participantType: 1
                    }
                ]);
            } catch (error) {
                console.error(`Error fetching ${bookingType} data:`, error);
                message.error(error.response.data.message);
            } finally {
                setLoadingData(false);
            }
        };

        if (itemId && scheduleId) {
            fetchData();
        }
    }, [itemId, scheduleId, form, bookingType]);

    // Cập nhật participants khi số lượng thay đổi
    useEffect(() => {
        const totalParticipants = numAdults + numChildren;
        const currentCount = participants.length;

        if (totalParticipants > currentCount) {
            // Thêm participant
            const newParticipants = [...participants];
            for (let i = currentCount; i < totalParticipants; i++) {
                newParticipants.push({
                    key: i,
                    fullName: '',
                    dateOfBirth: null,
                    gender: 1,
                    needSingleRoom: false,
                    participantType: i < numAdults ? 1 : 2
                });
            }
            setParticipants(newParticipants);
        } else if (totalParticipants < currentCount) {
            // Xóa participant
            setParticipants(participants.slice(0, totalParticipants));
        }
    }, [numAdults, numChildren]);

    // Validate form khi có thay đổi
    useEffect(() => {
        const validateForm = () => {
            const values = form.getFieldsValue();

            // Check required fields
            const hasContactInfo = values.contactName && values.contactEmail && values.contactPhone;

            // Check participants info
            const allParticipantsValid = participants.length > 0 && participants.every((p) => p.fullName && p.dateOfBirth);

            console.log('Form validation:', { hasContactInfo, allParticipantsValid });

            setIsFormValid(hasContactInfo && allParticipantsValid);
        };

        validateForm();
    }, [form, participants, numAdults, numChildren]);

    // Tính tổng tiền - Khác nhau theo bookingType
    const calculateTotalAmount = () => {
        if (bookingType === 'accommodation') {
            // Accommodation: Tính theo roomInventories
            if (!additionalData?.roomInventories) return 0;

            const totalAdultPrice = additionalData.roomInventories.reduce((sum, inv) => sum + inv.basePriceAdult * numAdults, 0);
            const totalChildPrice = additionalData.roomInventories.reduce((sum, inv) => sum + inv.basePriceChildren * numChildren, 0);

            return totalAdultPrice + totalChildPrice;
        } else {
            // Combo/Tour: Tính theo số người
            const priceAdult = bookingType === 'combo' ? scheduleData?.basePriceAdult || 0 : scheduleData?.priceAdult || 0;
            const priceChild = bookingType === 'combo' ? scheduleData?.basePriceChildren || 0 : scheduleData?.priceChildren || 0;
            const singleRoomSurcharge =
                bookingType === 'combo' ? scheduleData?.singleRoomSupplement || 0 : scheduleData?.singleRoomSurcharge || 0;

            const adultTotal = priceAdult * numAdults;
            const childTotal = priceChild * numChildren;
            const singleRoomTotal = singleRoomSurcharge * numSingleRooms;

            return adultTotal + childTotal + singleRoomTotal;
        }
    };

    const totalAmount = calculateTotalAmount();
    const discountAmount = discountData?.discountAmount || 0;
    const finalAmount = discountData?.finalAmount || totalAmount;

    // Áp dụng mã giảm giá
    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            message.warning('Vui lòng nhập mã giảm giá');
            return;
        }

        setApplyingDiscount(true);
        try {
            const response = await comboAPI.applyDiscount({
                discountCode: discountCode.trim(),
                totalAmount: totalAmount,
                userId: userId
            });

            if (response.success && response.data.isValid) {
                setDiscountData(response.data);
                message.success(response.data.message);
            } else {
                setDiscountData(null);
                message.error(response.data?.message || 'Mã giảm giá không hợp lệ');
            }
        } catch (error) {
            console.error('Error applying discount:', error);
            message.error('Đã xảy ra lỗi khi áp dụng mã giảm giá');
        } finally {
            setApplyingDiscount(false);
        }
    };

    // Update participant
    const handleParticipantChange = (key, field, value) => {
        // Xử lý cập nhật số phòng đơn
        if (field === 'needSingleRoom') {
            let newNumSingleRooms = numSingleRooms;
            const participant = participants.find((p) => p.key === key);
            if (participant) {
                if (value === true && participant.needSingleRoom === false) {
                    newNumSingleRooms += 1;
                } else if (value === false && participant.needSingleRoom === true) {
                    newNumSingleRooms -= 1;
                }
                setNumSingleRooms(newNumSingleRooms);
            }
        }
        const newParticipants = participants.map((p) => (p.key === key ? { ...p, [field]: value } : p));
        setParticipants(newParticipants);
    };

    // Table columns cho participants - Hide single room column for accommodation
    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            render: (text, record) => (
                <Input
                    placeholder="Nhập họ tên"
                    value={text}
                    onChange={(e) => handleParticipantChange(record.key, 'fullName', e.target.value)}
                />
            )
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            width: 150,
            render: (date, record) => (
                <DatePicker
                    value={date ? dayjs(date) : null}
                    onChange={(date) => handleParticipantChange(record.key, 'dateOfBirth', date ? date.toDate() : null)}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    style={{ width: '100%' }}
                />
            )
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: 120,
            render: (value, record) => (
                <Select value={value} onChange={(val) => handleParticipantChange(record.key, 'gender', val)} style={{ width: '100%' }}>
                    <Option value={1}>Nam</Option>
                    <Option value={2}>Nữ</Option>
                    <Option value={3}>Khác</Option>
                </Select>
            )
        },
        {
            title: 'Độ tuổi',
            dataIndex: 'participantType',
            key: 'participantType',
            width: 120,
            render: (value) => (value === 1 ? 'Người lớn' : value === 2 ? 'Trẻ em' : 'Em bé')
        },
        ...(bookingType !== 'accommodation'
            ? [
                  {
                      title: 'Phòng đơn',
                      dataIndex: 'needSingleRoom',
                      key: 'needSingleRoom',
                      width: 100,
                      render: (value, record) => (
                          <Select
                              value={value ? 'yes' : 'no'}
                              onChange={(val) => handleParticipantChange(record.key, 'needSingleRoom', val === 'yes')}
                              style={{ width: '100%' }}
                          >
                              <Option value="yes">Có</Option>
                              <Option value="no">Không</Option>
                          </Select>
                      )
                  }
              ]
            : [])
    ];

    // Submit form
    const handleSubmit = async () => {
        try {
            // Validate form fields
            await form.validateFields();

            // Validate participants
            const invalidParticipant = participants.find((p) => !p.fullName || !p.dateOfBirth);
            if (invalidParticipant) {
                message.error('Vui lòng nhập đầy đủ thông tin hành khách');
                return;
            }

            const values = form.getFieldsValue();

            const bookingData = {
                contactName: values.contactName,
                contactEmail: values.contactEmail,
                contactPhone: values.contactPhone,
                specialRequests: values.specialRequests || '',
                paymentType: 1, // Toàn bộ
                numAdults: numAdults,
                numChildren: numChildren,
                numInfants: 0,
                numSingleRooms: bookingType === 'accommodation' ? 0 : numSingleRooms,
                participants: participants.map((p) => ({
                    fullName: p.fullName,
                    dateOfBirth: p.dateOfBirth ? dayjs(p.dateOfBirth).toISOString() : null,
                    gender: p.gender,
                    idNumber: null,
                    nationality: 'Việt Nam',
                    needSingleRoom: bookingType === 'accommodation' ? false : p.needSingleRoom,
                    participantType: p.participantType
                })),
                userId: userId,
                bookingType: bookingType === 'combo' ? 0 : bookingType === 'tour' ? 1 : 2,
                itemId: parseInt(itemId)
            };

            // Add specific fields based on bookingType
            if (bookingType === 'accommodation') {
                // For accommodation: add roomInventoryIds and travelDate (first night date)
                bookingData.roomInventoryIds = additionalData.roomInventories.map((inv) => inv.id);
                bookingData.travelDate = additionalData.roomInventories[0].date;
            } else {
                // For combo/tour: add schedule-specific fields
                bookingData.travelDate = scheduleData.departureDate || scheduleData.date;
                bookingData.priceAdult = values.priceAdult;
                bookingData.priceChild = values.priceChild;
                bookingData.singleRoomSurcharge = values.singleRoomSurcharge;
                bookingData.discountCode = discountData ? discountCode : null;

                // Add scheduleId for combo/tour
                if (bookingType === 'combo') {
                    bookingData.scheduleId = parseInt(scheduleId);
                } else if (bookingType === 'tour') {
                    bookingData.departureId = parseInt(scheduleId);
                }
            }

            onComplete(bookingData);
        } catch (error) {
            console.error('Validation error:', error);
            message.error('Vui lòng kiểm tra lại thông tin');
        }
    };

    if (loadingData) {
        return (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <Spin size="large" tip="Đang tải thông tin combo..." />
            </div>
        );
    }

    return (
        <Row gutter={[24, 24]}>
            {/* Left: Form thông tin */}
            <Col xs={24} lg={16}>
                <div style={{ background: '#f9f9f9', padding: 24, borderRadius: 8 }}>
                    <h3 style={{ marginBottom: 24, fontWeight: 'bold' }}>Thông tin liên hệ</h3>
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Họ tên" name="contactName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                                    <Input placeholder="Nguyễn Văn A" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Email"
                                    name="contactEmail"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email' },
                                        { type: 'email', message: 'Email không hợp lệ' }
                                    ]}
                                >
                                    <Input placeholder="example@gmail.com" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Điện thoại"
                                    name="contactPhone"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                                        { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ' }
                                    ]}
                                >
                                    <Input placeholder="0901234567" />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item label="Chỉ chú (ghi chú thêm)" name="specialRequests">
                                    <TextArea rows={3} placeholder="Yêu cầu đặc biệt (nếu có)..." />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

                {/* Chi tiết booking */}
                <div style={{ background: '#f9f9f9', padding: 24, borderRadius: 8, marginTop: 24 }}>
                    <h3 style={{ marginBottom: 16, fontWeight: 'bold' }}>Chi tiết booking</h3>

                    {/* Accommodation: Show fixed capacity info */}
                    {bookingType === 'accommodation' && (maxAdults || maxChildren) && (
                        <Alert
                            message={`Sức chứa phòng: ${maxAdults || 0} người lớn và ${maxChildren || 0} trẻ em (cố định)`}
                            type="info"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />
                    )}

                    <Row gutter={[16, 16]} align="middle">
                        <Col span={12}>
                            <strong>Số người lớn:</strong>
                        </Col>
                        <Col span={12}>
                            {bookingType === 'accommodation' ? (
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>{numAdults}</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={() => setNumAdults(Math.max(1, numAdults - 1))}
                                        disabled={numAdults <= 1}
                                    />
                                    <span style={{ fontSize: 16, fontWeight: 'bold', minWidth: 30, textAlign: 'center' }}>{numAdults}</span>
                                    <Button icon={<PlusOutlined />} onClick={() => setNumAdults(numAdults + 1)} />
                                </div>
                            )}
                        </Col>
                        <Col span={12}>
                            <strong>Số trẻ em:</strong>
                        </Col>
                        <Col span={12}>
                            {bookingType === 'accommodation' ? (
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: 16, fontWeight: 'bold' }}>{numChildren}</span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                                    <Button
                                        icon={<MinusOutlined />}
                                        onClick={() => setNumChildren(Math.max(0, numChildren - 1))}
                                        disabled={numChildren <= 0}
                                    />
                                    <span style={{ fontSize: 16, fontWeight: 'bold', minWidth: 30, textAlign: 'center' }}>
                                        {numChildren}
                                    </span>
                                    <Button icon={<PlusOutlined />} onClick={() => setNumChildren(numChildren + 1)} />
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>

                {/* Thông tin hành khách */}
                <div style={{ background: '#f9f9f9', padding: 24, borderRadius: 8, marginTop: 24 }}>
                    <h3 style={{ marginBottom: 16, fontWeight: 'bold' }}>Thông tin hành khách</h3>
                    <Table
                        dataSource={participants}
                        columns={columns}
                        pagination={false}
                        rowKey="key"
                        bordered
                        size="middle"
                        scroll={{ x: 800 }}
                    />
                </div>

                {/* Button submit */}
                <div style={{ marginTop: 24, textAlign: 'right' }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ArrowRightOutlined />}
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!isFormValid || loading}
                    >
                        Tiếp tục
                    </Button>
                </div>
            </Col>

            {/* Right: Tour summary */}
            <Col xs={24} lg={8}>
                <TourSummaryCard
                    bookingType={bookingType}
                    itemData={itemData}
                    scheduleData={scheduleData}
                    additionalData={additionalData}
                    numAdults={numAdults}
                    numChildren={numChildren}
                    numSingleRooms={numSingleRooms}
                    totalAmount={totalAmount}
                    discountAmount={discountAmount}
                    finalAmount={finalAmount}
                    discountCode={discountCode}
                    onDiscountCodeChange={setDiscountCode}
                    onApplyDiscount={handleApplyDiscount}
                    applyingDiscount={applyingDiscount}
                />
            </Col>
        </Row>
    );
};

export default Step1_CustomerInfo;

import { Col, Row, Button, Space, Input, InputNumber, DatePicker, Select, message } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import discountAPI from '../../api/discount/discountAPI';
import Constants from '../../Constants/Constants';

const { TextArea } = Input;

export default function Addnew() {
    const [discount, setDiscount] = useState({});

    useEffect(() => {
        setupAddnewForm();
    }, []);

    const setupAddnewForm = async () => {
        const response = await axiosIntance.post('/Discount/setup-addnew', {});
        const res = response.data;
        setListStatus(res.listStatus);
        setListServiceType(res.listServiceType);
    };

    const onAddnewDiscount = async (discount) => {
        LoadingModal.showLoading();
        try {
            const request = {};
            request.Discount = { ...discount };
            request.Discount.StartEffectedDtg = discount.StartEffectedDtg?.toDate().toISOString();
            request.Discount.EndEffectedDtg = discount.EndEffectedDtg?.toDate().toISOString();
            request.Discount.MaximumDiscount = discount.MaximumDiscount;
            const res = await discountAPI.create(request);
            const discountRes = res.discount;
            if (res.success) {
                message.success('Thêm mới mã giảm giá thành công');
                window.location.href = `/admin/sale/discount/display/${discountRes.id}`;
            } else {
                const errorData = res.data || [];
                const listErrorMessage = errorData?.map((e) => e.errorMessage);
                message.error(`Lỗi khi thêm mới mã giảm giá: ${listErrorMessage.join(', ')}`);
            }
        } catch (error) {
            console.error('Error adding new discount:', error);
            message.error('Đã xảy ra lỗi khi thêm mới mã giảm giá');
        }
        LoadingModal.hideLoading();
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm mới mã giảm giá"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => onAddnewDiscount(discount)}>
                                Lưu
                            </Button>
                            <Button type="primary" href="/admin/sale/discount" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={8}>
                            <span>Mã</span>
                            <Input
                                maxLength={256}
                                value={discount.Code}
                                onChange={(e) => setDiscount({ ...discount, Code: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Tên mã giảm giá</span>
                            <Input
                                maxLength={256}
                                value={discount.Name}
                                onChange={(e) => setDiscount({ ...discount, Name: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Giá trị giảm (%)</span>
                            <InputNumber
                                value={discount.DiscountPercent}
                                min={0}
                                max={100}
                                className="w-100"
                                onChange={(val) => setDiscount({ ...discount, DiscountPercent: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Số tiền giảm tối đa (VND)</span>
                            <InputNumber
                                value={discount.MaximumDiscount}
                                min={0}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/,/g, '')}
                                onChange={(val) => setDiscount({ ...discount, MaximumDiscount: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Ngày hiệu lực</span>
                            <DatePicker
                                showTime
                                value={discount.StartEffectedDtg}
                                className="w-100"
                                onChange={(date) => setDiscount({ ...discount, StartEffectedDtg: date })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Ngày hết hiệu lực</span>
                            <DatePicker
                                showTime
                                value={discount.EndEffectedDtg}
                                className="w-100"
                                onChange={(date) => setDiscount({ ...discount, EndEffectedDtg: date })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Số lượng mã phát hành</span>
                            <InputNumber
                                value={discount.TotalQuantity}
                                min={0}
                                maxLength={9}
                                className="w-100"
                                onChange={(val) => setDiscount({ ...discount, TotalQuantity: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Số lượng mã còn lại</span>
                            <InputNumber value={discount.RemainingQuantity} className="w-100" readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Loại dịch vụ</span>
                            <Select
                                value={discount.ServiceType}
                                allowClear
                                className="w-100"
                                options={Constants.ServiceTypeOptions}
                                onChange={(val) => {
                                    setDiscount({ ...discount, ServiceType: val });
                                }}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select
                                value={discount.Status}
                                allowClear
                                className="w-100"
                                options={Constants.StatusOptions}
                                onChange={(val) => setDiscount({ ...discount, Status: val })}
                            />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={discount.Description}
                                allowClear
                                className="w-100"
                                onChange={(e) => setDiscount({ ...discount, Description: e.target.value })}
                            />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

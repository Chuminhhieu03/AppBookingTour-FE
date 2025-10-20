import { Col, Row, Button, Space, Input, InputNumber, DatePicker, Select } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';

const { TextArea } = Input;

export default function Addnew() {
    const [discount, setDiscount] = useState({});
    const [listStatus, setListStatus] = useState([]);
    const [listServiceType, setListServiceType] = useState([]);

    useEffect(() => {
        setupAddnewForm();
    }, []);

    const setupAddnewForm = async () => {
        const response = await fetch('https://localhost:44331/api/Discount/setup-addnew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const res = await response.json();
        setListStatus(res.listStatus);
        setListServiceType(res.listServiceType);
    };

    const onAddnewDiscount = async (discount) => {
        LoadingModal.showLoading();
        const request = {};
        request.Discount = { ...discount };
        request.Discount.StartEffectedDtg = discount.StartEffectedDtg?.toDate().toISOString();
        request.Discount.EndEffectedDtg = discount.EndEffectedDtg?.toDate().toISOString();
        const response = await fetch('https://localhost:44331/api/Discount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        const res = await response.json();
        const discountRes = res.discount;
        if (res.success) {
            window.location.href = `/admin/sale/discount/display/${discountRes.id}`;
        } else {
            const errorData = res.data || [];
            const listErrorMessage = errorData?.map(e => e.errorMessage);
            alert(`Lỗi khi thêm mới mã giảm giá:\n${listErrorMessage.join('\n')}`);
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
                            <Input value={discount.Code} onChange={(e) => setDiscount({ ...discount, Code: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <span>Tên mã giảm giá</span>
                            <Input value={discount.Name} onChange={(e) => setDiscount({ ...discount, Name: e.target.value })} />
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
                                options={listServiceType?.map((item) => ({
                                    label: item.value,
                                    value: item.key
                                }))}
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
                                options={listStatus?.map((item) => ({
                                    label: item.value,
                                    value: item.key
                                }))}
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

import { Col, Row, Button, Space, Input, InputNumber, DatePicker, Select } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';
import discountAPI from '../../api/discount/discountAPI';
import Constants from '../../Constants/Constants';
import Utility from '../../Utils/Utility';
import axiosIntance from '../../api/axiosInstance';

const { TextArea } = Input;

export default function Edit() {
    const [discount, setDiscount] = useState({});
    const { id } = useParams();

    useEffect(() => {
        setupEditForm();
    }, []);

    const setupEditForm = async () => {
        const response = await axiosIntance.post(`/Discount/setup-edit/${id}`);
        const res = response.data;
        const discountRes = res.discount ?? {};
        discountRes.startEffectedDtg = Utility.convertStringToDate(discountRes.startEffectedDtg);
        discountRes.endEffectedDtg = Utility.convertStringToDate(discountRes.endEffectedDtg);
        discountRes.status = Boolean(discountRes.status);
        setDiscount(discountRes);
    };

    const onEditDiscount = async (discount) => {
        LoadingModal.showLoading();
        try {
            const request = { ...discount };
            request.startEffectedDtg = discount.startEffectedDtg?.toDate().toISOString();
            request.endEffectedDtg = discount.endEffectedDtg?.toDate().toISOString();
            request.status = Number(discount.status);
            const res = await discountAPI.update(id, request);
            const discountRes = res.discount ?? {};
            if (res.success) {
                window.location.href = `/admin/sale/discount/display/${discountRes.id}`;
            } else {
                alert(`Lỗi khi chỉnh sửa mã giảm giá:\n${res.message}`);
            }
        } catch (error) {
            alert('Error editing discount:', error);
        }
        LoadingModal.hideLoading();
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chỉnh sửa mã giảm giá"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => onEditDiscount(discount)}>
                                Lưu
                            </Button>
                            <Button type="primary" href={`/admin/sale/discount/display/${id}`} shape="round" icon={<CloseOutlined />}>
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
                                value={discount.code}
                                onChange={(e) => setDiscount({ ...discount, code: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Tên mã giảm giá</span>
                            <Input
                                maxLength={256}
                                value={discount.name}
                                onChange={(e) => setDiscount({ ...discount, name: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Giá trị giảm (%)</span>
                            <InputNumber
                                value={discount.discountPercent}
                                min={0}
                                max={100}
                                className="w-100"
                                onChange={(val) => setDiscount({ ...discount, discountPercent: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Ngày hiệu lực</span>
                            <DatePicker
                                showTime
                                value={discount.startEffectedDtg}
                                className="w-100"
                                onChange={(date) => setDiscount({ ...discount, startEffectedDtg: date })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Ngày hết hiệu lực</span>
                            <DatePicker
                                showTime
                                value={discount.endEffectedDtg}
                                className="w-100"
                                onChange={(date) => setDiscount({ ...discount, endEffectedDtg: date })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Số lượng mã phát hành</span>
                            <InputNumber
                                value={discount.totalQuantity}
                                min={0}
                                maxLength={9}
                                className="w-100"
                                onChange={(val) => setDiscount({ ...discount, totalQuantity: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Số lượng mã còn lại</span>
                            <InputNumber value={discount.remainQuantity} className="w-100" readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Loại dịch vụ</span>
                            <Select
                                value={discount.serviceType}
                                allowClear
                                className="w-100"
                                options={Constants.ServiceTypeOptions}
                                onChange={(val) => {
                                    setDiscount({ ...discount, serviceType: val });
                                }}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select
                                value={discount.status}
                                allowClear
                                className="w-100"
                                options={Constants.StatusOptions}
                                onChange={(val) => setDiscount({ ...discount, status: val })}
                            />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={discount.description}
                                className="w-100"
                                onChange={(e) => setDiscount({ ...discount, description: e.target.value })}
                            />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

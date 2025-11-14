import { Col, Row, Button, Space, Input, InputNumber } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';
import discountAPI from '../../api/discount/discountAPI';
import Utility from '../../Utils/Utility';
import Constants from '../../Constants/Constants';

const { TextArea } = Input;

export default function Display() {
    const [discount, setDiscount] = useState({});
    const { id } = useParams();

    useEffect(() => {
        setupDisplayForm();
    }, []);

    const setupDisplayForm = async () => {
        try {
            LoadingModal.showLoading();
            const response = await discountAPI.getById(id);
            setDiscount(response.discount ?? {});
        } catch (error) {
            console.error('Error fetching discount details:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết mã giảm giá"
                    secondary={
                        <Space>
                            <Button type="primary" href={`/admin/sale/discount/edit/${id}`} shape="round" icon={<EditOutlined />}>
                                Chỉnh sửa
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
                            <Input value={discount.code} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Tên mã giảm giá</span>
                            <Input value={discount.name} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Giá trị giảm (%)</span>
                            <InputNumber value={discount.discountPercent} className="w-100" readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Ngày hiệu lực</span>
                            <Input value={Utility.formatDate(discount.startEffectedDtg)} className="w-100" readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Ngày hết hiệu lực</span>
                            <Input value={Utility.formatDate(discount.endEffectedDtg)} className="w-100" readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Số lượng mã phát hành</span>
                            <Input value={discount.totalQuantity} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Số lượng mã còn lại</span>
                            <Input value={discount.remainQuantity} className="w-100" readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Loại dịch vụ</span>
                            <Input value={discount.serviceTypeName} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Input value={Utility.getLabelByValue(Constants.StatusOptions, Boolean(discount.status))} readOnly />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea value={discount.description} className="w-100" readOnly />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

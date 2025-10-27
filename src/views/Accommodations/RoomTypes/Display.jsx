import { Modal, Button, InputNumber } from 'antd';
import { Col, Row, Input, Select } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;

export default function RoomTypeDisplay({ isOpen, onCancel, roomType }) {
    return (
        <Modal
            title="Chi tiết loại phòng"
            closable={true}
            open={isOpen}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>
            ]}
            width={{
                xs: '90%',
                sm: '80%',
                md: '70%',
                lg: '60%',
                xl: '50%',
                xxl: '40%'
            }}
        >
            <Row gutter={[24, 24]}>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <div className="mb-3 d-flex justify-content-center">
                        <ImagesUC imageUrl={roomType.coverImageUrl} viewOnly />
                    </div>
                    <span>Hình đại diện</span>
                </Col>
                <Col span={8}>
                    <span>Tên</span>
                    <Input value={roomType.name} readOnly />
                </Col>
                <Col span={8}>
                    <span>Số lượng người lớn</span>
                    <Input value={roomType.maxAdult} readOnly />
                </Col>
                <Col span={8}>
                    <span>Số lượng trẻ em</span>
                    <Input value={roomType.maxChildren} readOnly />
                </Col>
                <Col span={8}>
                    <span>Số lượng phòng</span>
                    <Input value={roomType.quantity} readOnly />
                </Col>
                <Col span={8}>
                    <span>Giá phòng</span>
                    <Input value={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomType.price)} readOnly />
                </Col>
                <Col span={8}>
                    <span>Phụ phí người lớn</span>
                    <Input
                        value={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomType.extraAdultPrice)}
                        readOnly
                    />
                </Col>
                <Col span={8}>
                    <span>Phụ phí trẻ em</span>
                    <Input
                        value={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomType.extraChildrenPrice)}
                        readOnly
                    />
                </Col>
                <Col span={8}>
                    <span>Trạng thái</span>
                    <Input value={roomType.statusName} readOnly />
                </Col>
                <Col span={8}>
                    <span>Tiện ích</span>
                    <Input value={roomType.amenities} readOnly />
                </Col>
                <Col span={24}>
                    <span>Hình ảnh khác</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                        <Gallery listImage={roomType.listInfoImage} viewOnly />
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

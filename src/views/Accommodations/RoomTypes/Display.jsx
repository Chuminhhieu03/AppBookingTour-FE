import { Modal, Button, InputNumber } from 'antd';
import { Col, Row, Input, Select } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';
import axiosIntance from '../../../api/axiosInstance';

const { TextArea } = Input;

export default function RoomTypeDisplay({ isOpen, onCancel, roomType }) {
    const [roomTypeDisplay, setRoomTypeDisplay] = useState(roomType || {});

    useEffect(() => {
        setRoomTypeDisplay(roomType || {});
        setupDisplayForm(roomType.id);
    }, [roomType]);

    const setupDisplayForm = async () => {
        try {
            const response = await axiosIntance.get(`/RoomType/${roomType.id}`);
            const res = response.data;
            setRoomTypeDisplay(res.roomType || {});
        } catch (error) {
            console.error('Error fetching setup data:', error);
        }
    };

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
                        <ImagesUC imageUrl={roomTypeDisplay.coverImageUrl} viewOnly />
                    </div>
                    <span>Hình đại diện</span>
                </Col>
                <Col span={8}>
                    <span>Tên</span>
                    <Input value={roomTypeDisplay.name} readOnly />
                </Col>
                <Col span={8}>
                    <span>Số lượng người lớn</span>
                    <Input value={roomTypeDisplay.maxAdult} readOnly />
                </Col>
                <Col span={8}>
                    <span>Số lượng trẻ em</span>
                    <Input value={roomTypeDisplay.maxChildren} readOnly />
                </Col>
                <Col span={8}>
                    <span>Số lượng phòng</span>
                    <Input value={roomTypeDisplay.quantity} readOnly />
                </Col>
                <Col span={8}>
                    <span>Giá phòng</span>
                    <Input
                        value={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomTypeDisplay.price)}
                        readOnly
                    />
                </Col>
                <Col span={8}>
                    <span>Phụ phí người lớn</span>
                    <Input
                        value={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomTypeDisplay.extraAdultPrice)}
                        readOnly
                    />
                </Col>
                <Col span={8}>
                    <span>Phụ phí trẻ em</span>
                    <Input
                        value={Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            roomTypeDisplay.extraChildrenPrice
                        )}
                        readOnly
                    />
                </Col>
                <Col span={8}>
                    <span>Tiện ích</span>
                    <Input value={roomTypeDisplay.amenityName} readOnly />
                </Col>
                <Col span={8}>
                    <span>Trạng thái</span>
                    <Input value={roomTypeDisplay.statusName} readOnly />
                </Col>
                <Col span={24}>
                    <span>Hình ảnh khác</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                        <Gallery listImage={roomTypeDisplay.listInfoImage} viewOnly />
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

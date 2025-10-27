import { Modal, Button, InputNumber } from 'antd';
import { Col, Row, Input, Select } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';

const { TextArea } = Input;

export default function AddNewRoomType({ isOpen, onOk, onCancel, accommodationId }) {
    const [roomType, setRoomType] = useState({});
    const [listStatus, setListStatus] = useState([]);
    const [listInfoImage, setListInfoImage] = useState([]);

    useEffect(() => {
        setupAddnewForm();
    }, []);

    const setupAddnewForm = async () => {
        const response = await fetch('https://localhost:44331/api/RoomType/setup-addnew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const res = await response.json();
        setListStatus(res.listStatus);
    };

    const onAddnewRoomType = async (roomType) => {
        LoadingModal.showLoading();
        try {
            const roomTypeRequest = { ...roomType };
            const formData = new FormData();
            formData.append('Name', roomTypeRequest.Name);
            formData.append('MaxAdult', roomTypeRequest.MaxAdult);
            formData.append('MaxChildren', roomTypeRequest.MaxChildren);
            formData.append('Quantity', roomTypeRequest.Quantity);
            formData.append('Price', roomTypeRequest.Price);
            formData.append('ExtraAdultPrice', roomTypeRequest.ExtraAdultPrice);
            formData.append('ExtraChildrenPrice', roomTypeRequest.ExtraChildrenPrice);
            formData.append('Status', roomTypeRequest.Status);
            formData.append('CoverImgFile', roomTypeRequest.CoverImgFile);
            formData.append('AccommodationId', accommodationId);
            listInfoImage?.forEach((file) => {
                formData.append('InfoImgFile', file);
            });
            const response = await fetch('https://localhost:44331/api/RoomType', {
                method: 'POST',
                body: formData
            });
            const res = await response.json();
            if (res.success) {
                onOk(true); // Signal success to parent
                onCancel(); // Close the modal
                setRoomType({});
            } else {
                console.error('Error adding new room type:', res.message);
            }
        } catch (error) {
            console.error('Error adding new accommodation:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleOk = () => {
        onAddnewRoomType(roomType);
    };

    return (
        <Modal
            title="Thêm mới loại phòng"
            closable={true}
            open={isOpen}
            onCancel={onCancel}
            onOk={handleOk}
            footer={[
                <Button key="back" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Lưu
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
                        <ImagesUC onChange={(_, file) => setRoomType({ ...roomType, CoverImgFile: file })} />
                    </div>
                    <span>Hình đại diện</span>
                </Col>
                <Col span={8}>
                    <span>Tên</span>
                    <Input value={roomType.Name} onChange={(e) => setRoomType({ ...roomType, Name: e.target.value })} />
                </Col>
                <Col span={8}>
                    <span>Số lượng người lớn</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomType.MaxAdult}
                        onChange={(val) => setRoomType({ ...roomType, MaxAdult: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Số lượng trẻ em</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomType.MaxChildren}
                        onChange={(val) => setRoomType({ ...roomType, MaxChildren: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Số lượng phòng</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomType.Quantity}
                        onChange={(val) => setRoomType({ ...roomType, Quantity: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Giá phòng</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomType.Price}
                        onChange={(val) => setRoomType({ ...roomType, Price: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Phụ phí người lớn</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomType.ExtraAdultPrice}
                        onChange={(val) => setRoomType({ ...roomType, ExtraAdultPrice: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Phụ phí trẻ em</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomType.ExtraChildrenPrice}
                        onChange={(val) => setRoomType({ ...roomType, ExtraChildrenPrice: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Trạng thái</span>
                    <Select
                        value={roomType.Status}
                        allowClear
                        className="w-100"
                        options={listStatus?.map((item) => ({
                            label: item.value,
                            value: item.key
                        }))}
                        onChange={(val) => setRoomType({ ...roomType, Status: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Tiện ích</span>
                    <Select
                        value={roomType.isActive}
                        allowClear
                        className="w-100"
                        options={listStatus?.map((item) => ({
                            label: item.value,
                            value: item.key
                        }))}
                        onChange={(val) => setRoomType({ ...roomType, isActive: val })}
                    />
                </Col>
                <Col span={24}>
                    <span>Hình ảnh khác</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                        <Gallery
                            onChange={(_, listNewImage) => {
                                setListInfoImage([...listNewImage]);
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

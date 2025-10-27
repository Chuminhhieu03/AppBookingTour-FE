import { Modal, Button, InputNumber } from 'antd';
import { Col, Row, Input, Select } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';
import { set } from 'react-hook-form';

const { TextArea } = Input;

export default function EditRoomType({ isOpen, onOk, onCancel, roomType, accommodationId }) {
    const [roomTypeEdit, setRoomTypeEdit] = useState(roomType || {});
    const [listStatus, setListStatus] = useState([]);
    const [listInfoImage, setListInfoImage] = useState(roomType?.infoImages || []);
    const [listAmenity, setListAmenity] = useState([]);

    useEffect(() => {
        setupEditForm();
    }, []);

    useEffect(() => {
        roomType.amenity = roomType.amenities?.split(', ').map(Number) || [];
        setRoomTypeEdit(roomType || {});
    }, [roomType]);

    const setupEditForm = async () => {
        try {
            const response = await fetch('https://localhost:44331/api/RoomType/setup-addnew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });
            const res = await response.json();
            setListStatus(res.listStatus || []);
            setListAmenity(res.listAmenity || []);
        } catch (error) {
            console.error('Error fetching setup data:', error);
        }
    };

    const onEditRoomType = async (roomTypeData) => {
        LoadingModal.showLoading();
        try {
            const amenities = roomTypeData.amenity?.join(', ') || '';
            const formData = new FormData();
            formData.append('Id', roomTypeData.id);
            formData.append('Name', roomTypeData.name);
            formData.append('MaxAdult', roomTypeData.maxAdult);
            formData.append('MaxChildren', roomTypeData.maxChildren);
            formData.append('Quantity', roomTypeData.quantity);
            formData.append('Price', roomTypeData.price);
            formData.append('ExtraAdultPrice', roomTypeData.extraAdultPrice);
            formData.append('ExtraChildrenPrice', roomTypeData.extraChildrenPrice);
            formData.append('Status', roomTypeData.status);
            formData.append('AccommodationId', accommodationId);
            formData.append('Amenities', amenities);
            if (roomTypeData.coverImgFile) {
                formData.append('CoverImgFile', roomTypeData.coverImgFile);
            }
            roomTypeData.listInfoImage?.forEach((file) => {
                formData.append('ListInfoImageId', file.id);
            });
            listInfoImage?.forEach((file) => {
                formData.append('ListNewInfoImage', file);
            });
            const response = await fetch(`https://localhost:44331/api/RoomType/${roomTypeData.id}`, {
                method: 'PUT',
                body: formData
            });
            const res = await response.json();
            if (res.success) {
                onOk(true); // Signal success to parent
                onCancel(); // Close the modal
                setRoomTypeEdit({});
                setListInfoImage([]);
            } else {
                console.error('Error editing room type:', res.message);
            }
        } catch (error) {
            console.error('Error editing room type:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleOk = () => {
        onEditRoomType(roomTypeEdit);
    };

    return (
        <Modal
            title="Chỉnh sửa loại phòng"
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
                        <ImagesUC
                            imageUrl={roomTypeEdit.coverImageUrl}
                            onChange={(imgUrl, file) => setRoomTypeEdit({ ...roomTypeEdit, coverImageUrl: imgUrl, coverImgFile: file })}
                        />
                    </div>
                    <span>Hình đại diện</span>
                </Col>
                <Col span={8}>
                    <span>Tên</span>
                    <Input value={roomTypeEdit.name} onChange={(e) => setRoomTypeEdit({ ...roomTypeEdit, name: e.target.value })} />
                </Col>
                <Col span={8}>
                    <span>Số lượng người lớn</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomTypeEdit.maxAdult}
                        onChange={(val) => setRoomTypeEdit({ ...roomTypeEdit, maxAdult: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Số lượng trẻ em</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomTypeEdit.maxChildren}
                        onChange={(val) => setRoomTypeEdit({ ...roomTypeEdit, maxChildren: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Số lượng phòng</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomTypeEdit.quantity}
                        onChange={(val) => setRoomTypeEdit({ ...roomTypeEdit, quantity: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Giá phòng</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomTypeEdit.price}
                        onChange={(val) => setRoomTypeEdit({ ...roomTypeEdit, price: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Phụ phí người lớn</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomTypeEdit.extraAdultPrice}
                        onChange={(val) => setRoomTypeEdit({ ...roomTypeEdit, extraAdultPrice: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Phụ phí trẻ em</span>
                    <InputNumber
                        min={0}
                        className="w-100"
                        value={roomTypeEdit.extraChildrenPrice}
                        onChange={(val) => setRoomTypeEdit({ ...roomTypeEdit, extraChildrenPrice: val })}
                    />
                </Col>
                <Col span={8}>
                    <span>Tiện ích</span>
                    <Select
                        mode="multiple"
                        value={roomTypeEdit.amenity}
                        allowClear
                        className="w-100"
                        options={listAmenity?.map((item) => ({
                            label: item.name,
                            value: item.id
                        }))}
                        onChange={(val) => {
                            setRoomTypeEdit({ ...roomTypeEdit, amenity: val });
                        }}
                    />
                </Col>
                <Col span={8}>
                    <span>Trạng thái</span>
                    <Select
                        value={roomTypeEdit.status}
                        allowClear
                        className="w-100"
                        options={listStatus?.map((item) => ({
                            label: item.value,
                            value: item.key
                        }))}
                        onChange={(val) => setRoomTypeEdit({ ...roomTypeEdit, status: val })}
                    />
                </Col>
                <Col span={24}>
                    <span>Hình ảnh khác</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                        <Gallery
                            listImage={roomTypeEdit.listInfoImage}
                            onChange={(listOldImage, listNewImage) =>
                            {
                                setRoomTypeEdit({
                                    ...roomTypeEdit,
                                    listInfoImage: listOldImage,
                                });
                                setListInfoImage(listNewImage);
                            }}
                        />
                    </div>
                </Col>
            </Row>
        </Modal>
    );
}

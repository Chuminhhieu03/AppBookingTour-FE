import { Modal, Button, InputNumber, Form, Input, Select, Col, Row } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';
import roomTypeAPI from '../../../api/accommodation/roomTypeAPI';
import Constants from '../../../Constants/Constants';
import systemParameterAPI from '../../../api/systemParameters/systemParameterAPI';
import RoomInventoryTable from './RoomInventories/RoomInventoryTable';

const { TextArea } = Input;

export default function EditRoomType({ isOpen, onOk, onCancel, roomType, accommodationId }) {
    const [form] = Form.useForm();
    const [roomTypeEdit, setRoomTypeEdit] = useState(roomType || {});
    const [listInfoImage, setListInfoImage] = useState(roomType?.listInfoImage || []);
    const [listAmenity, setListAmenity] = useState([]);
    const [coverImgFile, setCoverImgFile] = useState(null);

    useEffect(() => {
        getListRoomTypeAmenity();
        getRoomTypeById(roomType?.id);
    }, []);

    const getListRoomTypeAmenity = async () => {
        try {
            const res = await systemParameterAPI.getByFeatureCode(Constants.FeatureCode.RoomTypeAmenity);
            setListAmenity(res.data);
        } catch (error) {
            console.error('Error fetching setup data:', error);
        }
    };

    const getRoomTypeById = async (id) => {
        try {
            const res = await roomTypeAPI.getById(id);
            setRoomTypeEdit(res.roomType || {});
        } catch (error) {
            console.error('Error fetching setup data:', error);
        }
    };

    useEffect(() => {
        // Populate form when roomType prop changes
        const rt = roomType || {};
        const amenityArr = rt.amenities?.split(', ').map(Number) || [];
        setRoomTypeEdit(rt);
        setListInfoImage(rt.listInfoImage || []);
        form.setFieldsValue({
            Id: rt.id,
            Name: rt.name,
            MaxAdult: rt.maxAdult,
            MaxChildren: rt.maxChildren,
            Quantity: rt.quantity,
            Price: rt.price,
            ExtraAdultPrice: rt.extraAdultPrice,
            ExtraChildrenPrice: rt.extraChildrenPrice,
            Status: rt.status,
            Amenity: amenityArr,
            CoverImageUrl: rt.coverImageUrl
        });
    }, [roomType, form]);

    const onEditRoomType = async (roomTypeData) => {
        LoadingModal.showLoading();
        try {
            const amenities = roomTypeData.Amenity?.join(', ') || roomTypeData.amenity?.join(', ') || '';
            const formData = new FormData();
            formData.append('Id', roomTypeData.Id ?? roomTypeEdit.id);
            formData.append('Name', roomTypeData.Name ?? roomTypeEdit.name);
            formData.append('MaxAdult', roomTypeData.MaxAdult ?? roomTypeEdit.maxAdult);
            formData.append('MaxChildren', roomTypeData.MaxChildren ?? roomTypeEdit.maxChildren);
            formData.append('Quantity', roomTypeData.Quantity ?? roomTypeEdit.quantity);
            formData.append('Price', roomTypeData.Price ?? roomTypeEdit.price);
            formData.append('ExtraAdultPrice', roomTypeData.ExtraAdultPrice ?? roomTypeEdit.extraAdultPrice);
            formData.append('ExtraChildrenPrice', roomTypeData.ExtraChildrenPrice ?? roomTypeEdit.extraChildrenPrice);
            formData.append('Status', Number(roomTypeData.Status) ?? Number(roomTypeEdit.status));
            formData.append('AccommodationId', accommodationId);
            formData.append('Amenities', amenities);
            formData.append('CoverImageUrl', roomTypeData.CoverImageUrl ?? roomTypeEdit.coverImageUrl ?? '');
            if (coverImgFile) formData.append('CoverImgFile', coverImgFile);
            (roomTypeData.ListInfoImage || roomTypeEdit.listInfoImage || []).forEach((file) => {
                if (file && file.id) formData.append('ListInfoImageId', file.id);
            });
            listInfoImage?.forEach((file) => {
                if (!file.id) formData.append('ListNewInfoImage', file);
            });
            const idToPut = roomTypeData.Id ?? roomTypeEdit.id;
            const res = await roomTypeAPI.update(idToPut, formData);
            if (res.success) {
                onOk(true); 
                onCancel(); 
                form.resetFields();
                setRoomTypeEdit({});
                setListInfoImage([]);
                setCoverImgFile(null);
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
        form.submit();
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
            <Form form={form} layout="vertical" onFinish={onEditRoomType} initialValues={{ Status: undefined }}>
                <Row gutter={[24]}>
                    <Col span={24} style={{ textAlign: 'center' }}>
                        <div className="mb-3 d-flex justify-content-center">
                            <ImagesUC
                                imageUrl={roomTypeEdit.coverImageUrl}
                                onChange={(imgUrl, file) => {
                                    setCoverImgFile(file);
                                    form.setFieldsValue({ CoverImageUrl: imgUrl });
                                }}
                            />
                        </div>
                        <span>Hình đại diện</span>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="MaxAdult" label="Số lượng người lớn">
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="MaxChildren" label="Số lượng trẻ em">
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Quantity" label="Số lượng phòng">
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Price" label="Giá phòng">
                            <InputNumber
                                min={0}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                maxLength={15}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="ExtraAdultPrice" label="Phụ phí người lớn">
                            <InputNumber
                                min={0}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                maxLength={15}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="ExtraChildrenPrice" label="Phụ phí trẻ em">
                            <InputNumber
                                min={0}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                                maxLength={15}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Amenity" label="Tiện ích">
                            <Select
                                mode="multiple"
                                allowClear
                                className="w-100"
                                options={listAmenity?.map((item) => ({ label: item.name, value: item.id }))}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Status" label="Trạng thái">
                            <Select allowClear className="w-100" options={Constants.StatusOptions} />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <span>Hình ảnh khác</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                            <Gallery
                                listImage={roomTypeEdit.listInfoImage}
                                onChange={(listOldImage, listNewImage) => {
                                    form.setFieldsValue({ ListInfoImage: listOldImage });
                                    setListInfoImage(listNewImage);
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={24}>
                        <RoomInventoryTable
                            editable={true}
                            value={roomTypeEdit.listRoomInventory || []}
                            roomTypeId={roomTypeEdit.id}
                            onChange={(newListRoomInventory) => {
                                setRoomTypeEdit((prev) => ({
                                    ...prev,
                                    listRoomInventory: newListRoomInventory
                                }));
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

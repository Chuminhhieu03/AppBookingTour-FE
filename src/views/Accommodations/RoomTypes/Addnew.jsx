import { Modal, Button, InputNumber, Form, Input, Select, Col, Row } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import LoadingModal from '../../../components/LoadingModal';
import roomTypeAPI from '../../../api/accommodation/roomTypeAPI';
import Constants from '../../../Constants/Constants';
import systemParameterAPI from '../../../api/systemParameters/systemParameterAPI';

const { TextArea } = Input;

export default function AddNewRoomType({ isOpen, onOk, onCancel, accommodationId }) {
    const [form] = Form.useForm();
    const [listInfoImage, setListInfoImage] = useState([]);
    const [listAmenity, setListAmenity] = useState([]);
    const [coverImgFile, setCoverImgFile] = useState(null);

    useEffect(() => {
        getListRoomTypeAmenity();
    }, []);

    const getListRoomTypeAmenity = async () => {
        try {
            const res = await systemParameterAPI.getByFeatureCode(Constants.FeatureCode.RoomTypeAmenity);
            setListAmenity(res.data);
        } catch (error) {
            console.error('Error fetching setup addnew for room type:', error);
        }
    };

    const onAddnewRoomType = async (roomType) => {
        LoadingModal.showLoading();
        try {
            const roomTypeRequest = { ...roomType };
            const amenities = roomTypeRequest.Amenity?.join(', ') || '';
            const formData = new FormData();
            formData.append('Name', roomTypeRequest.Name);
            formData.append('MaxAdult', roomTypeRequest.MaxAdult);
            formData.append('MaxChildren', roomTypeRequest.MaxChildren);
            formData.append('Quantity', roomTypeRequest.Quantity);
            formData.append('Price', roomTypeRequest.Price);
            formData.append('ExtraAdultPrice', roomTypeRequest.ExtraAdultPrice);
            formData.append('ExtraChildrenPrice', roomTypeRequest.ExtraChildrenPrice);
            formData.append('Status', Number(roomTypeRequest.Status));
            // cover image file comes from local state
            if (coverImgFile) formData.append('CoverImgFile', coverImgFile);
            formData.append('Amenities', amenities);
            formData.append('AccommodationId', accommodationId);
            listInfoImage?.forEach((file) => {
                formData.append('InfoImgFile', file);
            });
            const res = await roomTypeAPI.create(formData);
            if (res.success) {
                onOk(true); // Signal success to parent
                onCancel(); // Close the modal
                form.resetFields();
                setCoverImgFile(null);
                setListInfoImage([]);
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
        form.submit();
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
            <Form form={form} layout="vertical" onFinish={onAddnewRoomType} initialValues={{ Status: undefined }}>
                <Row gutter={[24]}>
                    <Col span={24} style={{ textAlign: 'center', marginBottom: 16 }}>
                        <div className="mb-3 d-flex justify-content-center">
                            <ImagesUC onChange={(_, file) => setCoverImgFile(file)} />
                        </div>
                        <span>Hình đại diện</span>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Name" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="MaxAdult" label="Số lượng người lớn" rules={[{ type: 'number', min: 0 }]}>
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="MaxChildren" label="Số lượng trẻ em" rules={[{ type: 'number', min: 0 }]}>
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Quantity" label="Số lượng phòng" rules={[{ type: 'number', min: 0 }]}>
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Price" label="Giá phòng" rules={[{ type: 'number', min: 0 }]}>
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
                        <Form.Item name="ExtraAdultPrice" label="Phụ phí người lớn" rules={[{ type: 'number', min: 0 }]}>
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
                        <Form.Item name="ExtraChildrenPrice" label="Phụ phí trẻ em" rules={[{ type: 'number', min: 0 }]}>
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
                                onChange={(_, listNewImage) => {
                                    setListInfoImage([...listNewImage]);
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

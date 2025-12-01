import { Modal, Button, InputNumber, Form, Input, Select, Col, Row, message, TimePicker } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import LoadingModal from '../../../components/LoadingModal';
import roomTypeAPI from '../../../api/accommodation/roomTypeAPI';
import Constants from '../../../Constants/Constants';
import systemParameterAPI from '../../../api/systemParameters/systemParameterAPI';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';

const { TextArea } = Input;

export default function AddNewRoomType({ isOpen, onOk, onCancel, accommodationId }) {
    const [form] = Form.useForm();
    const [listInfoImage, setListInfoImage] = useState([]);
    const [listAmenity, setListAmenity] = useState([]);
    const [listRoomView, setListRoomView] = useState([]);
    const [coverImgFile, setCoverImgFile] = useState(null);
    const [cancelPolicy, setCancelPolicy] = useState('');

    useEffect(() => {
        getListRoomTypeAmenity();
        getListRoomView();
    }, []);

    const getListRoomTypeAmenity = async () => {
        try {
            const res = await systemParameterAPI.getByFeatureCode(Constants.FeatureCode.RoomTypeAmenity);
            setListAmenity(res.data);
        } catch (error) {
            console.error('Error fetching setup addnew for room type:', error);
        }
    };

    const getListRoomView = async () => {
        try {
            // Use static options from Constants instead of API
            setListRoomView(Constants.RoomViewOptions);
        } catch (error) {
            console.error('Error fetching room view options:', error);
        }
    };

    const onAddnewRoomType = async (roomType) => {
        LoadingModal.showLoading();
        try {
            const roomTypeRequest = { ...roomType };
            const amenities = roomTypeRequest.Amenity?.join(', ') || '';
            const views = roomTypeRequest.View?.join(', ') || '';
            const formData = new FormData();
            formData.append('Name', roomTypeRequest.Name);
            formData.append('MaxAdult', roomTypeRequest.MaxAdult);
            formData.append('MaxChildren', roomTypeRequest.MaxChildren);
            formData.append('Quantity', roomTypeRequest.Quantity);
            formData.append('Price', roomTypeRequest.Price);
            formData.append('Status', Number(roomTypeRequest.Status));
            formData.append('CheckinHour', roomTypeRequest.CheckinHour?.format('HH:mm:ss') || '');
            formData.append('CheckoutHour', roomTypeRequest.CheckoutHour?.format('HH:mm:ss') || '');
            formData.append('Area', roomTypeRequest.Area || 0);
            formData.append('View', views);
            formData.append('CancelPolicy', cancelPolicy || '');
            // cover image file comes from local state
            if (coverImgFile) formData.append('CoverImgFile', coverImgFile);
            formData.append('Amenities', amenities);
            formData.append('AccommodationId', accommodationId);
            listInfoImage?.forEach((file) => {
                formData.append('InfoImgFile', file);
            });
            const res = await roomTypeAPI.create(formData);
            if (res.success) {
                message.success('Thêm mới loại phòng thành công');
                onOk(true); // Signal success to parent
                onCancel(); // Close the modal
                form.resetFields();
                setCoverImgFile(null);
                setListInfoImage([]);
            } else {
                console.error('Error adding new room type:', res.message);
                message.error(res.message || 'Thêm mới loại phòng thất bại');
            }
        } catch (error) {
            console.error('Error adding new accommodation:', error);
            message.error('Đã xảy ra lỗi khi thêm mới loại phòng');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleOk = () => {
        form.submit();
    };

    return (
        <>
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
                        <Form.Item
                            name="MaxAdult"
                            label="Số lượng người lớn"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lượng người lớn' },
                                { type: 'number', min: 0 }
                            ]}
                        >
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="MaxChildren"
                            label="Số lượng trẻ em"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lượng trẻ em' },
                                { type: 'number', min: 0 }
                            ]}
                        >
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="Quantity"
                            label="Số lượng phòng"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số lượng phòng' },
                                { type: 'number', min: 0 }
                            ]}
                        >
                            <InputNumber min={0} className="w-100" />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="Price"
                            label="Giá phòng"
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá phòng' },
                                { type: 'number', min: 0 }
                            ]}
                        >
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
                        <Form.Item name="Amenity" label="Tiện ích" rules={[{ required: true, message: 'Vui lòng chọn tiện ích' }]}>
                            <Select
                                mode="multiple"
                                allowClear
                                className="w-100"
                                getPopupContainer={(trigger) => trigger.parentNode}
                                options={listAmenity?.map((item) => ({ label: item.name, value: item.id }))}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="Status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
                            <Select
                                allowClear
                                className="w-100"
                                options={Constants.StatusOptions}
                                getPopupContainer={(trigger) => trigger.parentNode}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="CheckinHour"
                            label="Giờ nhận phòng"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ nhận phòng' }]}
                        >
                            <TimePicker
                                className="w-100"
                                format="HH:mm"
                                placeholder="Chọn giờ nhận phòng"
                                getPopupContainer={(trigger) => trigger.parentNode}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="CheckoutHour"
                            label="Giờ trả phòng"
                            rules={[{ required: true, message: 'Vui lòng chọn giờ trả phòng' }]}
                        >
                            <TimePicker
                                className="w-100"
                                format="HH:mm"
                                placeholder="Chọn giờ trả phòng"
                                getPopupContainer={(trigger) => trigger.parentNode}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            name="Area"
                            label="Diện tích (m²)"
                            rules={[
                                { required: true, message: 'Vui lòng nhập diện tích' },
                                { type: 'number', min: 0 }
                            ]}
                        >
                            <InputNumber
                                min={0}
                                className="w-100"
                                placeholder="Nhập diện tích"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item name="View" label="Tầm nhìn" rules={[{ required: true, message: 'Vui lòng chọn tầm nhìn' }]}>
                            <Select
                                mode="multiple"
                                allowClear
                                className="w-100"
                                placeholder="Chọn tầm nhìn"
                                getPopupContainer={(trigger) => trigger.parentNode}
                                options={listRoomView}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <span>Quy định hủy phòng</span>
                        <div style={{ marginTop: 8 }}>
                            <TiptapEditor content={cancelPolicy} onChange={setCancelPolicy} minHeight={100} />
                        </div>
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
        </>
    );
}

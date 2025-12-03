import { Modal, Button, InputNumber, Form, Input, Select, Col, Row, Tabs, message, DatePicker, TimePicker } from 'antd';
import ImagesUC from '../../components/basic/ImagesUC';
import Gallery from '../../components/basic/Gallery';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import LoadingModal from '../../../components/LoadingModal';
import roomTypeAPI from '../../../api/accommodation/roomTypeAPI';
import Constants from '../../../Constants/Constants';
import systemParameterAPI from '../../../api/systemParameters/systemParameterAPI';
import RoomInventoryTable from './RoomInventories/RoomInventoryTable';
import roomInventoryAPI from '../../../api/accommodation/roomInventoryAPI';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';

const { TextArea } = Input;

export default function EditRoomType({ isOpen, onOk, onCancel, roomType, accommodationId }) {
    const [form] = Form.useForm();
    const [dateRangeForm] = Form.useForm();
    const [specialDateForm] = Form.useForm();
    const [roomTypeEdit, setRoomTypeEdit] = useState(roomType || {});
    const [listInfoImage, setListInfoImage] = useState(roomType?.listInfoImage || []);
    const [listAmenity, setListAmenity] = useState([]);
    const [coverImgFile, setCoverImgFile] = useState(null);
    const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);
    const [isSpecialDateModalOpen, setIsSpecialDateModalOpen] = useState(false);
    const [cancelPolicy, setCancelPolicy] = useState(roomType?.cancelPolicy || '');

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
        const viewArr = rt.view?.split(', ').map(Number) || [];
        setRoomTypeEdit(rt);
        setListInfoImage(rt.listInfoImage || []);
        form.setFieldsValue({
            Id: rt.id,
            Name: rt.name,
            MaxAdult: rt.maxAdult,
            MaxChildren: rt.maxChildren,
            Quantity: rt.quantity,
            Price: rt.price,
            Status: rt.status,
            Amenity: amenityArr,
            CheckinHour: rt.checkinHour ? dayjs(rt.checkinHour, 'HH:mm:ss') : undefined,
            CheckoutHour: rt.checkoutHour ? dayjs(rt.checkoutHour, 'HH:mm:ss') : undefined,
            Area: rt.area,
            View: viewArr,
            CancelPolicy: rt.cancelPolicy,
            CoverImageUrl: rt.coverImageUrl,
            VAT: rt.vat,
            ManagementFee: rt.managementFee
        });
    }, [roomType, form]);

    const onEditRoomType = async (roomTypeData) => {
        LoadingModal.showLoading();
        try {
            const amenities = roomTypeData.Amenity?.join(', ') || roomTypeData.amenity?.join(', ') || '';
            const views = roomTypeData.View?.join(', ') || '';
            const formData = new FormData();
            formData.append('Id', roomTypeData.Id ?? roomTypeEdit.id);
            formData.append('Name', roomTypeData.Name ?? roomTypeEdit.name);
            formData.append('MaxAdult', roomTypeData.MaxAdult ?? roomTypeEdit.maxAdult);
            formData.append('MaxChildren', roomTypeData.MaxChildren ?? roomTypeEdit.maxChildren);
            formData.append('Quantity', roomTypeData.Quantity ?? roomTypeEdit.quantity);
            formData.append('Price', roomTypeData.Price ?? roomTypeEdit.price);
            formData.append('Status', Number(roomTypeData.Status) ?? Number(roomTypeEdit.status));
            formData.append('CheckinHour', roomTypeData.CheckinHour?.format('HH:mm:ss') || roomTypeEdit.checkinHour || '');
            formData.append('CheckoutHour', roomTypeData.CheckoutHour?.format('HH:mm:ss') || roomTypeEdit.checkoutHour || '');
            formData.append('Area', roomTypeData.Area ?? roomTypeEdit.area ?? 0);
            formData.append('View', views || roomTypeEdit.view || '');
            formData.append('CancelPolicy', cancelPolicy || roomTypeEdit.cancelPolicy || '');
            formData.append('VAT', roomTypeData.VAT ?? roomTypeEdit.vat ?? 0);
            formData.append('ManagementFee', roomTypeData.ManagementFee ?? roomTypeEdit.managementFee ?? 0);
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
                message.success('Cập nhật loại phòng thành công');
                onOk(true);
                onCancel();
                form.resetFields();
                setRoomTypeEdit({});
                setListInfoImage([]);
                setCoverImgFile(null);
            } else {
                console.error('Error editing room type:', res.message);
                message.error(res.message || 'Cập nhật loại phòng thất bại');
            }
        } catch (error) {
            console.error('Error editing room type:', error);
            message.error('Đã xảy ra lỗi khi cập nhật loại phòng');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleOk = () => {
        form.submit();
    };

    const handleOpenDateRangeModal = () => {
        dateRangeForm.setFieldsValue({
            Price: roomTypeEdit.price,
            Slot: roomTypeEdit.quantity
        });
        setIsDateRangeModalOpen(true);
    };

    const handleDateRangeSubmit = async (values) => {
        LoadingModal.showLoading();
        try {
            const requestBody = {
                fromDate: values.FromDate?.format('YYYY-MM-DD'),
                toDate: values.ToDate?.format('YYYY-MM-DD'),
                BasePrice: values.Price,
                BookedRooms: values.Slot,
                roomTypeId: roomTypeEdit.id
            };

            const response = await roomInventoryAPI.createBulk(requestBody);

            if (response.success) {
                message.success('Thêm khoảng ngày thành công');
                setIsDateRangeModalOpen(false);
                dateRangeForm.resetFields();
                // Refresh room type data to update the table
                await getRoomTypeById(roomTypeEdit.id);
            } else {
                message.error(response.message || 'Không thể thêm khoảng ngày');
            }
        } catch (error) {
            console.error('Error creating date range:', error);
            message.error('Đã xảy ra lỗi khi thêm khoảng ngày');
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleOpenSpecialDateModal = () => {
        specialDateForm.setFieldsValue({
            Price: roomTypeEdit.price,
            Slot: roomTypeEdit.quantity
        });
        setIsSpecialDateModalOpen(true);
    };

    const handleSpecialDateSubmit = async (values) => {
        LoadingModal.showLoading();
        try {
            const requestBody = {
                RoomInventory: {
                    date: values.Date?.format('YYYY-MM-DD'),
                    BasePrice: values.Price,
                    BookedRooms: values.Slot,
                    RoomTypeId: roomTypeEdit.id
                }
            };

            const response = await roomInventoryAPI.create(requestBody);

            if (response.success) {
                message.success('Thêm ngày đặc biệt thành công');
                setIsSpecialDateModalOpen(false);
                specialDateForm.resetFields();
                // Refresh room type data to update the table
                await getRoomTypeById(roomTypeEdit.id);
            } else {
                message.error(response.message || 'Không thể thêm ngày đặc biệt');
            }
        } catch (error) {
            console.error('Error creating special date:', error);
            message.error('Đã xảy ra lỗi khi thêm ngày đặc biệt');
        } finally {
            LoadingModal.hideLoading();
        }
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
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            key: '1',
                            label: 'Thông tin loại phòng',
                            children: (
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
                                        <Form.Item
                                            name="MaxAdult"
                                            label="Số lượng người lớn"
                                            rules={[{ required: true, message: 'Vui lòng nhập số lượng người lớn' }]}
                                        >
                                            <InputNumber min={0} className="w-100" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="MaxChildren"
                                            label="Số lượng trẻ em"
                                            rules={[{ required: true, message: 'Vui lòng nhập số lượng trẻ em' }]}
                                        >
                                            <InputNumber min={0} className="w-100" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="Quantity"
                                            label="Số lượng phòng"
                                            rules={[{ required: true, message: 'Vui lòng nhập số lượng phòng' }]}
                                        >
                                            <InputNumber min={0} className="w-100" />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="Price"
                                            label="Giá phòng"
                                            rules={[{ required: true, message: 'Vui lòng nhập giá phòng' }]}
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
                                        <Form.Item
                                            name="Amenity"
                                            label="Tiện ích"
                                            rules={[{ required: true, message: 'Vui lòng chọn tiện ích' }]}
                                        >
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
                                        <Form.Item
                                            name="Status"
                                            label="Trạng thái"
                                            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                                        >
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
                                        <Form.Item
                                            name="View"
                                            label="Tầm nhìn"
                                            rules={[{ required: true, message: 'Vui lòng chọn tầm nhìn' }]}
                                        >
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                className="w-100"
                                                placeholder="Chọn tầm nhìn"
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                                options={Constants.RoomViewOptions}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="VAT"
                                            label="Thuế VAT (%)"
                                            rules={[
                                                { type: 'number', min: 0, max: 100, message: 'VAT phải từ 0 đến 100' }
                                            ]}
                                        >
                                            <InputNumber
                                                min={0}
                                                max={100}
                                                className="w-100"
                                                placeholder="Nhập thuế VAT"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            name="ManagementFee"
                                            label="Phụ thu quản trị (%)"
                                            rules={[
                                                { type: 'number', min: 0, max: 100, message: 'Phụ thu quản trị phải từ 0 đến 100' }
                                            ]}
                                        >
                                            <InputNumber
                                                min={0}
                                                max={100}
                                                className="w-100"
                                                placeholder="Nhập phụ thu quản trị"
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
                                                listImage={roomTypeEdit.listInfoImage}
                                                onChange={(listOldImage, listNewImage) => {
                                                    form.setFieldsValue({ ListInfoImage: listOldImage });
                                                    setListInfoImage(listNewImage);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            )
                        },
                        {
                            key: '2',
                            label: 'RoomInventory',
                            children: (
                                <Row gutter={[24, 24]}>
                                    <Col span={24} style={{ marginBottom: 16, textAlign: 'right' }}>
                                        <Button type="primary" style={{ marginRight: 8 }} onClick={handleOpenDateRangeModal}>
                                            Thêm theo khoảng ngày
                                        </Button>
                                        <Button type="default" onClick={handleOpenSpecialDateModal}>
                                            Thêm ngày đặc biệt
                                        </Button>
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
                            )
                        }
                    ]}
                />
            </Form>

            <Modal
                title="Thêm theo khoảng ngày"
                open={isDateRangeModalOpen}
                onCancel={() => {
                    setIsDateRangeModalOpen(false);
                    dateRangeForm.resetFields();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setIsDateRangeModalOpen(false);
                            dateRangeForm.resetFields();
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => dateRangeForm.submit()}>
                        Thêm
                    </Button>
                ]}
                width={600}
                getContainer={false}
                maskClosable={false}
            >
                <Form form={dateRangeForm} layout="vertical" onFinish={handleDateRangeSubmit}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Form.Item name="FromDate" label="Từ ngày" rules={[{ required: true, message: 'Vui lòng chọn từ ngày' }]}>
                                <DatePicker
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    format="DD/MM/YYYY"
                                    className="w-100"
                                    placeholder="Chọn từ ngày"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ToDate" label="Đến ngày" rules={[{ required: true, message: 'Vui lòng chọn đến ngày' }]}>
                                <DatePicker
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    format="DD/MM/YYYY"
                                    className="w-100"
                                    placeholder="Chọn đến ngày"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Price" label="Giá (VND)" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                                <InputNumber
                                    min={0}
                                    className="w-100"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/,/g, '')}
                                    placeholder="Nhập giá"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Slot" label="Số slot" rules={[{ required: true, message: 'Vui lòng nhập số slot' }]}>
                                <InputNumber min={0} className="w-100" placeholder="Nhập số slot" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                title="Thêm ngày đặc biệt"
                open={isSpecialDateModalOpen}
                onCancel={() => {
                    setIsSpecialDateModalOpen(false);
                    specialDateForm.resetFields();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setIsSpecialDateModalOpen(false);
                            specialDateForm.resetFields();
                        }}
                    >
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => specialDateForm.submit()}>
                        Thêm
                    </Button>
                ]}
                width={500}
                getContainer={false}
                maskClosable={false}
            >
                <Form form={specialDateForm} layout="vertical" onFinish={handleSpecialDateSubmit}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item name="Date" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                                <DatePicker
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    format="DD/MM/YYYY"
                                    className="w-100"
                                    placeholder="Chọn ngày"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Price" label="Giá (VND)" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                                <InputNumber
                                    min={0}
                                    className="w-100"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value?.replace(/,/g, '')}
                                    placeholder="Nhập giá"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Slot" label="Số slot" rules={[{ required: true, message: 'Vui lòng nhập số slot' }]}>
                                <InputNumber min={0} className="w-100" placeholder="Nhập số slot" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </Modal>
    );
}

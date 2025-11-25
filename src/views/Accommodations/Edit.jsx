import { Col, Row, Button, Space, Input, Select, Rate, Upload, Form } from 'antd';
import { CloseOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';
import RoomTypeTable from './RoomTypes/RoomTypeTable';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';
import AddNewRoomType from './RoomTypes/Addnew';
import RoomTypeDisplay from './RoomTypes/Display';
import RoomTypeEdit from './RoomTypes/Edit';
import accommodationAPI from '../../api/accommodation/accommodationAPI';
import cityAPI from '../../api/city/cityAPI';
import systemParameterAPI from '../../api/systemParameters/systemParameterAPI';
import Constants from '../../Constants/Constants';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';    

const { TextArea } = Input;

export default function Edit() {
    const [form] = Form.useForm();
    const [accommodation, setAccommodation] = useState({});
    const [listCity, setListCity] = useState([]);
    const [listAmenity, setListAmenity] = useState([]);
    const [coverImgFile, setCoverImgFile] = useState(null);
    const [regulation, setRegulation] = useState('');
    const { id } = useParams();
    const [isOpenModalAddnew, setIsOpenModalAddnew] = useState(false);

    const [isRoomTypeDisplayModalOpen, setIsRoomTypeDisplayModalOpen] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState(null);

    const [isRoomTypeEditModalOpen, setIsRoomTypeEditModalOpen] = useState(false);
    const [selectedRoomTypeForEdit, setSelectedRoomTypeForEdit] = useState(null);

    useEffect(() => {
        setupEditForm();
        getListAccommodationAmenity();
        getListCity();
    }, []);

    const getListAccommodationAmenity = async () => {
        try {
            const res = await systemParameterAPI.getByFeatureCode(Constants.FeatureCode.AccommodationAmenity);
            setListAmenity(res.data);
        } catch (error) {
            console.error('Error fetching accommodation amenities:', error);
        }
    };

    const getListCity = async () => {
        try {
            const res = await cityAPI.getListCity();
            setListCity(res.data);
        } catch (error) {
            console.error('Error fetching list of cities:', error);
        }
    };

    const setupEditForm = async () => {
        LoadingModal.showLoading();
        try {
            const res = await accommodationAPI.getById(id);
            const accommodationRes = res.accommodation;
            accommodationRes.amenity = accommodationRes.amenities?.split(', ').map(Number) ?? [];
            setAccommodation(accommodationRes ?? {});
            setCoverImgFile(null);
            // populate form fields
            form.setFieldsValue({
                Name: accommodationRes.name,
                Type: accommodationRes.type,
                CityId: accommodationRes.cityId ?? accommodationRes.city?.id,
                Address: accommodationRes.address,
                IsActive: accommodationRes.isActive,
                Amenity: accommodationRes.amenity,
                StarRating: accommodationRes.starRating,
                CoverImageUrl: accommodationRes.coverImgUrl
            });
            setRegulation(accommodationRes.regulation || '');
            
            // existing info images
            setAccommodation((prev) => ({ ...prev, listInfoImage: accommodationRes.listInfoImage || [] }));
        } catch (error) {
            console.error('Error fetching accommodation details for edit:', error);
        }
        LoadingModal.hideLoading();
    };

    const onEditAccommodation = async (values) => {
        LoadingModal.showLoading();
        try {
            const accommodationValues = { ...values };
            const amenities = (values.Amenity || values.amenity || accommodation.amenity || []).join(', ');
            const formData = new FormData();
            formData.append('Code', accommodation.code ?? '');
            formData.append('CityId', accommodationValues.CityId ?? accommodation.cityId ?? accommodation.city?.id ?? '');
            formData.append('Type', accommodationValues.Type ?? accommodation.type ?? '');
            formData.append('Name', accommodationValues.Name ?? accommodation.name ?? '');
            formData.append('Address', accommodationValues.Address ?? accommodation.address ?? '');
            formData.append('StarRating', accommodationValues.StarRating ?? accommodation.starRating ?? 0);
            formData.append('Description', accommodationValues.Description ?? accommodation.description ?? '');
            formData.append('Regulation', regulation ?? '');
            formData.append('Amenities', amenities ?? '');
            formData.append('IsActive', accommodationValues.IsActive);
            formData.append('CoverImgUrl', accommodation.coverImgUrl ?? '');
            if (coverImgFile) formData.append('CoverImgFile', coverImgFile);
            // existing images ids
            (accommodation.listInfoImage || []).forEach((file) => {
                if (file && file.id) formData.append('ListInfoImageId', file.id);
            });
            // new uploaded images stored in accommodation.ListNewInfoImage
            (accommodation.ListNewInfoImage || []).forEach((file) => {
                formData.append('ListNewInfoImage', file);
            });
            const res = await accommodationAPI.update(id, formData);
            if (res.success) {
                window.location.href = `/admin/service/accommodation/display/${id}`;
            } else {
                const errorData = res.data || [];
                const listErrorMessage = errorData?.map((e) => e.errorMessage);
                alert(`Lỗi khi chỉnh sửa cơ sở lưu trú:\n${listErrorMessage.join('\n')}`);
            }
        } catch (error) {
            console.error('Error editing accommodation:', error);
        }
        LoadingModal.hideLoading();
    };

    const handleOk = (success) => {
        setIsOpenModalAddnew(false);
        if (success) {
            setupEditForm(); // Refresh the form data after successful room type addition
        }
    };

    const handleEditOk = (success) => {
        setIsRoomTypeEditModalOpen(false);
        setSelectedRoomTypeForEdit(null);
        if (success) {
            setupEditForm(); // Refresh the form data after successful room type edit
        }
    };

    const handleCancel = () => {
        setIsOpenModalAddnew(false);
    };

    const handleEditCancel = () => {
        setIsRoomTypeEditModalOpen(false);
        setSelectedRoomTypeForEdit(null);
    };

    const handleRoomTypeDisplayClick = (roomType) => {
        setSelectedRoomType(roomType);
        setIsRoomTypeDisplayModalOpen(true);
    };

    const handleRoomTypeDisplayModalClose = () => {
        setIsRoomTypeDisplayModalOpen(false);
        setSelectedRoomType(null);
    };

    const handleRoomTypeEditClick = (roomType) => {
        setSelectedRoomTypeForEdit(roomType);
        setIsRoomTypeEditModalOpen(true);
    };

    const handleRoomTypeDeleteClick = () => {
        setupEditForm(); // Refresh the form data after successful room type deletion
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chỉnh sửa cơ sở lưu trú"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => form.submit()}>
                                Lưu
                            </Button>
                            <Button
                                type="primary"
                                href={`/admin/service/accommodation/display/${id}`}
                                shape="round"
                                icon={<CloseOutlined />}
                            >
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Form form={form} layout="vertical" onFinish={onEditAccommodation} initialValues={{ isActive: accommodation.isActive }}>
                        <Row gutter={[24]}>
                            <Col span={24} style={{ textAlign: 'center' }}>
                                <div className="mb-3 d-flex justify-content-center">
                                    <ImagesUC
                                        imageUrl={accommodation.coverImgUrl}
                                        onChange={(imgUrl, file) => {
                                            setCoverImgFile(file);
                                            setAccommodation({ ...accommodation, coverImgFile: file, coverImgUrl: imgUrl });
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
                                <Form.Item name="Type" label="Loại" rules={[{ required: true, message: 'Vui lòng chọn loại' }]}>
                                    <Select allowClear className="w-100" options={Constants.AccommodationTypeOptions} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="CityId" label="Thành phố" rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}>
                                    <Select
                                        allowClear
                                        className="w-100"
                                        options={listCity?.map((item) => ({ label: item.name, value: item.id }))}
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item name="Address" label="Địa chỉ chi tiết">
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    name="IsActive"
                                    label="Trạng thái"
                                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
                                >
                                    <Select allowClear className="w-100" options={Constants.StatusOptions} />
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

                            <Col span={8} className="d-flex align-items-center gap-2">
                                <Form.Item name="StarRating" label="Hạng sao" className="w-100">
                                    <Rate />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <span>Hình ảnh khác</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                    <Gallery
                                        listImage={accommodation.listInfoImage}
                                        onChange={(listOldImage, listNewImage) =>
                                            setAccommodation({
                                                ...accommodation,
                                                listInfoImage: listOldImage,
                                                ListNewInfoImage: listNewImage
                                            })
                                        }
                                    />
                                </div>
                            </Col>

                            <Col span={24}>
                                <span>Quy định</span>
                                <div style={{ marginTop: 8 }}>
                                    <TiptapEditor 
                                        content={regulation} 
                                        onChange={setRegulation}
                                        minHeight={100} />
                                </div>
                            </Col>

                            <Col span={24}>
                                <Form.Item name="Description" label="Mô tả">
                                    <TextArea allowClear className="w-100" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="mt-5">
                        <Col span={12}>
                            <span>Danh sách các loại phòng</span>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Button type="primary" onClick={() => setIsOpenModalAddnew(true)}>
                                Thêm loại phòng
                            </Button>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col span={24}>
                            <RoomTypeTable
                                listRoomType={accommodation.listRoomType}
                                onRoomTypeClick={handleRoomTypeDisplayClick}
                                onRoomTypeEditClick={handleRoomTypeEditClick}
                                onRoomTypeDeleteClick={handleRoomTypeDeleteClick}
                            />
                        </Col>
                    </Row>
                    {isOpenModalAddnew && (
                        <AddNewRoomType
                            accommodationId={accommodation.id}
                            isOpen={isOpenModalAddnew}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        />
                    )}
                    {isRoomTypeDisplayModalOpen && selectedRoomType && (
                        <RoomTypeDisplay
                            isOpen={isRoomTypeDisplayModalOpen}
                            onCancel={handleRoomTypeDisplayModalClose}
                            roomType={selectedRoomType}
                        />
                    )}
                    {isRoomTypeEditModalOpen && selectedRoomTypeForEdit && (
                        <RoomTypeEdit
                            accommodationId={accommodation.id}
                            isOpen={isRoomTypeEditModalOpen}
                            onOk={handleEditOk}
                            onCancel={handleEditCancel}
                            roomType={selectedRoomTypeForEdit}
                        />
                    )}
                </MainCard>
            </Col>
        </Row>
    );
}

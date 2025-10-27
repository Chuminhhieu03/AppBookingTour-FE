import { Col, Row, Button, Space, Input, Select, Rate, Upload } from 'antd';
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

const { TextArea } = Input;

export default function Edit() {
    const [accommodation, setAccommodation] = useState({});
    const [listStatus, setListStatus] = useState([]);
    const [listType, setListType] = useState([]);
    const [listCity, setListCity] = useState([]);
    const [listAmenity, setListAmenity] = useState([]);
    const { id } = useParams();
    const [isOpenModalAddnew, setIsOpenModalAddnew] = useState(false);

    const [isRoomTypeDisplayModalOpen, setIsRoomTypeDisplayModalOpen] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState(null);

    const [isRoomTypeEditModalOpen, setIsRoomTypeEditModalOpen] = useState(false);
    const [selectedRoomTypeForEdit, setSelectedRoomTypeForEdit] = useState(null);

    useEffect(() => {
        setupEditForm();
    }, []);

    const setupEditForm = async () => {
        LoadingModal.showLoading();
        try {
            const response = await fetch(`https://localhost:44331/api/Accommodation/setup-edit/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const res = await response.json();
            setListStatus(res.listStatus ?? []);
            setListType(res.listType ?? []);
            setListCity(res.listCity ?? []);
            setListAmenity(res.listAmenity ?? []);
            const accommodationRes = res.accommodation;
            accommodationRes.isActive = Number(accommodationRes.isActive);
            accommodationRes.amenity = accommodationRes.amenities?.split(', ').map(Number) ?? [];
            console.log('accommodationRes', accommodationRes);
            setAccommodation(accommodationRes ?? {});
        } catch (error) {
            console.error('Error fetching accommodation details for edit:', error);
        }
        LoadingModal.hideLoading();
    };

    const onEditAccommodation = async (accommodation) => {
        LoadingModal.showLoading();
        try {
            const formData = new FormData();
            const accommodationRequest = { ...accommodation };
            accommodationRequest.isActive = Boolean(accommodation.isActive);
            accommodationRequest.amenity = accommodation.amenity?.join(', ');
            formData.append('Code', accommodationRequest.code);
            formData.append('CityId', accommodationRequest.cityId);
            formData.append('Type', accommodationRequest.type);
            formData.append('Name', accommodationRequest.name);
            formData.append('Address', accommodationRequest.address);
            formData.append('StarRating', accommodationRequest.starRating);
            formData.append('Description', accommodationRequest.description ?? '');
            formData.append('Regulation', accommodationRequest.regulation ?? '');
            formData.append('Amenities', accommodationRequest.amenity ?? '');
            formData.append('IsActive', accommodationRequest.isActive);
            formData.append('CoverImgUrl', accommodationRequest.coverImgUrl ?? '');
            formData.append('CoverImgFile', accommodationRequest.coverImgFile);
            accommodationRequest.listInfoImage?.forEach((file) => {
                formData.append('ListInfoImageId', file.id);
            });
            accommodationRequest.ListNewInfoImage?.forEach((file) => {
                formData.append('ListNewInfoImage', file);
            });
            const response = await fetch(`https://localhost:44331/api/Accommodation/${id}`, {
                method: 'PUT',
                body: formData
            });
            const res = await response.json();
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

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chỉnh sửa cơ sở lưu trú"
                    secondary={
                        <Space>
                            <Button
                                type="primary"
                                shape="round"
                                icon={<CheckOutlined />}
                                onClick={() => onEditAccommodation(accommodation)}
                            >
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
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <ImagesUC
                                    imageUrl={accommodation.coverImgUrl}
                                    onChange={(imgUrl, file) =>
                                        setAccommodation({ ...accommodation, coverImgFile: file, coverImgUrl: imgUrl })
                                    }
                                />
                            </div>
                            <span>Hình đại diện</span>
                        </Col>
                        <Col span={8}>
                            <span>Tên</span>
                            <Input
                                value={accommodation.name}
                                onChange={(e) => setAccommodation({ ...accommodation, name: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Loại</span>
                            <Select
                                value={accommodation.type}
                                allowClear
                                className="w-100"
                                options={listType?.map((item) => ({
                                    label: item.value,
                                    value: item.key
                                }))}
                                onChange={(val) => setAccommodation({ ...accommodation, type: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Thành phố</span>
                            <Select
                                value={accommodation.cityId}
                                allowClear
                                className="w-100"
                                options={listCity?.map((item) => ({
                                    label: item.name,
                                    value: item.id
                                }))}
                                onChange={(val) => setAccommodation({ ...accommodation, cityId: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Địa chỉ chi tiết</span>
                            <Input
                                value={accommodation.address}
                                onChange={(e) => setAccommodation({ ...accommodation, address: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select
                                value={accommodation.isActive}
                                allowClear
                                className="w-100"
                                options={listStatus?.map((item) => ({
                                    label: item.value,
                                    value: item.key
                                }))}
                                onChange={(val) => setAccommodation({ ...accommodation, isActive: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Tiện ích</span>
                            <Select
                                mode="multiple"
                                value={accommodation.amenity}
                                allowClear
                                className="w-100"
                                options={listAmenity?.map((item) => ({
                                    label: item.name,
                                    value: item.id
                                }))}
                                onChange={(val) => {
                                    setAccommodation({ ...accommodation, amenity: val });
                                }}
                            />
                        </Col>
                        <Col span={8} className="d-flex align-items-center gap-2">
                            <span>Hạng sao</span>
                            <Rate
                                value={accommodation.starRating}
                                onChange={(val) => setAccommodation({ ...accommodation, starRating: val })}
                            />
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
                            <TextArea
                                value={accommodation.regulation}
                                onChange={(e) => setAccommodation({ ...accommodation, regulation: e.target.value })}
                            />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={accommodation.description}
                                allowClear
                                className="w-100"
                                onChange={(e) => setAccommodation({ ...accommodation, description: e.target.value })}
                            />
                        </Col>
                    </Row>
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

import { Col, Row, Button, Space, Input, Select, Rate, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';
import RoomTypeTable from './RoomTypes/RoomTypeTable';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';

const { TextArea } = Input;

export default function Edit() {
    const [accommodation, setAccommodation] = useState({});
    const [listStatus, setListStatus] = useState([]);
    const [listType, setListType] = useState([]);
    const [listCity, setListCity] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        setupEditForm();
    }, []);

    const setupEditForm = async () => {
        LoadingModal.showLoading();
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
        const accommodationRes = res.accommodation;
        accommodationRes.isActive = Number(accommodationRes.isActive);
        setAccommodation(accommodationRes ?? {});
        LoadingModal.hideLoading();
    };

    const onEditAccommodation = async (accommodation) => {
        LoadingModal.showLoading();
        try {
            const formData = new FormData();
            const accommodationRequest = { ...accommodation };
            accommodationRequest.isActive = Boolean(accommodation.isActive);
            formData.append('Code', accommodationRequest.code);
            formData.append('CityId', accommodationRequest.cityId);
            formData.append('Type', accommodationRequest.type);
            formData.append('Name', accommodationRequest.name);
            formData.append('Address', accommodationRequest.address);
            formData.append('StarRating', accommodationRequest.starRating);
            formData.append('Description', accommodationRequest.description ?? '');
            formData.append('Regulation', accommodationRequest.regulation ?? '');
            formData.append('Amenities', accommodationRequest.amenities ?? '');
            formData.append('IsActive', accommodationRequest.isActive);
            formData.append('CoverImgUrl', accommodationRequest.coverImgUrl);
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
                                    onChange={(imgUrl, file) => setAccommodation({ ...accommodation, coverImgFile: file, coverImgUrl: imgUrl })}
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
                        <Col span={12}>
                            <span>Tiện ích</span>
                            <TextArea
                                value={accommodation.amenities}
                                onChange={(e) => setAccommodation({ ...accommodation, amenities: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
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
                            <Button type="primary">Thêm loại phòng</Button>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col span={24}>
                            <RoomTypeTable listRoomType={accommodation.listRoomType} />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

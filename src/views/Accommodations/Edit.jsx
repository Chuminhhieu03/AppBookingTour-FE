import { Col, Row, Button, Space, Input, Select, Rate, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;

export default function Edit() {
    const [accommodation, setAccommodation] = useState({});
    const [listStatus, setListStatus] = useState([]);
    const [listServiceType, setListServiceType] = useState([]);
    const [listType, setListType] = useState([]);
    const [listCity, setListCity] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
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
        setListServiceType(res.listServiceType ?? []);
        setListType(res.listType ?? []);
        setListCity(res.listCity ?? []);
        setAccommodation(res.accommodation ?? {});
        setImageUrl(res.accommodation?.ImageUrl || null);
        LoadingModal.hideLoading();
    };

    const onEditAccommodation = async (accommodation) => {
        LoadingModal.showLoading();
        // Add logic for uploading an image if needed here as well
        // ...
        const request = { ...accommodation };
        const response = await fetch(`https://localhost:44331/api/Accommodation/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        const res = await response.json();
        if (res.success) {
            window.location.href = `/admin/sale/accommodation/display/${id}`;
        } else {
            const errorData = res.data || [];
            const listErrorMessage = errorData?.map((e) => e.errorMessage);
            alert(`Lỗi khi chỉnh sửa cơ sở lưu trú:\n${listErrorMessage.join('\n')}`);
        }
        LoadingModal.hideLoading();
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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
                            <Button type="primary" href={`/admin/sale/accommodation/display/${id}`} shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                                <ImagesUC fileList={fileList} />
                            </div>
                            <span>Hình ảnh đại diện của cơ sở lưu trú</span>
                        </Col>
                        <Col span={8}>
                            <span>Tên</span>
                            <Input
                                value={accommodation.Name}
                                onChange={(e) => setAccommodation({ ...accommodation, Name: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Loại</span>
                            <Select
                                value={accommodation.Type}
                                allowClear
                                className="w-100"
                                options={listType?.map((item) => ({
                                    label: item.name,
                                    value: item.id
                                }))}
                                onChange={(val) => setAccommodation({ ...accommodation, Type: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Thành phố</span>
                            <Select
                                value={accommodation.CityId}
                                allowClear
                                className="w-100"
                                options={listCity?.map((item) => ({
                                    label: item.name,
                                    value: item.id
                                }))}
                                onChange={(val) => setAccommodation({ ...accommodation, CityId: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Địa chỉ chi tiết</span>
                            <Input
                                value={accommodation.Address}
                                onChange={(e) => setAccommodation({ ...accommodation, Address: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Hạng sao</span>
                            <Rate
                                value={accommodation.StarRating}
                                onChange={(val) => setAccommodation({ ...accommodation, StarRating: val })}
                            />
                        </Col>
                        <Col span={12}>
                            <span>Tiện ích</span>
                            <TextArea
                                value={accommodation.Amenities}
                                onChange={(e) => setAccommodation({ ...accommodation, Amenities: e.target.value })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Quy định</span>
                            <TextArea
                                value={accommodation.Rules}
                                onChange={(e) => setAccommodation({ ...accommodation, Rules: e.target.value })}
                            />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={accommodation.Description}
                                allowClear
                                className="w-100"
                                onChange={(e) => setAccommodation({ ...accommodation, Description: e.target.value })}
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

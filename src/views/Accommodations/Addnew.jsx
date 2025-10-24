import { Col, Row, Button, Space, Input, Select, Rate, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import ImagesUC from '../components/basic/ImagesUC';

const { TextArea } = Input;

export default function Addnew() {
    const [accommodation, setAccommodation] = useState({});
    const [listStatus, setListStatus] = useState([]);
    const [listType, setListType] = useState([]);
    const [listCity, setListCity] = useState([]);
    const [fileList, setFileList] = useState([]);
    const { TextArea } = Input;

    useEffect(() => {
        setupAddnewForm();
    }, []);

    const setupAddnewForm = async () => {
        const response = await fetch('https://localhost:44331/api/Accommodation/setup-addnew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        const res = await response.json();
        setListStatus(res.listStatus);
        setListType(res.listType);
        setListCity(res.listCity);
    };

    const onAddnewAccommodation = async (accommodation) => {
        LoadingModal.showLoading();
        try {
            const accommodationRequest = { ...accommodation };
            accommodationRequest.isActive = Boolean(accommodation.isActive);
            const formData = new FormData();
            formData.append('CityId', accommodationRequest.CityId);
            formData.append('Type', accommodationRequest.Type);
            formData.append('Name', accommodationRequest.Name);
            formData.append('Address', accommodationRequest.Address);
            formData.append('StarRating', accommodationRequest.starRating);
            formData.append('Description', accommodationRequest.Description ?? '');
            formData.append('Regulation', accommodationRequest.Regulation ?? '');
            formData.append('Amenities', accommodationRequest.Amenities ?? '');
            formData.append('IsActive', accommodationRequest.isActive);
            formData.append('CoverImgFile', accommodationRequest.CoverImgFile);
            const response = await fetch('https://localhost:44331/api/Accommodation', {
                method: 'POST',
                body: formData
            });
            const res = await response.json();
            const accommodationRes = res.accommodation;
            window.location.href = `/admin/service/accommodation/display/${accommodationRes.id}`;
        } catch (error) {
            console.error('Error adding new accommodation:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm mới cơ sở lưu trú"
                    secondary={
                        <Space>
                            <Button
                                type="primary"
                                shape="round"
                                icon={<CheckOutlined />}
                                onClick={() => onAddnewAccommodation(accommodation)}
                            >
                                Lưu
                            </Button>
                            <Button type="primary" href="/admin/service/accommodation" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <ImagesUC onChange={(file) => setAccommodation({ ...accommodation, CoverImgFile: file })} />
                            </div>
                            <span>Hình đại diện</span>
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
                                    label: item.value,
                                    value: item.key
                                }))}
                                onChange={(val) => setAccommodation({ ...accommodation, Type: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Thành phố</span>
                            <Select
                                showSearch
                                optionFilterProp="label"
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
                        <Col span={12}>
                            <span>Tiện ích</span>
                            <TextArea
                                value={accommodation.Amenities}
                                onChange={(e) => setAccommodation({ ...accommodation, Amenities: e.target.value })}
                            />
                        </Col>
                        <Col span={12}>
                            <span>Quy định</span>
                            <TextArea
                                value={accommodation.Regulation}
                                onChange={(e) => setAccommodation({ ...accommodation, Regulation: e.target.value })}
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
                </MainCard>
            </Col>
        </Row>
    );
}

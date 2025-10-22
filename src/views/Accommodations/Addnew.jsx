import { Col, Row, Button, Space, Input, Select, Rate, Upload } from 'antd';
import { CloseOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import RoomTypeTable from './RoomTypes/RoomTypeTable';

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
        const request = {};
        request.Accommodation = { ...accommodation };
        request.Accommodation.isActive = Boolean(accommodation.isActive);
        console.log(request);
        const response = await fetch('https://localhost:44331/api/Accommodation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });
        const res = await response.json();
        const accommodationRes = res.accommodation;
        window.location.href = `/admin/service/accommodation/display/${accommodationRes.id}`;
        LoadingModal.hideLoading();
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
                        <Col span={12}>
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
                </MainCard>
            </Col>
        </Row>
    );
}

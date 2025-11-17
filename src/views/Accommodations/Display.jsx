import { Col, Row, Button, Space, Input, Rate } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import { useParams } from 'react-router-dom';
import RoomTypeTable from './RoomTypes/RoomTypeTable';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';
import RoomTypeDisplay from './RoomTypes/Display';
import accommodationAPI from '../../api/accommodation/accommodationAPI';
import Utility from '../../Utils/Utility';
import Constants from '../../Constants/Constants';
import AssignDiscountButton from '../components/basic/AssignDiscountButton';

const { TextArea } = Input;

export default function Display() {
    const [accommodation, setAccommodation] = useState({});
    const { id } = useParams();
    const [isRoomTypeDisplayModalOpen, setIsRoomTypeDisplayModalOpen] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState(null);

    useEffect(() => {
        getAccommodationById();
    }, []);

    const getAccommodationById = async () => {
        try {
            LoadingModal.showLoading();
            const res = await accommodationAPI.getById(id);
            setAccommodation(res.accommodation ?? {});
        } catch (error) {
            console.error('Error fetching accommodation details:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleRoomTypeDisplayClick = (roomType) => {
        setSelectedRoomType(roomType);
        setIsRoomTypeDisplayModalOpen(true);
    };

    const handleRoomTypeDisplayModalClose = () => {
        setIsRoomTypeDisplayModalOpen(false);
        setSelectedRoomType(null);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Chi tiết cơ sở lưu trú"
                    secondary={
                        <Space>
                            <AssignDiscountButton entityId={accommodation.id} entityType={Constants.ItemType.Accommodation} />
                            <Button type="primary" href={`/admin/service/accommodation/edit/${id}`} shape="round" icon={<EditOutlined />}>
                                Chỉnh sửa
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
                                <ImagesUC imageUrl={accommodation.coverImgUrl} viewOnly />
                            </div>
                            <span>Hình đại diện</span>
                        </Col>
                        <Col span={8}>
                            <span>Tên</span>
                            <Input value={accommodation.name} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Loại</span>
                            <Input value={accommodation.typeName} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Thành phố</span>
                            <Input value={accommodation.city?.name} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Địa chỉ chi tiết</span>
                            <Input value={accommodation.address} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Input value={Utility.getLabelByValue(Constants.StatusOptions, accommodation.isActive)} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Tiện ích</span>
                            <Input value={accommodation.amenityName} readOnly />
                        </Col>
                        <Col span={8}>
                            <span>Hạng sao</span>
                            <br />
                            <Rate className="mt-2" value={accommodation.starRating} readOnly />
                        </Col>
                        <Col span={24}>
                            <span>Hình ảnh khác</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                <Gallery listImage={accommodation.listInfoImage} viewOnly />
                            </div>
                        </Col>
                        <Col span={24}>
                            <span>Quy định</span>
                            <TextArea value={accommodation.regulation} readOnly />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea value={accommodation.description} readOnly />
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col span={12}>
                            <span>Danh sách các loại phòng</span>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col span={24}>
                            <RoomTypeTable
                                listRoomType={accommodation.listRoomType}
                                onRoomTypeClick={handleRoomTypeDisplayClick}
                                viewOnly
                            />
                        </Col>
                    </Row>
                    {isRoomTypeDisplayModalOpen && selectedRoomType && (
                        <RoomTypeDisplay
                            isOpen={isRoomTypeDisplayModalOpen}
                            onCancel={handleRoomTypeDisplayModalClose}
                            roomType={selectedRoomType}
                        />
                    )}
                </MainCard>
            </Col>
        </Row>
    );
}

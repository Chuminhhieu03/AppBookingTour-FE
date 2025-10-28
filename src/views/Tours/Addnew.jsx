import { Col, Row, Button, Space, Input, Select, Upload, InputNumber, DatePicker } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import LoadingModal from '../../components/LoadingModal';
import ImagesUC from '../components/basic/ImagesUC';
import Gallery from '../components/basic/Gallery';

const { TextArea } = Input;

export default function TourAddnew() {
    const [tour, setTour] = useState({});
    const [listStatus, setListStatus] = useState([]);
    const [listTourType, setListTourType] = useState([]);
    const [listDeparture, setListDeparture] = useState([]);
    const [listInfoImage, setListInfoImage] = useState([]);

    useEffect(() => {
        setupAddnewForm();
    }, []);

    const setupAddnewForm = async () => {
        const response = await fetch('https://localhost:44331/api/Tour/setup-addnew', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
        const res = await response.json();
        setListStatus(res.listStatus);
        setListTourType(res.listTourType);
        setListDeparture(res.listDeparture);
    };

    const onAddnewTour = async (tour) => {
        LoadingModal.showLoading();
        try {
            const tourRequest = { ...tour };
            tourRequest.isActive = Boolean(tour.isActive);

            const formData = new FormData();
            formData.append('TourTypeId', tourRequest.TourTypeId);
            formData.append('DepartureId', tourRequest.DepartureId);
            formData.append('Name', tourRequest.Name);
            formData.append('Destination', tourRequest.Destination ?? '');
            formData.append('StartDate', tourRequest.StartDate); // Cần xử lý format ngày
            formData.append('Duration', tourRequest.Duration ?? '');
            formData.append('Price', tourRequest.Price ?? 0);
            formData.append('Description', tourRequest.Description ?? '');
            formData.append('Itinerary', tourRequest.Itinerary ?? ''); // Lịch trình
            formData.append('Inclusions', tourRequest.Inclusions ?? ''); // Bao gồm
            formData.append('IsActive', tourRequest.isActive);
            formData.append('CoverImgFile', tourRequest.CoverImgFile);
            listInfoImage?.forEach((file) => {
                formData.append('InfoImgFile', file);
            });

            const response = await fetch('https://localhost:44331/api/Tour', {
                method: 'POST',
                body: formData
            });
            const res = await response.json();
            const tourRes = res.tour;
            window.location.href = `/admin/service/tour/display/${tourRes.id}`;
        } catch (error) {
            console.error('Error adding new tour:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Thêm mới tour"
                    secondary={
                        <Space>
                            <Button type="primary" shape="round" icon={<CheckOutlined />} onClick={() => onAddnewTour(tour)}>
                                Lưu
                            </Button>
                            <Button type="primary" href="/admin/service/tour" shape="round" icon={<CloseOutlined />}>
                                Thoát
                            </Button>
                        </Space>
                    }
                >
                    <Row gutter={[24, 24]}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <div className="mb-3 d-flex justify-content-center">
                                <ImagesUC onChange={(_, file) => setTour({ ...tour, CoverImgFile: file })} />
                            </div>
                            <span>Hình đại diện</span>
                        </Col>
                        <Col span={8}>
                            <span>Tên tour</span>
                            <Input value={tour.Name} onChange={(e) => setTour({ ...tour, Name: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <span>Loại tour</span>
                            <Select
                                value={tour.TourTypeId}
                                allowClear
                                className="w-100"
                                options={listTourType?.map((item) => ({ label: item.value, value: item.key }))}
                                onChange={(val) => setTour({ ...tour, TourTypeId: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Nơi khởi hành</span>
                            <Select
                                showSearch
                                optionFilterProp="label"
                                value={tour.DepartureId}
                                allowClear
                                className="w-100"
                                options={listDeparture?.map((item) => ({ label: item.name, value: item.id }))}
                                onChange={(val) => setTour({ ...tour, DepartureId: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Nơi đến (Destinations)</span>
                            <Input value={tour.Destination} onChange={(e) => setTour({ ...tour, Destination: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <span>Ngày khởi hành</span>
                            <DatePicker
                                className="w-100"
                                value={tour.StartDate} // Cần xử lý state cho DatePicker (moment/dayjs)
                                onChange={(date, dateString) => setTour({ ...tour, StartDate: dateString })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Thời gian (VD: 3N2Đ)</span>
                            <Input value={tour.Duration} onChange={(e) => setTour({ ...tour, Duration: e.target.value })} />
                        </Col>
                        <Col span={8}>
                            <span>Giá (VND)</span>
                            <InputNumber
                                value={tour.Price}
                                className="w-100"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={(val) => setTour({ ...tour, Price: val })}
                            />
                        </Col>
                        <Col span={8}>
                            <span>Trạng thái</span>
                            <Select
                                value={tour.isActive}
                                allowClear
                                className="w-100"
                                options={listStatus?.map((item) => ({ label: item.value, value: item.key }))}
                                onChange={(val) => setTour({ ...tour, isActive: val })}
                            />
                        </Col>

                        <Col span={24}>
                            <span>Hình ảnh khác</span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
                                <Gallery
                                    onChange={(_, files) => {
                                        setListInfoImage(files);
                                    }}
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <span>Dịch vụ bao gồm</span>
                            <TextArea value={tour.Inclusions} onChange={(e) => setTour({ ...tour, Inclusions: e.target.value })} rows={6} />
                        </Col>
                        <Col span={12}>
                            <span>Lịch trình chi tiết</span>
                            <TextArea value={tour.Itinerary} onChange={(e) => setTour({ ...tour, Itinerary: e.target.value })} rows={6} />
                        </Col>
                        <Col span={24}>
                            <span>Mô tả</span>
                            <TextArea
                                value={tour.Description}
                                allowClear
                                className="w-100"
                                onChange={(e) => setTour({ ...tour, Description: e.target.value })}
                                rows={4}
                            />
                        </Col>
                    </Row>
                </MainCard>
            </Col>
        </Row>
    );
}

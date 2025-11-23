import { useState, useEffect } from 'react';
import { Table, Col, Row, Input, Button, message, Tag, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import { tourDepartureAPI } from '../../api/tour/tourDepartureAPI';
import profileAPI from '../../api/profile/profileAPI';

export default function AssignedTourList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [assignedTours, setAssignedTours] = useState([]);
    const [filteredTours, setFilteredTours] = useState([]);
    const [guideId, setGuideId] = useState('');
    const [filterStatus, setFilterStatus] = useState('upcoming');
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        fetchGuides();
    }, []);

    const fetchGuides = async () => {
        try {
            const response = await profileAPI.getGuides();
            if (response.success) {
                setGuides(response.data || []);
            } else {
                console.error('Failed to fetch guides:', response.message);
            }
        } catch (error) {
            console.error('Error fetching guides:', error);
        }
    };

    const filterOptions = [
        { value: 'all', label: 'Xem tất cả các tour' },
        { value: 'upcoming', label: 'Xem các tour sắp tới' }
    ];

    const filterToursByStatus = (tours, status) => {
        if (status === 'all') {
            return tours;
        }

        if (status === 'upcoming') {
            const now = new Date();
            return tours.filter((tour) => {
                if (!tour.departureDate) return false;
                const departureDate = new Date(tour.departureDate);
                return departureDate >= now;
            });
        }

        return tours;
    };

    const fetchAssignedTours = async (searchGuideId = guideId) => {
        if (!searchGuideId) {
            message.warning('Vui lòng chọn hướng dẫn viên');
            return;
        }

        try {
            setLoading(true);
            const response = await tourDepartureAPI.getListForGuide(searchGuideId);
            if (response.success) {
                const tours = response.data || [];
                setAssignedTours(tours);
                const filtered = filterToursByStatus(tours, filterStatus);
                setFilteredTours(filtered);
            } else {
                message.error('Không thể lấy danh sách tour được phân công');
                setAssignedTours([]);
                setFilteredTours([]);
            }
        } catch (error) {
            console.error('Error fetching assigned tours:', error);
            message.error('Đã xảy ra lỗi khi lấy danh sách tour được phân công');
            setAssignedTours([]);
            setFilteredTours([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchAssignedTours();
    };

    const handleFilterChange = (value) => {
        setFilterStatus(value);
        const filtered = filterToursByStatus(assignedTours, value);
        setFilteredTours(filtered);
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '—';
        const date = new Date(dateTime);
        return (
            date.toLocaleDateString('vi-VN') +
            ' ' +
            date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            })
        );
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            align: 'center',
            width: 60,
            render: (_, __, index) => index + 1
        },
        {
            title: 'Mã Tour',
            dataIndex: 'tourCode',
            key: 'tourCode',
            align: 'center',
            width: 120
        },
        {
            title: 'Tên Tour',
            dataIndex: 'tourName',
            key: 'tourName',
            align: 'left'
        },
        {
            title: 'Thời gian khởi hành',
            dataIndex: 'departureDate',
            key: 'departureDate',
            align: 'center',
            width: 150,
            render: (value) => formatDateTime(value)
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'returnDate',
            key: 'returnDate',
            align: 'center',
            width: 150,
            render: (value) => formatDateTime(value)
        },
        {
            title: 'Thành phố khởi hành',
            dataIndex: 'departureCityName',
            key: 'departureCityName',
            align: 'center',
            width: 150
        },
        {
            title: 'Thành phố tham quan',
            dataIndex: 'destinationCityName',
            key: 'destinationCityName',
            align: 'center',
            width: 150
        },
        {
            title: 'Số lượng hành khách',
            dataIndex: 'bookedSlots',
            key: 'bookedSlots',
            align: 'center',
            width: 120,
            render: (value) => <Tag color="blue">{value || 0} khách</Tag>
        }
        // TODO: update view tour details to not allow guide to update tour info
        // {
        //     title: 'Hành động',
        //     key: 'action',
        //     width: 100,
        //     align: 'center',
        //     fixed: 'right',
        //     render: (_, record) => (
        //         <Space size="small">
        //             <Button
        //                 type="primary"
        //                 ghost
        //                 size="small"
        //                 icon={<EyeOutlined />}
        //                 title="Xem chi tiết tour"
        //                 onClick={() => navigate(`/admin/service/tour/display/${record.tourId}`)}
        //             />
        //         </Space>
        //     )
        // }
    ];

    return (
        <Row>
            <Col span={24}>
                <MainCard title="Danh sách tour được phân công">
                    {/* Search Section */}
                    <Row gutter={[16, 16]} className="mb-4">
                        <Col span={4}>
                            <Select
                                value={filterStatus}
                                onChange={handleFilterChange}
                                options={filterOptions}
                                style={{ width: '100%' }}
                                placeholder="Chọn loại tour"
                            />
                        </Col>
                        <Col span={6}>
                            <Select
                                value={guideId}
                                onChange={setGuideId}
                                placeholder="Chọn hướng dẫn viên"
                                style={{ width: '100%' }}
                                allowClear
                                showSearch
                                filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                            >
                                {guides.map((guide) => (
                                    <Select.Option key={guide.id} value={guide.id}>
                                        {guide.fullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} loading={loading}>
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>

                    {/* Table */}
                    <Table
                        columns={columns}
                        dataSource={filteredTours}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                        locale={{
                            emptyText: guideId ? 'Không có tour nào được phân công' : 'Vui lòng chọn hướng dẫn viên và tìm kiếm'
                        }}
                        size="middle"
                    />
                </MainCard>
            </Col>
        </Row>
    );
}

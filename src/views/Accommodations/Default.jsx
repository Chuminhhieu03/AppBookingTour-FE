import React, { useEffect } from 'react';
import { Table, Tag, Col, Row, Input, Flex, Button, Space, Select, Modal, message } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainCard from 'components/MainCard';
import Constants from '../../Constants/Constants';
import LoadingModal from '../../components/LoadingModal';
import accommodationAPI from '../../api/accommodation/accommodationAPI';
import cityAPI from '../../api/city/cityAPI';
import Utility from '../../Utils/Utility';

export default function Default() {
    const [query, setQuery] = React.useState({});
    const [filter, setFilter] = React.useState({});
    const [listAccommodation, setListAccommodation] = React.useState([]);
    const [listCity, setListCity] = React.useState([]);
    const [isReset, setIsReset] = React.useState(false);
    const [totalCount, setTotalCount] = React.useState(0);

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (query.PageIndex ?? 0) * Constants.DEFAULT_PAGE_SIZE + index + 1
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            render: (text, record) => <Link to={`/admin/service/accommodation/display/${record.id}`}>{text}</Link>
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => Utility.getLabelByValue(Constants.AccommodationTypeOptions, record.type)
        },
        {
            title: 'Thành phố',
            dataIndex: ['city', 'name'],
            key: 'cityName'
        },
        {
            title: 'Hạng sao',
            dataIndex: 'starRating',
            key: 'starRating'
        },
        {
            title: 'Điểm đánh giá',
            dataIndex: 'rating',
            key: 'rating'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            align: 'center',
            render: (_, record) => {
                return record.isActive === Constants.Status.Active ? (
                    <Tag color="green">{Utility.getLabelByValue(Constants.StatusOptions, record.isActive)}</Tag>
                ) : (
                    <Tag color="red">{Utility.getLabelByValue(Constants.StatusOptions, record.isActive)}</Tag>
                );
            }
        },
        {
            title: 'Hành động',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Button type="link" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    useEffect(() => {
        getListCity();
        searchData();
    }, []);

    useEffect(() => {
        if (filter && query && isReset) {
            searchData();
        }
    }, [filter, query, isReset]);

    const getListCity = async () => {
        try {
            const res = await cityAPI.getListCity();
            setListCity(res.data);
        } catch (error) {
            console.error('Error fetching list of cities:', error);
        }
    };

    const searchData = async (pageIndex = 0) => {
        try {
            LoadingModal.showLoading();
            const request = { ...query };
            request.PageIndex = pageIndex;
            request.searchAccommodationFilter = { ...filter };
            const res = await accommodationAPI.search(request);
            setListAccommodation(res.listAccommodation);
            setTotalCount(res.totalCount);
            setIsReset(false);
        } catch (error) {
            console.error('Error fetching accommodations:', error);
        } finally {
            LoadingModal.hideLoading();
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa cơ sở lưu trú này?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await accommodationAPI.delete(id);
                    if (response.success) {
                        message.success('Xóa cơ sở lưu trú thành công');

                        const currentPage = query.PageIndex ?? 0;

                        if (listAccommodation.length === 1 && currentPage > 0) {
                            searchData(currentPage - 1);
                            query.PageIndex = currentPage - 1;
                        } else {
                            searchData(currentPage);
                        }

                        setQuery({ ...query });
                    } else {
                        message.error(response.message || 'Không thể xóa cơ sở lưu trú');
                    }
                } catch (error) {
                    console.error('Error deleting accommodation:', error);
                    message.error('Đã xảy ra lỗi khi xóa cơ sở lưu trú');
                }
            }
        });
    };

    const onReset = () => {
        const newFilter = {};
        const newQuery = {};
        setFilter(newFilter);
        setQuery(newQuery);
        setIsReset(true);
    };

    return (
        <Row>
            <Col span={24}>
                <MainCard
                    title="Danh sách cơ sở lưu trú"
                    secondary={
                        <Button type="primary" href="/admin/service/accommodation/addnew" shape="round" icon={<PlusOutlined />}>
                            Tạo cơ sở lưu trú mới
                        </Button>
                    }
                >
                    <Row gutter={[24, 24]} className="mb-5">
                        <Col span={4}>
                            <Flex gap="small" align="center">
                                <span>Mã</span>
                                <Input
                                    value={filter.Code}
                                    onChange={(e) => {
                                        filter.Code = e.target.value;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={4}>
                            <Flex gap="small" align="center">
                                <span>Tên cơ sở lưu trú</span>
                                <Input
                                    style={{ flex: 1 }}
                                    value={filter.Name}
                                    onChange={(e) => {
                                        filter.Name = e.target.value;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={4}>
                            <Flex gap="small" align="center">
                                <span>Loại</span>
                                <Select
                                    value={filter.Type}
                                    allowClear
                                    style={{ flex: 1 }}
                                    options={Constants.AccommodationTypeOptions}
                                    onChange={(val) => {
                                        filter.Type = val;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={4}>
                            <Flex gap="small" align="center">
                                <span>Thành phố</span>
                                <Select
                                    value={filter.City}
                                    allowClear
                                    style={{ flex: 1 }}
                                    options={listCity?.map((item) => ({
                                        label: item.name,
                                        value: item.id
                                    }))}
                                    onChange={(val) => {
                                        filter.City = val;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={4}>
                            <Flex gap="small" align="center">
                                <span>Trạng thái</span>
                                <Select
                                    value={filter.IsActive}
                                    allowClear
                                    style={{ flex: 1 }}
                                    options={Constants.StatusOptions}
                                    onChange={(val) => {
                                        filter.IsActive = val;
                                        setFilter({ ...filter });
                                    }}
                                />
                            </Flex>
                        </Col>
                        <Col span={4}>
                            <Row justify="end">
                                <Space>
                                    <Button type="primary" icon={<SearchOutlined />} shape="round" onClick={() => searchData()}>
                                        Tìm kiếm
                                    </Button>
                                    <Button type="primary" icon={<ReloadOutlined />} shape="round" onClick={() => onReset()}>
                                        Reset
                                    </Button>
                                </Space>
                            </Row>
                        </Col>
                    </Row>
                    <h6 className="mb-3">Tổng số bản ghi: {totalCount}</h6>
                    <Table
                        dataSource={listAccommodation}
                        columns={columns}
                        rowKey={(record) => record.id}
                        bordered
                        pagination={{
                            current: (query.PageIndex ?? 0) + 1,
                            pageSize: Constants.DEFAULT_PAGE_SIZE,
                            total: totalCount,
                            onChange: (page) => {
                                searchData(page - 1);
                                query.PageIndex = page - 1;
                                setQuery({ ...query });
                            }
                        }}
                    />
                </MainCard>
            </Col>
        </Row>
    );
}

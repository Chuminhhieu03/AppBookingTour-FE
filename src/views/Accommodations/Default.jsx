import React, { useEffect } from 'react';
import { Table, Tag, Col, Row, Input, Flex, Button, Space, Select } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined, CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainCard from 'components/MainCard';
import Constants from '../../Constants/Constants';
import LoadingModal from '../../components/LoadingModal';

export default function Default() {
    const [query, setQuery] = React.useState({});
    const [filter, setFilter] = React.useState({});
    const [listAccommodation, setListAccommodation] = React.useState([]);
    const [listStatus, setListStatus] = React.useState([]);
    const [listType, setListType] = React.useState([]);
    const [listCity, setListCity] = React.useState([]);
    const [isReset, setIsReset] = React.useState(false);

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (_, __, index) => (filter.PageIndex ?? 0) * Constants.DEFAULT_PAGE_SIZE + index + 1
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
            dataIndex: 'typeName',
            key: 'typeName'
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
            dataIndex: 'statusName',
            key: 'statusName',
            align: 'center',
            render: (value, record) => {
                return Number(record.isActive) === Constants.Status.Active ? (
                    <Tag color="green">{value}</Tag>
                ) : (
                    <Tag color="red">{value}</Tag>
                );
            }
        },
        {
            title: 'Chức năng',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (_, record) => <Button type="link" icon={<DeleteOutlined />} />
        }
    ];

    useEffect(() => {
        searchData();
        setupDefault();
    }, []);

    useEffect(() => {
        if (filter && query && isReset) {
            searchData();
        }
    }, [filter, query, isReset]);

    const setupDefault = async () => {
        const response = await fetch('https://localhost:44331/api/Accommodation/setup-default', {
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

    const searchData = async (pageIndex = 0) => {
        try {
            LoadingModal.showLoading();
            const request = { ...query };
            request.PageIndex = pageIndex;
            request.searchAccommodationFilter = { ...filter };
            if (request.searchAccommodationFilter.IsActive) {
                request.searchAccommodationFilter.IsActive = Boolean(request.searchAccommodationFilter.IsActive);
            }
            const response = await fetch('https://localhost:44331/api/Accommodation/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });
            const res = await response.json();
            setListAccommodation(res.listAccommodation);
            setIsReset(false);
        } catch (error) {
            console.error('Error fetching accommodations:', error);
        } finally {
            LoadingModal.hideLoading();
        }
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
                                    options={listType?.map((item) => ({
                                        label: item.value,
                                        value: item.key
                                    }))}
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
                                    options={listStatus?.map((item) => ({
                                        label: item.value,
                                        value: item.key
                                    }))}
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
                    <h6 className="mb-3">Tổng số bản ghi: {listAccommodation?.length}</h6>
                    <Table
                        dataSource={listAccommodation}
                        columns={columns}
                        rowKey={(record) => record.id}
                        bordered
                        pagination={{
                            pageSize: Constants.DEFAULT_PAGE_SIZE,
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

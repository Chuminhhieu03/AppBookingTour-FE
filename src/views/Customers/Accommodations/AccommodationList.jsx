import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spin, Pagination, message, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { accommodationAPI } from '../../../api/accommodation/accommodationAPI';
import ItemFilter from '../components/ItemFilter';
import ItemCard from '../components/ItemCard';
import BookingSearchBar from '../components/BookingSearchBar';
import { createEmptyFilter, buildUrlParams, parseUrlParams } from '../../../utils/itemDataHelpers';
import Constants from '../../../Constants/Constants';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const AccommodationList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [accommodationData, setAccommodationData] = useState({
        accommodations: [],
        meta: {
            totalCount: 0,
            page: 1,
            pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
            totalPages: 1
        }
    });

    // Internal state for form inputs (controlled components)
    const [internalFilters, setInternalFilters] = useState(createEmptyFilter('accommodation'));

    const [queryParams, setQueryParams] = useState({
        pageIndex: 1,
        pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
        filter: createEmptyFilter('accommodation')
    });

    const [sortOption, setSortOption] = useState(null);

    // Function to sort accommodations based on sort option
    const sortAccommodations = useCallback((accommodations, sortOption) => {
        if (!sortOption || !accommodations || accommodations.length === 0) return accommodations;

        const sortedAccommodations = [...accommodations];

        switch (sortOption) {
            case 'priceAsc':
                return sortedAccommodations.sort((a, b) => (a.minRoomTypePrice || 0) - (b.minRoomTypePrice || 0));
            case 'priceDesc':
                return sortedAccommodations.sort((a, b) => (b.minRoomTypePrice || 0) - (a.minRoomTypePrice || 0));
            case 'rating':
                return sortedAccommodations.sort((a, b) => (b.rating || b.averageRating || 0) - (a.rating || a.averageRating || 0));
            case 'name':
                return sortedAccommodations.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            default:
                return accommodations;
        }
    }, []);

    // API call function
    const handleApiCall = useCallback(
        async (params, sortOption = null) => {
            try {
                setLoading(true);
                const response = await accommodationAPI.searchAccommodationsForCustomer(params);
                if (response.success) {
                    // Keep original accommodation data without normalizing
                    const accommodations = response.data.accommodations || [];

                    const sortedAccommodations = sortAccommodations(accommodations, sortOption);
                    setAccommodationData({
                        accommodations: sortedAccommodations,
                        meta: response.data.meta
                    });
                } else {
                    message.error('Không thể tải danh sách khách sạn');
                    setAccommodationData({
                        accommodations: [],
                        meta: {
                            totalCount: 0,
                            page: 1,
                            pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
                            totalPages: 1
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching accommodations:', error);
                message.error('Đã xảy ra lỗi khi tải danh sách khách sạn');
                setAccommodationData({
                    accommodations: [],
                    meta: {
                        totalCount: 0,
                        page: 1,
                        pageSize: Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
                        totalPages: 1
                    }
                });
            } finally {
                setLoading(false);
            }
        },
        [sortAccommodations]
    );

    // Effect to handle URL search params changes and API calls
    useEffect(() => {
        const urlFilters = parseUrlParams(searchParams);
        const urlPage = searchParams.get('page');
        const urlPageSize = searchParams.get('pageSize');
        const urlSort = searchParams.get('sort');

        // Update sort option from URL
        setSortOption(urlSort || null);

        // Update internal filters from URL
        const mergedFilters = { ...createEmptyFilter('accommodation'), ...urlFilters };
        setInternalFilters(mergedFilters);

        // Update query params and call API
        const newQueryParams = {
            pageIndex: urlPage ? Number(urlPage) : 1,
            pageSize: urlPageSize ? Number(urlPageSize) : Constants.DEFAULT_LIST_ITEM_PAGE_SIZE,
            filter: mergedFilters
        };

        setQueryParams(newQueryParams);
        handleApiCall(newQueryParams, urlSort);
    }, [searchParams, handleApiCall]);

    // Handle filter change - update URL params
    const handleFilterChange = (newFilter) => {
        const mergedFilters = { ...internalFilters, ...newFilter };
        setInternalFilters(mergedFilters);
        const params = buildUrlParams(mergedFilters);
        params.set('page', '1');
        setSearchParams(params);
    };

    // Handle pagination change - update URL params
    const handlePaginationChange = (page) => {
        const params = new URLSearchParams(searchParams);

        if (page > 1) {
            params.set('page', page.toString());
        } else {
            params.delete('page');
        }

        setSearchParams(params);
    };

    // Handle sort change - frontend only, no API call
    const handleSortChange = (value) => {
        setSortOption(value);

        // Sort existing data without API call
        const currentAccommodations = accommodationData.accommodations || [];
        const sortedAccommodations = sortAccommodations(currentAccommodations, value);
        setAccommodationData((prevData) => ({
            ...prevData,
            accommodations: sortedAccommodations
        }));
    };

    // Handle view details
    const handleViewDetails = (accommodation) => {
        console.log('View accommodation details:', accommodation.id);
        navigate(`/accommodations/${accommodation.id}`);
    };

    return (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div
                style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '24px 16px'
                }}
            >
                {/* Booking Search Bar */}
                <BookingSearchBar initialFilters={internalFilters} onFilterChange={handleFilterChange} />

                <Row gutter={[24, 24]}>
                    {/* Filter sidebar - Always displayed first */}
                    <Col xs={24} sm={24} md={8} lg={6} xl={6}>
                        <ItemFilter type="accommodation" initialFilters={internalFilters} onFilterChange={handleFilterChange} />
                    </Col>

                    {/* Accommodation list content */}
                    <Col xs={24} sm={24} md={16} lg={18} xl={18}>
                        <div style={{ marginBottom: '16px', textAlign: 'right' }}>
                            <Select
                                value={sortOption}
                                onChange={handleSortChange}
                                style={{ width: 200, textAlign: 'left' }}
                                placeholder="Sắp xếp"
                                allowClear
                            >
                                <Option value="priceAsc">Giá tăng dần</Option>
                                <Option value="priceDesc">Giá giảm dần</Option>
                                <Option value="rating">Điểm đánh giá</Option>
                                <Option value="name">Tên A-Z</Option>
                            </Select>
                        </div>

                        <Spin spinning={loading}>
                            {/* Accommodation cards list */}
                            <div style={{ marginBottom: '24px' }}>
                                {accommodationData.accommodations && accommodationData.accommodations.length > 0
                                    ? accommodationData.accommodations.map((accommodation) => (
                                          <div key={accommodation.id} style={{ marginBottom: '16px' }}>
                                              <ItemCard data={accommodation} type="accommodation" onViewDetails={handleViewDetails} />
                                          </div>
                                      ))
                                    : !loading && (
                                          <div
                                              style={{
                                                  textAlign: 'center',
                                                  padding: '60px 0',
                                                  color: '#999'
                                              }}
                                          >
                                              Không tìm thấy khách sạn nào phù hợp với tiêu chí tìm kiếm
                                          </div>
                                      )}
                            </div>

                            {/* Pagination */}
                            {accommodationData.accommodations && accommodationData.accommodations.length > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Pagination
                                        current={accommodationData.meta.page}
                                        total={accommodationData.meta.totalCount}
                                        pageSize={10}
                                        onChange={handlePaginationChange}
                                        showQuickJumper
                                        showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} khách sạn`}
                                    />
                                </div>
                            )}
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AccommodationList;

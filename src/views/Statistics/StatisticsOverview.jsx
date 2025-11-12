import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, message, Alert } from 'antd';
import { RiseOutlined, FallOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import statisticsAPI from 'api/statistics/statisticsAPI';
import MainCard from 'components/MainCard';

// Color constants
const CHART_COLORS = {
    total: '#91caff',
    tour: '#b7eb8f',
    combo: '#ffd591',
    accommodation: '#d3adf7'
};

const StatisticsOverview = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const fetchOverviewData = async () => {
        try {
            setLoading(true);
            const response = await statisticsAPI.getOverviewStatistics();
            setData(response.data);
        } catch (error) {
            console.error('Error fetching overview statistics:', error);
            message.error('Không thể tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverviewData();
    }, []);

    // Prepare data for revenue chart
    const prepareRevenueChartData = () => {
        if (!data?.monthlyReport) return null;

        const months = data.monthlyReport.map((item) => `Tháng ${item.month}/${item.year}`);

        // Calculate total revenue for each month
        const totalRevenueData = data.monthlyReport.map((item) => item.tourRevenue + item.comboRevenue + item.accommodationRevenue);

        const tourData = data.monthlyReport.map((item) => item.tourRevenue);
        const comboData = data.monthlyReport.map((item) => item.comboRevenue);
        const accommodationData = data.monthlyReport.map((item) => item.accommodationRevenue);

        return {
            series: [
                {
                    name: 'Tổng doanh thu',
                    data: totalRevenueData,
                    color: CHART_COLORS.total
                },
                {
                    name: 'Tour',
                    data: tourData,
                    color: CHART_COLORS.tour
                },
                {
                    name: 'Combo',
                    data: comboData,
                    color: CHART_COLORS.combo
                },
                {
                    name: 'Cơ sở lưu trú',
                    data: accommodationData,
                    color: CHART_COLORS.accommodation
                }
            ],
            options: {
                chart: {
                    type: 'line',
                    height: 350,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                title: {
                    text: 'Biểu đồ doanh thu theo tháng',
                    align: 'left',
                    margin: 20,
                    offsetY: 0,
                    style: {
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#262626'
                    }
                },
                grid: {
                    borderColor: '#f1f1f1',
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                    xaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                xaxis: {
                    categories: months,
                    labels: {
                        rotate: -45
                    }
                },
                yaxis: {
                    title: {
                        text: 'Doanh thu (VNĐ)'
                    },
                    labels: {
                        formatter: function (val) {
                            return new Intl.NumberFormat('vi-VN').format(val);
                        }
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: false,
                    offsetY: 0,
                    offsetX: 0,
                    markers: {
                        width: 12,
                        height: 12,
                        radius: 6
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
                        }
                    }
                }
            }
        };
    };

    // Prepare data for booking chart
    const prepareBookingChartData = () => {
        if (!data?.monthlyReport) return null;

        const months = data.monthlyReport.map((item) => `Tháng ${item.month}/${item.year}`);

        // Calculate total bookings for each month
        const totalBookingData = data.monthlyReport.map(
            (item) => item.tourCompletedBookings + item.comboCompletedBookings + item.accommodationCompletedBookings
        );

        const tourBookingData = data.monthlyReport.map((item) => item.tourCompletedBookings);
        const comboBookingData = data.monthlyReport.map((item) => item.comboCompletedBookings);
        const accommodationBookingData = data.monthlyReport.map((item) => item.accommodationCompletedBookings);

        return {
            series: [
                {
                    name: 'Tổng booking',
                    data: totalBookingData,
                    color: CHART_COLORS.total
                },
                {
                    name: 'Tour',
                    data: tourBookingData,
                    color: CHART_COLORS.tour
                },
                {
                    name: 'Combo',
                    data: comboBookingData,
                    color: CHART_COLORS.combo
                },
                {
                    name: 'Cơ sở lưu trú',
                    data: accommodationBookingData,
                    color: CHART_COLORS.accommodation
                }
            ],
            options: {
                chart: {
                    type: 'line',
                    height: 350,
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                title: {
                    text: 'Biểu đồ lượt booking hoàn thành theo tháng',
                    align: 'left',
                    margin: 20,
                    offsetY: 0,
                    style: {
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#262626'
                    }
                },
                grid: {
                    borderColor: '#f1f1f1',
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                    xaxis: {
                        lines: {
                            show: true
                        }
                    }
                },
                xaxis: {
                    categories: months,
                    labels: {
                        rotate: -45
                    }
                },
                yaxis: {
                    title: {
                        text: 'Số lượt booking'
                    },
                    labels: {
                        formatter: function (val) {
                            return Math.floor(val);
                        }
                    }
                },
                legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    floating: false,
                    offsetY: 0,
                    offsetX: 0,
                    markers: {
                        width: 12,
                        height: 12,
                        radius: 6
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            return val + ' booking';
                        }
                    }
                }
            }
        };
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('vi-VN').format(number);
    };

    const revenueChartData = prepareRevenueChartData();
    const bookingChartData = prepareBookingChartData();

    if (loading) {
        return (
            <MainCard>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Spin size="large" />
                </div>
            </MainCard>
        );
    }

    return (
        <MainCard title="Thống kê tổng quan">
            {data && (
                <>
                    {/* Header with current month/year info */}
                    <div
                        style={{
                            background: '#fff',
                            border: '1px solid #e8e8e8',
                            borderRadius: '8px',
                            padding: '24px 32px',
                            marginBottom: '24px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: '22px',
                                            fontWeight: '600',
                                            color: '#262626',
                                            marginBottom: '4px'
                                        }}
                                    >
                                        Báo cáo thống kê tháng {data.month}/{data.year}
                                    </h2>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: '14px',
                                            color: '#8c8c8c',
                                            fontWeight: '400'
                                        }}
                                    >
                                        Tổng quan hoạt động kinh doanh và xu hướng phát triển
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 1: Revenue Statistics */}
                    <Row gutter={[16, 16]} style={{ marginTop: 12, marginBottom: 16 }}>
                        <Col xs={24} sm={12} lg={12}>
                            <Card>
                                <Statistic
                                    title="Tổng doanh thu tháng này"
                                    value={data.totalRevenue}
                                    formatter={formatCurrency}
                                    prefix={<DollarOutlined />}
                                    valueStyle={{
                                        color: '#3f8600'
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={12}>
                            <Card>
                                <Statistic
                                    title="Tăng trưởng so với tháng trước"
                                    value={data.growthRate}
                                    precision={2}
                                    suffix="%"
                                    prefix={data.growthRate >= 0 ? <RiseOutlined /> : <FallOutlined />}
                                    valueStyle={{
                                        color: data.growthRate >= 0 ? '#3f8600' : '#cf1322'
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Row 2: Booking Statistics */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={8} lg={8}>
                            <Card>
                                <Statistic
                                    title="Tổng booking"
                                    value={data.totalBookings}
                                    formatter={formatNumber}
                                    prefix={<UserOutlined />}
                                    valueStyle={{
                                        color: '#1890ff'
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8} lg={8}>
                            <Card>
                                <Statistic
                                    title="Booking hoàn thành"
                                    value={data.completedBookings}
                                    formatter={formatNumber}
                                    prefix={<UserOutlined />}
                                    valueStyle={{
                                        color: '#52c41a'
                                    }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={8} lg={8}>
                            <Card>
                                <Statistic
                                    title="Booking bị hủy"
                                    value={data.canceledBookings}
                                    formatter={formatNumber}
                                    prefix={<UserOutlined />}
                                    valueStyle={{
                                        color: '#f5222d'
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Row 3: Revenue Distribution by Type */}
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} lg={8}>
                            <Card title="Phân bố doanh thu theo loại sản phẩm" size="small">
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'donut',
                                            height: 300
                                        },
                                        labels: ['Tour', 'Combo', 'Cơ sở lưu trú'],
                                        colors: [CHART_COLORS.tour, CHART_COLORS.combo, CHART_COLORS.accommodation],
                                        legend: {
                                            position: 'bottom'
                                        },
                                        plotOptions: {
                                            pie: {
                                                donut: {
                                                    size: '70%',
                                                    labels: {
                                                        show: true,
                                                        total: {
                                                            show: true,
                                                            label: '',
                                                            formatter: function (w) {
                                                                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                                                return new Intl.NumberFormat('vi-VN').format(total) + ' VNĐ';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        tooltip: {
                                            y: {
                                                formatter: function (val) {
                                                    return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
                                                }
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function (val) {
                                                return val.toFixed(1) + '%';
                                            },
                                            style: {
                                                colors: ['#cccccc']
                                            }
                                        }
                                    }}
                                    series={[
                                        data.summaryByType.tour.totalRevenue,
                                        data.summaryByType.combo.totalRevenue,
                                        data.summaryByType.accommodation.totalRevenue
                                    ]}
                                    type="donut"
                                    height={300}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card title="Phân bố booking hoàn thành theo loại sản phẩm" size="small">
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'donut',
                                            height: 300
                                        },
                                        labels: ['Tour', 'Combo', 'Cơ sở lưu trú'],
                                        colors: [CHART_COLORS.tour, CHART_COLORS.combo, CHART_COLORS.accommodation],
                                        legend: {
                                            position: 'bottom'
                                        },
                                        plotOptions: {
                                            pie: {
                                                donut: {
                                                    size: '70%',
                                                    labels: {
                                                        show: true,
                                                        total: {
                                                            show: true,
                                                            label: '',
                                                            formatter: function (w) {
                                                                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                                                return new Intl.NumberFormat('vi-VN').format(total);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        tooltip: {
                                            y: {
                                                formatter: function (val) {
                                                    return val + ' booking';
                                                }
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function (val) {
                                                return val.toFixed(1) + '%';
                                            },
                                            style: {
                                                colors: ['#cccccc']
                                            }
                                        }
                                    }}
                                    series={[
                                        data.summaryByType.tour.totalCompletedBooings,
                                        data.summaryByType.combo.totalCompletedBooings,
                                        data.summaryByType.accommodation.totalCompletedBooings
                                    ]}
                                    type="donut"
                                    height={300}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card title="Phân bố booking bị hủy theo loại sản phẩm" size="small">
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'donut',
                                            height: 300
                                        },
                                        labels: ['Tour', 'Combo', 'Cơ sở lưu trú'],
                                        colors: [CHART_COLORS.tour, CHART_COLORS.combo, CHART_COLORS.accommodation],
                                        legend: {
                                            position: 'bottom'
                                        },
                                        plotOptions: {
                                            pie: {
                                                donut: {
                                                    size: '70%',
                                                    labels: {
                                                        show: true,
                                                        total: {
                                                            show: true,
                                                            label: '',
                                                            formatter: function (w) {
                                                                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                                                return new Intl.NumberFormat('vi-VN').format(total);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        tooltip: {
                                            y: {
                                                formatter: function (val) {
                                                    return val + ' booking';
                                                }
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function (val) {
                                                return val.toFixed(1) + '%';
                                            },
                                            style: {
                                                colors: ['#cccccc']
                                            }
                                        }
                                    }}
                                    series={[
                                        data.summaryByType.tour.totalCanceledBookings,
                                        data.summaryByType.combo.totalCanceledBookings,
                                        data.summaryByType.accommodation.totalCanceledBookings
                                    ]}
                                    type="donut"
                                    height={300}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Row 4: Revenue and Booking Trends */}
                    <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
                        <Col span={12}>
                            <Card styles={{ body: { padding: '20px' } }}>
                                {revenueChartData && (
                                    <Chart options={revenueChartData.options} series={revenueChartData.series} type="line" height={400} />
                                )}
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card styles={{ body: { padding: '20px' } }}>
                                {bookingChartData && (
                                    <Chart options={bookingChartData.options} series={bookingChartData.series} type="line" height={400} />
                                )}
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </MainCard>
    );
};

export default StatisticsOverview;

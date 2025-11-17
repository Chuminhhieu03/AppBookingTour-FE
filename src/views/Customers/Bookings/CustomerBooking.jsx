import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Steps, message, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';
import Step1_CustomerInfo from './components/Step1_CustomerInfo';
import Step2_Payment from './components/Step2_Payment';
import Step3_Confirmation from './components/Step3_Confirmation';
import bookingAPI from 'api/booking/bookingAPI';

const { Step } = Steps;

const CustomerBooking = ({ bookingType = 'combo' }) => {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [currentStep, setCurrentStep] = useState(0);
    const [bookingData, setBookingData] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lấy scheduleId từ URL query params
    const scheduleId = searchParams.get('scheduleId');

    // Map bookingType to API bookingType number
    const bookingTypeMap = {
        tour: 1,
        combo: 3,
        accommodation: 2
    };

    useEffect(() => {
        if (!itemId || !scheduleId) {
            message.error(`Thiếu thông tin ${bookingType} hoặc lịch khởi hành`);
            navigate('/');
        }
    }, [itemId, scheduleId, navigate, bookingType]);

    // Xử lý khi hoàn thành bước 1 (Nhập thông tin)
    const handleStep1Complete = async (values) => {
        setLoading(true);
        try {
            const response = await bookingAPI.create({
                ...values,
                bookingType: bookingTypeMap[bookingType],
                itemId: parseInt(itemId),
                tourDepartureId: parseInt(scheduleId)
            });

            if (response.success) {
                setBookingData(response.data);
                setCurrentStep(1);
                message.success('Tạo booking thành công');
            } else {
                message.error(response.message || 'Không thể tạo booking');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            message.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tạo booking');
        } finally {
            setLoading(false);
        }
    }; // Xử lý khi hoàn thành bước 2 (Thanh toán)
    const handleStep2Complete = async (paymentMethodId) => {
        setLoading(true);
        try {
            const response = await bookingAPI.initPayment({
                bookingId: bookingData.id,
                paymentMethodId: paymentMethodId,
                ipAddress: '127.0.0.1' // TODO: Get real IP
            });

            if (response.success && response.data.success) {
                setPaymentData(response.data);
                setCurrentStep(2);
                message.success('Khởi tạo thanh toán thành công');
            } else {
                message.error(response.message || 'Không thể khởi tạo thanh toán');
            }
        } catch (error) {
            console.error('Error init payment:', error);
            message.error(error.response?.data?.message || 'Đã xảy ra lỗi khi khởi tạo thanh toán');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý khi thanh toán hoàn tất
    const handlePaymentComplete = () => {
        message.success('Thanh toán thành công!');
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    const steps = [
        {
            title: 'Nhập thông tin',
            content: (
                <Step1_CustomerInfo
                    itemId={itemId}
                    scheduleId={scheduleId}
                    bookingType={bookingType}
                    onComplete={handleStep1Complete}
                    loading={loading}
                />
            )
        },
        {
            title: 'Thanh toán',
            content: (
                <Step2_Payment
                    bookingData={bookingData}
                    onComplete={handleStep2Complete}
                    onBack={() => setCurrentStep(0)}
                    loading={loading}
                />
            )
        },
        {
            title: 'Hoàn tất',
            content: <Step3_Confirmation bookingData={bookingData} paymentData={paymentData} onComplete={handlePaymentComplete} />
        }
    ];

    return (
        <MainCard>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
                {/* Back button */}
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
                    Quay lại
                </Button>

                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 'bold', margin: 0 }}>
                        {bookingType === 'tour' && 'ĐẶT TOUR DU LỊCH'}
                        {bookingType === 'combo' && 'ĐẶT COMBO DU LỊCH'}
                        {bookingType === 'accommodation' && 'ĐẶT PHÒNG KHÁCH SẠN'}
                    </h1>
                </div>

                <Steps
                    current={currentStep}
                    style={{ marginBottom: 40 }}
                    labelPlacement="vertical"
                    items={steps.map((item) => ({ title: item.title }))}
                />

                <div>{steps[currentStep].content}</div>
            </div>
        </MainCard>
    );
};

export default CustomerBooking;

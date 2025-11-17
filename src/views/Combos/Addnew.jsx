import { useState, useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Space,
    Card,
    Row,
    Col,
    Typography,
    message,
    Tabs,
    Radio,
    Upload,
    DatePicker,
    Divider
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import MainCard from 'components/MainCard';
import TiptapEditor from 'components/TiptapEditor/TiptapEditor';
import comboAPI from 'api/combo/comboAPI';
import cityAPI from 'api/city/cityAPI';
import dayjs from 'dayjs';
import { VEHICLE_OPTIONS, STATUS_OPTIONS } from '../../constant/comboEnum';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CombosAddnew = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [description, setDescription] = useState('');
    const [coverFileList, setCoverFileList] = useState([]);
    const [galleryFileList, setGalleryFileList] = useState([]);
    const [activeTab, setActiveTab] = useState('1');

    // TẠO  MAP FIELD VỚI TAB KEY
    const fieldToTabMap = {
        code: '1',
        name: '1',
        fromCityId: '1',
        toCityId: '1',
        vehicle: '1',
        durationDays: '1',
        shortDescription: '1',
        isActive: '1',
        basePriceAdult: '2',
        basePriceChildren: '2',
        amenities: '3',
        includes: '3',
        excludes: '3',
        termsConditions: '3',
        schedules: '4'
    };

    // Fetch cities khi component mount
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoadingCities(true);
                const response = await cityAPI.getListCity();
                if (response.success) {
                    setCities(response.data || []);
                } else {
                    message.error('Không thể tải danh sách thành phố');
                    setCities([]);
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                message.error('Đã xảy ra lỗi khi tải danh sách thành phố');
                setCities([]);
            } finally {
                setLoadingCities(false);
            }
        };

        fetchCities();
    }, []);

    // Helper function để chuyển tiếng Việt có dấu thành không dấu
    const removeVietnameseTones = (str) => {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        // Loại bỏ ký tự đặc biệt
        str = str.replace(/[^a-z0-9\s-]/g, '');
        return str;
    };

    // Auto-generate code from name
    const handleNameChange = (e) => {
        const name = e.target.value;
        if (name) {
            const nameWithoutTones = removeVietnameseTones(name);
            const words = nameWithoutTones
                .toUpperCase()
                .split(' ')
                .filter((w) => w.length > 0);
            const code = words.length > 0 ? words.map((w) => w[0]).join('') + '-' + Date.now().toString().slice(-4) : '';
            form.setFieldValue('code', code);
        }
    };

    // TẠO HÀM XỬ LÝ KHI VALIDATE CLIENT THẤT BẠI
    const handleFinishFailed = (errorInfo) => {
        if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
            // Lấy field lỗi đầu tiên
            const firstErrorField = errorInfo.errorFields[0];

            // Lấy name path (luôn là MẢNG, ví dụ ['code'] hoặc ['schedules', 0, 'departureDate'])
            const firstErrorNamePath = firstErrorField.name;

            // 1. SỬA LỖI LOGIC: Lấy tên field CẤP CAO NHẤT để tìm tab
            // Code cũ của bạn (firstErrorName) là sai, nó phải luôn là phần tử [0]
            const topLevelFieldName = Array.isArray(firstErrorNamePath) ? firstErrorNamePath[0] : firstErrorNamePath;

            // Hiển thị message lỗi
            const firstErrorMessage = firstErrorField.errors[0];
            message.error(firstErrorMessage || 'Vui lòng kiểm tra lại các trường bị lỗi');

            // Tự động chuyển đến tab chứa field lỗi
            const targetTab = fieldToTabMap[topLevelFieldName]; // Dùng tên đã sửa

            if (targetTab) {
                // Chỉ chuyển tab nếu tab đó không phải là tab đang active
                if (targetTab !== activeTab) {
                    setActiveTab(targetTab);
                }

                // Sau khi chuyển tab (hoặc nếu đã ở đúng tab),
                setTimeout(() => {
                    form.scrollToField(firstErrorNamePath, {
                        // Dùng name path đầy đủ
                        behavior: 'smooth',
                        block: 'center',
                        focus: true
                    });
                }, 100); // 100ms là độ trễ an toàn để đợi tab render xong
            }
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Prepare data theo API format
            const data = {
                code: values.code,
                name: values.name,
                fromCityId: values.fromCityId,
                toCityId: values.toCityId,
                shortDescription: values.shortDescription || '',
                vehicle: values.vehicle,
                comboImageCover: null, // Will upload separately
                comboImages: null, // Will upload separately
                durationDays: values.durationDays,
                basePriceAdult: values.basePriceAdult,
                basePriceChildren: values.basePriceChildren,
                amenities: values.amenities || '',
                description: description || '',
                includes: values.includes || '',
                excludes: values.excludes || '',
                termsConditions: values.termsConditions || '',
                isActive: values.isActive !== undefined ? values.isActive : true,
                schedules:
                    values.schedules?.map((schedule) => ({
                        departureDate: schedule.departureDate.toISOString(),
                        returnDate: schedule.returnDate.toISOString(),
                        availableSlots: schedule.availableSlots,
                        basePriceAdult: schedule.basePriceAdult || values.basePriceAdult,
                        basePriceChildren: schedule.basePriceChildren || values.basePriceChildren,
                        singleRoomSupplement: schedule.singleRoomSupplement || 0
                    })) || []
            };

            const response = await comboAPI.create(data);

            if (response.success) {
                const comboId = response.data.id;

                // Upload images nếu có
                if (coverFileList.length > 0 || galleryFileList.length > 0) {
                    try {
                        const formData = new FormData();
                        if (coverFileList.length > 0) {
                            formData.append('coverImage', coverFileList[0].originFileObj);
                        }
                        galleryFileList.forEach((file) => {
                            formData.append('images', file.originFileObj);
                        });

                        await comboAPI.uploadImages(comboId, formData);
                    } catch (uploadError) {
                        console.error('Error uploading images:', uploadError);
                        message.warning('Tạo combo thành công nhưng upload ảnh thất bại');
                    }
                }

                message.success('Tạo combo thành công');
                navigate('/admin/combos');
            } else {
                message.error(response.message || 'Không thể tạo combo');
            }
        } catch (error) {
            console.error('Có lỗi khi tạo combo:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tạo combo';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAndAddAnother = async () => {
        try {
            const values = await form.validateFields();
            await handleSubmit(values);
            form.resetFields();
            setDescription('');
            setCoverFileList([]);
            setGalleryFileList([]);
            setActiveTab('1');
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    // Upload handlers
    const handleCoverChange = ({ fileList }) => {
        setCoverFileList(fileList.slice(-1)); // Only keep last file
    };

    const handleGalleryChange = ({ fileList }) => {
        setGalleryFileList(fileList.slice(0, 5)); // Max 5 images
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ được upload file ảnh!');
            return Upload.LIST_IGNORE;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
            return Upload.LIST_IGNORE;
        }
        return false; // Prevent auto upload
    };

    const tabItems = [
        {
            key: '1',
            label: 'Thông tin cơ bản',
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Mã Combo"
                            name="code"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mã combo' },
                                { max: 50, message: 'Mã combo không được quá 50 ký tự' },
                                { pattern: /^[A-Z0-9-]+$/, message: 'Mã combo chỉ được chứa chữ hoa, số và dấu gạch ngang' }
                            ]}
                        >
                            <Input placeholder="VD: HN-HL-3N2D-001" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Tên Combo"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên combo' },
                                { max: 200, message: 'Tên combo không được quá 200 ký tự' }
                            ]}
                        >
                            <Input placeholder="Du lịch Hạ Long 3 ngày 2 đêm" onChange={handleNameChange} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Thành phố đi"
                            name="fromCityId"
                            rules={[{ required: true, message: 'Vui lòng chọn thành phố xuất phát' }]}
                        >
                            <Select
                                placeholder="Chọn thành phố đi"
                                showSearch
                                loading={loadingCities}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Thành phố đến"
                            name="toCityId"
                            dependencies={['fromCityId']}
                            rules={[
                                { required: true, message: 'Vui lòng chọn thành phố đến' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('fromCityId') !== value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Thành phố đến phải khác thành phố đi'));
                                    }
                                })
                            ]}
                        >
                            <Select
                                placeholder="Chọn thành phố đến"
                                showSearch
                                loading={loadingCities}
                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            >
                                {cities.map((city) => (
                                    <Option key={city.id} value={city.id}>
                                        {city.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Phương tiện" name="vehicle" rules={[{ required: true, message: 'Vui lòng chọn phương tiện' }]}>
                            <Radio.Group>
                                {VEHICLE_OPTIONS.map((option) => (
                                    <Radio.Button key={option.value} value={option.value}>
                                        {option.label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Số ngày" name="durationDays" rules={[{ required: true, message: 'Vui lòng nhập số ngày' }]}>
                            <InputNumber min={1} max={30} style={{ width: '100%' }} placeholder="3" addonAfter="ngày" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label="Mô tả ngắn"
                            name="shortDescription"
                            rules={[{ max: 500, message: 'Mô tả ngắn không được quá 500 ký tự' }]}
                        >
                            <TextArea rows={3} placeholder="Mô tả ngắn gọn về combo tour..." maxLength={500} showCount />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item label="Trạng thái" name="isActive" initialValue={true}>
                            <Radio.Group>
                                {STATUS_OPTIONS.map((option) => (
                                    <Radio.Button key={option.value} value={option.value === 'active'}>
                                        {option.label}
                                    </Radio.Button>
                                ))}
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
            ),
            forceRender: true
        },
        {
            key: '2',
            label: 'Giá & Hình ảnh',
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Giá cơ bản người lớn"
                            name="basePriceAdult"
                            rules={[{ required: true, message: 'Vui lòng nhập giá cơ bản người lớn' }]}
                        >
                            <InputNumber
                                min={0}
                                max={100000000}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="4,500,000"
                                addonAfter="VNĐ"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            label="Giá trẻ em"
                            name="basePriceChildren"
                            dependencies={['basePriceAdult']}
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá cơ bản trẻ em' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('basePriceAdult') >= value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Giá cơ bản trẻ em không được cao hơn giá người lớn'));
                                    }
                                })
                            ]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="3,000,000"
                                addonAfter="VNĐ"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Ảnh bìa" extra="Chỉ được upload 1 ảnh, tối đa 5MB">
                            <Upload
                                fileList={coverFileList}
                                onChange={handleCoverChange}
                                beforeUpload={beforeUpload}
                                listType="picture-card"
                                maxCount={1}
                            >
                                {coverFileList.length < 1 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item label="Thư viện ảnh" extra="Tối đa 10 ảnh, mỗi ảnh không quá 5MB">
                            <Upload
                                fileList={galleryFileList}
                                onChange={handleGalleryChange}
                                beforeUpload={beforeUpload}
                                listType="picture-card"
                                multiple
                                maxCount={10}
                            >
                                {galleryFileList.length < 10 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            ),
            forceRender: true
        },
        {
            key: '3',
            label: 'Chi tiết tour',
            children: (
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Form.Item label="Tiện nghi" name="amenities" extra="Mỗi tiện nghi trên một dòng">
                            <TextArea
                                rows={4}
                                placeholder={'WiFi miễn phí\nBữa sáng buffet\nXe đưa đón sân bay\nHướng dẫn viên tiếng Việt'}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <div style={{ marginBottom: 8 }}>
                            <strong>Mô tả chi tiết:</strong>
                        </div>
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                            <TiptapEditor
                                content={description}
                                onChange={setDescription}
                                placeholder="Nhập mô tả chi tiết về combo tour..."
                                minHeight={300}
                            />
                        </div>
                    </Col>

                    <Col xs={24}>
                        <Form.Item label="Bao gồm" name="includes" extra="Mỗi mục trên một dòng">
                            <TextArea
                                rows={4}
                                placeholder={
                                    'Vé máy bay khứ hồi\nKhách sạn 4 sao\nBữa ăn theo chương trình\nVé tham quan các điểm\nBảo hiểm du lịch'
                                }
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item label="Không bao gồm" name="excludes" extra="Mỗi mục trên một dòng">
                            <TextArea rows={4} placeholder={'Chi phí cá nhân\nĐồ uống có cồn\nTips cho hướng dẫn viên'} />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item label="Điều khoản & Điều kiện" name="termsConditions">
                            <TextArea
                                rows={4}
                                placeholder="- Giá tour có thể thay đổi tùy theo mùa cao điểm&#10;- Hủy tour trước 7 ngày được hoàn 50% tiền&#10;- Hủy tour trước 3 ngày mất 100% tiền"
                            />
                        </Form.Item>
                    </Col>
                </Row>
            ),
            forceRender: true
        },
        {
            key: '4',
            label: 'Lịch khởi hành',
            children: (
                <div>
                    <Form.List
                        name="schedules"
                        rules={[
                            {
                                validator: async (_, schedules) => {
                                    if (!schedules || schedules.length < 1) {
                                        return Promise.reject(new Error('Phải có ít nhất 1 lịch khởi hành'));
                                    }
                                }
                            }
                        ]}
                    >
                        {(fields, { add, remove }, { errors }) => (
                            <>
                                {fields.map((field, index) => (
                                    <Card
                                        key={field.key}
                                        size="small"
                                        title={`Lịch khởi hành ${index + 1}`}
                                        extra={
                                            fields.length > 1 ? (
                                                <MinusCircleOutlined onClick={() => remove(field.name)} style={{ color: 'red' }} />
                                            ) : null
                                        }
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Row gutter={[16, 8]}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    {...field}
                                                    label="Ngày khởi hành"
                                                    name={[field.name, 'departureDate']}
                                                    rules={[
                                                        { required: true, message: 'Vui lòng chọn ngày khởi hành' },
                                                        {
                                                            validator: (_, value) => {
                                                                if (!value || dayjs(value).isAfter(dayjs())) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Ngày khởi hành phải sau hôm nay'));
                                                            }
                                                        }
                                                    ]}
                                                >
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        style={{ width: '100%' }}
                                                        placeholder="Chọn ngày giờ khởi hành"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    {...field}
                                                    label="Ngày về"
                                                    name={[field.name, 'returnDate']}
                                                    dependencies={[['schedules', field.name, 'departureDate']]}
                                                    rules={[
                                                        { required: true, message: 'Vui lòng chọn ngày về' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                const departureDate = getFieldValue([
                                                                    'schedules',
                                                                    field.name,
                                                                    'departureDate'
                                                                ]);
                                                                if (
                                                                    !value ||
                                                                    !departureDate ||
                                                                    dayjs(value).isAfter(dayjs(departureDate))
                                                                ) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('Ngày về phải sau ngày khởi hành'));
                                                            }
                                                        })
                                                    ]}
                                                >
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        style={{ width: '100%' }}
                                                        placeholder="Chọn ngày giờ về"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Số chỗ"
                                                    name={[field.name, 'availableSlots']}
                                                    rules={[{ required: true, message: 'Vui lòng nhập số chỗ' }]}
                                                >
                                                    <InputNumber min={1} max={500} style={{ width: '100%' }} placeholder="30" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Giá người lớn (tùy chọn)"
                                                    name={[field.name, 'basePriceAdult']}
                                                    extra="Để trống = giá mặc định"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                        placeholder="Giá mặc định"
                                                        addonAfter="VNĐ"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Giá trẻ em (tùy chọn)"
                                                    name={[field.name, 'basePriceChildren']}
                                                    extra="Để trống = giá mặc định"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                        placeholder="Giá mặc định"
                                                        addonAfter="VNĐ"
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...field}
                                                    label="Phụ phí phòng đơn (tùy chọn)"
                                                    name={[field.name, 'singleRoomSupplement']}
                                                    extra="Để trống = 0đ"
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '100%' }}
                                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                        placeholder="0"
                                                        addonAfter="VNĐ"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}

                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        Thêm lịch khởi hành
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </div>
            ),
            forceRender: true
        }
    ];

    return (
        <MainCard>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={3} style={{ margin: 0 }}>
                        Tạo Combo Tour mới
                    </Title>
                </Col>
            </Row>

            <Form form={form} layout="vertical" onFinish={handleSubmit} onFinishFailed={handleFinishFailed}>
                <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} animated={false} />

                <Divider />

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />} size="large">
                            Lưu Combo
                        </Button>
                        <Button type="default" onClick={handleSaveAndAddAnother} loading={loading} icon={<PlusOutlined />} size="large">
                            Lưu & Thêm mới
                        </Button>
                        <Button onClick={() => navigate('/admin/combos')} icon={<ArrowLeftOutlined />} size="large">
                            Hủy
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </MainCard>
    );
};

export default CombosAddnew;

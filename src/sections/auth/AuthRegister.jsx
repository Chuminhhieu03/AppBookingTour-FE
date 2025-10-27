import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Select, DatePicker, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { registerAsync } from '../../features/auth/authSlice';
import DarkLogo from 'assets/images/logo-dark.svg';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AuthRegisterForm() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            const userData = {
                email: values.email,
                userName: values.userName,
                password: values.password,
                confirmPassword: values.confirmPassword,
                fullName: values.fullName,
                userType: values.userType || 0, // Default: Customer
                phone: values.phone,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toISOString() : null,
                gender: values.gender,
                address: values.address
            };

            await dispatch(registerAsync(userData)).unwrap();
            navigate('/login');
        } catch (error) {
            console.error('Register failed:', error);
        }
    };

    return (
        <Card style={{ maxWidth: 700, width: '100%', margin: '0 auto', borderRadius: 8 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img src={DarkLogo} alt="Logo" style={{ height: 40, marginBottom: 16 }} />
                <Title level={3} style={{ marginBottom: 8 }}>
                    Đăng ký tài khoản
                </Title>
                <Text type="secondary">Tạo tài khoản mới để bắt đầu</Text>
            </div>

            <Form form={form} name="register" onFinish={onFinish} layout="vertical" autoComplete="off">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' }
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="email@example.com" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="userName"
                            label="Tên đăng nhập"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                            ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="username" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                    <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item
                            name="confirmPassword"
                            label="Xác nhận mật khẩu"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                                    }
                                })
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Xác nhận mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                            <Input prefix={<PhoneOutlined />} placeholder="0987654321" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="dateOfBirth" label="Ngày sinh">
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày sinh"
                                format="DD/MM/YYYY"
                                disabledDate={(current) => current && current > dayjs().endOf('day')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                            <Select placeholder="Chọn giới tính">
                                <Option value={0}>Nam</Option>
                                <Option value={1}>Nữ</Option>
                                <Option value={2}>Khác</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item name="userType" label="Loại tài khoản" initialValue={0}>
                            <Select placeholder="Chọn loại tài khoản">
                                <Option value={0}>Khách hàng</Option>
                                <Option value={1}>Nhân viên</Option>
                                <Option value={2}>Quản trị viên</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                    <Input.TextArea prefix={<HomeOutlined />} placeholder="123 Lê Lợi, Hà Nội" rows={2} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                        Đăng ký
                    </Button>
                </Form.Item>

                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">Đã có tài khoản? </Text>
                    <Link to="/login" style={{ color: '#1890ff', fontWeight: 500 }}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </Form>
        </Card>
    );
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Typography, Space, Card } from 'antd';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { loginAsync } from '../../features/auth/authSlice';
import DarkLogo from 'assets/images/logo-dark.svg';

const { Title, Text } = Typography;

export default function AuthLoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const result = await dispatch(loginAsync({ email: values.email, password: values.password })).unwrap();
      if (result) {
        navigate('/admin/service/accommodation');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Card style={{ maxWidth: 450, width: '100%', margin: '0 auto', borderRadius: 8 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <img src={DarkLogo} alt="Logo" style={{ height: 40, marginBottom: 16 }} />
        <Title level={3} style={{ marginBottom: 8 }}>
          Đăng nhập
        </Title>
        <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
      </div>

      <Form form={form} name="login" onFinish={onFinish} layout="vertical" autoComplete="off">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            size="large"
            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" style={{ color: '#1890ff' }}>
              Quên mật khẩu?
            </Link>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" loading={loading} block>
            Đăng nhập
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">Chưa có tài khoản? </Text>
          <Link to="/register" style={{ color: '#1890ff', fontWeight: 500 }}>
            Đăng ký ngay
          </Link>
        </div>
      </Form>
    </Card>
  );
}

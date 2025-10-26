import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, Card, Result } from 'antd';
import { LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { resetPasswordAsync } from '../../../features/auth/authSlice';
import { useState } from 'react';
import DarkLogo from 'assets/images/logo-dark.svg';

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading } = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();

  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const onFinish = async (values) => {
    try {
      await dispatch(
        resetPasswordAsync({
          email,
          token,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword
        })
      ).unwrap();
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Reset password failed:', error);
    }
  };

  if (!email || !token) {
    return (
      <div className="auth-main">
        <div className="auth-wrapper v1">
          <div className="auth-form">
            <Result
              status="error"
              title="Link không hợp lệ"
              subTitle="Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
              extra={[
                <Link to="/forgot-password" key="forgot">
                  <Button type="primary" size="large">
                    Gửi lại email
                  </Button>
                </Link>,
                <Link to="/login" key="login">
                  <Button size="large">Quay về đăng nhập</Button>
                </Link>
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-main">
        <div className="auth-wrapper v1">
          <div className="auth-form">
            <Result
              status="success"
              title="Đặt lại mật khẩu thành công!"
              subTitle="Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển đến trang đăng nhập..."
              extra={[
                <Link to="/login" key="login">
                  <Button type="primary" size="large">
                    Đăng nhập ngay
                  </Button>
                </Link>
              ]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-main">
      <div className="auth-wrapper v1">
        <div className="auth-form">
          <Card style={{ maxWidth: 450, width: '100%', margin: '0 auto', borderRadius: 8 }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <img src={DarkLogo} alt="Logo" style={{ height: 40, marginBottom: 16 }} />
              <Title level={3} style={{ marginBottom: 8 }}>
                Đặt lại mật khẩu
              </Title>
              <Text type="secondary">Nhập mật khẩu mới cho tài khoản của bạn</Text>
            </div>

            <Form form={form} name="reset-password" onFinish={onFinish} layout="vertical" autoComplete="off">
              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu mới"
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
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
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" loading={loading} block>
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <Link to="/login" style={{ color: '#1890ff' }}>
                  ← Quay về đăng nhập
                </Link>
              </div>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}

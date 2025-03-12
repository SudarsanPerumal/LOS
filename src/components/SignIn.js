import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  message, 
  Typography, 
  Space
} from 'antd';
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material';
import logo from "../assets/image/credibly.svg"

function SignIn({ onLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (onLogin(values)) {
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error('Invalid credentials');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        {/* <Typography.Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
          Available logins:
          <br />
          Credibly: admin/intain123
          <br />
          UWON: user/uwon123
        </Typography.Text> */}
        {/* <img 
          src={logo}
          alt="Company Logo" 
          style={{ 
            height: '40px', 
            marginTop: '20px',
            marginBottom: '20px',
            // background: "black" 
          }} 
        /> */}
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 30, color: '#212121' }}>
            LOS System
          </Typography.Title>
        </Space>
        {/* <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 30, color: '#1890ff' }}>
          Loan Origination System
        </Typography.Title> */}
        <Form
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input 
              prefix={<PersonIcon sx={{ fontSize: 20, color: '#bfbfbf' }} />}
              placeholder="Username" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockIcon sx={{ fontSize: 20, color: '#bfbfbf' }} />}
              placeholder="Password" 
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default SignIn; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Card, 
  Typography, 
  Tag, 
  Tooltip,
  Layout,
  Menu 
} from 'antd';
import { 
  Search as SearchIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { LogoutOutlined } from '@ant-design/icons';
import crediblyLogo from "../assets/image/credibly.svg";
import uwonLogo from "../assets/image/uwon.svg";
import data from "../data.json";

const { Title } = Typography;
const { Search } = Input;
const { Sider, Content } = Layout;

function Dashboard1({ setSelectedLoan, userType }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  // Import data from data.json
  const loans = data.data.map(loan => ({
    id: loan['Loan ID'],
    assetClass: loan['Asset Class'],
    originalBalance: loan['Original Principal Balance'],
    // interestRate: (parseFloat(loan['Current Interest Rate']) * 100).toFixed(2) + '%',

    interestRate: loan['Current Interest Rate'] + '%',
    verificationStatus: loan['Contract Digitized'],
    ein : loan["EIN"],
    borrower: loan["Borrower"]
  }));

  const getStatusColor = (status) => {
    const statusColors = {
      '180+_days_dq': 'error',
      'current': 'success',
      'late': 'warning'
    };
    return statusColors[status] || 'default';
  };

  const columns = [
    {
      title: 'Loan ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <strong>{text}</strong>
    },
    {
      title: 'Asset Class',
      dataIndex: 'assetClass',
      key: 'assetClass'
    },
    {
      title: 'Original Principal Balance',
      dataIndex: 'originalBalance',
      key: 'originalBalance',
      render: (text) => (
        <Space>
          ${text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Space>
      )
    },
    {
      title: 'Current Interest Rate',
      dataIndex: 'interestRate',
      key: 'interestRate'
    },
    {
      title: 'Verification Status',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      // render: (status) => (
      //   <Tag color={getStatusColor(status)}>
      //     {status}
      //   </Tag>
      // )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Tooltip title="Track loan progress">
          <Button 
            type="primary" 
            icon={<TimelineIcon />}
            onClick={() => handleTrack(record)}
          >
            Track
          </Button>
        </Tooltip>
      )
    }
  ];

  const handleTrack = (loan) => {
    debugger;
    console.log('loan',loan)
    setSelectedLoan(loan);
    sessionStorage.setItem("ein",loan['ein'])
    sessionStorage.setItem("borrower",loan['borrower'])
    navigate('/viewdetails');
  };

  const filteredLoans = loans.filter(loan => 
    Object.values(loan).some(value => 
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleLogout = () => {
    // Implement logout functionality
    navigate('/');
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardIcon  onClick={() => navigate('/dashboard')}/>,
      label: 'Dashboard'
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={250}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <img 
            src={userType === 'credibly' ? crediblyLogo : uwonLogo}
            alt="Company Logo" 
            style={{ height: '26px' }}
          />
        </div>
        
        <Menu
          mode="inline"
          defaultSelectedKeys={['applications']}
          style={{ flex: 1, borderRight: 0 }}
          items={menuItems}
        />

        <div style={{ 
          padding: '16px',
          borderTop: '1px solid #f0f0f0',
          marginTop: '95vh'
        }}>
          <Button 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            type="primary"
            danger
            block
          >
            Logout
          </Button>
        </div>
      </Sider>

      <Layout style={{ background: '#fff' }}>
        <Content style={{ padding: '24px' }}>
          <Card className="main-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div className="header-section">
                <Title level={2}>Loan Applications</Title>
                <Search
                  placeholder="Search loans..."
                  allowClear
                  enterButton={<SearchIcon />}
                  size="large"
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ maxWidth: 300 }}
                />
              </div>
              
              <Table 
                columns={columns} 
                dataSource={filteredLoans}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} loans`
                }}
              />
            </Space>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard1; 
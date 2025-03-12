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
  Tooltip 
} from 'antd';
import { 
  Search as SearchIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import crediblyLogo from "../assets/image/credibly.svg";
import uwonLogo from "../assets/image/uwon.svg";

const { Title } = Typography;
const { Search } = Input;

function Dashboard1({ setSelectedLoan, userType }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  // Sample loan data
  const loans = [
    {
      id: 'L001',
      customerName: 'John Doe',
      loanAmount: '$50,000',
      loanType: 'Business',
      applicationDate: '2024-03-15',
      status: 'In Progress',
      ein: '12-3456789'
    },
    {
      id: 'L002',
      customerName: 'Jane Smith',
      loanAmount: '$75,000',
      loanType: 'Equipment',
      applicationDate: '2024-03-16',
      status: 'Under Review',
      ein: '98-7654321'
    },
    {
      id: 'L003',
      customerName: 'Robert Johnson',
      loanAmount: '$100,000',
      loanType: 'Commercial',
      applicationDate: '2024-03-17',
      status: 'Approved',
      ein: '45-6789123'
    },
    {
      id: 'L004',
      customerName: 'Sarah Williams',
      loanAmount: '$25,000',
      loanType: 'Working Capital',
      applicationDate: '2024-03-18',
      status: 'Pending',
      ein: '32-1654987'
    }
  ];

  const getStatusColor = (status) => {
    const statusColors = {
      'In Progress': 'processing',
      'Under Review': 'warning',
      'Approved': 'success',
      'Pending': 'default'
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
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (text) => (
        <Space>
          <PersonIcon sx={{ fontSize: 16 }} />
          {text}
        </Space>
      )
    },
    {
      title: 'Loan Amount',
      dataIndex: 'loanAmount',
      key: 'loanAmount',
      render: (text) => (
        <Space>
          <MoneyIcon sx={{ fontSize: 16 }} />
          {text}
        </Space>
      )
    },
    {
      title: 'Loan Type',
      dataIndex: 'loanType',
      key: 'loanType'
    },
    {
      title: 'Application Date',
      dataIndex: 'applicationDate',
      key: 'applicationDate',
      render: (text) => (
        <Space>
          <CalendarIcon sx={{ fontSize: 16 }} />
          {text}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      )
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
    setSelectedLoan(loan);
    navigate('/viewdetails');
  };

  const filteredLoans = loans.filter(loan => 
    Object.values(loan).some(value => 
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="dashboard1-container">
      <Space direction="vertical" align="center" style={{ width: '100%' ,marginBottom: '20px'}}>
        <img 
          src={userType === 'credibly' ? crediblyLogo : uwonLogo}
          alt="Company Logo" 
          style={{ 
            height: '60px', 
            marginTop: '20px',
          }} 
        />
      </Space>
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
    </div>
  );
}

export default Dashboard1; 
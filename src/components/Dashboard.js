import { useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Modal, 
  Form, 
  Input, 
  Button, 
  message, 
  Typography, 
  Badge, 
  Space,
  Tooltip,
  notification
} from 'antd';
import {
  Description as DescriptionIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  Security as SecurityIcon,
  Badge as BadgeIcon,
  Assignment as AssignmentIcon,
  AccountBalance as AccountBalanceIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import crediblyLogo from "../assets/image/credibly.svg";
import uwonLogo from "../assets/image/uwon.svg";

const { confirm } = Modal;

function Dashboard({ selectedLoan, userType }) {
  const [verifyEINModal, setVerifyEINModal] = useState(false);
  const [responseModal, setResponseModal] = useState(false);
  const [closeConfirmModal, setCloseConfirmModal] = useState(false);
  const [form] = Form.useForm();
  const [responseData, setResponseData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModal, setSuccessModal] = useState(false);

  const sampleResponses = [
    {
      ein: "12-3456789",
      lender: "ABC Bank",
      outstandingBalance: "$50,000",
      status: "Verified",
      date: "2024-01-15"
    },
    {
      ein: "98-7654321",
      lender: "XYZ Financial",
      outstandingBalance: "$75,000",
      status: "Self Certified",
      date: "2024-02-20"
    },
    {
      ein: "45-6789012",
      error: "No loans were found for this Borrower"
    }
  ];

  const handleCloseLoan = () => {
    setCloseConfirmModal(false);
    message.loading('Processing...', 2.5);
    
    // Simulate API call with a longer delay
    setTimeout(() => {
      setSuccessModal(true);
    }, 0);
  };

  const loanPhases = [
    {
      phase: "Loan Application",
      icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
      status: "completed"
    },
    {
      phase: "Document Submission",
      icon: <UploadIcon sx={{ fontSize: 28 }} />,
      status: "completed"
    },
    {
      phase: "Screening Process",
      icon: <SearchIcon sx={{ fontSize: 28 }} />,
      status: "processing"
    },
    {
      phase: "Credit & Quality Check",
      icon: <SecurityIcon sx={{ fontSize: 28 }} />,
      status: "pending"
    },
    {
      phase: "Loan Stacking",
      icon: <BadgeIcon sx={{ fontSize: 28 }} />,
      status: "verified",
      action: () => setVerifyEINModal(true)
    },
    {
      phase: "Application Finalization",
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      status: "pending"
    },
    {
      phase: "Disbursement",
      icon: <AccountBalanceIcon sx={{ fontSize: 28 }} />,
      status: "pending"
    },
    {
      phase: "Close Loan",
      icon: <CancelIcon sx={{ fontSize: 28 }} />,
      status: "pending",
      action: () => setCloseConfirmModal(true)
    }
  ];

  const handleSubmitEIN = async (values) => {
    // Check if the entered EIN matches one of the first two sample responses
    const matchingResponse = sampleResponses.find(
      (resp) => resp.ein === values.ein && !resp.error
    );
    
    if (matchingResponse) {
      setResponseData(matchingResponse);
      setResponseModal(true);
      message.success('EIN verification submitted successfully');
    } else {
      setErrorMessage('No loans were found for this Borrower');
      setErrorModal(true);
    }
    
    form.resetFields();
    setVerifyEINModal(false);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: 'success',
      verified: 'success',
      processing: 'processing',
      pending: 'default'
    };
    return statusMap[status];
  };

  return (
    <div className="dashboard-container">
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        <img 
          src={userType === 'credibly' ? crediblyLogo : uwonLogo}
          alt="Company Logo" 
          style={{ 
            height: '60px', 
            marginTop: '20px',
          }} 
        />
        <Typography.Title level={2} style={{ textAlign: 'center', margin: '20px 0' }}>
          Loan Origination System
        </Typography.Title>
      </Space>

      <Row gutter={[16, 16]} justify="center">
        {loanPhases.map((phase, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Tooltip title={phase.action ? 
              phase.phase === "Close Loan" ? "Click to close loan" : "Click to verify EIN" 
              : null}
            >
              <Card
                hoverable={!!phase.action}
                onClick={phase.action}
                className={`phase-card ${phase.status}`}
                bodyStyle={{ padding: '24px 16px' }}
              >
                <Space direction="vertical" align="center" style={{ width: '100%' }}>
                  <Badge status={getStatusBadge(phase.status)} text={phase.status} />
                  <div className="phase-icon-wrapper">
                    <span className="phase-icon">{phase.icon}</span>
                  </div>
                  <Typography.Text strong style={{ fontSize: '16px' }}>
                    {phase.phase}
                  </Typography.Text>
                </Space>
              </Card>
            </Tooltip>
          </Col>
        ))}
      </Row>

      <Modal
        title="Loan Stacking"
        open={verifyEINModal}
        onCancel={() => setVerifyEINModal(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSubmitEIN}
          layout="vertical"
        >
          <Form.Item
            name="ein"
            label="EIN"
            rules={[{ required: true, message: 'Please input EIN!' }]}
          >
            <Input placeholder="XX-XXXXXXX" />
          </Form.Item>
          <Form.Item
            name="originatorName"
            label="Name of Originator"
            rules={[{ required: true, message: 'Please input originator name!' }]}
          >
            <Input placeholder="Enter originator name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="EIN Verification Result"
        open={responseModal}
        onCancel={() => setResponseModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setResponseModal(false)}>
            Close
          </Button>
        ]}
      >
        {responseData && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {responseData.error ? (
              <Typography.Text type="warning" strong>{responseData.error}</Typography.Text>
            ) : (
              <>
                <Typography.Text strong>EIN: {responseData.ein}</Typography.Text>
                <Typography.Text strong>Lender: {responseData.lender}</Typography.Text>
                <Typography.Text strong>Outstanding Balance: {responseData.outstandingBalance}</Typography.Text>
                <Typography.Text strong>Status: {responseData.status}</Typography.Text>
                <Typography.Text strong>Date: {responseData.date}</Typography.Text>
              </>
            )}
          </Space>
        )}
      </Modal>

      <Modal
        title="Close Loan Confirmation"
        open={closeConfirmModal}
        onCancel={() => setCloseConfirmModal(false)}
        style={{ marginTop: '110px' }}
        footer={[
          <Button key="cancel" onClick={() => setCloseConfirmModal(false)}>
            Cancel
          </Button>,
          <Button key="proceed" type="primary" onClick={handleCloseLoan}>
            Proceed
          </Button>
        ]}
      >
        <Typography.Text>
          Are you sure, you want to move the records to Digital Loan Ledger?
        </Typography.Text>
      </Modal>

      <Modal
        title="Error"
        open={errorModal}
        onCancel={() => setErrorModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setErrorModal(false)}>
            Close
          </Button>
        ]}
      >
        <Typography.Text  strong>
          {errorMessage}
        </Typography.Text>
      </Modal>

      <Modal
        title="Success"
        open={successModal}
        onCancel={() => setSuccessModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSuccessModal(false)}>
            Close
          </Button>
        ]}
      >
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <CheckCircleIcon style={{ color: '#52c41a', fontSize: 60 }} />
          <Typography.Text strong>
            Records are successfully moved to Digital Loan Ledger
          </Typography.Text>
        </Space>
      </Modal>
    </div>
  );
}

export default Dashboard; 
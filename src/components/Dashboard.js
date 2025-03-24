import { useState, useEffect } from "react";
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
  notification,
  Layout,
  Menu,
} from "antd";
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
  CheckCircle as CheckCircleIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { updateLoanStackingDetails } from '../service/service';

import crediblyLogo from "../assets/image/credibly.svg";
import uwonLogo from "../assets/image/uwon.svg";

const { confirm } = Modal;
const { Title } = Typography;
const { Sider, Content } = Layout;

function Dashboard({ selectedLoan, userType }) {
  console.log("selectedLoan",selectedLoan);
  const [verifyEINModal, setVerifyEINModal] = useState(false);
  const [responseModal, setResponseModal] = useState(false);
  const [closeConfirmModal, setCloseConfirmModal] = useState(false);
  const [form] = Form.useForm();
  const [responseData, setResponseData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const ein = sessionStorage.getItem("ein");
  const originatorName = sessionStorage.getItem("originatorName");
  const borrower = sessionStorage.getItem("borrower");

  console.log("borrower",borrower);

  useEffect(() => {
    form.setFieldsValue({
      ein: ein,
      borrower : borrower,
      originatorName: originatorName
    });
  }, [form, ein, originatorName]);

  const sampleResponses = [
    {
      ein: "12-3456789",
      lender: "ABC Bank",
      outstandingBalance: "$50,000",
      status: "Verified",
      date: "2024-01-15",
    },
    {
      ein: "98-7654321",
      lender: "XYZ Financial",
      outstandingBalance: "$75,000",
      status: "Self Certified",
      date: "2024-02-20",
    },
    {
      ein: "45-6789012",
      error: "No loans were found for this Borrower",
    },
  ];

  const handleCloseLoan = () => {
    setCloseConfirmModal(false);
    message.loading("Processing...", 2.5);

    // Simulate API call with a longer delay
    setTimeout(() => {
      setSuccessModal(true);
    }, 0);
  };

  const loanPhases = [
    {
      phase: "Loan Application",
      icon: <DescriptionIcon sx={{ fontSize: 28 }} />,
      status: "completed",
    },
    {
      phase: "Document Submission",
      icon: <UploadIcon sx={{ fontSize: 28 }} />,
      status: "completed",
    },
    {
      phase: "Screening Process",
      icon: <SearchIcon sx={{ fontSize: 28 }} />,
      status: "processing",
    },
    {
      phase: "Credit & Quality Check",
      icon: <SecurityIcon sx={{ fontSize: 28 }} />,
      status: "pending",
    },
    {
      phase: "Verify Loan Stacking",
      icon: <BadgeIcon sx={{ fontSize: 28 }} />,
      status: verificationStatus,
      action: () => setVerifyEINModal(true),
    },
    {
      phase: "Application Finalization",
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      status: "pending",
    },
    {
      phase: "Disbursement",
      icon: <AccountBalanceIcon sx={{ fontSize: 28 }} />,
      status: "pending",
    },
    {
      phase: "Close Loan",
      icon: <CancelIcon sx={{ fontSize: 28 }} />,
      status: "pending",
      action: () => setCloseConfirmModal(true),
    },
  ];

  const handleSubmitEIN = async (values) => {
    console.log("values",values);
    try {
      // Call the API with the form values
      await updateLoanStackingDetails({
        LoanID: selectedLoan.id,
      });

      // Check for specific EIN that should show error
      if (selectedLoan.id === "200000015") {
        debugger
        setErrorMessage("No loans were found for this Borrower");
        setErrorModal(true);
        setVerifyEINModal(false);
        return;
      }

      // Use the EIN from sessionStorage for comparison
      const storedEIN = sessionStorage.getItem("ein");
      
      // Create dynamic response based on stored EIN
      const matchingResponse = {
        ein: storedEIN,
        lender: "UOWN",
        outstandingBalance: "$50,000",
        state: "Yes, loans found for this borrower; Self-Verified",
        date: new Date().toISOString().split('T')[0]
      };

      if (values.ein === storedEIN) {
        setResponseData(matchingResponse);
        setResponseModal(true);
        setVerificationStatus('verified');
        message.success("EIN verification submitted successfully");
      } else {
        setErrorMessage("No loans were found for this Borrower");
        setErrorModal(true);
      }

      setVerifyEINModal(false);
    } catch (error) {
      message.error("Failed to update loan stacking details");
      console.error(error);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: "success",
      verified: "success",
      processing: "processing",
      pending: "default",
    };
    return statusMap[status];
  };

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardIcon onClick={() => navigate("/dashboard")} />,
      label: "Dashboard",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div style={{ padding: "20px", textAlign: "center" }}>
          <img
            src={userType === "credibly" ? crediblyLogo : uwonLogo}
            alt="Company Logo"
            style={{ height: "26px" }}
          />
        </div>

        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          style={{ flex: 1, borderRight: 0 }}
          items={menuItems}
          onClick={() => navigate("/dashboard")}
        />

        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #f0f0f0",
            marginTop: "78vh",
          }}
        >
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

      <Layout style={{ background: "#fff" }}>
        <Content style={{ padding: "24px" }}>
          <div className="dashboard-container">
            <Typography.Title
              level={2}
              style={{ textAlign: "center", margin: "20px 0" }}
            >
              Loan Application Process ( Loan ID : {selectedLoan.id })
            </Typography.Title>

            <Row gutter={[16, 16]} justify="center">
              {loanPhases.map((phase, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Tooltip
                    title={
                      phase.action
                        ? phase.phase === "Close Loan"
                          ? "Click to close loan"
                          : "Click to verify EIN"
                        : null
                    }
                  >
                    <Card
                      hoverable={!!phase.action}
                      onClick={phase.action}
                      className={`phase-card ${phase.status}`}
                      bodyStyle={{ padding: "24px 16px" }}
                    >
                      <Space
                        direction="vertical"
                        align="center"
                        style={{ width: "100%" }}
                      >
                        <Badge
                          status={getStatusBadge(phase.status)}
                          text={phase.status}
                        />
                        <div className="phase-icon-wrapper">
                          <span className="phase-icon">{phase.icon}</span>
                        </div>
                        <Typography.Text strong style={{ fontSize: "16px" }}>
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
              <Form form={form} onFinish={handleSubmitEIN} layout="vertical">
                <Form.Item
                  name="ein"
                  label="EIN"
                  rules={[{  message: "Please input EIN!" }]}
                >
                  <Input placeholder="XX-XXXXXXX" />
                </Form.Item>
                <Form.Item
                  name="borrower"
                  label="Name of Borrower"
                  rules={[
                    {
                      message: "Please input borrower name!",
                    },
                  ]}
                >
                  <Input placeholder="Enter borrower name" />
                </Form.Item>
                <Form.Item
                  name="originatorName"
                  label="Name of Originator"
                  rules={[
                    {
                      message: "Please input originator name!",
                    },
                  ]}
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
                <Button
                  key="close"
                  type="primary"
                  onClick={() => setResponseModal(false)}
                >
                  Close
                </Button>,
              ]}
            >
              {responseData && (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {responseData.error ? (
                    <Typography.Text type="warning" strong>
                      {responseData.error}
                    </Typography.Text>
                  ) : (
                    <>
                    <Typography.Text strong>
                        State: {responseData.state}
                      </Typography.Text>
                      <Typography.Text >
                        EIN: {responseData.ein}
                      </Typography.Text>
                      <Typography.Text >
                        Lender: {responseData.lender}
                      </Typography.Text>
                      <Typography.Text >
                        Outstanding Balance: {responseData.outstandingBalance}
                      </Typography.Text>
                      
                      <Typography.Text >
                        Date: {responseData.date}
                      </Typography.Text>
                    </>
                  )}
                </Space>
              )}
            </Modal>

            <Modal
              title="Close Loan Confirmation"
              open={closeConfirmModal}
              onCancel={() => setCloseConfirmModal(false)}
              style={{ marginTop: "110px" }}
              footer={[
                <Button
                  key="cancel"
                  onClick={() => setCloseConfirmModal(false)}
                >
                  Cancel
                </Button>,
                <Button key="proceed" type="primary" onClick={handleCloseLoan}>
                  Proceed
                </Button>,
              ]}
            >
              <Typography.Text>
                Are you sure, you want to move the records to Digital Loan
                Ledger?
              </Typography.Text>
            </Modal>

            <Modal
              // title="Error"
              style={{ marginTop: "110px" }}
              open={errorModal}
              onCancel={() => setErrorModal(false)}
              footer={[
                <Button
                  key="close"
                  type="primary"
                  onClick={() => setErrorModal(false)}
                >
                  Close
                </Button>,
              ]}
              closable={false}
            >
              <Typography.Text strong>{errorMessage}</Typography.Text>
            </Modal>

            <Modal
              title="Success"
              style={{ marginTop: "110px" }}
              open={successModal}
              onCancel={() => setSuccessModal(false)}
              footer={[
                <Button
                  key="close"
                  type="primary"
                  onClick={() => setSuccessModal(false)}
                >
                  Close
                </Button>,
              ]}
            >
              <Space
                direction="vertical"
                align="center"
                style={{ width: "100%" }}
              >
                <CheckCircleIcon style={{ color: "#52c41a", fontSize: 60 }} />
                <Typography.Text strong>
                  Records are successfully moved to Digital Loan Ledger
                </Typography.Text>
              </Space>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Dashboard;

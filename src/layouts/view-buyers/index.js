import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API service
import api from "services/api";

function ViewBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Format currency with Indian Rupee symbol
  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const fetchBuyers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/financer/buyers");
      setBuyers(response.data || []);
    } catch (err) {
      console.error("Error fetching buyers:", err);
      setError(err.response?.data?.message || "Failed to fetch buyers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card sx={{ borderRadius: 2, boxShadow: "0 4px 20px 0 rgba(0,0,0,0.1)" }}>
              <MDBox
                mx={0}
                mt={0}
                py={3}
                px={3}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="none"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Buyers List
                </MDTypography>
                <Tooltip title="Refresh" placement="top">
                  <IconButton color="white" onClick={fetchBuyers}>
                    <Icon>refresh</Icon>
                  </IconButton>
                </Tooltip>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                {error && (
                  <MDBox mb={2}>
                    <MDAlert color="error" dismissible>
                      {error}
                    </MDAlert>
                  </MDBox>
                )}
                {isLoading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <MDTypography variant="body2" color="text">
                      Loading buyers...
                    </MDTypography>
                  </MDBox>
                ) : buyers.length === 0 ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <MDTypography variant="body2" color="text">
                      No buyers found
                    </MDTypography>
                  </MDBox>
                ) : (
                  <MDBox>
                    <MDBox display="flex" py={2}>
                      <MDBox flex={2}>
                        <MDTypography variant="subtitle2" fontWeight="medium" color="text.secondary">
                          BUYER NAME
                        </MDTypography>
                      </MDBox>
                      <MDBox flex={1} textAlign="right">
                        <MDTypography variant="subtitle2" fontWeight="medium" color="text.secondary">
                          CREDIT LIMIT
                        </MDTypography>
                      </MDBox>
                      <MDBox flex={1} textAlign="right">
                        <MDTypography variant="subtitle2" fontWeight="medium" color="text.secondary">
                          AVAILABLE CREDIT
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <Divider />
                    {buyers.map((buyer, index) => (
                      <MDBox key={buyer.id || buyer._id || index}>
                        <MDBox display="flex" py={2}>
                          <MDBox flex={2}>
                            <MDTypography variant="body2" fontWeight="regular">
                              {buyer.name}
                            </MDTypography>
                          </MDBox>
                          <MDBox flex={1} textAlign="right">
                            <MDTypography variant="body2" fontWeight="regular">
                              {formatCurrency(buyer.credit_limit)}
                            </MDTypography>
                          </MDBox>
                          <MDBox flex={1} textAlign="right">
                            <MDTypography variant="body2" fontWeight="regular">
                              {formatCurrency(buyer.available_credit)}
                            </MDTypography>
                          </MDBox>
                        </MDBox>
                        {index < buyers.length - 1 && <Divider light />}
                      </MDBox>
                    ))}
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ViewBuyers; 
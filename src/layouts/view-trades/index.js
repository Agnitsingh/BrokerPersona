import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API service
import api from "services/api";

function ViewTrades() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get crop color based on crop name
  const getCropColor = (cropName) => {
    switch(cropName) {
      case "wheat": return "warning"; // Yellow
      case "rice": return "info";     // Blue
      case "corn": return "success";  // Green
      case "barley": return "error";  // Red
      case "soybean": return "dark";  // Dark
      default: return "primary";      // Default blue
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Calculate days remaining until valid_till date
  const getDaysRemaining = (validTill) => {
    const today = new Date();
    const expiryDate = new Date(validTill);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Fetch trades on component mount
  useEffect(() => {
    fetchTrades();
  }, []);
  
  // Fetch trades from API
  const fetchTrades = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/broker/trades");
      setTrades(response.data);
    } catch (err) {
      console.error("Failed to fetch trades:", err);
      setError("Failed to load trades. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Your Trade Offers
                </MDTypography>
                <MDButton
                  variant="gradient"
                  color="dark"
                  size="small"
                  onClick={() => window.location.href = "/trade-offers"}
                >
                  <Icon>add</Icon>&nbsp;
                  Create New Trade
                </MDButton>
              </MDBox>
              <MDBox p={3}>
                {error && (
                  <MDBox mb={2}>
                    <MDAlert color="error" dismissible>
                      {error}
                    </MDAlert>
                  </MDBox>
                )}
                
                {isLoading ? (
                  <MDBox display="flex" justifyContent="center">
                    <MDTypography variant="button" color="text">
                      Loading your trades...
                    </MDTypography>
                  </MDBox>
                ) : trades.length === 0 ? (
                  <MDBox textAlign="center" py={5}>
                    <Icon color="text" fontSize="large" sx={{ mb: 1 }}>
                      inventory
                    </Icon>
                    <MDTypography variant="h5" color="text" fontWeight="regular">
                      No trade offers found
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      You haven't created any trade offers yet.
                    </MDTypography>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => window.location.href = "/trade-offers"}
                    >
                      Create Your First Trade
                    </MDButton>
                  </MDBox>
                ) : (
                  <Grid container spacing={3}>
                    {trades.map((trade) => (
                      <Grid item xs={12} md={6} lg={4} key={trade.id}>
                        <Card>
                          <MDBox p={3}>
                            <Grid container spacing={3} alignItems="center">
                              <Grid item xs={3}>
                                <MDBox
                                  variant="gradient"
                                  bgColor={getCropColor(trade.crop)}
                                  color="white"
                                  width="4rem"
                                  height="4rem"
                                  borderRadius="xl"
                                  display="flex"
                                  justifyContent="center"
                                  alignItems="center"
                                  shadow="md"
                                >
                                  <Icon fontSize="large">grass</Icon>
                                </MDBox>
                              </Grid>
                              <Grid item xs={9}>
                                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                                  <MDTypography variant="h5" fontWeight="bold">
                                    {trade.crop.charAt(0).toUpperCase() + trade.crop.slice(1)}
                                  </MDTypography>
                                  <MDBox>
                                    <MDTypography
                                      variant="caption"
                                      fontWeight="bold"
                                      color={trade.status === "active" ? "success" : "error"}
                                      textTransform="uppercase"
                                      px={1.5}
                                      py={0.5}
                                      borderRadius="5px"
                                      bgcolor={trade.status === "active" ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)"}
                                    >
                                      {trade.status}
                                    </MDTypography>
                                  </MDBox>
                                </MDBox>
                                <MDTypography variant="button" color="text" fontWeight="medium">
                                  Grade {trade.grade} • {trade.quantity} units
                                </MDTypography>
                              </Grid>
                            </Grid>
                            
                            <Divider sx={{ my: 2.5 }} />
                            
                            <Grid container spacing={3}>
                              <Grid item xs={6}>
                                <MDTypography variant="caption" color="text" fontWeight="bold">
                                  PRICE PER UNIT
                                </MDTypography>
                                <MDTypography variant="h6" fontWeight="bold" display="flex" alignItems="center">
                                  ₹{trade.price}
                                  <Icon fontSize="small" sx={{ ml: 0.5 }}>currency_rupee</Icon>
                                </MDTypography>
                              </Grid>
                              <Grid item xs={6}>
                                <MDTypography variant="caption" color="text" fontWeight="bold">
                                  TOTAL VALUE
                                </MDTypography>
                                <MDTypography variant="h6" fontWeight="bold" display="flex" alignItems="center">
                                  ₹{(parseFloat(trade.price) * parseFloat(trade.quantity)).toLocaleString()}
                                  <Icon fontSize="small" sx={{ ml: 0.5 }}>currency_rupee</Icon>
                                </MDTypography>
                              </Grid>
                            </Grid>
                            
                            <Grid container spacing={3} mt={1}>
                              <Grid item xs={6}>
                                <MDTypography variant="caption" color="text" fontWeight="bold">
                                  CREATED ON
                                </MDTypography>
                                <MDBox>
                                  <MDTypography variant="button" fontWeight="medium" display="block">
                                    {formatDate(trade.createdAt)}
                                  </MDTypography>
                                </MDBox>
                              </Grid>
                              <Grid item xs={6}>
                                <MDTypography variant="caption" color="text" fontWeight="bold">
                                  VALID UNTIL
                                </MDTypography>
                                <MDBox>
                                  <MDTypography variant="button" fontWeight="medium" display="block">
                                    {formatDate(trade.valid_till)}
                                  </MDTypography>
                                </MDBox>
                              </Grid>
                            </Grid>
                            
                            <MDBox 
                              mt={2.5} 
                              display="flex" 
                              justifyContent="space-between" 
                              alignItems="center"
                              bgcolor={getDaysRemaining(trade.valid_till) < 5 ? "rgba(244, 67, 54, 0.1)" : "rgba(76, 175, 80, 0.1)"}
                              borderRadius="lg"
                              p={1.5}
                            >
                              <MDTypography 
                                variant="button" 
                                fontWeight="bold"
                                color={getDaysRemaining(trade.valid_till) < 5 ? "error" : "success"}
                              >
                                {getDaysRemaining(trade.valid_till)} days remaining
                              </MDTypography>
                              <MDBox>
                                <Tooltip title="Edit Trade" placement="top">
                                  <MDButton variant="text" color="info" size="small" iconOnly sx={{ mr: 1 }}>
                                    <Icon>edit</Icon>
                                  </MDButton>
                                </Tooltip>
                                <Tooltip title="Cancel Trade" placement="top">
                                  <MDButton variant="text" color="error" size="small" iconOnly>
                                    <Icon>delete</Icon>
                                  </MDButton>
                                </Tooltip>
                              </MDBox>
                            </MDBox>
                          </MDBox>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
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

export default ViewTrades; 
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API service
import api from "services/api";

function OnboardBuyers() {
  const [formData, setFormData] = useState({
    name: "",
    credit_limit: "",
    available_credit: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    // Validate form
    if (!formData.name || !formData.credit_limit || !formData.available_credit) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await api.post("/financer/buyers", {
        name: formData.name,
        credit_limit: formData.credit_limit,
        available_credit: formData.available_credit
      });
      setSuccess("Buyer onboarded successfully!");
      // Reset form
      setFormData({
        name: "",
        credit_limit: "",
        available_credit: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to onboard buyer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
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
              >
                <MDTypography variant="h6" color="white">
                  Onboard New Buyer
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                {error && (
                  <MDBox mb={2}>
                    <MDAlert color="error" dismissible>
                      {error}
                    </MDAlert>
                  </MDBox>
                )}
                {success && (
                  <MDBox mb={2}>
                    <MDAlert color="success" dismissible>
                      {success}
                    </MDAlert>
                  </MDBox>
                )}
                <MDBox component="form" role="form" onSubmit={handleSubmit}>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Buyer Name *"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="standard"
                      fullWidth
                      placeholder="Enter buyer's full name"
                      InputProps={{
                        startAdornment: (
                          <Icon position="start" sx={{ mr: 1, color: "text.secondary" }}>
                            person
                          </Icon>
                        ),
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="Credit Limit *"
                      name="credit_limit"
                      value={formData.credit_limit}
                      onChange={handleChange}
                      variant="standard"
                      fullWidth
                      placeholder="Enter credit limit"
                      InputProps={{
                        startAdornment: (
                          <Icon position="start" sx={{ mr: 1, color: "text.secondary" }}>
                            attach_money
                          </Icon>
                        ),
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="number"
                      label="Available Credit *"
                      name="available_credit"
                      value={formData.available_credit}
                      onChange={handleChange}
                      variant="standard"
                      fullWidth
                      placeholder="Enter available credit"
                      InputProps={{
                        startAdornment: (
                          <Icon position="start" sx={{ mr: 1, color: "text.secondary" }}>
                            credit_card
                          </Icon>
                        ),
                      }}
                    />
                  </MDBox>
                  <MDBox mt={6} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      type="submit"
                      disabled={isLoading}
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        py: 1.5
                      }}
                    >
                      {isLoading ? "ONBOARDING..." : "ONBOARD BUYER"}
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default OnboardBuyers; 
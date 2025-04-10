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

function OnboardSupplier() {
  const [formData, setFormData] = useState({
    firm_name: "",
    phone: "",
    address: ""
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
    if (!formData.firm_name || !formData.phone || !formData.address) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await api.post("/broker/supplier", {
        firm_name: formData.firm_name,
        phone: formData.phone,
        address: formData.address
      });
      setSuccess("Supplier onboarded successfully!");
      // Reset form
      setFormData({
        firm_name: "",
        phone: "",
        address: ""
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to onboard supplier");
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
                  Onboard New Supplier
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
                      label="Supplier Name *"
                      name="firm_name"
                      value={formData.firm_name}
                      onChange={handleChange}
                      variant="standard"
                      fullWidth
                      placeholder="Enter supplier's full name"
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
                      type="tel"
                      label="Phone Number *"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="standard"
                      fullWidth
                      placeholder="10-digit mobile number"
                      InputProps={{
                        startAdornment: (
                          <Icon position="start" sx={{ mr: 1, color: "text.secondary" }}>
                            phone
                          </Icon>
                        ),
                      }}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="text"
                      label="Address *"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      variant="standard"
                      fullWidth
                      multiline
                      rows={1}
                      placeholder="Enter Complete Address"
                      InputProps={{
                        startAdornment: (
                          <Icon position="start" sx={{ mr: 1, color: "text.secondary", alignSelf: "flex-start", mt: 0.5 }}>
                            location_on
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
                      {isLoading ? "ONBOARDING..." : "ONBOARD SUPPLIER"}
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

export default OnboardSupplier; 
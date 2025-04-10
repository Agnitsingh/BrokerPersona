import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API service
import api from "services/api";

function TradeOffers() {
  const [formData, setFormData] = useState({
    crop: "",
    grade: "",
    price: "",
    quantity: "",
    valid_till: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const cropOptions = [
    { value: "wheat", label: "Wheat" },
    { value: "rice", label: "Rice" },
    { value: "corn", label: "Corn" },
    { value: "barley", label: "Barley" },
    { value: "soybean", label: "Soybean" }
  ];
  
  const gradeOptions = [
    { value: "A", label: "Grade A" },
    { value: "B", label: "Grade B" },
    { value: "C", label: "Grade C" }
  ];
  
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
    if (!formData.crop || !formData.grade || !formData.price || !formData.quantity || !formData.valid_till) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await api.post("/broker/trade", formData);
      setSuccess("Trade offer created successfully! View all your trades in the View Trades section.");
      // Reset form
      setFormData({
        crop: "",
        grade: "",
        price: "",
        quantity: "",
        valid_till: null
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create trade offer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
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
                  Create Trade Offer
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={3} px={3}>
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
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDInput
                          select
                          label="Crop *"
                          name="crop"
                          value={formData.crop}
                          onChange={handleChange}
                          variant="standard"
                          fullWidth
                        >
                          {cropOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </MDInput>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDInput
                          select
                          label="Grade *"
                          name="grade"
                          value={formData.grade}
                          onChange={handleChange}
                          variant="standard"
                          fullWidth
                        >
                          {gradeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </MDInput>
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDInput
                          type="number"
                          label="Price (per unit) *"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          variant="standard"
                          fullWidth
                          inputProps={{ min: 0, step: 0.01 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <MDBox mb={2}>
                        <MDInput
                          type="number"
                          label="Quantity *"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          variant="standard"
                          fullWidth
                          inputProps={{ min: 1 }}
                        />
                      </MDBox>
                    </Grid>
                    <Grid item xs={12}>
                      <MDBox mb={2}>
                        <MDInput
                          type="date"
                          label="Valid Until *"
                          name="valid_till"
                          value={formData.valid_till ? formData.valid_till.toISOString().split('T')[0] : ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : null;
                            setFormData({
                              ...formData,
                              valid_till: date
                            });
                          }}
                          variant="standard"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      </MDBox>
                    </Grid>
                  </Grid>
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "CREATING..." : "CREATE TRADE OFFER"}
                    </MDButton>
                  </MDBox>
                  <MDBox textAlign="center" mt={3}>
                    <MDTypography variant="button" color="text">
                      Want to see your existing trades? 
                      <MDTypography
                        component="a"
                        href="/view-trades"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                        sx={{ ml: 1 }}
                      >
                        View Trades
                      </MDTypography>
                    </MDTypography>
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

export default TradeOffers; 
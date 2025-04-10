/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// Custom hooks
import { useAuth } from "hooks/useAuth";

function Cover() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeTerms: false
  });
  
  const [formError, setFormError] = useState("");

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "agreeTerms" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !role) {
      setFormError("All fields are required");
      return;
    }
    
    if (!formData.agreeTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }
    
    // Prepare data for API
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role
    };

    
    // Call register function from our hook
    const result = await register(userData);
    
    if (result.success) {
      // Redirect to dashboard on success
      navigate("/dashboard");
    } else {
      // Display error message
      setFormError(result.error);
    }
  };

  return (
    <CoverLayout image={bgImage} title="Join BrokerBridge" description="Enter your details to register">
      <Card>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {(formError || error) && (
              <MDBox mb={2}>
                <MDAlert color="error" dismissible>
                  {formError || error}
                </MDAlert>
              </MDBox>
            )}
            
            <MDBox mb={2}>
              <MDInput 
                type="text" 
                label="Name" 
                variant="standard" 
                fullWidth 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput 
                type="email" 
                label="Email" 
                variant="standard" 
                fullWidth 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput 
                type="password" 
                label="Password" 
                variant="standard" 
                fullWidth 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </MDBox>
            <MDBox mb={4}>
              <MDInput
                select
                label="Role"
                variant="standard"
                fullWidth
                value={role}
                onChange={handleRoleChange}
                required
                placeholder="Select a role"
              >
                <MenuItem value="broker">Broker</MenuItem>
                <MenuItem value="financer">Financer</MenuItem>
              </MDInput>
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox 
                checked={formData.agreeTerms}
                onChange={handleChange}
                name="agreeTerms"
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton 
                variant="gradient" 
                color="info" 
                fullWidth
                type="submit"
                disabled={isLoading || !formData.agreeTerms}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;

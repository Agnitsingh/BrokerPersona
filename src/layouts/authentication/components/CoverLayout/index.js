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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import PageLayout from "examples/LayoutContainers/PageLayout";

// Authentication layout components
import Footer from "examples/Footer";

function CoverLayout({ image, title, description, children }) {
  return (
    <PageLayout>
      <DefaultNavbar
        action={{
          type: "internal",
          route: "/authentication/sign-in",
          label: "Sign In",
          color: "dark",
        }}
      />
      <MDBox
        width="calc(100% - 2rem)"
        minHeight="50vh"
        borderRadius="lg"
        mx={2}
        my={2}
        pt={6}
        pb={28}
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            image &&
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Grid container spacing={3} justifyContent="center" sx={{ textAlign: "center" }}>
          <Grid item xs={10} lg={4}>
            <MDBox mt={6} mb={1}>
              <MDTypography variant="h1" color="white" fontWeight="bold">
                {title}
              </MDTypography>
            </MDBox>
            <MDBox mb={2}>
              <MDTypography variant="body2" color="white" fontWeight="regular">
                {description}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={{ xs: -28, lg: -26 }} px={1} width="calc(100% - 2rem)" mx="auto">
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mt={4}>
        <Footer />
      </MDBox>
    </PageLayout>
  );
}

// Setting default values for the props of CoverLayout
CoverLayout.defaultProps = {
  title: "",
  description: "",
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;

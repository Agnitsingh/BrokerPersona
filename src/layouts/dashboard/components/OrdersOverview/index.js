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

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

function OrdersOverview() {
  return (
    <MDBox>
      <MDTypography variant="h6" color="text">
        Recent Trade Activity
      </MDTypography>
      <MDBox mt={2}>
        <TimelineItem
          color="success"
          icon="inventory_2"
          title="Wheat trade offer accepted"
          dateTime="Just now"
          description="Supplier Ramesh Kumar accepted your offer for 25 tons of wheat at ₹2,450/ton"
        />
        <TimelineItem
          color="error"
          icon="inventory_2"
          title="Rice trade offer declined"
          dateTime="2 days ago"
          description="Supplier Suresh Patel declined your offer for 15 tons of rice at ₹3,200/ton"
        />
        <TimelineItem
          color="info"
          icon="shopping_cart"
          title="New trade offer created"
          dateTime="3 days ago"
          description="You created a new trade offer for 30 tons of corn at ₹1,950/ton"
        />
        <TimelineItem
          color="warning"
          icon="payment"
          title="Payment processed"
          dateTime="1 week ago"
          description="Payment of ₹61,250 processed for wheat delivery from Ramesh Kumar"
        />
        <TimelineItem
          color="primary"
          icon="person_add"
          title="New supplier onboarded"
          dateTime="1 week ago"
          description="You added Suresh Patel as a new supplier for rice and wheat"
        />
      </MDBox>
    </MDBox>
  );
}

export default OrdersOverview;

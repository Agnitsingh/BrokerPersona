/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
import Tooltip from "@mui/material/Tooltip";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";
import { useState, useEffect } from 'react';
import api from "services/api";

// Images
import logoXD from "assets/images/small-logos/logo-xd.svg";
import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoJira from "assets/images/small-logos/logo-jira.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";

export default function data() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/broker/invoiceslist/details');
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const avatars = (members) =>
    members.map(([image, name]) => (
      <Tooltip key={name} title={name} placeholder="bottom">
        <MDAvatar
          src={image}
          alt="name"
          size="xs"
          sx={{
            border: ({ borders: { borderWidth }, palette: { white } }) =>
              `${borderWidth[2]} solid ${white.main}`,
            cursor: "pointer",
            position: "relative",

            "&:not(:first-of-type)": {
              ml: -1.25,
            },

            "&:hover, &:focus": {
              zIndex: "10",
            },
          }}
        />
      </Tooltip>
    ));

  const Company = ({ image, name, address }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={1}>
        <MDTypography variant="button" fontWeight="medium" lineHeight={1}>
          {name}
        </MDTypography>
        <MDTypography variant="caption" color="text">
          {address}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  // Get a random logo for each supplier
  const getRandomLogo = () => {
    const logos = [logoXD, logoAtlassian, logoSlack, logoSpotify, logoJira];
    return logos[Math.floor(Math.random() * logos.length)];
  };

  // Calculate status based on created_at date
  const calculateStatus = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const daysDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) return { value: 25, color: "info" };
    if (daysDiff <= 3) return { value: 50, color: "info" };
    if (daysDiff <= 5) return { value: 75, color: "info" };
    return { value: 100, color: "success" };
  };

  return {
    columns: [
      { Header: "Supplier", accessor: "supplier", width: "35%", align: "left" },
      { Header: "Invoice No", accessor: "invoice_no", width: "15%", align: "left" },
      { Header: "Total Amount", accessor: "total_amount", align: "center" },
      { Header: "Commission", accessor: "commission", align: "center" },
      { Header: "Commission Status", accessor: "commission_status", align: "center" },
      { Header: "Status", accessor: "status", align: "center" },
    ],

    rows: invoices.map(invoice => {
      const commission = invoice.total_amount * 0.05;
      const isReceived = Math.random() < 0.5; // This should come from API, using random for demo

      return {
        supplier: (
          <Company
            image={getRandomLogo()}
            name={invoice.supplier.name}
            address={invoice.supplier.address}
          />
        ),
        invoice_no: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            {invoice.invoice_number}
          </MDTypography>
        ),
        total_amount: (
          <MDTypography variant="caption" color="text" fontWeight="medium">
            ₹{invoice.total_amount.toLocaleString('en-IN')}
          </MDTypography>
        ),
        commission: (
          <MDTypography
            variant="caption"
            color={isReceived ? "success" : "text"}
            fontWeight="medium"
          >
            ₹{commission.toLocaleString('en-IN')}
          </MDTypography>
        ),
        commission_status: (
          <MDBox>
            <MDTypography
              variant="caption"
              color={isReceived ? "success" : "error"}
              fontWeight="medium"
              sx={{
                backgroundColor: isReceived ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
                padding: "4px 8px",
                borderRadius: "4px",
                display: "inline-block"
              }}
            >
              {isReceived ? "RECEIVED" : "DUE"}
            </MDTypography>
          </MDBox>
        ),
        status: (
          <MDBox width="8rem" textAlign="left">
            <MDProgress
              value={calculateStatus(invoice.created_at).value}
              color={calculateStatus(invoice.created_at).color}
              variant="gradient"
              label={false}
            />
          </MDBox>
        ),
      };
    }),
    loading,
  };
}

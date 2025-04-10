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

import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API service
import api from "services/api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  
  // Buyers dropdown
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [buyersLoading, setBuyersLoading] = useState(false);
  
  // Form fields
  const [shipTo, setShipTo] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const userRole = localStorage.getItem("userRole");
        let endpoint = "";
        
        // Determine the correct endpoint based on user role
        if (userRole === "broker") {
          endpoint = "/broker/logs/accepted-trades";
        }
        
        const response = await api.get(endpoint);
        setNotifications(response.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleOpenModal = async (notification) => {
    setSelectedNotification(notification);
    setOpenModal(true);
    setInvoiceLoading(true);
    setInvoiceError("");
    
    try {
      // Fetch invoice data
      const response = await api.get(`/broker/invoice/suppliers/${notification.id}`);
      setInvoiceData(response.data.invoice);
      
      // Fetch buyers list
      setBuyersLoading(true);
      const buyersResponse = await api.get('/financer/buyers/all');
      setBuyers(buyersResponse.data);
      setBuyersLoading(false);
    } catch (err) {
      console.error("Error fetching invoice data:", err);
      setInvoiceError("Failed to load invoice data. Please try again later.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedNotification(null);
    setInvoiceData(null);
    setSelectedBuyer("");
    setShipTo("");
  };

  const handleSubmitInvoice = async () => {
    try {
      // Set loading state if needed
      setInvoiceLoading(true);
      
      // Find the selected buyer details
      const selectedBuyerDetails = buyers.find(buyer => buyer.id === selectedBuyer);
      
      // Format the data for the API
      const invoicePayload = {
        bill_from: invoiceData.bill_from,
        ship_from: invoiceData.ship_from,
        ship_to: shipTo,
        bill_to: selectedBuyerDetails ? selectedBuyerDetails.name : "",
        items: [
          {
            crop: invoiceData.items?.[0]?.crop || "Wheat", // Default to Wheat if not available
            price: invoiceData.items?.[0]?.price || invoiceData.total_amount / invoiceData.items?.[0]?.quantity,
            quantity: invoiceData.items?.[0]?.quantity,
            total_amount: invoiceData.items?.[0]?.total_amount || invoiceData.total_amount
          }
        ],
        order_id: invoiceData.order_id,
        total_amount: invoiceData.total_amount,
        tax_amount: invoiceData.tax_amount || 0,
        shipping_charges: invoiceData.shipping_charges || 0,
        final_amount: invoiceData.final_amount,
        po_number: invoiceData.po_number || "",
        broker_id: invoiceData.broker_id,
        invoice_number: invoiceData.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
      };
      
      // Make the API call
      const response = await api.post('/broker/invoice/dummy', invoicePayload);
      
      // Handle success
      console.log("Invoice generated successfully:", response.data);
      
      // Show success message
      // You can add a snackbar or alert here
      
      // Close the modal
      handleCloseModal();
      
    } catch (error) {
      // Handle error
      console.error("Error generating invoice:", error);
      setInvoiceError("Failed to generate invoice. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: 800,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflow: 'auto'
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Alerts</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {isLoading ? (
                  <MDTypography variant="body2" color="text">
                    Loading notifications...
                  </MDTypography>
                ) : error ? (
                  <MDAlert color="error">
                    {error}
                  </MDAlert>
                ) : notifications.length === 0 ? (
                  <MDTypography variant="body2" color="text">
                    No notifications found.
                  </MDTypography>
                ) : (
                  notifications.map((notification) => (
                    <MDAlert
                      key={notification.id}
                      color="success"
                      dismissible
                      sx={{ mb: 2, cursor: 'pointer' }}
                      onClick={() => handleOpenModal(notification)}
                    >
                      <MDTypography variant="body2" fontWeight="medium">
                        {notification.message}
                      </MDTypography>
                    </MDAlert>
                  ))
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      
      {/* Invoice Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="invoice-modal-title"
        aria-describedby="invoice-modal-description"
      >
        <Box sx={modalStyle}>
          <MDTypography id="invoice-modal-title" variant="h6" component="h2" mb={3}>
            Generate Invoice
          </MDTypography>
          
          {invoiceLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : invoiceError ? (
            <MDAlert color="error" mb={3}>
              {invoiceError}
            </MDAlert>
          ) : invoiceData && (
            <Grid container spacing={3}>
              {/* Bill From */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Bill From"
                  fullWidth
                  value={invoiceData.bill_from || ""}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              {/* Ship From */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ship From"
                  fullWidth
                  value={invoiceData.ship_from || ""}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              {/* Ship To */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Ship To"
                  fullWidth
                  value={shipTo}
                  onChange={(e) => setShipTo(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                    }
                  }}
                />
              </Grid>
              
              {/* Bill To (Dropdown) */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel id="buyer-select-label">Bill To</InputLabel>
                  <Select
                    labelId="buyer-select-label"
                    id="buyer-select"
                    value={selectedBuyer}
                    onChange={(e) => setSelectedBuyer(e.target.value)}
                    label="Bill To"
                    disabled={buyersLoading}
                    sx={{ 
                      height: '56px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.87)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a buyer</em>
                    </MenuItem>
                    {buyers.map((buyer) => (
                      <MenuItem key={buyer.id} value={buyer.id}>
                        {buyer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Quantity"
                  fullWidth
                  value={invoiceData.items?.[0]?.quantity || ""}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                    }
                  }}
                />
              </Grid>
              
              {/* Total Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Total Amount"
                  fullWidth
                  value={invoiceData.total_amount || ""}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      height: '56px',
                    }
                  }}
                />
              </Grid>
              
              {/* Tax Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tax Amount"
                  fullWidth
                  value={invoiceData.tax_amount || "0"}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              {/* Shipping Charges */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Shipping Charges"
                  fullWidth
                  value={invoiceData.shipping_charges || "0"}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              {/* Final Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Final Amount"
                  fullWidth
                  value={invoiceData.final_amount || ""}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              {/* PO Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="PO Number"
                  fullWidth
                  value={invoiceData.po_number || ""}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              
              {/* Action Buttons */}
              <Grid item xs={12} display="flex" justifyContent="flex-end" mt={2}>
                <MDButton 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCloseModal}
                  sx={{ mr: 2 }}
                >
                  Cancel
                </MDButton>
                <MDButton 
                  variant="contained" 
                  color="info" 
                  onClick={handleSubmitInvoice}
                  disabled={!selectedBuyer}
                >
                  Generate Invoice
                </MDButton>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>
      
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";

export default function SignUp() {
  const [role, setRole] = useState("individual");
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", { role, ...form });
    // send data to backend API here
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, bgcolor: "#121821", color: "#e6eef7", borderRadius: 2 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}>
          Create your account
        </Typography>

        {/* Tabs to toggle between Individual / Business */}
        <Tabs
          value={role}
          onChange={(e, newValue) => setRole(newValue)}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#2a8cff" } }}
          centered
          sx={{ mb: 3 }}
        >
          <Tab value="individual" label="Individual" />
          <Tab value="business" label="Business" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {role === "individual" && (
              <>
                <TextField
                  label="Full Name"
                  name="fullName"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}

            {role === "business" && (
              <>
                <TextField
                  label="Company Name"
                  name="companyName"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Company Email"
                  name="companyEmail"
                  type="email"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Contact Person"
                  name="contactName"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Role / Title"
                  name="roleTitle"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                bgcolor: "#2a8cff",
                fontWeight: 700,
                "&:hover": { bgcolor: "#3c97ff" },
              }}
            >
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

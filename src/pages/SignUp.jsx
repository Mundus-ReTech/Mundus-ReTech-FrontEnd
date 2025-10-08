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
  MenuItem,
  Divider,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

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

  // Shared TextField style for white text on dark bg
  const whiteInput = {
    "& .MuiInputBase-root": {
      color: "white",
      bgcolor: "rgba(255,255,255,0.05)",
      borderRadius: 1.5,
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#2a8cff" },
    },
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: "#121821",
          color: "#e6eef7",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
            textAlign: "center",
            color: "#fff",
          }}
        >
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

        {/* Form */}
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
                  sx={whiteInput}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
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
                  sx={whiteInput}
                />
                <TextField
                  label="Company Email"
                  name="companyEmail"
                  type="email"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
                />
                <TextField
                  label="Contact Person"
                  name="contactName"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
                />
                <TextField
                  label="Role / Title"
                  name="roleTitle"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
                />

                {/* New: Business Classification */}
                <TextField
                  select
                  label="Business Classification"
                  name="businessSize"
                  value={form.businessSize || ""}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
                >
                  <MenuItem value="small">Small Business</MenuItem>
                  <MenuItem value="medium">Medium Enterprise</MenuItem>
                  <MenuItem value="large">Large Corporation</MenuItem>
                </TextField>

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={whiteInput}
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

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }}>
              or
            </Divider>

            {/* ID.me Login Button */}
            <Button
              variant="outlined"
              startIcon={<VerifiedUserIcon />}
              fullWidth
              sx={{
                borderColor: "#00c26d",
                color: "#00c26d",
                fontWeight: 700,
                py: 1.2,
                "&:hover": {
                  bgcolor: "rgba(0,194,109,0.1)",
                  borderColor: "#00d67a",
                },
              }}
              onClick={() => {
                window.location.href = "https://www.id.me"; // Replace with your ID.me redirect URL
              }}
            >
              Sign up / Log in with ID.me
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

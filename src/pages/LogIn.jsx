import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Link,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login data:", form);
    // send login data to backend API here
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, bgcolor: "#121821", color: "#e6eef7", borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}
        >
          Log in to your account
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
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
              Log In
            </Button>
          </Stack>
        </Box>

        {/* Links below form */}
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ mt: 2 }}
        >
          <Link component={NavLink} to="/forgot-password" color="#a9d4ff">
            Forgot password?
          </Link>
          <Link component={NavLink} to="/signup" color="#a9d4ff">
            Don’t have an account? Sign Up
          </Link>
        </Stack>
      </Paper>
    </Container>
  );
}

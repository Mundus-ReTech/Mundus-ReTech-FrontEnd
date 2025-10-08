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
  Divider,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

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

  // shared style for white text inputs
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
        sx={{ p: 4, bgcolor: "#121821", color: "#e6eef7", borderRadius: 2 }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 3, textAlign: "center", color: "#fff" }}
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

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }}>
              or
            </Divider>

            {/* ID.me Button */}
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
                window.location.href = "https://www.id.me"; // Replace with your actual OAuth redirect
              }}
            >
              Log in with ID.me
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

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
  Alert,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import api from "../lib/http";

const LOGIN_URL = "http://localhost:8080/v1/login";

const TOKEN_KEY = "token";          // store accessToken here
const REFRESH_TOKEN_KEY = "refreshToken";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);

      const loginRes = await api.post(LOGIN_URL, {
        email: form.email.trim(),
        password: form.password,
      });

      // ✅ FIX: your API returns accessToken / refreshToken
      const accessToken = loginRes?.data?.accessToken;
      const refreshToken = loginRes?.data?.refreshToken;
      const user = loginRes?.data?.user;

      if (!accessToken) {
        throw new Error("Login succeeded but no accessToken was returned.");
      }

      localStorage.setItem(TOKEN_KEY, accessToken);
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

      // ✅ store user basics for dashboard endpoints that need userId
      if (user) {

        localStorage.setItem("role", user.role || "");
        localStorage.setItem("email", user.email || form.email.trim());
        localStorage.setItem("name", user.fullName || user.name || "");
        localStorage.setItem("accessToken", loginRes.data.accessToken);
localStorage.setItem("refreshToken", loginRes.data.refreshToken);
localStorage.setItem("userId", loginRes.data.user?._id || loginRes.data.user?.id || "");
localStorage.setItem("user", JSON.stringify(loginRes.data.user || {}));

      }

      // Redirect after login (adjust based on role if you want)
      navigate("/dashboard/smb", { replace: true });

      // Force navbar refresh (simple + reliable)
      window.location.reload();
    } catch (e2) {
      console.error("Login failed:", e2);
      setError(
        e2?.response?.data?.message ||
          e2?.message ||
          "Invalid email or password."
      );
    } finally {
      setSubmitting(false);
    }
  };

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

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
              sx={whiteInput}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={whiteInput}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{
                mt: 2,
                bgcolor: "#2a8cff",
                fontWeight: 700,
                "&:hover": { bgcolor: "#3c97ff" },
              }}
            >
              {submitting ? "Logging in…" : "Log In"}
            </Button>

            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }}>
              or
            </Divider>

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
                window.location.href = "https://www.id.me";
              }}
            >
              Log in with ID.me
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
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

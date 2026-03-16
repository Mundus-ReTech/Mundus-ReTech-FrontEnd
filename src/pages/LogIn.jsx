import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import api from "../lib/http";

const LOGIN_URL = "http://localhost:8080/v1/login";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

      const accessToken = loginRes?.data?.accessToken;
      const refreshToken = loginRes?.data?.refreshToken;
      const user = loginRes?.data?.user;

      if (!accessToken) {
        throw new Error("Login succeeded but no accessToken was returned.");
      }

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      if (user) {
        localStorage.setItem("role", user.role || "");
        localStorage.setItem("email", user.email || form.email.trim());
        localStorage.setItem("name", user.fullName || user.name || "");
        localStorage.setItem("userId", user?._id || user?.id || "");
        localStorage.setItem("user", JSON.stringify(user || {}));
      }

      window.dispatchEvent(new Event("auth:updated"));

      navigate("/dashboard/smb", { replace: true });
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

  const inputSx = {
    "& .MuiInputBase-root": {
      borderRadius: 3,
      backgroundColor: brand.white,
      fontFamily: '"Semplicita Pro", sans-serif',
    },
    "& .MuiInputLabel-root": {
      color: brand.muted,
      fontFamily: '"Semplicita Pro", sans-serif',
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: brand.border,
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(brand.navy, 0.45),
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: brand.navy,
      borderWidth: "1px",
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: brand.grayBg,
        background: `radial-gradient(circle at top right, ${alpha(
          brand.green,
          0.08
        )} 0%, transparent 24%), radial-gradient(circle at left top, ${alpha(
          brand.navy,
          0.08
        )} 0%, transparent 30%), ${brand.grayBg}`,
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            borderRadius: 6,
            border: `1px solid ${brand.border}`,
            bgcolor: brand.white,
            boxShadow: "0 24px 60px rgba(30, 58, 95, 0.08)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: { xs: 3, md: 5 },
              pt: { xs: 3, md: 4 },
              pb: 2,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                bgcolor: alpha(brand.green, 0.08),
                border: `1px solid ${alpha(brand.green, 0.18)}`,
                color: brand.green,
                mb: 2.5,
              }}
            >
              <LoginRoundedIcon sx={{ fontSize: 18 }} />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Secure account access
              </Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: '"vvyPreston Display", serif',
                fontSize: { xs: 34, md: 46 },
                lineHeight: 1.05,
                color: brand.navy,
              }}
            >
              Log in to your account
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                color: brand.muted,
                fontSize: 16,
                lineHeight: 1.75,
                fontFamily: '"Semplicita Pro", sans-serif',
              }}
            >
              Access your ReTech account to manage listings, activity, and
              account settings.
            </Typography>
          </Box>

          <CardContent sx={{ px: { xs: 3, md: 5 }, pb: { xs: 3.5, md: 4 } }}>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 3,
                  alignItems: "center",
                }}
              >
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
                  sx={inputSx}
                />

                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  sx={inputSx}
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  sx={{
                    mt: 1,
                    bgcolor: brand.navy,
                    color: brand.white,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: 15,
                    boxShadow: "none",
                    fontFamily: '"Semplicita Pro", sans-serif',
                    "&:hover": {
                      bgcolor: "#16304F",
                      boxShadow: "none",
                    },
                  }}
                >
                  {submitting ? "Logging in..." : "Log In"}
                </Button>

                <Divider
                  sx={{
                    my: 1,
                    color: brand.muted,
                    "&::before, &::after": {
                      borderColor: brand.border,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      px: 1,
                      fontSize: 13,
                      color: brand.muted,
                      fontFamily: '"Semplicita Pro", sans-serif',
                    }}
                  >
                    or
                  </Typography>
                </Divider>

                <Button
                  variant="outlined"
                  startIcon={<VerifiedUserIcon />}
                  fullWidth
                  sx={{
                    borderColor: alpha(brand.green, 0.35),
                    color: brand.green,
                    py: 1.4,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    fontFamily: '"Semplicita Pro", sans-serif',
                    "&:hover": {
                      borderColor: brand.green,
                      bgcolor: alpha(brand.green, 0.04),
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={1.5}
              sx={{ mt: 3 }}
            >
              <Link
                component={NavLink}
                to="/forgot-password"
                underline="hover"
                sx={{
                  color: brand.navy,
                  fontWeight: 600,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Forgot password?
              </Link>

              <Link
                component={NavLink}
                to="/signup"
                underline="hover"
                sx={{
                  color: brand.navy,
                  fontWeight: 600,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Don’t have an account? Sign Up
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
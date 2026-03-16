import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PhoneIphoneRoundedIcon from "@mui/icons-material/PhoneIphoneRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";
import api from "../lib/http";

const SIGNUP_URL = "http://localhost:8080/v1/signup";
const MFA_START_URL = "http://localhost:8080/v1/mfa/sms/start";
const MFA_VERIFY_URL = "http://localhost:8080/v1/mfa/sms/verify";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form");
  const [role, setRole] = useState("individual");
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState(null);

  const [mfa, setMfa] = useState({
    phone: "",
    code: "",
    sid: "",
    sending: false,
    verifying: false,
    verified: false,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const email = useMemo(() => {
    return role === "business"
      ? form.companyEmail?.trim()
      : form.email?.trim();
  }, [role, form.companyEmail, form.email]);

  const buildPayload = () => {
    const base = {
      role,
      password: form.password,
      email,
      phone: mfa.phone || undefined,
      mfaVerified: true,
    };

    if (role === "individual") {
      return {
        ...base,
        fullName: form.fullName,
      };
    }

    return {
      ...base,
      companyName: form.companyName,
      contactName: form.contactName,
      roleTitle: form.roleTitle,
      businessSize: form.businessSize,
    };
  };

  const normalizePhone = (value) => String(value || "").trim();

  const sendMfaCode = async () => {
    const phone = normalizePhone(mfa.phone);

    if (!phone) {
      setServerMsg({ type: "error", text: "Enter a phone number first." });
      return;
    }

    try {
      setServerMsg(null);
      setMfa((prev) => ({ ...prev, sending: true }));

      const res = await api.post(MFA_START_URL, { phone });
      const sid = res?.data?.sid || res?.data?.verificationSid || "";

      setMfa((prev) => ({
        ...prev,
        sid,
        sending: false,
        verified: false,
      }));

      setServerMsg({ type: "success", text: "Verification code sent." });
    } catch (e) {
      console.error("MFA start failed:", e);
      setMfa((prev) => ({ ...prev, sending: false }));
      setServerMsg({
        type: "error",
        text:
          e?.response?.data?.message ||
          e?.response?.statusText ||
          e?.message ||
          "Could not send verification code.",
      });
    }
  };

  const completeSignup = async () => {
    const payload = buildPayload();

    try {
      setSubmitting(true);
      const res = await api.post(SIGNUP_URL, payload);
      const msg = res?.data?.message || "Account created. You can log in now.";
      setServerMsg({ type: "success", text: msg });
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Signup failed:", e);
      setServerMsg({
        type: "error",
        text:
          e?.response?.data?.message ||
          e?.response?.statusText ||
          e?.message ||
          "Signup failed.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const verifyMfaCode = async () => {
    const phone = normalizePhone(mfa.phone);
    const code = String(mfa.code || "").trim();

    if (!phone || !code) {
      setServerMsg({ type: "error", text: "Enter phone + code." });
      return;
    }

    try {
      setServerMsg(null);
      setMfa((prev) => ({ ...prev, verifying: true }));

      const res = await api.post(MFA_VERIFY_URL, {
        phone,
        code,
        sid: mfa.sid || undefined,
      });

      const ok =
        res?.data?.ok === true ||
        res?.data?.approved === true ||
        String(res?.data?.status || "").toLowerCase() === "approved";

      if (!ok) {
        throw new Error(res?.data?.message || "Invalid code.");
      }

      setMfa((prev) => ({
        ...prev,
        verifying: false,
        verified: true,
      }));

      setServerMsg({ type: "success", text: "Phone verified." });

      await completeSignup();
    } catch (e) {
      console.error("MFA verify failed:", e);
      setMfa((prev) => ({
        ...prev,
        verifying: false,
        verified: false,
      }));
      setServerMsg({
        type: "error",
        text:
          e?.response?.data?.message ||
          e?.message ||
          "Verification failed. Check the code and try again.",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerMsg(null);

    if (form.password !== form.confirmPassword) {
      setServerMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    if (!email) {
      setServerMsg({ type: "error", text: "Email is required." });
      return;
    }

    setStep("mfa");
  };

  const resetFlowForRole = (newRole) => {
    setRole(newRole);
    setForm({});
    setServerMsg(null);
    setStep("form");
    setMfa({
      phone: "",
      code: "",
      sid: "",
      sending: false,
      verifying: false,
      verified: false,
    });
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
        py: { xs: 6, md: 10 },
        display: "flex",
        alignItems: "center",
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
          <Box sx={{ px: { xs: 3, md: 5 }, pt: { xs: 3, md: 4 }, pb: 2 }}>
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
              {role === "individual" ? (
                <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <BusinessOutlinedIcon sx={{ fontSize: 18 }} />
              )}
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                {step === "form" ? "Account setup" : "SMS verification"}
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
              Create your account
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
              Set up your ReTech account to manage listings, business activity,
              and marketplace access.
            </Typography>
          </Box>

          <CardContent sx={{ px: { xs: 3, md: 5 }, pb: { xs: 3.5, md: 4 } }}>
            <Tabs
              value={role}
              onChange={(e, newValue) => resetFlowForRole(newValue)}
              variant="fullWidth"
              sx={{
                mb: 3,
                minHeight: 50,
                bgcolor: brand.grayBg,
                borderRadius: 3,
                p: 0.5,
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab
                value="individual"
                label="Individual"
                sx={{
                  minHeight: 44,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  fontFamily: '"Semplicita Pro", sans-serif',
                  color: brand.muted,
                  "&.Mui-selected": {
                    bgcolor: brand.white,
                    color: brand.navy,
                    boxShadow: "0 2px 10px rgba(30, 58, 95, 0.06)",
                  },
                }}
              />
              <Tab
                value="business"
                label="Business"
                sx={{
                  minHeight: 44,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  fontFamily: '"Semplicita Pro", sans-serif',
                  color: brand.muted,
                  "&.Mui-selected": {
                    bgcolor: brand.white,
                    color: brand.navy,
                    boxShadow: "0 2px 10px rgba(30, 58, 95, 0.06)",
                  },
                }}
              />
            </Tabs>

            {serverMsg && (
              <Alert
                severity={serverMsg.type}
                sx={{
                  mb: 2.5,
                  borderRadius: 3,
                }}
              >
                {serverMsg.text}
              </Alert>
            )}

            {step === "form" ? (
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  {role === "individual" && (
                    <>
                      <TextField
                        label="Full Name"
                        name="fullName"
                        value={form.fullName || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputSx}
                      />
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputSx}
                      />
                    </>
                  )}

                  {role === "business" && (
                    <>
                      <TextField
                        label="Company Name"
                        name="companyName"
                        value={form.companyName || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputSx}
                      />
                      <TextField
                        label="Company Email"
                        name="companyEmail"
                        type="email"
                        value={form.companyEmail || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputSx}
                      />
                      <TextField
                        label="Contact Person"
                        name="contactName"
                        value={form.contactName || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputSx}
                      />
                      <TextField
                        label="Role / Title"
                        name="roleTitle"
                        value={form.roleTitle || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputSx}
                      />
                      <TextField
                        select
                        label="Business Classification"
                        name="businessSize"
                        value={form.businessSize || ""}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputSx}
                      >
                        <MenuItem value="small">Small Business</MenuItem>
                        <MenuItem value="medium">Medium Enterprise</MenuItem>
                        <MenuItem value="large">Large Corporation</MenuItem>
                      </TextField>
                    </>
                  )}

                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={inputSx}
                  />

                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={form.confirmPassword || ""}
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
                    Continue to Verification
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
                    Sign up / Log in with ID.me
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 5,
                  border: `1px solid ${brand.border}`,
                  bgcolor: brand.grayBg,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1.5 }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          bgcolor: alpha(brand.green, 0.12),
                          color: brand.green,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <PhoneIphoneRoundedIcon fontSize="small" />
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: brand.navy,
                          fontFamily: '"Semplicita Pro", sans-serif',
                        }}
                      >
                        Phone verification
                      </Typography>
                    </Stack>

                    {mfa.verified ? (
                      <Chip
                        label="Verified"
                        size="small"
                        sx={{
                          bgcolor: alpha(brand.green, 0.12),
                          color: brand.green,
                          fontWeight: 700,
                        }}
                      />
                    ) : (
                      <Chip
                        label="Required"
                        size="small"
                        sx={{
                          bgcolor: brand.white,
                          color: brand.muted,
                          fontWeight: 700,
                          border: `1px solid ${brand.border}`,
                        }}
                      />
                    )}
                  </Stack>

                  <Typography
                    sx={{
                      color: brand.muted,
                      fontSize: 14,
                      lineHeight: 1.7,
                      mb: 2.5,
                      fontFamily: '"Semplicita Pro", sans-serif',
                    }}
                  >
                    Enter your phone number and we’ll text you a one-time code
                    to complete account creation.
                  </Typography>

                  <Stack spacing={1.75}>
                    <TextField
                      label="Phone number"
                      placeholder="+1 212 555 1212"
                      value={mfa.phone}
                      onChange={(e) =>
                        setMfa((prev) => ({
                          ...prev,
                          phone: e.target.value,
                          verified: false,
                        }))
                      }
                      fullWidth
                      required
                      sx={inputSx}
                    />

                    <Button
                      type="button"
                      variant="outlined"
                      disabled={mfa.sending || !mfa.phone}
                      onClick={sendMfaCode}
                      sx={{
                        borderColor: brand.border,
                        color: brand.navy,
                        py: 1.25,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 700,
                        fontFamily: '"Semplicita Pro", sans-serif',
                        "&:hover": {
                          borderColor: brand.navy,
                          bgcolor: alpha(brand.navy, 0.03),
                        },
                      }}
                    >
                      {mfa.sending ? "Sending..." : "Send code"}
                    </Button>

                    <TextField
                      label="Verification code"
                      value={mfa.code}
                      onChange={(e) =>
                        setMfa((prev) => ({ ...prev, code: e.target.value }))
                      }
                      fullWidth
                      sx={inputSx}
                    />

                    <Button
                      type="button"
                      variant="contained"
                      disabled={
                        submitting ||
                        mfa.verifying ||
                        !mfa.code ||
                        !mfa.phone
                      }
                      onClick={verifyMfaCode}
                      sx={{
                        bgcolor: brand.green,
                        color: brand.white,
                        py: 1.4,
                        borderRadius: 3,
                        textTransform: "none",
                        fontWeight: 800,
                        boxShadow: "none",
                        fontFamily: '"Semplicita Pro", sans-serif',
                        "&:hover": {
                          bgcolor: "#25692A",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {mfa.verifying || submitting
                        ? "Verifying & creating..."
                        : "Verify & create account"}
                    </Button>

                    <Button
                      type="button"
                      variant="text"
                      startIcon={<ArrowBackRoundedIcon />}
                      onClick={() => setStep("form")}
                      sx={{
                        color: brand.muted,
                        textTransform: "none",
                        fontWeight: 700,
                        alignSelf: "flex-start",
                        fontFamily: '"Semplicita Pro", sans-serif',
                        "&:hover": {
                          color: brand.navy,
                          bgcolor: "transparent",
                        },
                      }}
                    >
                      Back
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
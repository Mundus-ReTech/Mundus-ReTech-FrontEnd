import React, { useMemo, useState } from "react";
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
  Alert,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useNavigate } from "react-router-dom";
import api from "../lib/http";

/** ✅ adjust these to match your backend */

const SIGNUP_URL = "http://localhost:8080/v1/signup";

const MFA_START_URL = "http://localhost:8080/v1/mfa/sms/start";
const MFA_VERIFY_URL = "http://localhost:8080/v1/mfa/sms/verify";

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = useState("form"); // "form" | "mfa"
  const [role, setRole] = useState("individual");
  const [form, setForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverMsg, setServerMsg] = useState(null); // { type, text }

  // ✅ MFA state
  const [mfa, setMfa] = useState({
    phone: "",
    code: "",
    sid: "", // if your backend returns a verificationSid
    sending: false,
    verifying: false,
    verified: false,
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const email = useMemo(() => {
    return role === "business" ? form.companyEmail?.trim() : form.email?.trim();
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
      return { ...base, fullName: form.fullName };
    }

    return {
      ...base,
      companyName: form.companyName,
      contactName: form.contactName,
      roleTitle: form.roleTitle,
      businessSize: form.businessSize,
    };
  };

  const normalizePhone = (v) => String(v || "").trim();

  const sendMfaCode = async () => {
    const phone = normalizePhone(mfa.phone);

    if (!phone) {
      setServerMsg({ type: "error", text: "Enter a phone number first." });
      return;
    }

    try {
      setServerMsg(null);
      setMfa((p) => ({ ...p, sending: true }));

      // Backend should trigger Twilio Verify (or your own OTP) here
      const res = await api.post(MFA_START_URL, { phone });

      // If your backend returns something like { sid } or { verificationSid }
      const sid = res?.data?.sid || res?.data?.verificationSid || "";

      setMfa((p) => ({
        ...p,
        sid,
        sending: false,
        verified: false,
      }));

      setServerMsg({ type: "success", text: "Verification code sent." });
    } catch (e) {
      console.error("MFA start failed:", e);
      setMfa((p) => ({ ...p, sending: false }));
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
    } catch (e2) {
      console.error("Signup failed:", e2);
      setServerMsg({
        type: "error",
        text:
          e2?.response?.data?.message ||
          e2?.response?.statusText ||
          e2?.message ||
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
      setMfa((p) => ({ ...p, verifying: true }));

      // Backend should verify the code (Twilio Verify check) here
      const res = await api.post(MFA_VERIFY_URL, {
        phone,
        code,
        sid: mfa.sid || undefined,
      });

      // Accept either { ok: true } or { status: "approved" } etc.
      const ok =
        res?.data?.ok === true ||
        res?.data?.approved === true ||
        String(res?.data?.status || "").toLowerCase() === "approved";

      if (!ok) throw new Error(res?.data?.message || "Invalid code.");

      setMfa((p) => ({ ...p, verifying: false, verified: true }));
      setServerMsg({ type: "success", text: "Phone verified ✅" });

      // ✅ after MFA, finish signup
      await completeSignup();
    } catch (e) {
      console.error("MFA verify failed:", e);
      setMfa((p) => ({ ...p, verifying: false, verified: false }));
      setServerMsg({
        type: "error",
        text:
          e?.response?.data?.message ||
          e?.message ||
          "Verification failed. Check the code and try again.",
      });
    }
  };

  const handleSubmit = async (e) => {
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

    // ✅ move to MFA step (instead of signing up here)
    setStep("mfa");
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
      <Paper elevation={3} sx={{ p: 4, bgcolor: "#121821", color: "#e6eef7", borderRadius: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 3, textAlign: "center", color: "#fff" }}>
          Create your account
        </Typography>

        <Tabs
          value={role}
          onChange={(e, newValue) => {
            setRole(newValue);
            setForm({});
            setServerMsg(null);
            setStep("form");
            setMfa({ phone: "", code: "", sid: "", sending: false, verifying: false, verified: false });
          }}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#2a8cff" } }}
          centered
          sx={{ mb: 3 }}
        >
          <Tab value="individual" label="Individual" />
          <Tab value="business" label="Business" />
        </Tabs>

        {serverMsg && (
          <Alert
            severity={serverMsg.type}
            sx={{
              mb: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              color: "#e6eef7",
              "& .MuiAlert-icon": { color: "inherit" },
            }}
          >
            {serverMsg.text}
          </Alert>
        )}

        {/* ✅ TERNARY: FORM first, then MFA */}
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
                    sx={whiteInput}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email || ""}
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
                    value={form.companyName || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={whiteInput}
                  />
                  <TextField
                    label="Company Email"
                    name="companyEmail"
                    type="email"
                    value={form.companyEmail || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={whiteInput}
                  />
                  <TextField
                    label="Contact Person"
                    name="contactName"
                    value={form.contactName || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={whiteInput}
                  />
                  <TextField
                    label="Role / Title"
                    name="roleTitle"
                    value={form.roleTitle || ""}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={whiteInput}
                  />
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
                sx={whiteInput}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword || ""}
                onChange={handleChange}
                fullWidth
                required
                sx={whiteInput}
              />

              <Button
                type="submit"
                variant="contained"
                onClick={completeSignup}
                size="large"
                disabled={submitting}
                sx={{
                  mt: 2,
                  bgcolor: "#2a8cff",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#3c97ff" },
                }}
              >
                {'Signup'}
              </Button>

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }}>or</Divider>

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
                Sign up / Log in with ID.me
              </Button>
            </Stack>
          </Box>
        ) 
        
        :   (
          <Card
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.12)",
              bgcolor: "rgba(255,255,255,0.03)",
            }}
          >
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography sx={{ fontWeight: 800, color: "#fff" }}>Phone verification (SMS)</Typography>
                {mfa.verified ? (
                  <Chip label="Verified" size="small" sx={{ bgcolor: "rgba(0,194,109,0.2)", color: "#9ff3c6" }} />
                ) : (
                  <Chip label="Required" size="small" sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "#e6eef7" }} />
                )}
              </Stack>

              <Typography sx={{ color: "rgba(230,238,247,0.75)", fontSize: 13, mb: 2 }}>
                Enter your phone number and we’ll text you a one-time code.
              </Typography>

              <Stack spacing={1.5}>
                <TextField
                  label="Phone number"
                  placeholder="+1 212 555 1212"
                  value={mfa.phone}
                  onChange={(e) => setMfa((p) => ({ ...p, phone: e.target.value, verified: false }))}
                  fullWidth
                  required
                  sx={whiteInput}
                />

                <Button
                  type="button"
                  variant="outlined"
                  disabled={mfa.sending || !mfa.phone}
                  onClick={sendMfaCode}
                  sx={{
                    borderColor: "rgba(255,255,255,0.25)",
                    color: "#e6eef7",
                    fontWeight: 700,
                    "&:hover": { borderColor: "rgba(255,255,255,0.45)" },
                  }}
                >
                  {mfa.sending ? "Sending…" : "Send code"}
                </Button>

                <TextField
                  label="Verification code"
                  value={mfa.code}
                  onChange={(e) => setMfa((p) => ({ ...p, code: e.target.value }))}
                  fullWidth
                  sx={whiteInput}
                />

                <Button
                  type="button"
                  variant="contained"
                  disabled={submitting || mfa.verifying || !mfa.code || !mfa.phone}
                  onClick={verifyMfaCode}
                  sx={{
                    bgcolor: "#00c26d",
                    color: "#ffffffff",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#00d67a" },
                  }}
                >
                  {mfa.verifying || submitting ? "Verifying & creating…" : "Verify & create account"}
                </Button>

                <Button
                  type="button"
                  variant="text"
                  onClick={() => setStep("form")}
                  sx={{ color: "rgba(255,255,255,0.65)", fontWeight: 700 }}
                >
                  ← Back
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )
        
        }
      </Paper>
    </Container>
  );
}

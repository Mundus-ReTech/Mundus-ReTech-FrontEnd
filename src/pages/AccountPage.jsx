import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  TextField,
  Chip,
  Divider,
  Avatar,
  Link,
  Skeleton,
  Alert,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import api from "../lib/http";
import { Link as RouterLink, useNavigate } from "react-router-dom";

/**
 * ✅ With your current setup:
 * - Login returns the user object.
 * - Account page should load user from localStorage.
 * - DO NOT call /v1/login again from AccountPage.
 *
 * When you later add /v1/users/me or /v1/users/:id, plug it in here.
 */
const ORDERS_URL = `/v1/orders`;
const RESERVATIONS_URL = `/v1/reservations`;
const LISTING_BY_ID = (id) => `/v1/listings/${encodeURIComponent(id)}`;

// Optional: if you later add this, use it:
// const USER_ME_URL = "/v1/users/me";
// const USER_BY_ID = (id) => `/v1/users/${encodeURIComponent(id)}`;

export default function AccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // auth
  const token = localStorage.getItem("accessToken") || "";
  const userId =
    localStorage.getItem("userId") ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        return u?._id || u?.id || "";
      } catch {
        return "";
      }
    })();

  // user/profile
  const [userLoading, setUserLoading] = useState(true);
  const [userErr, setUserErr] = useState("");
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    _id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    address: { line1: "", city: "", state: "", zip: "" },
    favorites: [],
  });

  // Orders / Reservations / Favorites
  const [orders, setOrders] = useState({ loading: true, items: [] });
  const [reservations, setReservations] = useState({ loading: true, items: [] });
  const [favorites, setFavorites] = useState({ loading: true, items: [] });

  // attach auth header (if you aren’t already doing this in ../lib/http)
  useEffect(() => {
    if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
    else delete api.defaults.headers.common.Authorization;
  }, [token]);

  // ✅ load user FROM localStorage (because login already returned it)
  useEffect(() => {
    let mounted = true;

    const loadUserFromStorage = async () => {
      try {
        setUserErr("");

        if (!token || !userId) {
          setUserErr("Please log in to view your account.");
          setUserLoading(false);
          return;
        }

        setUserLoading(true);

        let storedUser = {};
        try {
          storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
          storedUser = {};
        }

        // If user isn't stored for some reason, at least show the id
        const data = storedUser && Object.keys(storedUser).length ? storedUser : { _id: userId };

        const normalized = {
          _id: data?._id || data?.id || userId,
          name: data?.name || data?.fullName || data?.contactName || "",
          email: data?.email || data?.companyEmail || "",
          phone: data?.phone || "",
          role: data?.role || "",
          address: {
            line1: data?.address?.line1 || data?.address?.street || "",
            city: data?.address?.city || "",
            state: data?.address?.state || "",
            zip: data?.address?.zip || data?.zipcode || "",
          },
          favorites: Array.isArray(data?.favorites) ? data.favorites : [],
        };

        if (!mounted) return;

        setProfile(normalized);
        setFavorites({ loading: false, items: normalized.favorites });
      } catch (e) {
        if (!mounted) return;
        setUserErr(e?.message || "Failed to load user from storage.");
      } finally {
        if (mounted) setUserLoading(false);
      }
    };

    loadUserFromStorage();
    return () => {
      mounted = false;
    };
  }, [token, userId]);

  // ✅ load orders + reservations (optional; safe if endpoints don’t exist yet)
  useEffect(() => {
    let mounted = true;

    if (!token || !userId) {
      setOrders({ loading: false, items: [] });
      setReservations({ loading: false, items: [] });
      return () => {};
    }

    (async () => {
      try {
        const { data } = await api.get(ORDERS_URL, { params: { userId } });
        if (!mounted) return;
        setOrders({ loading: false, items: data?.items || data?.orders || [] });
      } catch {
        if (!mounted) return;
        setOrders({ loading: false, items: [] });
      }
    })();

    (async () => {
      try {
        const { data } = await api.get(RESERVATIONS_URL, { params: { userId } });
        if (!mounted) return;
        setReservations({
          loading: false,
          items: data?.items || data?.reservations || [],
        });
      } catch {
        if (!mounted) return;
        setReservations({ loading: false, items: [] });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, userId]);

  const saveProfile = async () => {
    try {
      setSaving(true);
      setUserErr("");

      if (!token || !profile._id) {
        setUserErr("Missing auth/user id. Please log in again.");
        return;
      }

      /**
       * ✅ You DO NOT have a user-update endpoint wired here yet.
       * So we save locally so the UI works.
       *
       * When you add PATCH /v1/users/:id (or /v1/users/me),
       * replace this localStorage section with api.patch(...)
       */
      const storedUser = (() => {
        try {
          return JSON.parse(localStorage.getItem("user") || "{}");
        } catch {
          return {};
        }
      })();

      const updatedUser = {
        ...storedUser,
        _id: profile._id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        address: profile.address,
        favorites: profile.favorites,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile saved (local). Add a PATCH /v1/users/:id to persist to DB.");
    } catch (e) {
      setUserErr(e?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.06)", width: 48, height: 48 }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              My Account
            </Typography>
            <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
              Manage your profile, orders, reservations, and favorites.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={logout}
            sx={{ borderColor: "rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.88)" }}
          >
            Log out
          </Button>
        </Stack>

        {userErr && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              color: "#e6eef7",
              "& .MuiAlert-icon": { color: "inherit" },
            }}
          >
            {userErr}
          </Alert>
        )}

        <Card elevation={0} sx={quietCard}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              px: { xs: 1, md: 2 },
              "& .MuiTab-root": { color: "rgba(255,255,255,0.84)" },
              "& .Mui-selected": { color: "#e6eef7" },
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Overview" />
            <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="Orders" />
            <Tab icon={<ScheduleIcon />} iconPosition="start" label="Reservations" />
            <Tab icon={<FavoriteIcon />} iconPosition="start" label="Favorites" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
          </Tabs>

          {/* Overview */}
          {tab === 0 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={quietCardInner}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>
                        Profile
                      </Typography>

                      {userLoading ? (
                        <Grid container spacing={1.5}>
                          {[...Array(5)].map((_, i) => (
                            <Grid item xs={12} key={i}>
                              <Skeleton variant="rectangular" height={56} sx={{ ...skel, borderRadius: 2 }} />
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Grid container spacing={1.5}>
                          <Grid item xs={12}>
                            <TextField
                              label="Name"
                              fullWidth
                              value={profile.name}
                              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                              sx={textFieldStyle}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              label="Email"
                              fullWidth
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                              sx={textFieldStyle}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              label="Phone (MFA)"
                              fullWidth
                              value={profile.phone || ""}
                              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                              sx={textFieldStyle}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              label="Address line 1"
                              fullWidth
                              value={profile.address.line1}
                              onChange={(e) =>
                                setProfile({ ...profile, address: { ...profile.address, line1: e.target.value } })
                              }
                              sx={textFieldStyle}
                            />
                          </Grid>

                          <Grid item xs={6} md={4}>
                            <TextField
                              label="City"
                              fullWidth
                              value={profile.address.city}
                              onChange={(e) =>
                                setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })
                              }
                              sx={textFieldStyle}
                            />
                          </Grid>

                          <Grid item xs={3} md={4}>
                            <TextField
                              label="State"
                              fullWidth
                              value={profile.address.state}
                              onChange={(e) =>
                                setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })
                              }
                              sx={textFieldStyle}
                            />
                          </Grid>

                          <Grid item xs={3} md={4}>
                            <TextField
                              label="ZIP"
                              fullWidth
                              value={profile.address.zip}
                              onChange={(e) =>
                                setProfile({ ...profile, address: { ...profile.address, zip: e.target.value } })
                              }
                              sx={textFieldStyle}
                            />
                          </Grid>
                        </Grid>
                      )}

                      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={saveProfile}
                          disabled={userLoading || saving}
                          sx={{
                            bgcolor: "#e6eef7",
                            color: "#0b0f14",
                            fontWeight: 700,
                            "&:hover": { bgcolor: "#cfe0f4" },
                          }}
                        >
                          {saving ? "Saving…" : "Save changes"}
                        </Button>
                        <Button variant="text" sx={{ color: "rgba(255,255,255,0.88)" }}>
                          Change password
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={quietCardInner}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>
                        Membership & Trust
                      </Typography>

                      {userLoading ? (
                        <Stack spacing={1}>
                          <Skeleton variant="rectangular" height={36} sx={{ ...skel, borderRadius: 2 }} />
                          <Skeleton variant="rectangular" height={36} sx={{ ...skel, borderRadius: 2 }} />
                          <Skeleton variant="rectangular" height={36} sx={{ ...skel, borderRadius: 2 }} />
                        </Stack>
                      ) : (
                        <Stack spacing={1}>
                          <Chip icon={<VerifiedIcon />} label="Buyer protection active" sx={pill} />
                          <Chip label={profile.email ? "Email on file" : "Email missing"} sx={pill} />
                          <Chip
                            label={profile.phone ? "Phone on file (MFA ready)" : "Two-factor auth (recommended)"}
                            sx={profile.phone ? pill : pillGhost}
                          />
                          {profile.role ? <Chip label={`Role: ${profile.role}`} sx={pillGhost} /> : null}
                        </Stack>
                      )}

                      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
                      <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                        Manage security in{" "}
                        <Link component={RouterLink} to="/account/security" color="rgba(230,238,247,0.88)">
                          Settings
                        </Link>
                        .
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Keep the rest of your tabs as-is */}
        </Card>
      </Container>
    </Box>
  );
}

/* ——— Styles ——— */
const quietCard = {
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
};

const quietCardInner = { ...quietCard };

const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    color: "rgba(255, 255, 255, 1)",
  },
  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
};

const pill = {
  bgcolor: "transparent",
  border: "1px solid rgba(255,255,255,0.16)",
  color: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(4px)",
};

const pillGhost = {
  bgcolor: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.9)",
};

const skel = { bgcolor: "rgba(255,255,255,0.06)" };

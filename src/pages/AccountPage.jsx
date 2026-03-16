import React, { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import api from "../lib/http";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const ORDERS_URL = `/v1/orders`;
const RESERVATIONS_URL = `/v1/reservations`;
const LISTING_BY_ID = (id) => `/v1/listings/${encodeURIComponent(id)}`;

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

export default function AccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

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

  const [orders, setOrders] = useState({ loading: true, items: [] });
  const [reservations, setReservations] = useState({ loading: true, items: [] });
  const [favorites, setFavorites] = useState({ loading: true, items: [] });

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

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

        const data =
          storedUser && Object.keys(storedUser).length
            ? storedUser
            : { _id: userId };

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
      window.dispatchEvent(new Event("auth:updated"));
      alert("Profile saved locally. Add a PATCH /v1/users/:id to persist it to the database.");
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
    window.dispatchEvent(new Event("auth:updated"));
    navigate("/login", { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: brand.grayBg,
        color: brand.text,
        background: `radial-gradient(circle at top right, ${alpha(
          brand.green,
          0.06
        )} 0%, transparent 20%), radial-gradient(circle at left top, ${alpha(
          brand.navy,
          0.05
        )} 0%, transparent 28%), ${brand.grayBg}`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          sx={{ mb: 2.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: alpha(brand.navy, 0.08),
                color: brand.navy,
                border: `1px solid ${alpha(brand.navy, 0.12)}`,
              }}
            >
              <AccountCircleRoundedIcon />
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontFamily: '"vvyPreston Display", serif',
                  fontSize: { xs: 34, md: 48 },
                  lineHeight: 1.05,
                  color: brand.navy,
                }}
              >
                My Account
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  color: brand.muted,
                  fontSize: 16,
                  lineHeight: 1.7,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Manage your profile, orders, reservations, and favorites.
              </Typography>
            </Box>
          </Stack>

          <Button variant="outlined" onClick={logout} sx={secondaryButtonSx}>
            Log out
          </Button>
        </Stack>

        {userErr && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
            {userErr}
          </Alert>
        )}

        <Card elevation={0} sx={shellCardSx}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: { xs: 1.5, md: 2.5 },
              pt: 1.5,
              borderBottom: `1px solid ${brand.border}`,
              "& .MuiTabs-indicator": {
                backgroundColor: brand.navy,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: 56,
                color: brand.muted,
                fontWeight: 700,
                fontFamily: '"Semplicita Pro", sans-serif',
              },
              "& .Mui-selected": {
                color: brand.navy,
              },
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Overview" />
            <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="Orders" />
            <Tab icon={<ScheduleIcon />} iconPosition="start" label="Reservations" />
            <Tab icon={<FavoriteIcon />} iconPosition="start" label="Favorites" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Grid container spacing={2.25}>
                <Grid item xs={12} md={7}>
                  <Card elevation={0} sx={panelCardSx}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <SectionHeader
                        title="Profile"
                        subtitle="Update the account details currently stored for your session."
                      />

                      {userLoading ? (
                        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                          {[...Array(6)].map((_, i) => (
                            <Grid item xs={12} key={i}>
                              <Skeleton
                                variant="rectangular"
                                height={56}
                                sx={{ ...skeletonSx, borderRadius: 3 }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                          <Grid item xs={12}>
                            <TextField
                              label="Name"
                              fullWidth
                              value={profile.name}
                              onChange={(e) =>
                                setProfile({ ...profile, name: e.target.value })
                              }
                              sx={inputSx}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              label="Email"
                              fullWidth
                              type="email"
                              value={profile.email}
                              onChange={(e) =>
                                setProfile({ ...profile, email: e.target.value })
                              }
                              sx={inputSx}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              label="Phone"
                              fullWidth
                              value={profile.phone || ""}
                              onChange={(e) =>
                                setProfile({ ...profile, phone: e.target.value })
                              }
                              sx={inputSx}
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              label="Address line 1"
                              fullWidth
                              value={profile.address.line1}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  address: {
                                    ...profile.address,
                                    line1: e.target.value,
                                  },
                                })
                              }
                              sx={inputSx}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              label="City"
                              fullWidth
                              value={profile.address.city}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  address: {
                                    ...profile.address,
                                    city: e.target.value,
                                  },
                                })
                              }
                              sx={inputSx}
                            />
                          </Grid>

                          <Grid item xs={6} sm={3} md={4}>
                            <TextField
                              label="State"
                              fullWidth
                              value={profile.address.state}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  address: {
                                    ...profile.address,
                                    state: e.target.value,
                                  },
                                })
                              }
                              sx={inputSx}
                            />
                          </Grid>

                          <Grid item xs={6} sm={3} md={4}>
                            <TextField
                              label="ZIP"
                              fullWidth
                              value={profile.address.zip}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  address: {
                                    ...profile.address,
                                    zip: e.target.value,
                                  },
                                })
                              }
                              sx={inputSx}
                            />
                          </Grid>
                        </Grid>
                      )}

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{ mt: 2.5 }}
                      >
                        <Button
                          variant="contained"
                          onClick={saveProfile}
                          disabled={userLoading || saving}
                          sx={primaryButtonSx}
                        >
                          {saving ? "Saving..." : "Save changes"}
                        </Button>

                        <Button variant="text" sx={linkButtonSx}>
                          Change password
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Card elevation={0} sx={panelCardSx}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            bgcolor: alpha(brand.green, 0.10),
                            color: brand.green,
                            border: `1px solid ${alpha(brand.green, 0.16)}`,
                          }}
                        >
                          <ShieldOutlinedIcon />
                        </Avatar>
                        <Box>
                          <Typography sx={sectionTitleSx}>
                            Membership & Trust
                          </Typography>
                          <Typography sx={sectionSubSx}>
                            Signals tied to your account and readiness.
                          </Typography>
                        </Box>
                      </Stack>

                      {userLoading ? (
                        <Stack spacing={1.1} sx={{ mt: 2 }}>
                          <Skeleton
                            variant="rectangular"
                            height={36}
                            sx={{ ...skeletonSx, borderRadius: 999 }}
                          />
                          <Skeleton
                            variant="rectangular"
                            height={36}
                            sx={{ ...skeletonSx, borderRadius: 999 }}
                          />
                          <Skeleton
                            variant="rectangular"
                            height={36}
                            sx={{ ...skeletonSx, borderRadius: 999 }}
                          />
                        </Stack>
                      ) : (
                        <Stack spacing={1.1} sx={{ mt: 2 }}>
                          <Chip
                            icon={<VerifiedIcon />}
                            label="Buyer protection active"
                            sx={pillSx}
                          />
                          <Chip
                            label={profile.email ? "Email on file" : "Email missing"}
                            sx={pillSx}
                          />
                          <Chip
                            label={
                              profile.phone
                                ? "Phone on file (MFA ready)"
                                : "Two-factor auth recommended"
                            }
                            sx={profile.phone ? pillSx : pillGhostSx}
                          />
                          {profile.role ? (
                            <Chip label={`Role: ${profile.role}`} sx={pillGhostSx} />
                          ) : null}
                        </Stack>
                      )}

                      <Divider sx={sectionDividerSx} />

                      <Typography sx={helperTextSx}>
                        Manage additional security in{" "}
                        <Link
                          component={RouterLink}
                          to="/account/security"
                          underline="hover"
                          sx={{
                            color: brand.navy,
                            fontWeight: 700,
                            fontFamily: '"Semplicita Pro", sans-serif',
                          }}
                        >
                          Settings
                        </Link>
                        .
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card elevation={0} sx={{ ...panelCardSx, mt: 2.25 }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <SectionHeader
                        title="Quick snapshot"
                        subtitle="A simple view of current account activity."
                      />

                      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                        <Grid item xs={4}>
                          <MiniStat
                            label="Orders"
                            value={orders.loading ? "—" : orders.items.length}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <MiniStat
                            label="Reservations"
                            value={
                              reservations.loading ? "—" : reservations.items.length
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <MiniStat
                            label="Favorites"
                            value={favorites.loading ? "—" : favorites.items.length}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    title="Orders"
                    subtitle="Your recent order activity."
                  />
                  <Divider sx={sectionDividerSx} />

                  {orders.loading ? (
                    <Stack spacing={1.25}>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          height={72}
                          sx={{ ...skeletonSx, borderRadius: 3 }}
                        />
                      ))}
                    </Stack>
                  ) : orders.items.length ? (
                    <Stack spacing={1.25}>
                      {orders.items.map((order, index) => (
                        <RowCard
                          key={order._id || order.id || index}
                          title={order.title || order.orderNumber || "Order"}
                          subtitle={order.status || "Pending"}
                          right={
                            order.total != null ? `$${order.total}` : "—"
                          }
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={helperTextSx}>No orders yet.</Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}

          {tab === 2 && (
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    title="Reservations"
                    subtitle="Items you have reserved or scheduled."
                  />
                  <Divider sx={sectionDividerSx} />

                  {reservations.loading ? (
                    <Stack spacing={1.25}>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          height={72}
                          sx={{ ...skeletonSx, borderRadius: 3 }}
                        />
                      ))}
                    </Stack>
                  ) : reservations.items.length ? (
                    <Stack spacing={1.25}>
                      {reservations.items.map((item, index) => (
                        <RowCard
                          key={item._id || item.id || index}
                          title={item.title || "Reservation"}
                          subtitle={item.status || "Scheduled"}
                          right={item.date || "—"}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={helperTextSx}>
                      No reservations yet.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}

          {tab === 3 && (
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    title="Favorites"
                    subtitle="Saved listings and items you want to revisit."
                  />
                  <Divider sx={sectionDividerSx} />

                  {favorites.loading ? (
                    <Stack spacing={1.25}>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          height={72}
                          sx={{ ...skeletonSx, borderRadius: 3 }}
                        />
                      ))}
                    </Stack>
                  ) : favorites.items.length ? (
                    <Stack spacing={1.25}>
                      {favorites.items.map((fav, index) => {
                        const id =
                          fav?._id || fav?.id || fav?.listingId || fav;
                        return (
                          <RowCard
                            key={id || index}
                            title={fav?.title || "Saved listing"}
                            subtitle={fav?.category || "Favorite"}
                            right={
                              id ? (
                                <Button
                                  component={RouterLink}
                                  to={LISTING_BY_ID(id)}
                                  size="small"
                                  sx={linkButtonSx}
                                >
                                  View
                                </Button>
                              ) : (
                                "—"
                              )
                            }
                          />
                        );
                      })}
                    </Stack>
                  ) : (
                    <Typography sx={helperTextSx}>No favorites yet.</Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}

          {tab === 4 && (
            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    title="Settings"
                    subtitle="Additional account and security options."
                  />
                  <Divider sx={sectionDividerSx} />

                  <Stack spacing={1.5}>
                    <Button sx={linkButtonSx}>Change password</Button>
                    <Button sx={linkButtonSx}>Manage MFA</Button>
                    <Button sx={linkButtonSx}>Notification preferences</Button>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <Box>
      <Typography sx={sectionTitleSx}>{title}</Typography>
      {subtitle && (
        <Typography sx={{ ...sectionSubSx, mt: 0.5 }}>{subtitle}</Typography>
      )}
    </Box>
  );
}

function MiniStat({ label, value }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(brand.navy, 0.08)}`,
        bgcolor: brand.grayBg,
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Typography sx={miniLabelSx}>{label}</Typography>
        <Typography sx={miniValueSx}>{value}</Typography>
      </CardContent>
    </Card>
  );
}

function RowCard({ title, subtitle, right }) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 3,
        border: `1px solid ${alpha(brand.navy, 0.08)}`,
        bgcolor: brand.white,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: brand.text,
            fontFamily: '"Semplicita Pro", sans-serif',
          }}
          noWrap
        >
          {title}
        </Typography>
        <Typography sx={helperTextSx} noWrap>
          {subtitle}
        </Typography>
      </Box>
      <Box>{right}</Box>
    </Stack>
  );
}

const shellCardSx = {
  borderRadius: 5,
  border: `1px solid ${brand.border}`,
  bgcolor: brand.white,
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
  overflow: "hidden",
};

const panelCardSx = {
  borderRadius: 5,
  border: `1px solid ${brand.border}`,
  bgcolor: brand.white,
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
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

const primaryButtonSx = {
  bgcolor: brand.navy,
  color: brand.white,
  px: 2.25,
  py: 1.2,
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 700,
  boxShadow: "none",
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "#16304F",
    boxShadow: "none",
  },
};

const secondaryButtonSx = {
  color: brand.navy,
  borderColor: brand.border,
  px: 2,
  py: 1.1,
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 700,
  bgcolor: brand.white,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    borderColor: brand.navy,
    bgcolor: alpha(brand.navy, 0.03),
  },
};

const linkButtonSx = {
  color: brand.navy,
  textTransform: "none",
  fontWeight: 700,
  justifyContent: "flex-start",
  p: 0,
  minWidth: 0,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "transparent",
    color: brand.green,
  },
};

const sectionDividerSx = {
  my: 2,
  borderColor: brand.border,
};

const sectionTitleSx = {
  fontSize: 22,
  fontWeight: 800,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const sectionSubSx = {
  fontSize: 14,
  lineHeight: 1.7,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const helperTextSx = {
  fontSize: 14,
  lineHeight: 1.7,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const pillSx = {
  alignSelf: "flex-start",
  bgcolor: alpha(brand.navy, 0.05),
  color: brand.navy,
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const pillGhostSx = {
  alignSelf: "flex-start",
  bgcolor: alpha(brand.green, 0.08),
  color: brand.green,
  border: `1px solid ${alpha(brand.green, 0.14)}`,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const skeletonSx = {
  bgcolor: alpha(brand.navy, 0.08),
};

const miniLabelSx = {
  fontSize: 13,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const miniValueSx = {
  mt: 0.4,
  fontSize: 24,
  lineHeight: 1.1,
  fontWeight: 900,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};
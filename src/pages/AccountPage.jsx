import React, { useEffect, useState } from "react";
import {
  Box, Container, Typography, Tabs, Tab, Stack, Card, CardContent, CardActions,
  Button, Grid, TextField, Chip, Divider, Avatar, Link, Skeleton
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import api from "../lib/http";
import { Link as RouterLink } from "react-router-dom";

export default function AccountPage() {
  const [tab, setTab] = useState(0);

  // Profile state (stubbed from localStorage; replace with /users/me when you add it)
  const [profile, setProfile] = useState({
    name: localStorage.getItem("name") || "Demo User",
    email: localStorage.getItem("email") || "demo@example.com",
    address: {
      line1: localStorage.getItem("addr_line1") || "",
      city: localStorage.getItem("addr_city") || "",
      state: localStorage.getItem("addr_state") || "",
      zip: localStorage.getItem("addr_zip") || ""
    }
  });

  // Orders / Reservations / Favorites
  const [orders, setOrders] = useState({ loading: true, items: [] });
  const [reservations, setReservations] = useState({ loading: true, items: [] });
  const [favorites, setFavorites] = useState({ loading: true, items: [] });

  useEffect(() => {
    let mounted = true;

    // --- ORDERS (TODO: add GET /api/orders?user=current on the server)
    (async () => {
      try {
        const { data } = await api.get("/orders"); // <- implement route later
        if (!mounted) return;
        setOrders({ loading: false, items: data?.items || [] });
      } catch {
        if (!mounted) return;
        setOrders({ loading: false, items: [] });
      }
    })();

    // --- RESERVATIONS (TODO: add GET /api/reservations?user=current)
    (async () => {
      try {
        const { data } = await api.get("/reservations"); // <- implement route later
        if (!mounted) return;
        setReservations({ loading: false, items: data?.items || [] });
      } catch {
        if (!mounted) return;
        setReservations({ loading: false, items: [] });
      }
    })();

    // --- FAVORITES (TODO: add GET /api/users/me/favorites or include on /users/me)
    (async () => {
      try {
        const { data } = await api.get("/users/me"); // <- implement route later
        if (!mounted) return;
        const favs = data?.favorites || [];
        setFavorites({ loading: false, items: favs });
      } catch {
        if (!mounted) return;
        setFavorites({ loading: false, items: [] });
      }
    })();

    return () => (mounted = false);
  }, []);

  const saveProfile = async () => {
    // TODO: POST /api/users/me — for now, persist locally so the UI feels responsive
    localStorage.setItem("name", profile.name || "");
    localStorage.setItem("email", profile.email || "");
    localStorage.setItem("addr_line1", profile.address.line1 || "");
    localStorage.setItem("addr_city", profile.address.city || "");
    localStorage.setItem("addr_state", profile.address.state || "");
    localStorage.setItem("addr_zip", profile.address.zip || "");
    alert("Profile saved (local). Wire to /api/users/me to persist in DB.");
  };

  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.06)", width: 48, height: 48 }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              My Account
            </Typography>
            <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
              Manage your profile, orders, reservations, and favorites.
            </Typography>
          </Box>
        </Stack>

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
              "& .Mui-selected": { color: "#e6eef7" }
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
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        Profile
                      </Typography>
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
                      <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={saveProfile}
                          sx={{
                            bgcolor: "#e6eef7",
                            color: "#0b0f14",
                            fontWeight: 700,
                            "&:hover": { bgcolor: "#cfe0f4" }
                          }}
                        >
                          Save changes
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
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                        Membership & Trust
                      </Typography>
                      <Stack spacing={1}>
                        <Chip
                          icon={<VerifiedIcon />}
                          label="Buyer protection active"
                          sx={pill}
                        />
                        <Chip
                          label="Email verified"
                          sx={pill}
                        />
                        <Chip
                          label="Two-factor auth (recommended)"
                          sx={pillGhost}
                        />
                      </Stack>
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

          {/* Orders */}
          {tab === 1 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Orders
              </Typography>
              {orders.loading ? (
                <ListSkeleton />
              ) : orders.items.length ? (
                <Grid container spacing={2}>
                  {orders.items.map((o) => (
                    <Grid key={o._id} item xs={12} md={6}>
                      <OrderCard order={o} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  title="No orders yet"
                  body="When you buy with Retech, your orders will appear here."
                />
              )}
            </Box>
          )}

          {/* Reservations */}
          {tab === 2 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Reservations
              </Typography>
              {reservations.loading ? (
                <ListSkeleton />
              ) : reservations.items.length ? (
                <Grid container spacing={2}>
                  {reservations.items.map((r) => (
                    <Grid key={r._id} item xs={12} md={6}>
                      <ReservationCard res={r} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  title="No active reservations"
                  body="Hold items for 15 minutes from any listing to reserve before checkout."
                />
              )}
            </Box>
          )}

          {/* Favorites */}
          {tab === 3 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Favorites
              </Typography>
              {favorites.loading ? (
                <ListSkeleton />
              ) : favorites.items.length ? (
                <Grid container spacing={2}>
                  {favorites.items.map((id) => (
                    <Grid key={id} item xs={12} md={6}>
                      <FavoriteCard listingId={id} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  title="No favorites yet"
                  body="Tap the heart on any listing to save it here."
                />
              )}
            </Box>
          )}

          {/* Settings */}
          {tab === 4 && (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Settings
              </Typography>
              <Stack spacing={1.5}>
                <Button variant="outlined" sx={{ color: "rgba(255,255,255,0.88)", borderColor: "rgba(255,255,255,0.22)" }}>
                  Enable two-factor authentication
                </Button>
                <Button variant="outlined" sx={{ color: "rgba(255,255,255,0.88)", borderColor: "rgba(255,255,255,0.22)" }}>
                  Manage notifications
                </Button>
                <Button variant="outlined" sx={{ color: "rgba(255,255,255,0.88)", borderColor: "rgba(255,255,255,0.22)" }}>
                  Delete account (danger)
                </Button>
              </Stack>
              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
              <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                Looking to sell?{" "}
                <Link component={RouterLink} to="/partners" color="rgba(230,238,247,0.88)">
                  Apply as a partner
                </Link>
                .
              </Typography>
            </Box>
          )}
        </Card>
      </Container>
    </Box>
  );
}

/* ——— Small components ——— */
function OrderCard({ order }) {
  // order: { _id, items: [{ listingId, quantity, price }], total, createdAt, payment: { status } }
  return (
    <Card elevation={0} sx={quietCardInner}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Order #{order._id?.slice(-6) || "—"}
          </Typography>
          <Chip label={order.payment?.status || "paid"} size="small" sx={pill} />
        </Stack>
        <Typography sx={{ color: "rgba(230,238,247,0.72)", mt: 0.5 }}>
          Placed {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
        </Typography>
        <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)" }} />
        {(order.items || []).map((it, idx) => (
          <Typography key={idx} sx={{ color: "rgba(230,238,247,0.84)" }}>
            x{it.quantity} • ${it.price} — {String(it.listingId).slice(-6)}
          </Typography>
        ))}
        <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
          Total: ${order.total || 0}
        </Typography>
        <CardActions sx={{ p: 0, pt: 1 }}>
          <Button size="small" variant="text" sx={{ color: "rgba(255,255,255,0.88)" }}>
            View details
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
}

function ReservationCard({ res }) {
  // res: { _id, listingId, quantity, expiresAt, status }
  const exp = res.expiresAt ? new Date(res.expiresAt) : null;
  return (
    <Card elevation={0} sx={quietCardInner}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Reservation #{res._id?.slice(-6) || "—"}
        </Typography>
        <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
          Listing: {String(res.listingId).slice(-6)} • Qty {res.quantity}
        </Typography>
        <Typography sx={{ color: "rgba(230,238,247,0.72)", mt: 0.5 }}>
          Expires: {exp ? exp.toLocaleTimeString() : "—"}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip label={res.status || "HELD"} size="small" sx={pill} />
          <Button
            size="small"
            variant="outlined"
            sx={{ color: "rgba(255,255,255,0.88)", borderColor: "rgba(255,255,255,0.22)" }}
            onClick={async () => {
              try {
                await api.delete(`/reservations/${res._id}`);
                alert("Reservation released.");
                // You might refetch reservations here.
              } catch {
                alert("Could not release reservation.");
              }
            }}
          >
            Release
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function FavoriteCard({ listingId }) {
  // fetch listing detail to show title/price (best-effort, won’t crash if 404)
  const [listing, setListing] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/listings/${listingId}`);
        if (mounted) setListing(data);
      } catch {
        if (mounted) setListing({ _id: listingId });
      }
    })();
    return () => (mounted = false);
  }, [listingId]);

  return (
    <Card elevation={0} sx={quietCardInner} component={RouterLink} to={`/listing/${listingId}`} style={{ textDecoration: "none" }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {listing?.title || "Listing"}
          </Typography>
          <Chip icon={<FavoriteIcon />} size="small" label="Saved" sx={pill} />
        </Stack>
        <Typography sx={{ color: "rgba(230,238,247,0.72)", mt: .5 }}>
          {listing?.brand || ""} {listing?.model || ""}
        </Typography>
        {listing?.rescuePrice != null && (
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
            ${listing.rescuePrice}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ title, body }) {
  return (
    <Card elevation={0} sx={quietCardInner}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>{body}</Typography>
      </CardContent>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <Grid container spacing={2}>
      {[...Array(3)].map((_, i) => (
        <Grid item xs={12} md={6} key={i}>
          <Card elevation={0} sx={quietCardInner}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Skeleton variant="text" width="40%" sx={skel} />
              <Skeleton variant="text" width="60%" sx={skel} />
              <Skeleton variant="rectangular" height={60} sx={{ ...skel, borderRadius: 2, mt: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

/* ——— Styles ——— */
const quietCard = {
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
};

const quietCardInner = {
  ...quietCard,
};

const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    color: "rgba(255,255,255,0.9)",
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

const skel = {
  bgcolor: "rgba(255,255,255,0.06)"
};

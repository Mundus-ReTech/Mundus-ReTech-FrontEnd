import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/http";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Inventory2Icon from "@mui/icons-material/Inventory2";

export default function ListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [reserveBusy, setReserveBusy] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) {
        setErr("Missing listing id in URL.");
        setLoading(false);
        return;
      }

      try {
        setErr("");
        setLoading(true);

        const res = await api.get(
          `http://localhost:8080/v1/listing/${encodeURIComponent(id)}`
        );

        if (!cancelled) setItem(res.data);
      } catch (e) {
        console.error("Listing fetch failed:", e);
        if (!cancelled) {
          setErr(
            e?.response?.data?.message ||
              e?.response?.statusText ||
              e?.message ||
              "Failed to load listing."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const price = useMemo(() => {
    const p = item?.rescuePrice ?? item?.price ?? 0;
    const n = Number(p);
    return Number.isFinite(n) ? n : 0;
  }, [item]);

  const coverPhoto = useMemo(() => {
    const photos = item?.photos || [];
    return photos.length ? photos[0] : "";
  }, [item]);

  const reserve = async () => {
    try {
      setReserveBusy(true);
      const { data } = await api.post("/v1/reservations", {
        listingId: id,
        quantity: 1,
      });
      alert("Held! Expires at: " + new Date(data.expiresAt).toLocaleTimeString());
    } catch (e) {
      console.error("Reserve failed:", e);
      alert(e?.response?.data?.message || "Could not hold this item.");
    } finally {
      setReserveBusy(false);
    }
  };

  /**
   * ✅ Add to cart (localStorage)
   * Later swap to POST /v1/cart if you implement it.
   */
  const addToCart = async () => {
    try {
      setCartBusy(true);

      const cartRaw = localStorage.getItem("cart") || "[]";
      const cart = JSON.parse(cartRaw);

      const listingId = item?._id || id;
      const existingIdx = cart.findIndex((c) => c.listingId === listingId);

      if (existingIdx >= 0) {
        cart[existingIdx].quantity = (cart[existingIdx].quantity || 1) + 1;
      } else {
        cart.push({
          listingId,
          title: item?.title || "Listing",
          price,
          photo: coverPhoto || "",
          quantity: 1,
          condition: item?.condition || "",
          brand: item?.brand || "",
          model: item?.model || "",
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart ✅");
    } catch (e) {
      console.error("Add to cart failed:", e);
      alert("Could not add to cart.");
    } finally {
      setCartBusy(false);
    }
  };

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(String(value || ""));
      alert(`${label} copied`);
    } catch {
      // ignore
    }
  };

  if (err) {
    return (
      <Box sx={{ bgcolor: "#0b0f14", minHeight: "100vh", color: "#e6eef7" }}>
        <Container sx={{ py: 6 }}>
          <Alert
            severity="error"
            sx={{
              bgcolor: "rgba(255,255,255,0.06)",
              color: "#e6eef7",
              "& .MuiAlert-icon": { color: "inherit" },
            }}
          >
            {err}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: "#0b0f14",
        minHeight: "100vh",
        color: "#e6eef7",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      {/* ✅ FULL-WIDTH PAGE WRAPPER */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 5, lg: 8 },
        }}
      >
        {/* Top header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.06)" }}>
              <Inventory2Icon />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}
                noWrap
              >
                {loading ? "Loading…" : item?.title || "Listing"}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.75 }}>
                {loading ? (
                  <>
                    <Skeleton variant="rounded" width={90} height={28} sx={skel} />
                    <Skeleton variant="rounded" width={110} height={28} sx={skel} />
                  </>
                ) : (
                  <>
                    <Chip label={item?.status || "ACTIVE"} size="small" sx={pill} />
                    <Chip
                      label={(item?.condition || "").replaceAll("_", " ") || "—"}
                      size="small"
                      sx={pill}
                    />
                    {(item?.techTypes || []).slice(0, 2).map((t) => (
                      <Chip key={t} label={t} size="small" sx={pillGhost} />
                    ))}
                  </>
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={1}>
            <Button
              onClick={addToCart}
              disabled={loading || cartBusy}
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              sx={{
                bgcolor: "#e6eef7",
                color: "#0b0f14",
                fontWeight: 900,
                "&:hover": { bgcolor: "#cfe0f4" },
              }}
            >
              {cartBusy ? "Adding…" : "Add to cart"}
            </Button>

            <Button
              onClick={reserve}
              disabled={loading || reserveBusy}
              variant="outlined"
              startIcon={<ScheduleIcon />}
              sx={{
                borderColor: "rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.9)",
                "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
              }}
            >
              {reserveBusy ? "Holding…" : "Hold 15 min"}
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={3}>
          {/* Left: gallery + description */}
          <Grid item xs={12} lg={8}>
            <Card elevation={0} sx={quietCard}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                {/* Hero image */}
                {loading ? (
                  <Skeleton variant="rounded" height={420} sx={{ ...skel, borderRadius: 3 }} />
                ) : coverPhoto ? (
                  <Box
                    component="img"
                    src={coverPhoto}
                    alt={item?.title || "cover"}
                    sx={{
                      width: "100%",
                      height: { xs: 280, md: 420 },
                      objectFit: "cover",
                      borderRadius: 3,
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: { xs: 280, md: 420 },
                      borderRadius: 3,
                      border: "1px dashed rgba(255,255,255,0.18)",
                      display: "grid",
                      placeItems: "center",
                      color: "rgba(230,238,247,0.7)",
                    }}
                  >
                    No photo uploaded
                  </Box>
                )}

                {/* Thumbs */}
                {!loading && (item?.photos || []).length > 1 && (
                  <Grid container spacing={1} sx={{ mt: 1.5 }}>
                    {item.photos.slice(0, 10).map((p, idx) => (
                      <Grid item xs={3} sm={2} key={`${p}-${idx}`}>
                        <Box
                          component="img"
                          src={p}
                          alt={`photo-${idx}`}
                          sx={{
                            width: "100%",
                            height: 78,
                            objectFit: "cover",
                            borderRadius: 2,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                <Divider sx={divider} />

                {/* Description */}
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                  Description
                </Typography>
                {loading ? (
                  <>
                    <Skeleton variant="text" sx={skel} />
                    <Skeleton variant="text" sx={skel} />
                    <Skeleton variant="text" sx={skel} />
                  </>
                ) : (
                  <Typography
                    sx={{
                      color: "rgba(230,238,247,0.8)",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {item?.description || "No description provided."}
                  </Typography>
                )}

                {/* Notes / extras */}
                {!loading && (item?.gradeNotes || item?.notes) && (
                  <>
                    <Divider sx={divider} />
                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography sx={{ color: "rgba(230,238,247,0.8)", whiteSpace: "pre-wrap" }}>
                      {item?.gradeNotes || item?.notes}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right: details */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={2}>
              {/* Price card */}
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography sx={{ color: "rgba(230,238,247,0.7)", fontWeight: 700 }}>
                    Rescue price
                  </Typography>
                  {loading ? (
                    <Skeleton variant="text" width="40%" sx={{ ...skel, fontSize: 42 }} />
                  ) : (
                    <Typography variant="h3" sx={{ fontWeight: 1000, letterSpacing: "-0.02em" }}>
                      ${price.toLocaleString()}
                    </Typography>
                  )}

                  <Divider sx={divider} />

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip icon={<VerifiedIcon />} label="Buyer protection" sx={pill} />
                    <Chip icon={<LocalShippingIcon />} label="Ready for pickup / ship" sx={pillGhost} />
                  </Stack>
                </CardContent>
              </Card>

              {/* Device details */}
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
                    Device details
                  </Typography>

                  {loading ? (
                    <Stack spacing={1}>
                      <Skeleton variant="rounded" height={44} sx={{ ...skel, borderRadius: 2 }} />
                      <Skeleton variant="rounded" height={44} sx={{ ...skel, borderRadius: 2 }} />
                      <Skeleton variant="rounded" height={44} sx={{ ...skel, borderRadius: 2 }} />
                    </Stack>
                  ) : (
                    <Stack spacing={1}>
                      <DetailRow label="Brand" value={item?.brand || "—"} />
                      <DetailRow label="Model" value={item?.model || "—"} />
                      <DetailRow label="Make" value={item?.make || "—"} />
                      <DetailRow label="Category" value={item?.category || "—"} />
                      <DetailRow
                        label="Tech types"
                        value={(item?.techTypes || []).length ? item.techTypes.join(", ") : "—"}
                      />
                      <DetailRow
                        label="Device types"
                        value={(item?.deviceTypes || []).length ? item.deviceTypes.join(", ") : "—"}
                      />

                      <Divider sx={divider} />

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ minWidth: 120, color: "rgba(230,238,247,0.7)", fontWeight: 700 }}>
                          Serial
                        </Typography>
                        <Typography sx={{ color: "rgba(230,238,247,0.9)", fontWeight: 800, flex: 1 }}>
                          {item?.serialnumber || "—"}
                        </Typography>
                        {item?.serialnumber && (
                          <Tooltip title="Copy">
                            <IconButton
                              size="small"
                              onClick={() => copy("Serial number", item.serialnumber)}
                              sx={{ color: "rgba(255,255,255,0.8)" }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ minWidth: 120, color: "rgba(230,238,247,0.7)", fontWeight: 700 }}>
                          MAC
                        </Typography>
                        <Typography sx={{ color: "rgba(230,238,247,0.9)", fontWeight: 800, flex: 1 }}>
                          {item?.macaddress || "—"}
                        </Typography>
                        {item?.macaddress && (
                          <Tooltip title="Copy">
                            <IconButton
                              size="small"
                              onClick={() => copy("MAC address", item.macaddress)}
                              sx={{ color: "rgba(255,255,255,0.8)" }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>
                  )}
                </CardContent>
              </Card>

              {/* Pickup / location */}
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <LocationOnIcon />
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      Pickup
                    </Typography>
                  </Stack>

                  {loading ? (
                    <>
                      <Skeleton variant="text" sx={skel} />
                      <Skeleton variant="text" sx={skel} />
                    </>
                  ) : item?.pickup?.address ? (
                    <Typography sx={{ color: "rgba(230,238,247,0.8)" }}>
                      {item.pickup.address.street || "—"}
                      <br />
                      {item.pickup.address.city || "—"}, {item.pickup.address.state || "—"}{" "}
                      {item.pickup.address.zip || ""}
                    </Typography>
                  ) : (
                    <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                      No pickup address provided.
                    </Typography>
                  )}

                  <Divider sx={divider} />

                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addToCart}
                      disabled={loading || cartBusy}
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        bgcolor: "#e6eef7",
                        color: "#0b0f14",
                        fontWeight: 900,
                        "&:hover": { bgcolor: "#cfe0f4" },
                      }}
                    >
                      {cartBusy ? "Adding…" : "Add to cart"}
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={reserve}
                      disabled={loading || reserveBusy}
                      startIcon={<ScheduleIcon />}
                      sx={{
                        borderColor: "rgba(255,255,255,0.22)",
                        color: "rgba(255,255,255,0.9)",
                        "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
                      }}
                    >
                      {reserveBusy ? "Holding…" : "Hold"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Button
                variant="text"
                onClick={() => navigate(-1)}
                sx={{ color: "rgba(255,255,255,0.8)" }}
              >
                ← Back
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

/* ——— Small UI bits ——— */
function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography
        sx={{
          minWidth: 120,
          color: "rgba(230,238,247,0.7)",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>
      <Typography sx={{ color: "rgba(230,238,247,0.9)", fontWeight: 800 }}>
        {value}
      </Typography>
    </Stack>
  );
}

/* ——— Styles ——— */
const quietCard = {
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
};

const pill = {
  bgcolor: "transparent",
  border: "1px solid rgba(255,255,255,0.16)",
  color: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(4px)",
};

const pillGhost = {
  bgcolor: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.9)",
};

const divider = { borderColor: "rgba(255,255,255,0.08)", my: 2 };

const skel = { bgcolor: "rgba(255,255,255,0.06)" };

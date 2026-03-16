import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/http";
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
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

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
      window.dispatchEvent(new Event("cart:updated"));
      alert("Added to cart");
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
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: brand.grayBg,
          background: `radial-gradient(circle at top right, ${alpha(
            brand.green,
            0.06
          )} 0%, transparent 20%), radial-gradient(circle at left top, ${alpha(
            brand.navy,
            0.05
          )} 0%, transparent 28%), ${brand.grayBg}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            {err}
          </Alert>
        </Container>
      </Box>
    );
  }

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
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 5, lg: 8 },
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
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
                mb: 2,
              }}
            >
              <SellRoundedIcon sx={{ fontSize: 18 }} />
              <Typography sx={eyebrowSx}>Listing details</Typography>
            </Box>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: alpha(brand.navy, 0.08),
                  color: brand.navy,
                  border: `1px solid ${alpha(brand.navy, 0.12)}`,
                }}
              >
                <Inventory2Icon />
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography sx={pageTitleSx} noWrap>
                  {loading ? "Loading..." : item?.title || "Listing"}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mt: 0.9, flexWrap: "wrap" }}
                >
                  {loading ? (
                    <>
                      <Skeleton
                        variant="rounded"
                        width={90}
                        height={28}
                        sx={{ ...skeletonSx, borderRadius: 999 }}
                      />
                      <Skeleton
                        variant="rounded"
                        width={110}
                        height={28}
                        sx={{ ...skeletonSx, borderRadius: 999 }}
                      />
                    </>
                  ) : (
                    <>
                      <Chip label={item?.status || "ACTIVE"} size="small" sx={pillSx} />
                      <Chip
                        label={(item?.condition || "").replaceAll("_", " ") || "—"}
                        size="small"
                        sx={pillSx}
                      />
                      {(item?.techTypes || []).slice(0, 2).map((t) => (
                        <Chip key={t} label={t} size="small" sx={pillGhostSx} />
                      ))}
                    </>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              onClick={addToCart}
              disabled={loading || cartBusy}
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              sx={primaryButtonSx}
            >
              {cartBusy ? "Adding..." : "Add to cart"}
            </Button>

            <Button
              onClick={reserve}
              disabled={loading || reserveBusy}
              variant="outlined"
              startIcon={<ScheduleIcon />}
              sx={secondaryButtonSx}
            >
              {reserveBusy ? "Holding..." : "Hold 15 min"}
            </Button>
          </Stack>
        </Stack>

        <Grid container spacing={2.25}>
          <Grid item xs={12} lg={8}>
            <Card elevation={0} sx={panelCardSx}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                {loading ? (
                  <Skeleton
                    variant="rounded"
                    height={420}
                    sx={{ ...skeletonSx, borderRadius: 4 }}
                  />
                ) : coverPhoto ? (
                  <Box
                    component="img"
                    src={coverPhoto}
                    alt={item?.title || "cover"}
                    sx={{
                      width: "100%",
                      height: { xs: 280, md: 420 },
                      objectFit: "cover",
                      borderRadius: 4,
                      border: `1px solid ${brand.border}`,
                      display: "block",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: { xs: 280, md: 420 },
                      borderRadius: 4,
                      border: `1px dashed ${brand.border}`,
                      display: "grid",
                      placeItems: "center",
                      color: brand.muted,
                      bgcolor: brand.grayBg,
                      fontFamily: '"Semplicita Pro", sans-serif',
                    }}
                  >
                    No photo uploaded
                  </Box>
                )}

                {!loading && (item?.photos || []).length > 1 && (
                  <Grid container spacing={1.25} sx={{ mt: 1.75 }}>
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
                            borderRadius: 2.5,
                            border: `1px solid ${brand.border}`,
                            display: "block",
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                <Divider sx={sectionDividerSx} />

                <SectionHeader
                  title="Description"
                  subtitle="Item condition, included accessories, and other relevant details."
                />

                {loading ? (
                  <>
                    <Skeleton variant="text" sx={skeletonSx} />
                    <Skeleton variant="text" sx={skeletonSx} />
                    <Skeleton variant="text" sx={skeletonSx} />
                  </>
                ) : (
                  <Typography sx={bodyTextSx}>
                    {item?.description || "No description provided."}
                  </Typography>
                )}

                {!loading && (item?.gradeNotes || item?.notes) && (
                  <>
                    <Divider sx={sectionDividerSx} />
                    <SectionHeader
                      title="Notes"
                      subtitle="Additional notes supplied by the seller."
                    />
                    <Typography sx={bodyTextSx}>
                      {item?.gradeNotes || item?.notes}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={2.25}>
              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography sx={sectionSubSx}>Rescue price</Typography>

                  {loading ? (
                    <Skeleton
                      variant="text"
                      width="45%"
                      sx={{ ...skeletonSx, fontSize: 42 }}
                    />
                  ) : (
                    <Typography sx={priceValueSx}>
                      ${price.toLocaleString()}
                    </Typography>
                  )}

                  <Divider sx={sectionDividerSx} />

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Buyer protection"
                      sx={pillSx}
                    />
                    <Chip
                      icon={<LocalShippingIcon />}
                      label="Ready for pickup / ship"
                      sx={pillGhostSx}
                    />
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <SectionHeader
                    title="Device details"
                    subtitle="Core information and identifying attributes."
                  />

                  {loading ? (
                    <Stack spacing={1}>
                      <Skeleton
                        variant="rounded"
                        height={44}
                        sx={{ ...skeletonSx, borderRadius: 2.5 }}
                      />
                      <Skeleton
                        variant="rounded"
                        height={44}
                        sx={{ ...skeletonSx, borderRadius: 2.5 }}
                      />
                      <Skeleton
                        variant="rounded"
                        height={44}
                        sx={{ ...skeletonSx, borderRadius: 2.5 }}
                      />
                    </Stack>
                  ) : (
                    <Stack spacing={1.15}>
                      <DetailRow label="Brand" value={item?.brand || "—"} />
                      <DetailRow label="Model" value={item?.model || "—"} />
                      <DetailRow label="Make" value={item?.make || "—"} />
                      <DetailRow label="Category" value={item?.category || "—"} />
                      <DetailRow
                        label="Tech types"
                        value={
                          (item?.techTypes || []).length
                            ? item.techTypes.join(", ")
                            : "—"
                        }
                      />
                      <DetailRow
                        label="Device types"
                        value={
                          (item?.deviceTypes || []).length
                            ? item.deviceTypes.join(", ")
                            : "—"
                        }
                      />

                      <Divider sx={sectionDividerSx} />

                      <CopyRow
                        label="Serial"
                        value={item?.serialnumber || "—"}
                        copyValue={item?.serialnumber}
                        onCopy={() => copy("Serial number", item.serialnumber)}
                      />

                      <CopyRow
                        label="MAC"
                        value={item?.macaddress || "—"}
                        copyValue={item?.macaddress}
                        onCopy={() => copy("MAC address", item.macaddress)}
                      />
                    </Stack>
                  )}
                </CardContent>
              </Card>

              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack direction="row" spacing={1.1} alignItems="center" sx={{ mb: 1 }}>
                    <LocationOnIcon sx={{ color: brand.navy }} />
                    <Typography sx={sectionTitleSx}>Pickup</Typography>
                  </Stack>

                  {loading ? (
                    <>
                      <Skeleton variant="text" sx={skeletonSx} />
                      <Skeleton variant="text" sx={skeletonSx} />
                    </>
                  ) : item?.pickup?.address ? (
                    <Typography sx={bodyTextSx}>
                      {item.pickup.address.street || "—"}
                      <br />
                      {item.pickup.address.city || "—"},{" "}
                      {item.pickup.address.state || "—"}{" "}
                      {item.pickup.address.zip || ""}
                    </Typography>
                  ) : (
                    <Typography sx={bodyTextSx}>
                      No pickup address provided.
                    </Typography>
                  )}

                  <Divider sx={sectionDividerSx} />

                  <Stack direction="row" spacing={1.25}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={addToCart}
                      disabled={loading || cartBusy}
                      startIcon={<ShoppingCartIcon />}
                      sx={primaryButtonSx}
                    >
                      {cartBusy ? "Adding..." : "Add to cart"}
                    </Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={reserve}
                      disabled={loading || reserveBusy}
                      startIcon={<ScheduleIcon />}
                      sx={secondaryButtonSx}
                    >
                      {reserveBusy ? "Holding..." : "Hold"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Button
                variant="text"
                startIcon={<ArrowBackRoundedIcon />}
                onClick={() => navigate(-1)}
                sx={backButtonSx}
              >
                Back
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Typography sx={sectionTitleSx}>{title}</Typography>
      {subtitle ? <Typography sx={sectionSubSx}>{subtitle}</Typography> : null}
    </Box>
  );
}

function DetailRow({ label, value }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={detailLabelSx}>{label}</Typography>
      <Typography sx={detailValueSx}>{value}</Typography>
    </Stack>
  );
}

function CopyRow({ label, value, copyValue, onCopy }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography sx={detailLabelSx}>{label}</Typography>
      <Typography sx={{ ...detailValueSx, flex: 1 }}>{value}</Typography>
      {copyValue ? (
        <Tooltip title="Copy">
          <IconButton size="small" onClick={onCopy} sx={{ color: brand.navy }}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Stack>
  );
}

const panelCardSx = {
  borderRadius: 5,
  border: `1px solid ${brand.border}`,
  bgcolor: brand.white,
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
};

const primaryButtonSx = {
  bgcolor: brand.navy,
  color: brand.white,
  fontWeight: 700,
  textTransform: "none",
  borderRadius: 3,
  boxShadow: "none",
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "#16304F",
    boxShadow: "none",
  },
};

const secondaryButtonSx = {
  borderColor: brand.border,
  color: brand.navy,
  fontWeight: 700,
  textTransform: "none",
  borderRadius: 3,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    borderColor: brand.navy,
    bgcolor: alpha(brand.navy, 0.03),
  },
};

const backButtonSx = {
  color: brand.navy,
  textTransform: "none",
  fontWeight: 700,
  alignSelf: "flex-start",
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "transparent",
    color: brand.green,
  },
};

const pillSx = {
  bgcolor: alpha(brand.navy, 0.05),
  color: brand.navy,
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const pillGhostSx = {
  bgcolor: alpha(brand.green, 0.08),
  color: brand.green,
  border: `1px solid ${alpha(brand.green, 0.14)}`,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const sectionDividerSx = {
  my: 2,
  borderColor: brand.border,
};

const skeletonSx = {
  bgcolor: alpha(brand.navy, 0.08),
};

const eyebrowSx = {
  fontSize: 13,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const pageTitleSx = {
  fontFamily: '"vvyPreston Display", serif',
  fontSize: { xs: 30, md: 42 },
  lineHeight: 1.05,
  color: brand.navy,
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

const bodyTextSx = {
  color: brand.muted,
  whiteSpace: "pre-wrap",
  lineHeight: 1.8,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const detailLabelSx = {
  minWidth: 120,
  color: brand.muted,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const detailValueSx = {
  color: brand.text,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const priceValueSx = {
  fontSize: { xs: 38, md: 46 },
  lineHeight: 1.05,
  fontWeight: 900,
  letterSpacing: "-0.02em",
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};
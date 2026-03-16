import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VerifiedIcon from "@mui/icons-material/Verified";
import SellRoundedIcon from "@mui/icons-material/SellRounded";

const CART_KEY = "cart";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY) || "[]";
      const parsed = JSON.parse(raw);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function refresh() {
      if (!items.length) return;
      setRefreshing(true);

      try {
        const next = await Promise.all(
          items.map(async (it) => {
            if (!it?.listingId) return it;

            try {
              const res = await api.get(
                `http://localhost:8080/v1/listing/${encodeURIComponent(it.listingId)}`
              );
              const d = res.data || {};
              const cover =
                Array.isArray(d.photos) && d.photos.length ? d.photos[0] : it.photo;

              return {
                ...it,
                title: d.title ?? it.title,
                price: Number(d.rescuePrice ?? d.price ?? it.price ?? 0),
                photo: cover ?? it.photo,
                condition: d.condition ?? it.condition,
                brand: d.brand ?? it.brand,
                model: d.model ?? it.model,
                _fresh: true,
              };
            } catch {
              return it;
            }
          })
        );

        if (!mounted) return;
        setItems(next);
        localStorage.setItem(CART_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("cart:updated"));
      } finally {
        if (mounted) setRefreshing(false);
      }
    }

    refresh();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => {
      const p = Number(it?.price ?? 0);
      const q = Number(it?.quantity ?? 1);
      return sum + (Number.isFinite(p) ? p : 0) * (Number.isFinite(q) ? q : 1);
    }, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it?.quantity) || 1), 0);
  }, [items]);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("cart:updated"));
  };

  const inc = (listingId) => {
    const next = items.map((it) =>
      it.listingId === listingId
        ? { ...it, quantity: (Number(it.quantity) || 1) + 1 }
        : it
    );
    persist(next);
  };

  const dec = (listingId) => {
    const next = items
      .map((it) => {
        if (it.listingId !== listingId) return it;
        const q = (Number(it.quantity) || 1) - 1;
        return { ...it, quantity: q };
      })
      .filter((it) => (Number(it.quantity) || 0) > 0);

    persist(next);
  };

  const setQty = (listingId, qty) => {
    const q = Math.max(0, Number(qty || 0));
    const next = items
      .map((it) => (it.listingId === listingId ? { ...it, quantity: q } : it))
      .filter((it) => (Number(it.quantity) || 0) > 0);

    persist(next);
  };

  const removeItem = (listingId) => {
    const next = items.filter((it) => it.listingId !== listingId);
    persist(next);
    setToast({ open: true, type: "success", msg: "Removed from cart." });
  };

  const clearCart = () => {
    persist([]);
    setToast({ open: true, type: "success", msg: "Cart cleared." });
  };

  const copy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(String(value || ""));
      setToast({ open: true, type: "success", msg: `${label} copied.` });
    } catch {
      // ignore
    }
  };

  const checkout = () => {
    setToast({ open: true, type: "success", msg: "Checkout coming soon." });
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
      <Container
        maxWidth={false}
        disableGutters
        sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3, md: 5, lg: 8 } }}
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
              <ShoppingCartIcon sx={{ fontSize: 18 }} />
              <Typography sx={eyebrowSx}>Cart</Typography>
            </Box>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: alpha(brand.navy, 0.08),
                  color: brand.navy,
                  border: `1px solid ${alpha(brand.navy, 0.12)}`,
                }}
              >
                <ShoppingCartIcon />
              </Avatar>
              <Box>
                <Typography sx={pageTitleSx}>Cart</Typography>
                <Typography sx={sectionSubSx}>
                  {itemCount} item{itemCount === 1 ? "" : "s"} • Subtotal $
                  {subtotal.toLocaleString()}
                  {refreshing ? " • refreshing..." : ""}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              variant="outlined"
              onClick={clearCart}
              disabled={!items.length}
              sx={secondaryButtonSx}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={checkout}
              disabled={!items.length}
              sx={primaryButtonSx}
            >
              Checkout
            </Button>
          </Stack>
        </Stack>

        {err && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3 }}>
            {err}
          </Alert>
        )}

        {!items.length ? (
          <Card elevation={0} sx={panelCardSx}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography sx={sectionTitleSx}>Your cart is empty</Typography>
              <Typography sx={{ ...sectionSubSx, mt: 0.75, mb: 2.25 }}>
                Browse listings and add items to your cart.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/categories")}
                sx={primaryButtonSx}
              >
                Browse listings
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2.25}>
            <Grid item xs={12} lg={8}>
              <Stack spacing={2}>
                {items.map((it) => (
                  <Card key={it.listingId} elevation={0} sx={panelCardSx}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Box
                          sx={{
                            width: { xs: "100%", sm: 180 },
                            height: { xs: 220, sm: 140 },
                            borderRadius: 4,
                            overflow: "hidden",
                            border: `1px solid ${brand.border}`,
                            bgcolor: brand.grayBg,
                            flexShrink: 0,
                          }}
                        >
                          {it.photo ? (
                            <Box
                              component="img"
                              src={it.photo}
                              alt={it.title}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                color: brand.muted,
                              }}
                            >
                              <Inventory2Icon />
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={1}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={itemTitleSx} noWrap>
                                {it.title || "Listing"}
                              </Typography>
                              <Typography sx={itemMetaSx}>
                                {(it.brand || "—") + (it.model ? ` • ${it.model}` : "")}
                              </Typography>

                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: 1 }}
                                flexWrap="wrap"
                                useFlexGap
                              >
                                {it.condition ? (
                                  <Chip
                                    label={String(it.condition).replaceAll("_", " ")}
                                    size="small"
                                    sx={pillSx}
                                  />
                                ) : null}

                                <Chip
                                  label={`$${Number(it.price || 0).toLocaleString()}`}
                                  size="small"
                                  sx={pillGhostSx}
                                />

                                <Chip
                                  label={`ID: ${String(it.listingId).slice(-6)}`}
                                  size="small"
                                  sx={pillGhostSx}
                                />
                              </Stack>
                            </Box>

                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Tooltip title="Copy listing id">
                                <IconButton
                                  size="small"
                                  onClick={() => copy("Listing ID", it.listingId)}
                                  sx={{ color: brand.navy }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Remove">
                                <IconButton
                                  size="small"
                                  onClick={() => removeItem(it.listingId)}
                                  sx={{ color: brand.navy }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>

                          <Divider sx={sectionDividerSx} />

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                          >
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => dec(it.listingId)}
                                sx={qtyBtnSx}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>

                              <TextField
                                value={it.quantity ?? 1}
                                onChange={(e) => setQty(it.listingId, e.target.value)}
                                type="number"
                                inputProps={{ min: 1 }}
                                size="small"
                                sx={qtyFieldSx}
                              />

                              <IconButton
                                size="small"
                                onClick={() => inc(it.listingId)}
                                sx={qtyBtnSx}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Stack>

                            <Typography sx={lineTotalSx}>
                              $
                              {(
                                Number(it.price || 0) * (Number(it.quantity) || 1)
                              ).toLocaleString()}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                            <Button
                              variant="outlined"
                              onClick={() => navigate(`/listing/${it.listingId}`)}
                              sx={secondaryButtonSx}
                            >
                              View listing
                            </Button>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card elevation={0} sx={panelCardSx}>
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Typography sx={sectionTitleSx}>Order summary</Typography>
                  <Typography sx={{ ...sectionSubSx, mt: 0.5 }}>
                    Taxes and shipping will calculate at checkout.
                  </Typography>

                  <Divider sx={sectionDividerSx} />

                  <Stack spacing={1}>
                    <Row label="Items" value={`${itemCount}`} />
                    <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
                    <Row label="Estimated shipping" value="—" />
                    <Row label="Estimated tax" value="—" />
                  </Stack>

                  <Divider sx={sectionDividerSx} />

                  <Stack spacing={1}>
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Buyer protection"
                      sx={pillSx}
                    />
                    <Chip
                      label="Secure checkout (coming soon)"
                      sx={pillGhostSx}
                    />
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={checkout}
                    sx={{ ...primaryButtonSx, mt: 2 }}
                  >
                    Checkout
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    startIcon={<ArrowBackRoundedIcon />}
                    onClick={() => navigate(-1)}
                    sx={backButtonSx}
                  >
                    Back
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Snackbar
          open={toast.open}
          autoHideDuration={2200}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={toast.type} variant="filled" sx={{ width: "100%" }}>
            {toast.msg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

function Row({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={summaryLabelSx}>{label}</Typography>
      <Typography sx={summaryValueSx}>{value}</Typography>
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
  mt: 1,
  color: brand.navy,
  textTransform: "none",
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "transparent",
    color: brand.green,
  },
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

const qtyBtnSx = {
  border: `1px solid ${brand.border}`,
  borderRadius: 2.5,
  color: brand.navy,
  bgcolor: brand.white,
  "&:hover": {
    bgcolor: alpha(brand.navy, 0.03),
    borderColor: brand.navy,
  },
};

const qtyFieldSx = {
  width: 90,
  "& .MuiInputBase-root": {
    bgcolor: brand.white,
    borderRadius: 2.5,
    color: brand.text,
    fontFamily: '"Semplicita Pro", sans-serif',
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.border,
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(brand.navy, 0.45),
  },
};

const sectionDividerSx = {
  my: 2,
  borderColor: brand.border,
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

const itemTitleSx = {
  fontWeight: 800,
  color: brand.text,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const itemMetaSx = {
  color: brand.muted,
  fontSize: 14,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const lineTotalSx = {
  fontWeight: 900,
  fontSize: 20,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const summaryLabelSx = {
  color: brand.muted,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const summaryValueSx = {
  color: brand.text,
  fontWeight: 900,
  fontFamily: '"Semplicita Pro", sans-serif',
};
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/http";
import {
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  TextField,
  Grid,
  Chip,
  Alert,
  Snackbar,
  Avatar,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Inventory2Icon from "@mui/icons-material/Inventory2";

const CART_KEY = "cart";

/**
 * Cart model stored in localStorage (as built in your ListingPage):
 * [
 *  { listingId, title, price, photo, quantity, condition, brand, model }
 * ]
 *
 * This page:
 * - Loads cart from localStorage
 * - Optionally refreshes details from backend per listingId (safe if endpoint exists)
 * - Lets user update qty, remove items, clear cart
 * - Shows totals
 * - Placeholder checkout button
 */
export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // local cart items
  const [err, setErr] = useState("");
  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });
  const [refreshing, setRefreshing] = useState(false);

  // 1) Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY) || "[]";
      const parsed = JSON.parse(raw);
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  // 2) (Optional) Refresh with latest listing data
  // If your backend is stable, this keeps cart current (price/title/photo).
  useEffect(() => {
    let mounted = true;

    async function refresh() {
      if (!items.length) return;
      setRefreshing(true);

      try {
        const next = await Promise.all(
          items.map(async (it) => {
            // If listingId missing, keep as-is
            if (!it?.listingId) return it;

            try {
              const res = await api.get(
                `http://localhost:8080/v1/listing/${encodeURIComponent(it.listingId)}`
              );
              const d = res.data || {};

              // Merge backend data onto cart item (keep quantity)
              const cover = Array.isArray(d.photos) && d.photos.length ? d.photos[0] : it.photo;

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
              return it; // fail silently; cart still works
            }
          })
        );

        if (!mounted) return;
        setItems(next);
        localStorage.setItem(CART_KEY, JSON.stringify(next));
      } finally {
        if (mounted) setRefreshing(false);
      }
    }

    // refresh once on mount load (after initial load)
    refresh();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

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
  };

  const inc = (listingId) => {
    const next = items.map((it) =>
      it.listingId === listingId ? { ...it, quantity: (Number(it.quantity) || 1) + 1 } : it
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
    // Placeholder: connect this to your checkout flow when ready.
    setToast({ open: true, type: "success", msg: "Checkout coming soon ✅" });
  };

  return (
    <Box sx={{ bgcolor: "#0b0f14", minHeight: "100vh", color: "#e6eef7" }}>
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
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.06)" }}>
              <ShoppingCartIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
                Cart
              </Typography>
              <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                {itemCount} item{itemCount === 1 ? "" : "s"} • Subtotal ${subtotal.toLocaleString()}
                {refreshing ? " • refreshing…" : ""}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={clearCart}
              disabled={!items.length}
              sx={{
                borderColor: "rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.9)",
                "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
              }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={checkout}
              disabled={!items.length}
              sx={{
                bgcolor: "#e6eef7",
                color: "#0b0f14",
                fontWeight: 900,
                "&:hover": { bgcolor: "#cfe0f4" },
              }}
            >
              Checkout
            </Button>
          </Stack>
        </Stack>

        {err && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: "rgba(255,255,255,0.06)",
              color: "#e6eef7",
              "& .MuiAlert-icon": { color: "inherit" },
            }}
          >
            {err}
          </Alert>
        )}

        {!items.length ? (
          <Card elevation={0} sx={quietCard}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5 }}>
                Your cart is empty
              </Typography>
              <Typography sx={{ color: "rgba(230,238,247,0.72)", mb: 2 }}>
                Browse listings and add items to your cart.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/categories")}
                sx={{
                  bgcolor: "#e6eef7",
                  color: "#0b0f14",
                  fontWeight: 900,
                  "&:hover": { bgcolor: "#cfe0f4" },
                }}
              >
                Browse listings
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {/* Items */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={2}>
                {items.map((it) => (
                  <Card key={it.listingId} elevation={0} sx={quietCard}>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        {/* Image */}
                        <Box
                          sx={{
                            width: { xs: "100%", sm: 180 },
                            height: { xs: 220, sm: 140 },
                            borderRadius: 3,
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.08)",
                            bgcolor: "rgba(255,255,255,0.02)",
                            flexShrink: 0,
                          }}
                        >
                          {it.photo ? (
                            <Box
                              component="img"
                              src={it.photo}
                              alt={it.title}
                              sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                display: "grid",
                                placeItems: "center",
                                color: "rgba(230,238,247,0.7)",
                              }}
                            >
                              <Inventory2Icon />
                            </Box>
                          )}
                        </Box>

                        {/* Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="h6" sx={{ fontWeight: 900 }} noWrap>
                                {it.title || "Listing"}
                              </Typography>
                              <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                                {(it.brand || "—") + (it.model ? ` • ${it.model}` : "")}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                                {it.condition ? (
                                  <Chip
                                    label={String(it.condition).replaceAll("_", " ")}
                                    size="small"
                                    sx={pill}
                                  />
                                ) : null}
                                <Chip label={`$${Number(it.price || 0).toLocaleString()}`} size="small" sx={pillGhost} />
                                <Chip
                                  label={`ID: ${String(it.listingId).slice(-6)}`}
                                  size="small"
                                  sx={pillGhost}
                                />
                              </Stack>
                            </Box>

                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Tooltip title="Copy listing id">
                                <IconButton
                                  size="small"
                                  onClick={() => copy("Listing ID", it.listingId)}
                                  sx={{ color: "rgba(255,255,255,0.8)" }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Remove">
                                <IconButton
                                  size="small"
                                  onClick={() => removeItem(it.listingId)}
                                  sx={{ color: "rgba(255,255,255,0.8)" }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>

                          <Divider sx={divider} />

                          {/* Qty row */}
                          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => dec(it.listingId)}
                                sx={qtyBtn}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>

                              <TextField
                                value={it.quantity ?? 1}
                                onChange={(e) => setQty(it.listingId, e.target.value)}
                                type="number"
                                inputProps={{ min: 1 }}
                                size="small"
                                sx={qtyField}
                              />

                              <IconButton
                                size="small"
                                onClick={() => inc(it.listingId)}
                                sx={qtyBtn}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Stack>

                            <Typography sx={{ fontWeight: 900, fontSize: 18 }}>
                              ${(
                                Number(it.price || 0) * (Number(it.quantity) || 1)
                              ).toLocaleString()}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                            <Button
                              variant="outlined"
                              onClick={() => navigate(`/listing/${it.listingId}`)}
                              sx={{
                                borderColor: "rgba(255,255,255,0.22)",
                                color: "rgba(255,255,255,0.9)",
                                "&:hover": { borderColor: "rgba(255,255,255,0.4)" },
                              }}
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

            {/* Summary */}
            <Grid item xs={12} lg={4}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Order summary
                  </Typography>
                  <Typography sx={{ color: "rgba(230,238,247,0.72)", mt: 0.5 }}>
                    Taxes and shipping will calculate at checkout.
                  </Typography>

                  <Divider sx={divider} />

                  <Stack spacing={1}>
                    <Row label="Items" value={`${itemCount}`} />
                    <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
                    <Row label="Estimated shipping" value="—" />
                    <Row label="Estimated tax" value="—" />
                  </Stack>

                  <Divider sx={divider} />

                  <Stack spacing={1}>
                    <Chip
                      // icon={<VerifiedIcon />}
                      label="Buyer protection"
                      sx={pill}
                    />
                    <Chip
                      label="Secure checkout (coming soon)"
                      sx={pillGhost}
                    />
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={checkout}
                    sx={{
                      mt: 2,
                      bgcolor: "#e6eef7",
                      color: "#0b0f14",
                      fontWeight: 900,
                      "&:hover": { bgcolor: "#cfe0f4" },
                    }}
                  >
                    Checkout
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => navigate(-1)}
                    sx={{ mt: 1, color: "rgba(255,255,255,0.82)" }}
                  >
                    ← Back
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
      <Typography sx={{ color: "rgba(230,238,247,0.72)", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "rgba(230,238,247,0.92)", fontWeight: 900 }}>
        {value}
      </Typography>
    </Stack>
  );
}

/* Styles */
const quietCard = {
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
};

const divider = { borderColor: "rgba(255,255,255,0.08)", my: 2 };

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

const qtyBtn = {
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 2,
  color: "rgba(255,255,255,0.9)",
};

const qtyField = {
  width: 90,
  "& .MuiInputBase-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    color: "rgba(255,255,255,0.92)",
  },
  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
};

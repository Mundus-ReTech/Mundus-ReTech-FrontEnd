import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RefreshIcon from "@mui/icons-material/Refresh";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaidIcon from "@mui/icons-material/Paid";
import InsightsIcon from "@mui/icons-material/Insights";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VerifiedIcon from "@mui/icons-material/Verified";
import SecurityIcon from "@mui/icons-material/Security";
import DownloadIcon from "@mui/icons-material/Download";
import api from "../lib/http";
import UploadCsvDialog from "../components/UploadCsvDialog";
import KpiCard from "../components/KpiCard";

/** ✅ adjust to match your backend */
const DASHBOARD_URL = "http://localhost:8080/v1/user"; // GET `${DASHBOARD_URL}/${userId}`

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getUserIdFromStorage() {
  const user = getStoredUser();
  return user?._id || user?.id || user?.userId || "";
}

export default function SmallBusinessDashboard() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [csvOpen, setCsvOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [err, setErr] = useState("");

  const menuOpen = Boolean(anchorEl);

  const filteredInventory = useMemo(() => {
    if (!search) return inventory;
    const s = search.toLowerCase();
    return inventory.filter(
      (i) =>
        (i.title || "").toLowerCase().includes(s) ||
        (i.brand || "").toLowerCase().includes(s) ||
        (i.model || "").toLowerCase().includes(s)
    );
  }, [inventory, search]);

  const computeMetrics = (inv = [], ord = []) => {
    const gross = ord.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const activeListings = inv.filter((i) => (i.status || "ACTIVE") === "ACTIVE").length;

    const shippedOrders = ord.filter((o) =>
      String(o.status || "").toUpperCase().includes("SHIPPED")
    ).length;

    const avg = inv.length
      ? Math.round(
          (inv.reduce((s, i) => s + (Number(i.rescuePrice ?? i.price) || 0), 0) /
            inv.length) *
            100
        ) / 100
      : 0;

    return {
      mrr: gross,
      pendingListings: activeListings,
      shippedOrders,
      avgPrice: avg,
      complianceScore: 92,
    };
  };

  const fetchDashboard = async () => {
    const userId = getUserIdFromStorage();
    if (!userId) {
      // ✅ don't silently return undefined; force the error so you see it
      throw new Error(
        "Missing user id. Ensure login sets localStorage.setItem('user', JSON.stringify(user))."
      );
    }

    const dashRes = await api.get(`${DASHBOARD_URL}/${encodeURIComponent(userId)}`);
    console.log("DASHBOARD RAW:", dashRes.data); // ✅ keep this while debugging
    return dashRes.data;
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const dash = await fetchDashboard();
        if (!mounted) return;

        // ✅ Normalize possible shapes.
        // If /v1/user/:id returns a user doc, you might not have inventory/orders here at all.
        // We'll accept all common names.
        const dashInventory =
          dash?.inventory ||
          dash?.listings ||
          dash?.items ||
          dash?.data?.inventory ||
          dash?.data?.listings ||
          dash?.data?.items ||
          [];

        const dashOrders = dash?.orders || dash?.data?.orders || [];
        const dashPayouts = dash?.payouts || dash?.data?.payouts || [];

        const inv = Array.isArray(dashInventory) ? dashInventory : [];
        const ord = Array.isArray(dashOrders) ? dashOrders : [];
        const pay = Array.isArray(dashPayouts) ? dashPayouts : [];

        setInventory(inv);
        setOrders(ord);
        setPayouts(pay);

        // ✅ ALWAYS set metrics:
        // If backend provided dash.metrics use it, else compute from inv/ord.
        const m = dash?.metrics || dash?.data?.metrics || computeMetrics(inv, ord);
        setMetrics(m);

        // ---- Optional fallback fetch if your /v1/user/:id doesn't include listings ----
        // If you find inv is always empty, uncomment this block and point it to your real listings endpoint.
        /*
        if (!inv.length) {
          const userId = getUserIdFromStorage();
          const listingsRes = await api.get(`http://localhost:8080/v1/listings/${encodeURIComponent(userId)}`);
          const items = listingsRes.data?.items || listingsRes.data?.listings || listingsRes.data || [];
          const normalizedInv = Array.isArray(items) ? items : [];
          setInventory(normalizedInv);
          const m2 = computeMetrics(normalizedInv, ord);
          setMetrics(dash?.metrics || m2);
        }
        */
      } catch (e) {
        console.error("Dashboard load failed:", e);
        if (mounted) {
          setErr(
            e?.response?.data?.message ||
              e?.response?.statusText ||
              e?.message ||
              "Failed to load dashboard."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: "-0.02em" }}>
              Small Business Dashboard
            </Typography>
            <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
              Manage inventory, track orders & payouts, and keep compliance tight.
            </Typography>
            {err && <Typography sx={{ mt: 1, color: "#ffb3b3" }}>{err}</Typography>}
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="New listing">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="/sell/new"
                sx={{
                  bgcolor: "#e6eef7",
                  color: "#0b0f14",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#cfe0f4" },
                }}
              >
                New Listing
              </Button>
            </Tooltip>

            <Tooltip title="Bulk upload via CSV">
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => setCsvOpen(true)}
                sx={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.9)" }}
              >
                Bulk Upload
              </Button>
            </Tooltip>

            <Tooltip title="More">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ color: "#e6eef7" }}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { bgcolor: "#121821", border: "1px solid #223047" } }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <DownloadIcon fontSize="small" style={{ marginRight: 8 }} /> Export CSV
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  window.location.reload();
                }}
              >
                <RefreshIcon fontSize="small" style={{ marginRight: 8 }} /> Refresh
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>

        {/* ✅ Top KPIs */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<InsightsIcon />}
              label="Gross sales (30d)"
              value={loading ? "—" : `$${(metrics?.mrr || 0).toLocaleString()}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<InventoryIcon />}
              label="Active listings"
              value={loading ? "—" : metrics?.pendingListings ?? 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<LocalShippingIcon />}
              label="Shipped (30d)"
              value={loading ? "—" : metrics?.shippedOrders ?? 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiCard
              icon={<PaidIcon />}
              label="Avg listing price"
              value={loading ? "—" : `$${metrics?.avgPrice ?? 0}`}
            />
          </Grid>
        </Grid>

        {/* Compliance strip */}
        <Card elevation={0} sx={quietCard}>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: "#2a8cff22", border: "1px solid #2a8cff33", color: "#a9d4ff" }}>
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Compliance health
                  </Typography>
                  <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                    Certificates & evidence uploaded for recent devices.
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 280 }}>
                <LinearProgress
                  variant="determinate"
                  value={metrics?.complianceScore || 0}
                  sx={{
                    flex: 1,
                    height: 8,
                    bgcolor: "rgba(255,255,255,0.06)",
                    "& .MuiLinearProgress-bar": { bgcolor: "#2aff9b" },
                    borderRadius: 10,
                  }}
                />
                <Chip icon={<VerifiedIcon />} label={`${metrics?.complianceScore || 0}%`} sx={pillStyle} />
                <Button
                  variant="outlined"
                  size="small"
                  href="/compliance"
                  sx={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.9)" }}
                >
                  Review
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Search */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="center" sx={{ mt: 3, mb: 1 }}>
          <TextField
            placeholder="Search inventory (brand / model / title)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={textFieldStyle}
          />
          <Button
            variant="outlined"
            sx={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.9)" }}
            onClick={() => setSearch("")}
          >
            Clear
          </Button>
        </Stack>

        {/* Main grid */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Card elevation={0} sx={quietCard}>
              <CardContent>
                <SectionHeader title="Inventory (recent)" action={<Button href="/inventory" size="small">Manage</Button>} />
                <Divider sx={divider} />
                {loading ? (
                  <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>Loading…</Typography>
                ) : filteredInventory.length ? (
                  <Stack spacing={1.25}>
                    {filteredInventory.slice(0, 8).map((it) => (
                      <InventoryRow key={it.id || it._id} item={it} />
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>No listings yet.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card elevation={0} sx={quietCard}>
              <CardContent>
                <SectionHeader title="Recent orders" action={<Button size="small" href="/orders">View all</Button>} />
                <Divider sx={divider} />
                <Stack spacing={1.25}>
                  {(orders || []).slice(0, 5).map((o) => (
                    <RowTwoCol
                      key={o.id || o._id}
                      left={
                        <>
                          <Typography sx={{ fontWeight: 700 }}>{o.buyer?.name || "Buyer"}</Typography>
                          <Typography sx={{ color: "rgba(230,238,247,0.72)", fontSize: 13 }}>
                            {o.items?.[0]?.title || "Order items"} • {o.status || "NEW"}
                          </Typography>
                        </>
                      }
                      right={<Typography>${o.total?.toFixed?.(2) || o.total || 0}</Typography>}
                    />
                  ))}
                  {!orders?.length && <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>No orders yet.</Typography>}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={0} sx={quietCard}>
              <CardContent>
                <SectionHeader title="Payouts" action={<Button size="small" href="/payouts">View statements</Button>} />
                <Divider sx={divider} />
                <Grid container spacing={1.25}>
                  {(payouts || []).slice(0, 4).map((p) => (
                    <Grid key={p.id || p._id} item xs={12} md={3}>
                      <Card elevation={0} sx={{ ...quietCard, p: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: "rgba(230,238,247,0.72)" }}>
                          {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900, mt: 0.5 }}>
                          ${p.amount || 0}
                        </Typography>
                        <Chip label={p.status || "PENDING"} size="small" sx={{ ...pillStyle, mt: 1 }} />
                      </Card>
                    </Grid>
                  ))}
                  {!payouts?.length && (
                    <Grid item xs={12}>
                      <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>No payouts yet.</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <UploadCsvDialog open={csvOpen} onClose={() => setCsvOpen(false)} onUploaded={() => window.location.reload()} />
    </Box>
  );
}

/* ——— Reusable bits ——— */
function SectionHeader({ title, action }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center">
        {action}
      </Stack>
    </Stack>
  );
}

function InventoryRow({ item }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Avatar
        variant="rounded"
        sx={{
          width: 42,
          height: 42,
          bgcolor: "#2a8cff22",
          border: "1px solid #2a8cff33",
          color: "#a9d4ff",
        }}
      >
        <InventoryIcon />
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700 }} noWrap>
          {item.title}
        </Typography>
        <Typography sx={{ color: "rgba(230,238,247,0.72)", fontSize: 13 }} noWrap>
          {item.brand} {item.model} • {item.condition}
        </Typography>
      </Box>
      <Chip label={`$${item.rescuePrice ?? item.price ?? 0}`} size="small" sx={pillStyle} />
      <Chip label={item.status || "ACTIVE"} size="small" sx={pillStyle} />
      <Button size="small" href={`/listing/${item.id || item._id}`} sx={{ color: "#a9d4ff" }}>
        View
      </Button>
    </Stack>
  );
}

function RowTwoCol({ left, right }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{left}</Box>
      <Box>{right}</Box>
    </Stack>
  );
}

/* ——— Styles ——— */
const quietCard = {
  bgcolor: "rgba(255,255,255,0.02)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
};

const pillStyle = {
  bgcolor: "transparent",
  border: "1px solid rgba(255,255,255,0.16)",
  color: "rgba(255, 255, 255, 1)",
  backdropFilter: "blur(4px)",
};

const divider = { borderColor: "rgba(255,255,255,0.08)", my: 1.25 };

const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    color: "rgba(255,255,255,0.9)",
  },
  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
};

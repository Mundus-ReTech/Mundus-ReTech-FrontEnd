import React, { useEffect, useMemo, useState } from "react";
import {
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
  LinearProgress,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
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
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import api from "../lib/http";
import UploadCsvDialog from "../components/UploadCsvDialog";
import KpiCard from "../components/KpiCard";

const DASHBOARD_URL = "http://localhost:8080/v1/user";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

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

    const activeListings = inv.filter(
      (i) => (i.status || "ACTIVE") === "ACTIVE"
    ).length;

    const shippedOrders = ord.filter((o) =>
      String(o.status || "").toUpperCase().includes("SHIPPED")
    ).length;

    const avg = inv.length
      ? Math.round(
          (inv.reduce(
            (sum, i) => sum + (Number(i.rescuePrice ?? i.price) || 0),
            0
          ) /
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
      throw new Error(
        "Missing user id. Ensure login sets localStorage.setItem('user', JSON.stringify(user))."
      );
    }

    const dashRes = await api.get(`${DASHBOARD_URL}/${encodeURIComponent(userId)}`);
    console.log("DASHBOARD RAW:", dashRes.data);
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

        const m = dash?.metrics || dash?.data?.metrics || computeMetrics(inv, ord);
        setMetrics(m);
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
        )} 0%, transparent 26%), ${brand.grayBg}`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", lg: "center" }}
          justifyContent="space-between"
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
              <StorefrontRoundedIcon sx={{ fontSize: 18 }} />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Seller operations
              </Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: '"vvyPreston Display", serif',
                fontSize: { xs: 34, md: 50 },
                lineHeight: 1.05,
                color: brand.navy,
              }}
            >
              Small Business Dashboard
            </Typography>

            <Typography
              sx={{
                mt: 1.25,
                color: brand.muted,
                fontSize: 16,
                lineHeight: 1.75,
                fontFamily: '"Semplicita Pro", sans-serif',
              }}
            >
              Manage inventory, track orders and payouts, and keep compliance in
              good standing.
            </Typography>

            {err && (
              <Typography
                sx={{
                  mt: 1.5,
                  color: "#B42318",
                  fontWeight: 600,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                {err}
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Tooltip title="New listing">
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                href="/sell/new"
                sx={primaryButtonSx}
              >
                New Listing
              </Button>
            </Tooltip>

            <Tooltip title="Bulk upload via CSV">
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => setCsvOpen(true)}
                sx={secondaryButtonSx}
              >
                Bulk Upload
              </Button>
            </Tooltip>

            <Tooltip title="More actions">
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  border: `1px solid ${brand.border}`,
                  borderRadius: 3,
                  color: brand.navy,
                  bgcolor: brand.white,
                  "&:hover": {
                    bgcolor: alpha(brand.navy, 0.03),
                    borderColor: alpha(brand.navy, 0.35),
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  border: `1px solid ${brand.border}`,
                  boxShadow: "0 18px 40px rgba(30, 58, 95, 0.12)",
                },
              }}
            >
              <MenuItem onClick={() => setAnchorEl(null)}>
                <DownloadIcon fontSize="small" style={{ marginRight: 8 }} />
                Export CSV
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  window.location.reload();
                }}
              >
                <RefreshIcon fontSize="small" style={{ marginRight: 8 }} />
                Refresh
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>

        <Grid container spacing={2.25} sx={{ mb: 2.25 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KpiShell
              icon={<InsightsIcon />}
              label="Gross sales (30d)"
              value={loading ? "—" : `$${(metrics?.mrr || 0).toLocaleString()}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiShell
              icon={<InventoryIcon />}
              label="Active listings"
              value={loading ? "—" : metrics?.pendingListings ?? 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiShell
              icon={<LocalShippingIcon />}
              label="Shipped (30d)"
              value={loading ? "—" : metrics?.shippedOrders ?? 0}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KpiShell
              icon={<PaidIcon />}
              label="Avg listing price"
              value={loading ? "—" : `$${metrics?.avgPrice ?? 0}`}
            />
          </Grid>
        </Grid>

        <Card elevation={0} sx={panelCardSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", lg: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: alpha(brand.green, 0.12),
                    color: brand.green,
                    border: `1px solid ${alpha(brand.green, 0.18)}`,
                  }}
                >
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: brand.navy,
                      fontFamily: '"Semplicita Pro", sans-serif',
                    }}
                  >
                    Compliance health
                  </Typography>
                  <Typography
                    sx={{
                      color: brand.muted,
                      fontSize: 14,
                      fontFamily: '"Semplicita Pro", sans-serif',
                    }}
                  >
                    Certificates and supporting evidence uploaded for recent
                    devices.
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ minWidth: { lg: 360 } }}
              >
                <LinearProgress
                  variant="determinate"
                  value={metrics?.complianceScore || 0}
                  sx={{
                    flex: 1,
                    minWidth: 180,
                    height: 8,
                    bgcolor: alpha(brand.navy, 0.08),
                    borderRadius: 999,
                    "& .MuiLinearProgress-bar": {
                      bgcolor: brand.green,
                    },
                  }}
                />
                <Chip
                  icon={<VerifiedIcon />}
                  label={`${metrics?.complianceScore || 0}%`}
                  sx={pillStyle}
                />
                <Button
                  variant="outlined"
                  size="small"
                  href="/compliance"
                  sx={secondaryButtonSx}
                >
                  Review
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems="center"
          sx={{ mt: 3, mb: 1.5 }}
        >
          <TextField
            placeholder="Search inventory by brand, model, or title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={searchFieldSx}
          />
          <Button variant="outlined" onClick={() => setSearch("")} sx={secondaryButtonSx}>
            Clear
          </Button>
        </Stack>

        <Grid container spacing={2.25}>
          <Grid item xs={12} md={7}>
            <Card elevation={0} sx={panelCardSx}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeader
                  title="Inventory"
                  subtitle="Recent active listings and inventory items"
                  action={
                    <Button href="/inventory" size="small" sx={linkButtonSx}>
                      Manage
                    </Button>
                  }
                />
                <Divider sx={sectionDividerSx} />

                {loading ? (
                  <Typography sx={emptyTextSx}>Loading...</Typography>
                ) : filteredInventory.length ? (
                  <Stack spacing={1.35}>
                    {filteredInventory.slice(0, 8).map((it) => (
                      <InventoryRow key={it.id || it._id} item={it} />
                    ))}
                  </Stack>
                ) : (
                  <Typography sx={emptyTextSx}>No listings yet.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card elevation={0} sx={panelCardSx}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeader
                  title="Recent orders"
                  subtitle="Latest buyer activity"
                  action={
                    <Button size="small" href="/orders" sx={linkButtonSx}>
                      View all
                    </Button>
                  }
                />
                <Divider sx={sectionDividerSx} />

                <Stack spacing={1.25}>
                  {(orders || []).slice(0, 5).map((o) => (
                    <RowCard
                      key={o.id || o._id}
                      left={
                        <>
                          <Typography sx={rowTitleSx}>
                            {o.buyer?.name || "Buyer"}
                          </Typography>
                          <Typography sx={rowMetaSx}>
                            {o.items?.[0]?.title || "Order items"} •{" "}
                            {o.status || "NEW"}
                          </Typography>
                        </>
                      }
                      right={
                        <Typography sx={amountTextSx}>
                          ${o.total?.toFixed?.(2) || o.total || 0}
                        </Typography>
                      }
                    />
                  ))}

                  {!orders?.length && (
                    <Typography sx={emptyTextSx}>No orders yet.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card elevation={0} sx={panelCardSx}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeader
                  title="Payouts"
                  subtitle="Recent transfer and statement activity"
                  action={
                    <Button size="small" href="/payouts" sx={linkButtonSx}>
                      View statements
                    </Button>
                  }
                />
                <Divider sx={sectionDividerSx} />

                <Grid container spacing={1.5}>
                  {(payouts || []).slice(0, 4).map((p) => (
                    <Grid item xs={12} md={3} key={p.id || p._id}>
                      <Card elevation={0} sx={miniCardSx}>
                        <Typography sx={rowMetaSx}>
                          {new Date(
                            p.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </Typography>
                        <Typography sx={miniValueSx}>
                          ${p.amount || 0}
                        </Typography>
                        <Chip
                          label={p.status || "PENDING"}
                          size="small"
                          sx={{ ...pillStyle, mt: 1.25 }}
                        />
                      </Card>
                    </Grid>
                  ))}

                  {!payouts?.length && (
                    <Grid item xs={12}>
                      <Typography sx={emptyTextSx}>No payouts yet.</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <UploadCsvDialog
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        onUploaded={() => window.location.reload()}
      />
    </Box>
  );
}

function KpiShell({ icon, label, value }) {
  return (
    <Card elevation={0} sx={panelCardSx}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar
            sx={{
              bgcolor: alpha(brand.navy, 0.08),
              color: brand.navy,
              border: `1px solid ${alpha(brand.navy, 0.12)}`,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography sx={kpiLabelSx}>{label}</Typography>
            <Typography sx={kpiValueSx}>{value}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
    >
      <Box>
        <Typography
          sx={{
            fontSize: 22,
            fontWeight: 800,
            color: brand.navy,
            fontFamily: '"Semplicita Pro", sans-serif',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              mt: 0.35,
              fontSize: 14,
              color: brand.muted,
              fontFamily: '"Semplicita Pro", sans-serif',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}

function InventoryRow({ item }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        p: 1.5,
        borderRadius: 3,
        border: `1px solid ${alpha(brand.navy, 0.08)}`,
        bgcolor: brand.white,
      }}
    >
      <Avatar
        variant="rounded"
        sx={{
          width: 44,
          height: 44,
          bgcolor: alpha(brand.green, 0.10),
          color: brand.green,
          border: `1px solid ${alpha(brand.green, 0.16)}`,
        }}
      >
        <InventoryIcon />
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={rowTitleSx} noWrap>
          {item.title}
        </Typography>
        <Typography sx={rowMetaSx} noWrap>
          {item.brand} {item.model} • {item.condition}
        </Typography>
      </Box>

      <Chip
        label={`$${item.rescuePrice ?? item.price ?? 0}`}
        size="small"
        sx={pillStyle}
      />
      <Chip label={item.status || "ACTIVE"} size="small" sx={pillStyle} />
      <Button
        size="small"
        href={`/listing/${item.id || item._id}`}
        sx={linkButtonSx}
      >
        View
      </Button>
    </Stack>
  );
}

function RowCard({ left, right }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        p: 1.5,
        borderRadius: 3,
        border: `1px solid ${alpha(brand.navy, 0.08)}`,
        bgcolor: brand.white,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>{left}</Box>
      <Box>{right}</Box>
    </Stack>
  );
}

const panelCardSx = {
  borderRadius: 5,
  border: `1px solid ${brand.border}`,
  bgcolor: brand.white,
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
};

const miniCardSx = {
  p: 2,
  height: "100%",
  borderRadius: 4,
  border: `1px solid ${alpha(brand.navy, 0.08)}`,
  bgcolor: brand.grayBg,
  boxShadow: "none",
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

const searchFieldSx = {
  "& .MuiInputBase-root": {
    borderRadius: 3,
    bgcolor: brand.white,
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
  },
};

const pillStyle = {
  bgcolor: alpha(brand.navy, 0.05),
  color: brand.navy,
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const kpiLabelSx = {
  fontSize: 14,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const kpiValueSx = {
  mt: 0.35,
  fontSize: 28,
  lineHeight: 1.1,
  fontWeight: 900,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const rowTitleSx = {
  fontWeight: 700,
  color: brand.text,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const rowMetaSx = {
  fontSize: 13,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const amountTextSx = {
  fontWeight: 800,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const miniValueSx = {
  mt: 0.5,
  fontSize: 24,
  lineHeight: 1.1,
  fontWeight: 900,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const emptyTextSx = {
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};
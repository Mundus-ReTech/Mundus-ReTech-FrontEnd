// src/pages/EnterpriseDashboard.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Chip,
  Divider,
  Avatar,
  LinearProgress,
  Tooltip,
  IconButton,
  TextField,
  Link,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  alpha,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import InventoryIcon from "@mui/icons-material/Inventory2";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ShieldIcon from "@mui/icons-material/Shield";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaymentsIcon from "@mui/icons-material/Payments";
import KeyIcon from "@mui/icons-material/Key";
import HttpIcon from "@mui/icons-material/Http";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupIcon from "@mui/icons-material/Group";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VerifiedIcon from "@mui/icons-material/Verified";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

export default function EnterpriseBusinessDashboard() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const apiKey = "rt_live_******************_9VQX";

  const kpis = useMemo(
    () => ({
      gmv: 128450.32,
      orders: 642,
      sellThrough: 68,
      pendingPayouts: 19230.55,
      nextPayoutDate: "Fri, Oct 10",
    }),
    []
  );

  const inventorySummary = useMemo(
    () => ({
      totalSkus: 119,
      totalUnits: 2187,
      categories: [
        { name: "Laptops", units: 740 },
        { name: "Networking", units: 520 },
        { name: "AV/Pro Audio", units: 430 },
        { name: "Monitors", units: 300 },
        { name: "Components", units: 197 },
      ],
      conditions: [
        { grade: "NEW", pct: 5 },
        { grade: "LIKE_NEW", pct: 22 },
        { grade: "REFURBISHED", pct: 38 },
        { grade: "GOOD", pct: 24 },
        { grade: "FAIR", pct: 9 },
        { grade: "FOR_PARTS", pct: 2 },
      ],
    }),
    []
  );

  const orders = useMemo(
    () => [
      { id: "ORD-10421", title: "Dell Latitude 5420 (Batch A)", qty: 12, total: 3840, status: "Awaiting Pickup", date: "2025-10-02", zip: "10027" },
      { id: "ORD-10413", title: "Cisco 9300 Switch x4", qty: 4, total: 5600, status: "Shipped", date: "2025-10-01", zip: "07302" },
      { id: "ORD-10388", title: "Crestron DMPS3-4K-350-C", qty: 2, total: 2200, status: "Delivered", date: "2025-09-29", zip: "11201" },
      { id: "ORD-10377", title: "ThinkPad T14 Gen2", qty: 20, total: 14000, status: "Processing", date: "2025-09-28", zip: "10013" },
    ],
    []
  );

  const payouts = useMemo(
    () => [
      { id: "PAYOUT-579", amount: 11890.45, period: "Sep 22–Sep 28", status: "Settled" },
      { id: "PAYOUT-578", amount: 8200.0, period: "Sep 15–Sep 21", status: "Settled" },
      { id: "PAYOUT-577", amount: 9600.73, period: "Sep 08–Sep 14", status: "Settled" },
    ],
    []
  );

  const alerts = useMemo(
    () => [
      { type: "compliance", text: "3 batches need wipe attestation uploads", severity: "warning" },
      { type: "shipping", text: "7 orders awaiting pickup window confirmation", severity: "info" },
      { type: "inventory", text: "Low stock: Latitude 5420 (10 units or fewer remaining)", severity: "info" },
    ],
    []
  );

  const checklist = useMemo(
    () => [
      { label: "Connect payout bank account", done: true },
      { label: "Upload first CSV of inventory", done: true },
      { label: "Configure API key and webhook", done: false },
      { label: "Add data wipe policy attestation", done: false },
    ],
    []
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: brand.grayBg,
        color: brand.text,
        py: { xs: 4, md: 6 },
        background: `radial-gradient(circle at top right, ${alpha(
          brand.green,
          0.06
        )} 0%, transparent 22%), radial-gradient(circle at left top, ${alpha(
          brand.navy,
          0.05
        )} 0%, transparent 28%), ${brand.grayBg}`,
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{ px: { xs: 2, sm: 3, md: 4 }, width: "100%", maxWidth: "100%" }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 2.5 }}
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
              <VerifiedIcon sx={{ fontSize: 18 }} />
              <Typography sx={eyebrowSx}>Enterprise operations</Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: '"vvyPreston Display", serif',
                fontSize: { xs: 34, md: 50 },
                lineHeight: 1.05,
                color: brand.navy,
              }}
            >
              Enterprise Dashboard
            </Typography>
            <Typography sx={subTextSx}>
              Overview of sales, inventory, compliance, and payouts.
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Chip label="Enterprise" sx={chipTone} icon={<VerifiedIcon />} />
            <Chip label="High-Volume Tier" sx={chipTone} />
            <Button
              variant="contained"
              startIcon={<UploadFileIcon />}
              sx={primaryBtn}
              href="/partners/post?type=enterprise"
            >
              Post Inventory
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 2,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          <KpiCard title="GMV (30d)" value={`$${kpis.gmv.toLocaleString()}`} hint="+12% vs previous period" />
          <KpiCard title="Orders (30d)" value={kpis.orders} hint="+6% vs previous period" />
          <KpiCard title="Sell-through" value={`${kpis.sellThrough}%`} hint="Target 70% or higher" />
          <KpiCard
            title="Pending payouts"
            value={`$${kpis.pendingPayouts.toLocaleString()}`}
            hint={`Next payout: ${kpis.nextPayoutDate}`}
            icon={<CalendarMonthIcon />}
          />

          <Card sx={card}>
            <CardHeader title={<Header title="Operational alerts" icon={<WarningAmberIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <Stack spacing={1.25}>
                {alerts.map((a, i) => (
                  <AlertItem key={i} severity={a.severity} text={a.text} />
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={card}>
            <CardHeader title={<Header title="Onboarding checklist" icon={<DoneAllIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <List dense>
                {checklist.map((c, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={miniIcon}>
                        {c.done ? <CheckCircleIcon fontSize="small" /> : <WarningAmberIcon fontSize="small" />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: c.done ? brand.text : "#B54708", fontFamily: '"Semplicita Pro", sans-serif' }}>
                          {c.label}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ ...card, gridColumn: { xs: "span 1", md: "span 2" } }}>
            <CardHeader title={<Header title="Inventory overview" icon={<InventoryIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <Typography sx={subTextSx}>
                {inventorySummary.totalSkus} SKUs • {inventorySummary.totalUnits} Units
              </Typography>

              <Divider sx={divider} />

              <Typography sx={sectionLabelSx}>By category</Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                {inventorySummary.categories.map((c) => (
                  <Stack key={c.name} direction="row" spacing={1} alignItems="center">
                    <Badge variant="dot" sx={{ "& .MuiBadge-badge": { bgcolor: brand.navy } }}>
                      <Box sx={{ width: 0, height: 0 }} />
                    </Badge>
                    <Typography sx={{ flex: 1, fontFamily: '"Semplicita Pro", sans-serif' }}>
                      {c.name}
                    </Typography>
                    <Typography sx={subTextSx}>{c.units} units</Typography>
                  </Stack>
                ))}
              </Stack>

              <Typography sx={sectionLabelSx}>Condition mix</Typography>
              <Stack spacing={1}>
                {inventorySummary.conditions.map((g) => (
                  <Stack key={g.grade} spacing={0.5}>
                    <Typography sx={{ fontSize: 12, color: brand.text, fontFamily: '"Semplicita Pro", sans-serif' }}>
                      {g.grade}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={g.pct}
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: alpha(brand.navy, 0.08),
                        "& .MuiLinearProgress-bar": { backgroundColor: brand.green },
                      }}
                    />
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={card}>
            <CardHeader title={<Header title="Compliance center" icon={<ShieldIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <Stack spacing={1.25}>
                <ComplianceRow title="Wipe attestations" pending={3} action="Upload CSV / PDFs" />
                <ComplianceRow title="Batch certificates" pending={1} action="Generate" />
                <ComplianceRow title="Photo guidelines" pending={0} action="View policy" />
                <ComplianceRow title="Audit log" pending={0} action="Download" />
              </Stack>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button variant="outlined" startIcon={<DownloadIcon />} sx={ghostBtn}>
                Export compliance report
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ ...card, gridColumn: { xs: "span 1", md: "span 2" } }}>
            <CardHeader title={<Header title="Recent orders" icon={<ReceiptLongIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <TableList
                rows={orders}
                columns={[
                  { key: "id", label: "Order ID" },
                  { key: "title", label: "Title" },
                  { key: "qty", label: "Qty" },
                  { key: "total", label: "Total", render: (v) => `$${v.toLocaleString()}` },
                  { key: "status", label: "Status" },
                  { key: "date", label: "Date" },
                ]}
              />
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button variant="text" sx={linkBtn} href="/orders">
                View all orders
              </Button>
              <Button variant="contained" sx={primaryBtn} href="/shipping">
                Manage pickups & shipping
              </Button>
            </CardActions>
          </Card>

          <Card sx={card}>
            <CardHeader title={<Header title="Payouts" icon={<PaymentsIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <TableList
                rows={payouts}
                columns={[
                  { key: "id", label: "Payout ID" },
                  { key: "period", label: "Period" },
                  { key: "amount", label: "Amount", render: (v) => `$${v.toLocaleString()}` },
                  { key: "status", label: "Status" },
                ]}
              />
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button variant="outlined" sx={ghostBtn}>
                Download statements
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ ...card, gridColumn: { xs: "span 1", md: "span 2" } }}>
            <CardHeader title={<Header title="Bulk tools & integrations" icon={<AssessmentIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <Stack spacing={1.5}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button variant="contained" sx={primaryBtn} startIcon={<UploadFileIcon />} href="/import/csv">
                    Upload CSV
                  </Button>
                  <Button variant="outlined" sx={ghostBtn} startIcon={<DownloadIcon />}>
                    Download CSV Template
                  </Button>
                </Stack>

                <Divider sx={divider} />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                  <Avatar sx={miniIcon}>
                    <KeyIcon fontSize="small" />
                  </Avatar>
                  <Typography sx={{ flex: 1, fontFamily: '"Semplicita Pro", sans-serif' }}>
                    API Key
                  </Typography>
                  <TextField
                    size="small"
                    value={apiKeyVisible ? "rt_live_1234567890abcdef_9VQX" : apiKey}
                    InputProps={{ readOnly: true, sx: textField }}
                    sx={{ width: { xs: "100%", sm: 360 } }}
                  />
                  <Tooltip title={apiKeyVisible ? "Hide key" : "Reveal key"}>
                    <Switch checked={apiKeyVisible} onChange={() => setApiKeyVisible((v) => !v)} />
                  </Tooltip>
                  <Tooltip title="Copy">
                    <IconButton onClick={() => navigator.clipboard.writeText("rt_live_1234567890abcdef_9VQX")}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                  <Avatar sx={miniIcon}>
                    <HttpIcon fontSize="small" />
                  </Avatar>
                  <Typography sx={{ flex: 1, fontFamily: '"Semplicita Pro", sans-serif' }}>
                    Webhook URL
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="https://yourdomain.com/webhooks/retech"
                    InputProps={{ sx: textField }}
                    sx={{ width: { xs: "100%", sm: 360 } }}
                  />
                  <Button variant="outlined" sx={ghostBtn}>
                    Save
                  </Button>
                </Stack>

                <Typography sx={{ ...subTextSx, fontSize: 12 }}>
                  Supported webhooks: order.created, order.updated, payout.created, listing.published, compliance.updated
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={card}>
            <CardHeader title={<Header title="Team & permissions" icon={<GroupIcon />} />} sx={cardHdr} />
            <CardContent sx={{ pt: 0 }}>
              <Stack spacing={1.25}>
                {[
                  { name: "Alex Rivera", role: "Admin" },
                  { name: "Priya Desai", role: "Ops" },
                  { name: "Sam Chen", role: "Finance" },
                ].map((u) => (
                  <Stack key={u.name} direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(brand.navy, 0.08), color: brand.navy }}>
                      {u.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </Avatar>
                    <Typography sx={{ flex: 1, fontFamily: '"Semplicita Pro", sans-serif' }}>
                      {u.name}
                    </Typography>
                    <Chip label={u.role} size="small" sx={chipTone} />
                    <Button variant="text" sx={linkBtn}>
                      Manage
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button variant="contained" sx={primaryBtn} startIcon={<AddIcon />}>
                Invite teammate
              </Button>
            </CardActions>
          </Card>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 2.5 }}
        >
          <Typography sx={{ ...subTextSx, fontSize: 14 }}>
            Need help? <Link href="/contact">Contact support</Link>
          </Typography>
          <Typography sx={{ ...subTextSx, fontSize: 14 }}>
            © {new Date().getFullYear()} ReTech • Enterprise
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function Header({ title, icon }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar sx={miniIcon}>{icon}</Avatar>
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
    </Stack>
  );
}

function KpiCard({ title, value, hint, icon }) {
  return (
    <Card sx={{ ...card, minHeight: 120 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ ...subTextSx, fontSize: 13 }}>{title}</Typography>
          {icon ? <Avatar sx={miniIcon}>{icon}</Avatar> : null}
        </Stack>
        <Typography
          sx={{
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 900,
            color: brand.navy,
            mt: 0.5,
            fontFamily: '"Semplicita Pro", sans-serif',
          }}
        >
          {value}
        </Typography>
        {hint ? <Typography sx={{ ...subTextSx, fontSize: 12, mt: 0.5 }}>{hint}</Typography> : null}
      </CardContent>
    </Card>
  );
}

function AlertItem({ severity = "info", text }) {
  const color =
    severity === "warning"
      ? "#B54708"
      : severity === "error"
      ? "#B42318"
      : brand.text;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar sx={miniIcon}>
        <WarningAmberIcon fontSize="small" />
      </Avatar>
      <Typography sx={{ color, fontFamily: '"Semplicita Pro", sans-serif' }}>{text}</Typography>
    </Stack>
  );
}

function ComplianceRow({ title, pending = 0, action = "Review" }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Avatar sx={miniIcon}>
        <ShieldIcon fontSize="small" />
      </Avatar>
      <Typography sx={{ flex: 1, fontFamily: '"Semplicita Pro", sans-serif' }}>{title}</Typography>
      {pending > 0 ? (
        <Chip size="small" label={`${pending} pending`} sx={chipTone} />
      ) : (
        <Chip size="small" label="All good" sx={chipTone} icon={<CheckCircleIcon />} />
      )}
      <Button variant="text" sx={linkBtn}>
        {action}
      </Button>
    </Stack>
  );
}

function TableList({ rows, columns }) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${brand.border}`,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          p: 1.5,
          bgcolor: brand.grayBg,
          borderBottom: `1px solid ${brand.border}`,
        }}
      >
        {columns.map((c) => (
          <Typography
            key={c.key}
            sx={{
              fontSize: 12,
              color: brand.muted,
              fontFamily: '"Semplicita Pro", sans-serif',
            }}
          >
            {c.label}
          </Typography>
        ))}
      </Box>

      <Stack>
        {rows.map((r, idx) => (
          <Box
            key={idx}
            sx={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              p: 1.5,
              borderBottom: `1px solid ${alpha(brand.navy, 0.06)}`,
              "&:hover": { backgroundColor: alpha(brand.navy, 0.02) },
            }}
          >
            {columns.map((c) => {
              const val = r[c.key];
              const out = c.render ? c.render(val, r) : val;
              return (
                <Typography
                  key={c.key}
                  sx={{
                    color: brand.text,
                    fontFamily: '"Semplicita Pro", sans-serif',
                  }}
                >
                  {out}
                </Typography>
              );
            })}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

const card = {
  bgcolor: brand.white,
  border: `1px solid ${brand.border}`,
  color: brand.text,
  borderRadius: 5,
  height: "100%",
  width: "100%",
  boxSizing: "border-box",
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
};

const cardHdr = {
  p: 2.5,
  "& .MuiCardHeader-title": { fontWeight: 800 },
};

const chipTone = {
  bgcolor: alpha(brand.navy, 0.05),
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  color: brand.navy,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const primaryBtn = {
  bgcolor: brand.navy,
  color: brand.white,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "none",
  borderRadius: 3,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "#16304F",
    boxShadow: "none",
  },
};

const ghostBtn = {
  color: brand.navy,
  borderColor: brand.border,
  textTransform: "none",
  fontWeight: 700,
  borderRadius: 3,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    borderColor: brand.navy,
    bgcolor: alpha(brand.navy, 0.03),
  },
};

const linkBtn = {
  color: brand.navy,
  textTransform: "none",
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "transparent",
    color: brand.green,
  },
};

const miniIcon = {
  width: 30,
  height: 30,
  bgcolor: alpha(brand.navy, 0.08),
  color: brand.navy,
};

const divider = {
  my: 1.75,
  borderColor: brand.border,
};

const textField = {
  bgcolor: brand.white,
  color: brand.text,
  borderRadius: 3,
  fontFamily: '"Semplicita Pro", sans-serif',
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.border,
  },
};

const eyebrowSx = {
  fontSize: 13,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const subTextSx = {
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const sectionLabelSx = {
  mb: 1,
  fontWeight: 700,
  color: brand.text,
  fontFamily: '"Semplicita Pro", sans-serif',
};
import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Grid, Typography, Stack, TextField, InputAdornment,
  Select, MenuItem, FormControl, Chip, Slider, Button, Card, CardContent,
  CardActions, Avatar, Pagination, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import RouterIcon from "@mui/icons-material/Router";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MemoryIcon from "@mui/icons-material/Memory";
import MonitorIcon from "@mui/icons-material/Monitor";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import StorageIcon from "@mui/icons-material/Storage";
import DnsIcon from "@mui/icons-material/Dns";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import api from "../lib/http";

const CATEGORY_OPTIONS = [
  { v: "", label: "All categories" },
  { v: "LAPTOP", label: "Laptops", icon: <LaptopMacIcon /> },
  { v: "TABLET", label: "Tablets", icon: <TabletMacIcon /> },
  { v: "PHONE", label: "Phones", icon: <PhoneIphoneIcon /> },
  { v: "MONITOR", label: "Monitors", icon: <MonitorIcon /> },
  { v: "COMPONENT", label: "Components", icon: <MemoryIcon /> },
  { v: "NETWORKING", label: "Networking", icon: <RouterIcon /> },
  { v: "SERVER", label: "Servers", icon: <DnsIcon /> },
  { v: "ACCESSORY", label: "Accessories", icon: <HeadphonesIcon /> },
  { v: "OTHER", label: "Other", icon: <StorageIcon /> },
];

const CONDITIONS = ["NEW","LIKE_NEW","REFURBISHED","GOOD","FAIR","FOR_PARTS"];

export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("cat") || "");
  const [zip, setZip] = useState(params.get("zip") || "");
  const [price, setPrice] = useState([Number(params.get("min") || 0), Number(params.get("max") || 800)]);
  const [cond, setCond] = useState(params.getAll("cond") || []);
  const [page, setPage] = useState(Number(params.get("page") || 1));
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const limit = 24;

  const apiQuery = useMemo(() => {
    const p = {
      page, limit, q: q || undefined, category: category || undefined,
      zip: zip || undefined, minPrice: price[0] || undefined,
      maxPrice: price[1] || undefined, status: "ACTIVE",
    };
    if (cond?.length) p.condition = cond;
    return p;
  }, [page, q, category, zip, price, cond]);

  useEffect(() => {
    // keep URL in sync
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("cat", category);
    if (zip) next.set("zip", zip);
    if (price[0]) next.set("min", String(price[0]));
    if (price[1]) next.set("max", String(price[1]));
    if (page !== 1) next.set("page", String(page));
    cond.forEach(c => next.append("cond", c));
    setParams(next, { replace: true });
  }, [q, category, zip, price, cond, page, setParams]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await api.get("/listings", { params: apiQuery });
      if (!isMounted) return;
      setItems(data.items || []);
      setCount(data.count || 0);
    })();
    return () => { isMounted = false; };
  }, [apiQuery]);

  const pages = Math.max(1, Math.ceil(count / limit));

  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          Browse tech
        </Typography>
        <Typography sx={{ color: "rgba(230,238,247,0.72)", mb: 3 }}>
          Filter by category, condition, price, and ZIP to find the best rescue deals.
        </Typography>

        {/* Filter bar */}
        <Card elevation={0} sx={quietCard}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="Search brand, model, specs…"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "rgba(255,255,255,0.6)" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <Select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                    displayEmpty
                    sx={selectStyle}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <MenuItem key={c.v || "all"} value={c.v}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {c.icon && <Box sx={{ opacity: 0.8 }}>{c.icon}</Box>}
                          <span>{c.label}</span>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  value={zip}
                  onChange={(e) => { setZip(e.target.value); setPage(1); }}
                  placeholder="ZIP"
                  fullWidth
                  sx={textFieldStyle}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <Stack spacing={0.5}>
                  <Typography sx={{ fontSize: 12, color: "rgba(230,238,247,0.72)" }}>
                    Price range (${price[0]} – ${price[1]})
                  </Typography>
                  <Slider
                    value={price}
                    onChange={(_, val) => { setPrice(val); setPage(1); }}
                    valueLabelDisplay="off"
                    min={0}
                    max={2000}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {CONDITIONS.map((c) => {
                    const active = cond.includes(c);
                    return (
                      <Chip
                        key={c}
                        label={c.replace("_", " ")}
                        onClick={() => {
                          const next = active ? cond.filter(x => x !== c) : [...cond, c];
                          setCond(next); setPage(1);
                        }}
                        sx={{
                          ...pillStyle,
                          ...(active ? pillActive : null),
                        }}
                      />
                    );
                  })}
                  <Button
                    onClick={() => { setQ(""); setCategory(""); setZip(""); setCond([]); setPrice([0, 800]); setPage(1); }}
                    size="small"
                    sx={{ ml: "auto", color: "rgba(255,255,255,0.88)" }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Meta / count */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, mb: 1 }}>
          <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
            {count} results
          </Typography>
          <Divider flexItem sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 1 }} />
          {category && (
            <Chip size="small" label={category} sx={{ ...pillStyle }} />
          )}
        </Stack>

        {/* Results grid */}
        <Grid container spacing={2}>
          {items.map((it) => (
            <Grid key={it._id} item xs={12} sm={6} md={3}>
              <Card
                elevation={0}
                component={RouterLink}
                to={`/listing/${it._id}`}
                sx={{
                  ...quietCard,
                  textDecoration: "none",
                  transition: "transform .2s ease",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, pr: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {it.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={it.condition}
                      icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                      sx={{ ...pillStyle, ml: 1 }}
                    />
                  </Stack>
                  <Typography sx={{ color: "rgba(230,238,247,0.64)", mb: 1 }} noWrap>
                    {(it.brand || "") + (it.model ? ` ${it.model}` : "")}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    ${it.rescuePrice}
                  </Typography>
                  {it.pickup?.address?.zip && (
                    <Typography sx={{ color: "rgba(230,238,247,0.56)", mt: 0.5, fontSize: 13 }}>
                      ZIP {it.pickup.address.zip}
                    </Typography>
                  )}
                </CardContent>
                <CardActions sx={{ px: 2.5, pb: 2.5 }}>
                  <Button variant="contained" size="small" sx={{ bgcolor: "#e6eef7", color: "#0b0f14", fontWeight: 700, "&:hover": { bgcolor: "#cfe0f4" } }}>
                    View
                  </Button>
                  <Button variant="text" size="small" sx={{ color: "rgba(255,255,255,0.88)", ml: "auto" }}>
                    Hold 15 min
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {pages > 1 && (
          <Stack alignItems="center" sx={{ mt: 3 }}>
            <Pagination
              count={pages}
              page={page}
              onChange={(_, p) => setPage(p)}
              sx={{
                "& .MuiPaginationItem-root": { color: "rgba(255,255,255,0.88)" },
                "& .Mui-selected": { bgcolor: "rgba(255,255,255,0.12) !important" },
              }}
            />
          </Stack>
        )}
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

const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    color: "rgba(255,255,255,0.9)",
  },
  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
};

const selectStyle = {
  ...textFieldStyle,
  "& .MuiSelect-select": { py: 1.2 },
};

const pillStyle = {
  bgcolor: "transparent",
  border: "1px solid rgba(255,255,255,0.16)",
  color: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(4px)",
};

const pillActive = {
  bgcolor: "rgba(255,255,255,0.1)",
  borderColor: "rgba(255,255,255,0.28)",
};

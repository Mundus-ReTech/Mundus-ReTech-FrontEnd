import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Grid, Typography, Stack, TextField, InputAdornment,
  Select, MenuItem, FormControl, Chip, Slider, Button, Card, CardContent,
  CardActions, Pagination, Divider, Drawer, IconButton, Accordion,
  AccordionSummary, AccordionDetails, Checkbox, FormGroup, FormControlLabel,
  Autocomplete
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import RouterIcon from "@mui/icons-material/Router";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MemoryIcon from "@mui/icons-material/Memory";
import MonitorIcon from "@mui/icons-material/Monitor";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import StorageIcon from "@mui/icons-material/Storage";
import DnsIcon from "@mui/icons-material/Dns";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import axios from "axios";

/* ---------- facet options ---------- */
const TECHNOLOGY_TYPES = [
  { v: "GENERAL", label: "General purpose" },
  { v: "AV", label: "AV / Pro Audio" },
  { v: "MEDICAL", label: "Medical" },
  { v: "NETWORK", label: "Networking/Telecom" },
  { v: "IOT", label: "IoT / Smart" },
  { v: "INDUSTRIAL", label: "Industrial/Lab" },
];

const DEVICE_TYPES = [
  "Laptop","iPad / Tablet","Phone","Monitor","Server","Switch/Router",
  "Access Point","Projector","Control Processor","Camera","Headset","Other"
];

const BRANDS = [
  "Apple","Dell","HP","Lenovo","Cisco","Ubiquiti","Crestron","AMX","Q-SYS",
  "Siemens","GE Healthcare","Philips","Sony","Samsung","Epson","Other"
];

const CATEGORY_OPTIONS = [
  { v: "", label: "All categories", icon: null },
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

/* ---------- page ---------- */
export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();

  // top bar filters
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("cat") || "");
  const [zip, setZip] = useState(params.get("zip") || "");
  const [price, setPrice] = useState([
    Number(params.get("min") || 0),
    Number(params.get("max") || 800),
  ]);
  const [cond, setCond] = useState(params.getAll("cond") || []);
  const [page, setPage] = useState(Number(params.get("page") || 1));

  // side filters
  const [techTypes, setTechTypes] = useState(params.getAll("tech") || []);
  const [deviceTypes, setDeviceTypes] = useState(params.getAll("dtype") || []);
  const [brands, setBrands] = useState(params.getAll("brand") || []);
  const [makes, setMakes] = useState(params.getAll("make") || []);
  const [models, setModels] = useState(params.getAll("model") || []);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // show 10 per page
  const limit = 10;

  // axios data fetch
  const [allListings, setAllListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get("http://localhost:8080/v1/all");
        let data = res.data;

        if (Array.isArray(data)) {
          if (!cancelled) setAllListings(data);
        } else if (Array.isArray(data.items)) {
          if (!cancelled) setAllListings(data.items);
        } else if (Array.isArray(data.listings)) {
          if (!cancelled) setAllListings(data.listings);
        } else {
          console.warn("Unknown listings shape:", data);
          if (!cancelled) setAllListings([]);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        if (!cancelled) {
          setError(err);
          setAllListings([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchListings();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- sync URL ---------- */
  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("cat", category);
    if (zip) next.set("zip", zip);
    if (price[0]) next.set("min", String(price[0]));
    if (price[1]) next.set("max", String(price[1]));
    if (page !== 1) next.set("page", String(page));
    cond.forEach(c => next.append("cond", c));
    techTypes.forEach(t => next.append("tech", t));
    deviceTypes.forEach(d => next.append("dtype", d));
    brands.forEach(b => next.append("brand", b));
    makes.forEach(m => next.append("make", m));
    models.forEach(mo => next.append("model", mo));
    setParams(next, { replace: true });
  }, [
    q, category, zip, price, cond, page,
    techTypes, deviceTypes, brands, makes, models, setParams
  ]);

  /* ---------- client-side filtering ---------- */
  const filtered = useMemo(() => {
    if (!Array.isArray(allListings)) return [];

    const qLower = q.toLowerCase();

    return allListings.filter((it) => {
      const title = it.title || "";
      const brand = it.brand || "";
      const model = it.model || "";
      const categoryVal = it.category || "";
      const conditionVal = it.condition || "";
      const tech = it.techTypes || it.industry || "";
      const deviceType = it.deviceType || "";
      const priceVal = Number(it.rescuePrice || it.price || 0);
      const itemZip =
        it.pickup?.address?.zip?.toString() ||
        it.zipcode?.toString() ||
        "";

      if (q && !(`${title} ${brand} ${model}`.toLowerCase().includes(qLower))) {
        return false;
      }

      if (category && categoryVal !== category) return false;
      if (zip && itemZip !== zip) return false;
      if (cond.length && !cond.includes(conditionVal)) return false;

      if (techTypes.length) {
        if (Array.isArray(tech)) {
          if (!tech.some(t => techTypes.includes(t))) return false;
        } else if (tech) {
          if (!techTypes.some(t => String(tech).includes(t))) return false;
        }
      }

      if (deviceTypes.length && deviceType) {
        if (!deviceTypes.includes(deviceType)) return false;
      }

      if (brands.length && brand) {
        if (!brands.includes(brand)) return false;
      }

      if (makes.length) {
        const lowerBrand = brand.toLowerCase();
        if (!makes.some(m => lowerBrand.includes(String(m).toLowerCase()))) {
          return false;
        }
      }

      if (models.length) {
        const lowerModel = model.toLowerCase();
        if (!models.some(mo => lowerModel.includes(String(mo).toLowerCase()))) {
          return false;
        }
      }

      if (priceVal < price[0] || priceVal > price[1]) return false;

      return true;
    });
  }, [
    allListings, q, category, zip, cond,
    techTypes, deviceTypes, brands, makes, models, price
  ]);

  const count = filtered.length;
  const pages = Math.max(1, Math.ceil(count / limit));

  const pagedItems = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  );

  /* ---------- helpers ---------- */
  const resetAll = () => {
    setQ(""); setCategory(""); setZip("");
    setPrice([0, 800]); setCond([]);
    setTechTypes([]); setDeviceTypes([]);
    setBrands([]); setMakes([]); setModels([]);
    setPage(1);
  };

  /* ---------- side filter content ---------- */
  const SideFilters = (
    <Box sx={{ width: { xs: 300, md: "100%" }, p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: "whitesmoke" }}>
        Filters
      </Typography>

      <Accordion defaultExpanded sx={accStyle}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
        >
          <Typography sx={accTitle}>Technology type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {TECHNOLOGY_TYPES.map(t => (
              <FormControlLabel
                key={t.v}
                control={
                  <Checkbox
                    checked={techTypes.includes(t.v)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...techTypes, t.v]
                        : techTypes.filter(x => x !== t.v);
                      setTechTypes(next); setPage(1);
                    }}
                    sx={checkboxStyle}
                  />
                }
                label={t.label}
                sx={labelStyle}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={accStyle}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
        >
          <Typography sx={accTitle}>Device type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {DEVICE_TYPES.map(d => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={deviceTypes.includes(d)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...deviceTypes, d]
                        : deviceTypes.filter(x => x !== d);
                      setDeviceTypes(next); setPage(1);
                    }}
                    sx={checkboxStyle}
                  />
                }
                label={d}
                sx={labelStyle}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={accStyle}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
        >
          <Typography sx={accTitle}>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            multiple
            options={BRANDS}
            value={brands}
            onChange={(_, v) => { setBrands(v); setPage(1); }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Add brand…" sx={textFieldStyle} />
            )}
            sx={{ mb: 1 }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {BRANDS.slice(0, 6).map(b => (
              <Chip
                key={b}
                label={b}
                onClick={() => {
                  if (brands.includes(b)) return;
                  setBrands([...brands, b]); setPage(1);
                }}
                sx={pillStyle}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accStyle}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
        >
          <Typography sx={accTitle}>Make & Model</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            multiple
            freeSolo
            value={makes}
            onChange={(_, v) => { setMakes(v); setPage(1); }}
            options={[]}
            renderInput={(p) => (
              <TextField {...p} placeholder="Makes (free text)" sx={textFieldStyle} />
            )}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            freeSolo
            value={models}
            onChange={(_, v) => { setModels(v); setPage(1); }}
            options={[]}
            renderInput={(p) => (
              <TextField {...p} placeholder="Models (free text)" sx={textFieldStyle} />
            )}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accStyle}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
        >
          <Typography sx={accTitle}>Condition</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {CONDITIONS.map((c) => {
              const active = cond.includes(c);
              return (
                <Chip
                  key={c}
                  label={c.replace("_", " ")}
                  onClick={() => {
                    const next = active
                      ? cond.filter(x => x !== c)
                      : [...cond, c];
                    setCond(next); setPage(1);
                  }}
                  sx={{ ...pillStyle, ...(active ? pillActive : null) }}
                />
              );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accStyle}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
        >
          <Typography sx={accTitle}>Price</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={0.5}>
            <Typography sx={{ fontSize: 12, color: "rgba(230,238,247,0.72)" }}>
              ${price[0]} – ${price[1]}
            </Typography>
            <Slider
              value={price}
              onChange={(_, val) => { setPrice(val); setPage(1); }}
              min={0}
              max={5000}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          onClick={resetAll}
          size="small"
          sx={{ color: "rgba(255,255,255,0.88)" }}
        >
          Reset all
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        bgcolor: "#0b0f14",
        color: "#e6eef7",
        minHeight: "100vh",
        minWidth: "100%",
      }}
    >
      {/* ✅ Full-width container, no default maxWidth or gutters */}
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
              Browse tech
            </Typography>
            <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
              Filter by category, brand, type, condition, price, and ZIP.
            </Typography>
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "#e6eef7" }}
            aria-label="Open filters"
          >
            <FilterListIcon />
          </IconButton>
        </Stack>

        {/* top filter bar */}
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
                          {c.icon && (
                            <Box sx={{ opacity: 0.8, color: "whitesmoke" }}>
                              {c.icon}
                            </Box>
                          )}
                          <span style={{ color: "whitesmoke" }}>{c.label}</span>
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

              <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
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
            </Grid>
          </CardContent>
        </Card>

        {/* content layout */}
        <Grid
          container
          columnSpacing={2}
          rowSpacing={2}
          sx={{ mt: 2 }}
        >
          {/* sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: { xs: "none", md: "block" },
              pr: { md: 2 },
            }}
          >
            <Card elevation={0} sx={quietCard}>
              {SideFilters}
            </Card>
          </Grid>

          {/* results */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 0,              // ✅ remove grid item padding so cards can fill
            }}
          >
            {/* Meta / count */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                {loading
                  ? "Loading…"
                  : error
                  ? "Error loading listings"
                  : `${count} results`}
              </Typography>
              <Divider
                flexItem
                sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 1 }}
              />
              {[...techTypes, ...deviceTypes, ...brands, ...makes, ...models]
                .slice(0, 6)
                .map((t) => (
                  <Chip key={t} size="small" label={t} sx={{ ...pillStyle }} />
                ))}
            </Stack>

            {error && (
              <Typography sx={{ color: "#ffb3b3", mb: 2 }}>
                {error.message || "Something went wrong."}
              </Typography>
            )}

            {/* vertical list, full width of right side */}
            {!loading && !error && (
              <Stack spacing={2} sx={{ mt: 1, width: "100%" }}>
                {pagedItems.map((it) => (
                  <Card
                    key={it._id || it.id || it.serialnumber}
                    elevation={0}
                    component={RouterLink}
                    to={`/listing/${it._id || it.id || ""}`}
                    sx={{
                      ...quietCard,
                      width: "100%",       // ✅ fill full right-hand column
                      display: "flex",
                      flexDirection: "row",
                      position: "relative",
                      overflow: "hidden",
                      textDecoration: "none",
                      background:
                        "linear-gradient(135deg, rgba(22,30,46,0.96), rgba(9,13,23,0.98))",
                      borderColor: "rgba(148,163,184,0.4)",
                      boxShadow: "0 18px 35px rgba(15,23,42,0.7)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background:
                          "linear-gradient(180deg, #38bdf8, #a855f7)",
                      },
                      "&:hover": {
                        transform: "translateY(-4px)",
                        borderColor: "#38bdf8",
                        boxShadow: "0 22px 45px rgba(8,47,73,0.85)",
                      },
                      transition: "all .18s ease-out",
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 2.5,
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      {/* Title + condition */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                        spacing={1}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 800,
                            pr: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: "#ffffff",   // ✅ title white
                          }}
                        >
                          {it.title || it.name || "(no title)"}
                        </Typography>
                        {it.condition && (
                          <Chip
                            size="small"
                            label={it.condition}
                            icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                            sx={{
                              ...pillStyle,
                              fontSize: 11,
                              borderRadius: 999,
                            }}
                          />
                        )}
                      </Stack>

                      {/* Brand / model */}
                      <Typography
                        sx={{
                          color: "rgba(230,238,247,0.68)",
                          fontSize: 13,
                          mb: 0.5,
                        }}
                        noWrap
                      >
                        {(it.brand || "") + (it.model ? ` ${it.model}` : "")}
                      </Typography>

                      {/* Meta row */}
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 0.75, flexWrap: "wrap" }}
                      >
                        {it.category && (
                          <Chip
                            label={it.category}
                            size="small"
                            sx={{
                              ...pillStyle,
                              borderRadius: 999,
                              fontSize: 11,
                            }}
                          />
                        )}
                        {Array.isArray(it.techTypes) &&
                          it.techTypes.slice(0, 2).map((t) => (
                            <Chip
                              key={t}
                              label={t}
                              size="small"
                              sx={{
                                ...pillStyle,
                                borderRadius: 999,
                                fontSize: 11,
                              }}
                            />
                          ))}
                      </Stack>

                      {/* Price + location */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-end"
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 900,
                              lineHeight: 1.1,
                              color: "#ffffff",   // ✅ price white
                            }}
                          >
                            ${it.rescuePrice ?? it.price ?? 0}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 11,
                              color: "rgba(148,163,184,0.9)",
                            }}
                          >
                            per unit
                          </Typography>
                        </Box>

                        {(it.pickup?.address?.zip || it.zipcode) && (
                          <Typography
                            sx={{
                              color: "rgba(203,213,225,0.86)",
                              fontSize: 13,
                              textAlign: "right",
                            }}
                          >
                            ZIP {it.pickup?.address?.zip || it.zipcode}
                          </Typography>
                        )}
                      </Stack>
                    </CardContent>

                    <CardActions
                      sx={{
                        px: 2.5,
                        py: 2,
                        borderLeft: "1px solid rgba(15,23,42,0.9)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 1,
                        minWidth: { xs: 140, sm: 160 },
                        bgcolor: "rgba(15,23,42,0.85)",
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: "#e6eef7",
                          color: "#020617",
                          fontWeight: 800,
                          borderRadius: 999,
                          px: 2.5,
                          "&:hover": { bgcolor: "#cfe0f4" },
                          textTransform: "none",
                          fontSize: 13,
                          width: "100%",
                        }}
                      >
                        View details
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: "rgba(248,250,252,0.88)",
                          textTransform: "none",
                          fontSize: 12,
                          width: "100%",
                        }}
                      >
                        Hold for 15 min
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            )}

            {/* Pagination */}
            {!loading && !error && pages > 1 && (
              <Stack alignItems="center" sx={{ mt: 3 }}>
                <Pagination
                  count={pages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "rgba(255,255,255,0.88)",
                    },
                    "& .Mui-selected": {
                      bgcolor: "rgba(255,255,255,0.12) !important",
                    },
                  }}
                />
              </Stack>
            )}
          </Grid>
        </Grid>

        {/* mobile drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx: { bgcolor: "#0b0f14", color: "#e6eef7" } }}
        >
          {SideFilters}
        </Drawer>
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

const accStyle = {
  bgcolor: "transparent",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 2,
  mb: 1,
  "&:before": { display: "none" },
};

const accTitle = { fontWeight: 700, color: "rgba(255,255,255,0.9)" };

const labelStyle = { color: "rgba(230,238,247,0.9)" };

const checkboxStyle = {
  color: "rgba(255,255,255,0.6)",
  "&.Mui-checked": { color: "#2a8cff" },
};

const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    color: "rgba(255,255,255,0.9)",
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
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

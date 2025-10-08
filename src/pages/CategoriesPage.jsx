import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Grid, Typography, Stack, TextField, InputAdornment,
  Select, MenuItem, FormControl, Chip, Slider, Button, Card, CardContent,
  CardActions, Avatar, Pagination, Divider, Drawer, IconButton, Accordion,
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
import api from "../lib/http";

/* ---------- facet options (seed/static; you can hydrate from API later) ---------- */
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

/* ---------- page ---------- */
export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();

  // existing
  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("cat") || "");
  const [zip, setZip] = useState(params.get("zip") || "");
  const [price, setPrice] = useState([Number(params.get("min") || 0), Number(params.get("max") || 800)]);
  const [cond, setCond] = useState(params.getAll("cond") || []);
  const [page, setPage] = useState(Number(params.get("page") || 1));

  // new side filters
  const [techTypes, setTechTypes] = useState(params.getAll("tech") || []);         // array
  const [deviceTypes, setDeviceTypes] = useState(params.getAll("dtype") || []);    // array
  const [brands, setBrands] = useState(params.getAll("brand") || []);              // array
  const [makes, setMakes] = useState(params.getAll("make") || []);                 // array (free text)
  const [models, setModels] = useState(params.getAll("model") || []);              // array (free text)

  // ui
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const limit = 24;

  /* ---------- API query ---------- */
  const apiQuery = useMemo(() => {
    const p = {
      page, limit, q: q || undefined, category: category || undefined,
      zip: zip || undefined, minPrice: price[0] || undefined,
      maxPrice: price[1] || undefined, status: "ACTIVE",
      // new
      techTypes: techTypes.length ? techTypes : undefined,
      deviceTypes: deviceTypes.length ? deviceTypes : undefined,
      brands: brands.length ? brands : undefined,
      makes: makes.length ? makes : undefined,
      models: models.length ? models : undefined,
      condition: cond?.length ? cond : undefined,
    };
    return p;
  }, [page, q, category, zip, price, cond, techTypes, deviceTypes, brands, makes, models]);

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
  }, [q, category, zip, price, cond, page, techTypes, deviceTypes, brands, makes, models, setParams]);

  /* ---------- fetch ---------- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await api.get("/listings", { params: apiQuery });
      if (!mounted) return;
      setItems(data.items || []);
      setCount(data.count || 0);
    })();
    return () => { mounted = false; };
  }, [apiQuery]);

  const pages = Math.max(1, Math.ceil(count / limit));

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
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>Filters</Typography>

      <Accordion defaultExpanded sx={accStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
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
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
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
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
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
          {/* quick chips */}
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
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
          <Typography sx={accTitle}>Make & Model</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Autocomplete
            multiple freeSolo
            value={makes}
            onChange={(_, v) => { setMakes(v); setPage(1); }}
            options={[]} // hydrate with API facet later
            renderInput={(p) => <TextField {...p} placeholder="Makes (free text)" sx={textFieldStyle} />}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple freeSolo
            value={models}
            onChange={(_, v) => { setModels(v); setPage(1); }}
            options={[]}
            renderInput={(p) => <TextField {...p} placeholder="Models (free text)" sx={textFieldStyle} />}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
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
                    const next = active ? cond.filter(x => x !== c) : [...cond, c];
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
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
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
              min={0} max={5000}
            />
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button onClick={resetAll} size="small" sx={{ color: "rgba(255,255,255,0.88)" }}>
          Reset all
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
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

        {/* top bar (kept) */}
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

        {/* content layout: sidebar + results */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* sidebar desktop */}
          <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
            <Card elevation={0} sx={quietCard}>{SideFilters}</Card>
          </Grid>

          {/* results */}
          <Grid item xs={12} md={9}>
            {/* Meta / count */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                {count} results
              </Typography>
              <Divider flexItem sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 1 }} />
              {[...techTypes, ...deviceTypes, ...brands, ...makes, ...models].slice(0, 6).map((t) => (
                <Chip key={t} size="small" label={t} sx={{ ...pillStyle }} />
              ))}
            </Stack>

            <Grid container spacing={2}>
              {items.map((it) => (
                <Grid key={it._id} item xs={12} sm={6} md={4} lg={3}>
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
  "&.Mui-checked": { color: "#2a8cff" }
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

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Slider,
  Button,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Divider,
  Drawer,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import axios from "axios";

/* ---------- constants ---------- */
const CONDITIONS = ["NEW", "LIKE_NEW", "REFURBISHED", "GOOD", "FAIR", "FOR_PARTS"];

/* ---------- helpers ---------- */
const norm = (v) => String(v ?? "").trim().toLowerCase();
const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const uniqSorted = (arr) =>
  Array.from(new Set(arr.filter(Boolean))).sort((a, b) => a.localeCompare(b));

const getListingId = (it) =>
  it?._id ??
  it?.id ??
  it?.listingId ??
  it?.listing_id ??
  it?.serialnumber ??
  it?.serialNumber ??
  it?.macaddress ??
  it?.macAddress ??
  "";

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

  // fetch
  useEffect(() => {
    let cancelled = false;

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get("http://localhost:8080/v1/all");
        const data = res.data;

        let next = [];
        if (Array.isArray(data)) next = data;
        else if (Array.isArray(data.items)) next = data.items;
        else if (Array.isArray(data.listings)) next = data.listings;

        if (!cancelled) setAllListings(next || []);
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

  /* ---------- dynamic filter options from data ---------- */
  const CATEGORY_OPTIONS = useMemo(() => {
    const cats = uniqSorted(allListings.map((x) => x?.category));
    return ["", ...cats];
  }, [allListings]);

  const BRAND_OPTIONS = useMemo(() => {
    const b = uniqSorted(allListings.map((x) => x?.brand));
    return b.length ? b : [];
  }, [allListings]);

  const TECH_OPTIONS = useMemo(() => {
    const all = [];
    allListings.forEach((x) => toArray(x?.techTypes).forEach((t) => all.push(t)));
    return uniqSorted(all);
  }, [allListings]);

  const DEVICE_OPTIONS = useMemo(() => {
    const all = [];
    allListings.forEach((x) =>
      toArray(x?.deviceTypes || x?.deviceType).forEach((t) => all.push(t))
    );
    return uniqSorted(all);
  }, [allListings]);

  /* ---------- sync URL ---------- */
  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("cat", category);
    if (zip) next.set("zip", zip);
    if (price[0]) next.set("min", String(price[0]));
    if (price[1]) next.set("max", String(price[1]));
    if (page !== 1) next.set("page", String(page));
    cond.forEach((c) => next.append("cond", c));
    techTypes.forEach((t) => next.append("tech", t));
    deviceTypes.forEach((d) => next.append("dtype", d));
    brands.forEach((b) => next.append("brand", b));
    makes.forEach((m) => next.append("make", m));
    models.forEach((mo) => next.append("model", mo));
    setParams(next, { replace: true });
  }, [
    q,
    category,
    zip,
    price,
    cond,
    page,
    techTypes,
    deviceTypes,
    brands,
    makes,
    models,
    setParams,
  ]);

  /* ---------- client-side filtering ---------- */
  const filtered = useMemo(() => {
    if (!Array.isArray(allListings)) return [];

    const qLower = norm(q);
    const selectedCategory = norm(category);
    const selectedZip = norm(zip);

    const selectedCond = cond.map(norm);
    const selectedTech = techTypes.map(norm);
    const selectedDevice = deviceTypes.map(norm);
    const selectedBrands = brands.map(norm);
    const selectedMakes = makes.map(norm);
    const selectedModels = models.map(norm);

    return allListings.filter((it) => {
      const title = norm(it.title || it.name);
      const brand = norm(it.brand);
      const model = norm(it.model);
      const make = norm(it.make);
      const categoryVal = norm(it.category);
      const conditionVal = norm(it.condition);

      const listingTechTypes = toArray(it.techTypes).map(norm);
      const listingDeviceTypes = toArray(it.deviceTypes || it.deviceType).map(norm);

      const priceVal = Number(it.rescuePrice ?? it.price ?? 0);
      const itemZip = norm(it.pickup?.address?.zip ?? it.zipcode ?? "");

      if (
        qLower &&
        !(
          title.includes(qLower) ||
          brand.includes(qLower) ||
          model.includes(qLower) ||
          make.includes(qLower)
        )
      ) {
        return false;
      }

      if (selectedCategory && !categoryVal.includes(selectedCategory)) return false;
      if (selectedZip && itemZip !== selectedZip) return false;
      if (selectedCond.length && !selectedCond.includes(conditionVal)) return false;

      if (selectedTech.length) {
        const ok = listingTechTypes.some((t) => selectedTech.includes(t));
        if (!ok) return false;
      }

      if (selectedDevice.length) {
        const ok = listingDeviceTypes.some((d) => selectedDevice.includes(d));
        if (!ok) return false;
      }

      if (selectedBrands.length && !selectedBrands.includes(brand)) return false;

      if (selectedMakes.length) {
        const ok = selectedMakes.some((m) => make.includes(m) || brand.includes(m));
        if (!ok) return false;
      }

      if (selectedModels.length) {
        const ok = selectedModels.some((m) => model.includes(m));
        if (!ok) return false;
      }

      if (priceVal < price[0] || priceVal > price[1]) return false;

      return true;
    });
  }, [allListings, q, category, zip, cond, techTypes, deviceTypes, brands, makes, models, price]);

  // always snap back to page 1 if filters reduce results
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    if (page > totalPages) setPage(1);
  }, [filtered.length, limit]);

  const count = filtered.length;
  const pages = Math.max(1, Math.ceil(count / limit));

  const pagedItems = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page, limit]
  );

  /* ---------- helpers ---------- */
  const resetAll = () => {
    setQ("");
    setCategory("");
    setZip("");
    setPrice([0, 800]);
    setCond([]);
    setTechTypes([]);
    setDeviceTypes([]);
    setBrands([]);
    setMakes([]);
    setModels([]);
    setPage(1);
  };

  const chipsPreview = useMemo(() => {
    const list = [...techTypes, ...deviceTypes, ...brands, ...makes, ...models, ...cond];
    return list.filter(Boolean).slice(0, 8);
  }, [techTypes, deviceTypes, brands, makes, models, cond]);

  /* ---------- side filter content ---------- */
  const SideFilters = (
    <Box sx={{ width: { xs: 320, md: "100%" }, p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: "whitesmoke" }}>
        Filters
      </Typography>

      <Accordion defaultExpanded sx={accStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
          <Typography sx={accTitle}>Technology type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {(TECH_OPTIONS.length ? TECH_OPTIONS : []).map((t) => (
              <FormControlLabel
                key={t}
                control={
                  <Checkbox
                    checked={techTypes.includes(t)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...techTypes, t]
                        : techTypes.filter((x) => x !== t);
                      setTechTypes(next);
                      setPage(1);
                    }}
                    sx={checkboxStyle}
                  />
                }
                label={t}
                sx={labelStyle}
              />
            ))}
            {!TECH_OPTIONS.length && (
              <Typography sx={{ color: "rgba(230,238,247,0.7)", fontSize: 12 }}>
                No techTypes found in data yet.
              </Typography>
            )}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={accStyle}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
          <Typography sx={accTitle}>Device type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {(DEVICE_OPTIONS.length ? DEVICE_OPTIONS : []).map((d) => (
              <FormControlLabel
                key={d}
                control={
                  <Checkbox
                    checked={deviceTypes.includes(d)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...deviceTypes, d]
                        : deviceTypes.filter((x) => x !== d);
                      setDeviceTypes(next);
                      setPage(1);
                    }}
                    sx={checkboxStyle}
                  />
                }
                label={d}
                sx={labelStyle}
              />
            ))}
            {!DEVICE_OPTIONS.length && (
              <Typography sx={{ color: "rgba(230,238,247,0.7)", fontSize: 12 }}>
                No deviceTypes found in data yet.
              </Typography>
            )}
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
            options={BRAND_OPTIONS}
            value={brands}
            onChange={(_, v) => {
              setBrands(v);
              setPage(1);
            }}
            renderInput={(p) => <TextField {...p} placeholder="Add brand…" sx={textFieldStyle} />}
            sx={{ mb: 1 }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {BRAND_OPTIONS.slice(0, 8).map((b) => (
              <Chip
                key={b}
                label={b}
                onClick={() => {
                  if (brands.includes(b)) return;
                  setBrands([...brands, b]);
                  setPage(1);
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
            multiple
            freeSolo
            value={makes}
            onChange={(_, v) => {
              setMakes(v);
              setPage(1);
            }}
            options={[]}
            renderInput={(p) => <TextField {...p} placeholder="Makes (free text)" sx={textFieldStyle} />}
            sx={{ mb: 1 }}
          />
          <Autocomplete
            multiple
            freeSolo
            value={models}
            onChange={(_, v) => {
              setModels(v);
              setPage(1);
            }}
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
                  label={c.replaceAll("_", " ")}
                  onClick={() => {
                    const next = active ? cond.filter((x) => x !== c) : [...cond, c];
                    setCond(next);
                    setPage(1);
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
              onChange={(_, val) => {
                setPrice(val);
                setPage(1);
              }}
              min={0}
              max={5000}
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
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh", minWidth: "100%" }}>
      <Container maxWidth={false} disableGutters sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        {/* Header */}
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

        {/* top filter bar */}
        <Card elevation={0} sx={quietCard}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, brand, model, make…"
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
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                    displayEmpty
                    sx={selectStyle}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <MenuItem key={c || "all"} value={c}>
                        <span style={{ color: "whitesmoke" }}>{c || "All categories"}</span>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  value={zip}
                  onChange={(e) => {
                    setZip(e.target.value);
                    setPage(1);
                  }}
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
                    onChange={(_, val) => {
                      setPrice(val);
                      setPage(1);
                    }}
                    valueLabelDisplay="off"
                    min={0}
                    max={5000}
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
          sx={{
            mt: 2,
            alignItems: "flex-start",
          }}
        >
          {/* sidebar */}
          <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
            <Card elevation={0} sx={{ ...quietCard }}>
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
              justifyContent: "flex-start",
              alignItems: "stretch",
              width: "60%",
              minHeight: 0,
            }}
          >
            {/* Meta / count */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                {loading ? "Loading…" : error ? "Error loading listings" : `${count} results`}
              </Typography>
              <Divider flexItem sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 1 }} />
              {chipsPreview.map((t) => (
                <Chip key={t} size="small" label={t} sx={{ ...pillStyle }} />
              ))}
            </Stack>

            {error && (
              <Typography sx={{ color: "#ffb3b3", mb: 2 }}>
                {error.message || "Something went wrong."}
              </Typography>
            )}

            {/* list */}
            {!loading && !error && (
              <Box sx={{ width: "100%" }}>
                <Stack spacing={2} sx={{ width: "100%" }}>
                  {pagedItems.map((it) => {
                    const listingId = getListingId(it);

                    if (!listingId) {
                      console.warn("Missing listing id; skipping item:", it);
                      return null;
                    }

                    const to = `/listing/${encodeURIComponent(String(listingId))}`;

                    return (
                      <Card
                        key={String(listingId)}
                        elevation={0}
                        component={RouterLink}
                        to={to}
                        sx={{
                          ...quietCard,
                          width: "100%",
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
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
                            background: "linear-gradient(180deg, #38bdf8, #a855f7)",
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
                            minWidth: 0,
                          }}
                        >
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
                                color: "#fff",
                              }}
                            >
                              {it.title || it.name || "(no title)"}
                            </Typography>

                            {it.condition && (
                              <Chip
                                size="small"
                                label={it.condition}
                                icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                                sx={{ ...pillStyle, fontSize: 11, borderRadius: 999 }}
                              />
                            )}
                          </Stack>

                          <Typography
                            sx={{ color: "rgba(230,238,247,0.68)", fontSize: 13, mb: 0.5 }}
                            noWrap
                          >
                            {(it.brand || "") + (it.model ? ` ${it.model}` : "")}
                          </Typography>

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
                                sx={{ ...pillStyle, borderRadius: 999, fontSize: 11 }}
                              />
                            )}
                            {toArray(it.techTypes)
                              .slice(0, 2)
                              .map((t) => (
                                <Chip
                                  key={t}
                                  label={t}
                                  size="small"
                                  sx={{ ...pillStyle, borderRadius: 999, fontSize: 11 }}
                                />
                              ))}
                            {toArray(it.deviceTypes || it.deviceType)
                              .slice(0, 1)
                              .map((d) => (
                                <Chip
                                  key={d}
                                  label={d}
                                  size="small"
                                  sx={{ ...pillStyle, borderRadius: 999, fontSize: 11 }}
                                />
                              ))}
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1, color: "#fff" }}>
                                ${it.rescuePrice ?? it.price ?? 0}
                              </Typography>
                              <Typography sx={{ fontSize: 11, color: "rgba(148,163,184,0.9)" }}>
                                per unit
                              </Typography>
                            </Box>

                            {(it.pickup?.address?.zip || it.zipcode) && (
                              <Typography sx={{ color: "rgba(203,213,225,0.86)", fontSize: 13, textAlign: "right" }}>
                                ZIP {it.pickup?.address?.zip || it.zipcode}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>

                        <CardActions
                          sx={{
                            px: 2.5,
                            py: 2,
                            borderLeft: { xs: "none", sm: "1px solid rgba(15,23,42,0.9)" },
                            borderTop: { xs: "1px solid rgba(15,23,42,0.9)", sm: "none" },
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 1,
                            minWidth: { xs: "100%", sm: 180 },
                            bgcolor: "rgba(15,23,42,0.85)",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            component={RouterLink}
                            to={to}
                            onClick={(e) => e.stopPropagation()}
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
                            onClick={(e) => {
                              e.preventDefault(); // don't navigate away
                              e.stopPropagation();
                            }}
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
                    );
                  })}
                </Stack>

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
              </Box>
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

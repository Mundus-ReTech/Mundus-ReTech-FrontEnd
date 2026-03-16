import React, { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import axios from "axios";

const CONDITIONS = ["NEW", "LIKE_NEW", "REFURBISHED", "GOOD", "FAIR", "FOR_PARTS"];

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

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

export default function CategoriesPage() {
  const [params, setParams] = useSearchParams();

  const [q, setQ] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("cat") || "");
  const [zip, setZip] = useState(params.get("zip") || "");
  const [price, setPrice] = useState([
    Number(params.get("min") || 0),
    Number(params.get("max") || 800),
  ]);
  const [cond, setCond] = useState(params.getAll("cond") || []);
  const [page, setPage] = useState(Number(params.get("page") || 1));

  const [techTypes, setTechTypes] = useState(params.getAll("tech") || []);
  const [deviceTypes, setDeviceTypes] = useState(params.getAll("dtype") || []);
  const [brands, setBrands] = useState(params.getAll("brand") || []);
  const [makes, setMakes] = useState(params.getAll("make") || []);
  const [models, setModels] = useState(params.getAll("model") || []);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const limit = 10;

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
      const brandVal = norm(it.brand);
      const modelVal = norm(it.model);
      const makeVal = norm(it.make);
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
          brandVal.includes(qLower) ||
          modelVal.includes(qLower) ||
          makeVal.includes(qLower)
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

      if (selectedBrands.length && !selectedBrands.includes(brandVal)) return false;

      if (selectedMakes.length) {
        const ok = selectedMakes.some((m) => makeVal.includes(m) || brandVal.includes(m));
        if (!ok) return false;
      }

      if (selectedModels.length) {
        const ok = selectedModels.some((m) => modelVal.includes(m));
        if (!ok) return false;
      }

      if (priceVal < price[0] || priceVal > price[1]) return false;

      return true;
    });
  }, [allListings, q, category, zip, cond, techTypes, deviceTypes, brands, makes, models, price]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
    if (page > totalPages) setPage(1);
  }, [filtered.length, limit, page]);

  const count = filtered.length;
  const pages = Math.max(1, Math.ceil(count / limit));

  const pagedItems = useMemo(
    () => filtered.slice((page - 1) * limit, page * limit),
    [filtered, page]
  );

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

  const SideFilters = (
    <Box sx={{ width: { xs: 320, md: "100%" }, p: 2.25 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2.5,
            bgcolor: alpha(brand.green, 0.10),
            color: brand.green,
            border: `1px solid ${alpha(brand.green, 0.16)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TuneRoundedIcon fontSize="small" />
        </Box>
        <Box>
          <Typography sx={sectionTitleSx}>Filters</Typography>
          <Typography sx={sectionSubSx}>Refine by type, condition, price, and brand.</Typography>
        </Box>
      </Stack>

      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: brand.navy }} />}>
          <Typography sx={accordionTitleSx}>Technology type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {TECH_OPTIONS.map((t) => (
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
                    sx={checkboxSx}
                  />
                }
                label={t}
                sx={filterLabelSx}
              />
            ))}
            {!TECH_OPTIONS.length && (
              <Typography sx={emptyFilterTextSx}>No tech types found yet.</Typography>
            )}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: brand.navy }} />}>
          <Typography sx={accordionTitleSx}>Device type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {DEVICE_OPTIONS.map((d) => (
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
                    sx={checkboxSx}
                  />
                }
                label={d}
                sx={filterLabelSx}
              />
            ))}
            {!DEVICE_OPTIONS.length && (
              <Typography sx={emptyFilterTextSx}>No device types found yet.</Typography>
            )}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: brand.navy }} />}>
          <Typography sx={accordionTitleSx}>Brands</Typography>
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
            renderInput={(p) => (
              <TextField {...p} placeholder="Add brand..." sx={inputSx} />
            )}
            sx={{ mb: 1.5 }}
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
                sx={filterChipSx}
              />
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: brand.navy }} />}>
          <Typography sx={accordionTitleSx}>Make & Model</Typography>
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
            renderInput={(p) => (
              <TextField {...p} placeholder="Makes" sx={inputSx} />
            )}
            sx={{ mb: 1.5 }}
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
            renderInput={(p) => (
              <TextField {...p} placeholder="Models" sx={inputSx} />
            )}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: brand.navy }} />}>
          <Typography sx={accordionTitleSx}>Condition</Typography>
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
                  sx={{
                    ...filterChipSx,
                    ...(active ? activeFilterChipSx : null),
                  }}
                />
              );
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: brand.navy }} />}>
          <Typography sx={accordionTitleSx}>Price</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={priceMetaSx}>
            ${price[0]} - ${price[1]}
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
        </AccordionDetails>
      </Accordion>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button onClick={resetAll} size="small" sx={linkButtonSx}>
          Reset all
        </Button>
      </Stack>
    </Box>
  );

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
      <Container maxWidth={false} disableGutters sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
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
              <Inventory2RoundedIcon sx={{ fontSize: 18 }} />
              <Typography sx={eyebrowSx}>Marketplace inventory</Typography>
            </Box>

            <Typography
              sx={{
                fontFamily: '"vvyPreston Display", serif',
                fontSize: { xs: 34, md: 48 },
                lineHeight: 1.05,
                color: brand.navy,
              }}
            >
              Browse tech
            </Typography>

            <Typography sx={pageSubSx}>
              Filter by category, brand, type, condition, price, and ZIP.
            </Typography>
          </Box>

          <IconButton
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: brand.navy,
              border: `1px solid ${brand.border}`,
              borderRadius: 3,
              bgcolor: brand.white,
            }}
            aria-label="Open filters"
          >
            <FilterListIcon />
          </IconButton>
        </Stack>

        <Card elevation={0} sx={shellCardSx}>
          <CardContent sx={{ p: 2.25 }}>
            <Grid container spacing={1.5} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, brand, model, make..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: brand.muted }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
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
                    sx={selectSx}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <MenuItem key={c || "all"} value={c}>
                        {c || "All categories"}
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
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
                <Typography sx={priceMetaSx}>
                  Price range (${price[0]} - ${price[1]})
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
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container columnSpacing={2.25} rowSpacing={2.25} sx={{ mt: 1 }}>
          <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
            <Card elevation={0} sx={shellCardSx}>
              {SideFilters}
            </Card>
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
              <Typography sx={pageSubSx}>
                {loading ? "Loading..." : error ? "Error loading listings" : `${count} results`}
              </Typography>

              {chipsPreview.length > 0 && (
                <>
                  <Divider
                    flexItem
                    sx={{
                      mx: 1,
                      borderColor: brand.border,
                    }}
                  />
                  {chipsPreview.map((t) => (
                    <Chip key={t} size="small" label={t} sx={filterChipSx} />
                  ))}
                </>
              )}
            </Stack>

            {error && (
              <Typography sx={{ color: "#B42318", mb: 2 }}>
                {error.message || "Something went wrong."}
              </Typography>
            )}

            {!loading && !error && (
              <Box sx={{ width: "100%" }}>
                <Stack spacing={2}>
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
                          ...listingCardSx,
                          textDecoration: "none",
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 2.5,
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.6,
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
                            <Typography sx={listingTitleSx} noWrap>
                              {it.title || it.name || "(no title)"}
                            </Typography>

                            {it.condition && (
                              <Chip
                                size="small"
                                label={String(it.condition).replaceAll("_", " ")}
                                icon={<VerifiedIcon sx={{ fontSize: 14 }} />}
                                sx={statusChipSx}
                              />
                            )}
                          </Stack>

                          <Typography sx={listingMetaSx} noWrap>
                            {(it.brand || "") + (it.model ? ` ${it.model}` : "")}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.75, flexWrap: "wrap" }}
                          >
                            {it.category && (
                              <Chip label={it.category} size="small" sx={filterChipSx} />
                            )}

                            {toArray(it.techTypes)
                              .slice(0, 2)
                              .map((t) => (
                                <Chip key={t} label={t} size="small" sx={filterChipSx} />
                              ))}

                            {toArray(it.deviceTypes || it.deviceType)
                              .slice(0, 1)
                              .map((d) => (
                                <Chip key={d} label={d} size="small" sx={filterChipSx} />
                              ))}
                          </Stack>

                          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                            <Box>
                              <Typography sx={priceValueSx}>
                                ${it.rescuePrice ?? it.price ?? 0}
                              </Typography>
                              <Typography sx={unitMetaSx}>per unit</Typography>
                            </Box>

                            {(it.pickup?.address?.zip || it.zipcode) && (
                              <Stack direction="row" spacing={0.5} alignItems="center">
                                <LocalShippingRoundedIcon sx={{ fontSize: 15, color: brand.muted }} />
                                <Typography sx={zipTextSx}>
                                  ZIP {it.pickup?.address?.zip || it.zipcode}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </CardContent>

                        <CardActions sx={listingActionsSx}>
                          <Button
                            variant="contained"
                            size="small"
                            component={RouterLink}
                            to={to}
                            onClick={(e) => e.stopPropagation()}
                            sx={primaryButtonSx}
                          >
                            View details
                          </Button>

                          <Button
                            variant="text"
                            size="small"
                            startIcon={<SellRoundedIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            sx={linkButtonSx}
                          >
                            Hold for 15 min
                          </Button>
                        </CardActions>
                      </Card>
                    );
                  })}
                </Stack>

                {pages > 1 && (
                  <Stack alignItems="center" sx={{ mt: 3 }}>
                    <Pagination
                      count={pages}
                      page={page}
                      onChange={(_, p) => setPage(p)}
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: brand.navy,
                          fontFamily: '"Semplicita Pro", sans-serif',
                        },
                        "& .Mui-selected": {
                          bgcolor: `${alpha(brand.navy, 0.10)} !important`,
                        },
                      }}
                    />
                  </Stack>
                )}
              </Box>
            )}
          </Grid>
        </Grid>

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              bgcolor: brand.white,
              color: brand.text,
              borderLeft: `1px solid ${brand.border}`,
            },
          }}
        >
          {SideFilters}
        </Drawer>
      </Container>
    </Box>
  );
}

const shellCardSx = {
  borderRadius: 5,
  border: `1px solid ${brand.border}`,
  bgcolor: brand.white,
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
};

const accordionSx = {
  bgcolor: "transparent",
  border: `1px solid ${brand.border}`,
  borderRadius: "16px !important",
  mb: 1,
  boxShadow: "none",
  "&:before": { display: "none" },
};

const accordionTitleSx = {
  fontWeight: 700,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const filterLabelSx = {
  color: brand.text,
  "& .MuiFormControlLabel-label": {
    fontFamily: '"Semplicita Pro", sans-serif',
    fontSize: 14,
  },
};

const checkboxSx = {
  color: alpha(brand.navy, 0.55),
  "&.Mui-checked": {
    color: brand.navy,
  },
};

const inputSx = {
  "& .MuiInputBase-root": {
    bgcolor: brand.white,
    borderRadius: 3,
    color: brand.text,
    fontFamily: '"Semplicita Pro", sans-serif',
  },
  "& .MuiInputLabel-root": {
    color: brand.muted,
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

const selectSx = {
  borderRadius: 3,
  bgcolor: brand.white,
  color: brand.text,
  fontFamily: '"Semplicita Pro", sans-serif',
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.border,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(brand.navy, 0.45),
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.navy,
  },
  "& .MuiSelect-select": {
    py: 1.2,
  },
};

const filterChipSx = {
  bgcolor: alpha(brand.navy, 0.05),
  color: brand.navy,
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  fontWeight: 700,
  borderRadius: 999,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const activeFilterChipSx = {
  bgcolor: alpha(brand.green, 0.10),
  color: brand.green,
  borderColor: alpha(brand.green, 0.20),
};

const statusChipSx = {
  bgcolor: alpha(brand.green, 0.10),
  color: brand.green,
  border: `1px solid ${alpha(brand.green, 0.18)}`,
  fontWeight: 700,
  borderRadius: 999,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const listingCardSx = {
  width: "100%",
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  borderRadius: 5,
  border: `1px solid ${brand.border}`,
  bgcolor: brand.white,
  overflow: "hidden",
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
  transition: "all .18s ease-out",
  "&:hover": {
    transform: "translateY(-3px)",
    borderColor: alpha(brand.navy, 0.24),
    boxShadow: "0 18px 40px rgba(30, 58, 95, 0.10)",
  },
};

const listingActionsSx = {
  px: 2.25,
  py: 2,
  borderLeft: { xs: "none", sm: `1px solid ${brand.border}` },
  borderTop: { xs: `1px solid ${brand.border}`, sm: "none" },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: 1,
  minWidth: { xs: "100%", sm: 190 },
  bgcolor: brand.grayBg,
};

const primaryButtonSx = {
  bgcolor: brand.navy,
  color: brand.white,
  fontWeight: 700,
  borderRadius: 999,
  px: 2.5,
  textTransform: "none",
  boxShadow: "none",
  fontFamily: '"Semplicita Pro", sans-serif',
  width: "100%",
  "&:hover": {
    bgcolor: "#16304F",
    boxShadow: "none",
  },
};

const linkButtonSx = {
  color: brand.navy,
  textTransform: "none",
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
  width: "100%",
  "&:hover": {
    bgcolor: "transparent",
    color: brand.green,
  },
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

const eyebrowSx = {
  fontSize: 13,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const pageSubSx = {
  color: brand.muted,
  fontSize: 15,
  lineHeight: 1.7,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const emptyFilterTextSx = {
  color: brand.muted,
  fontSize: 12,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const listingTitleSx = {
  fontWeight: 800,
  color: brand.text,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const listingMetaSx = {
  color: brand.muted,
  fontSize: 13,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const priceMetaSx = {
  fontSize: 12,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const priceValueSx = {
  fontSize: 26,
  lineHeight: 1.1,
  fontWeight: 900,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const unitMetaSx = {
  fontSize: 11,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const zipTextSx = {
  color: brand.muted,
  fontSize: 13,
  textAlign: "right",
  fontFamily: '"Semplicita Pro", sans-serif',
};
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Link,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import RecyclingIcon from "@mui/icons-material/Recycling";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import StorefrontIcon from "@mui/icons-material/Storefront";
import heroImage from "../assets/reTech-Background-Landing-Page-Hero-art.png";

import PartnerHorizontalSection from "../components/PartnerHorizontalSection";
import TrustSection from "../components/TrustSection";
import PartnerBackgroundImage from "../assets/reTech-Background-Partner-Split.png";

const howItWorksSteps = [
  {
    step: "1",
    color: "#2a8cff",
    title: "Assess the project",
    desc: "Review site scope, equipment types, timelines, and removal requirements.",
  },
  {
    step: "2",
    color: "#ffa32a",
    title: "Remove & inventory",
    desc: "Disconnect equipment, palletize assets, and document model, serial, and condition.",
  },
  {
    step: "3",
    color: "#2aff9b",
    title: "Recycle or recover value",
    desc: "Route equipment to resale, reuse, donation, or responsible e-waste recycling.",
  },
];

const services = [
  {
    k: "Rack & equipment removal",
    v: "Safe removal of AV hardware, peripherals, and infrastructure-adjacent gear.",
  },
  {
    k: "Inventory reporting",
    v: "Manufacturer, model, serial number, condition, and asset documentation.",
  },
  {
    k: "Secure disposition",
    v: "Recycling, reuse, donation, resale, and data-bearing device handling.",
  },
  {
    k: "Value recovery",
    v: "Identify equipment with resale potential so clients can recover value.",
  },
];

const reasons = [
  {
    k: "AV expertise",
    v: "We understand racks, DSPs, control systems, cameras, and enterprise AV environments.",
  },
  {
    k: "Cleaner project closeouts",
    v: "Installers stay focused on deployment while we manage the outgoing equipment.",
  },
  {
    k: "Documentation-ready",
    v: "Useful for facilities teams, asset tracking, internal reporting, and compliance workflows.",
  },
  {
    k: "Less landfill, more recovery",
    v: "Prioritize reuse and resale before recycling whenever practical.",
  },
];

const faqs = [
  {
    q: "What kinds of equipment do you decommission?",
    a: "We handle common AV system components including control processors, DSPs, amplifiers, cameras, touch panels, wireless systems, projectors, displays, and related rack equipment.",
  },
  {
    q: "Do you provide inventory reports?",
    a: "Yes. We can document manufacturer, model, serial number, condition, and general asset notes to support client records and project closeout.",
  },
  {
    q: "Can you help recover value from old equipment?",
    a: "Yes. When appropriate, we identify reusable or resellable equipment so clients or partners can recover value instead of sending everything straight to scrap.",
  },
  {
    q: "Do you recycle unusable equipment responsibly?",
    a: "Yes. Equipment that cannot be reused or resold can be routed through responsible electronics recycling channels.",
  },
  {
    q: "Who is this service for?",
    a: "ReTech is built for AV integrators, installers, facilities teams, corporate offices, education environments, venues, and organizations managing technology refreshes.",
  },
];

export default function LandingPage() {
  return (
    <Box
      sx={{
        bgcolor: "#0b0f14",
        color: "#e6eef7",
        minHeight: "100vh",
        scrollBehavior: "smooth",
      }}
    >
      {/* HERO */}
      <Box sx={{ position: "relative", overflow: "hidden", color: "#e6eef7" }}>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.9) brightness(0.5)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(11,15,20,0.35) 0%, rgba(11,15,20,0.85) 60%, rgba(11,15,20,1) 100%)",
            pointerEvents: "none",
          }}
        />

        <Container sx={{ position: "relative", zIndex: 1, py: { xs: 10, md: 14 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                <Chip
                  icon={<RecyclingIcon />}
                  label="AV Decommissioning"
                  sx={{ bgcolor: "#2a8dff", color: "#0b0f14", fontWeight: 700 }}
                />
                <Chip
                  icon={<SecurityIcon />}
                  label="Secure Disposal"
                  sx={{ bgcolor: "#2aff9b", color: "#0b0f14", fontWeight: 700 }}
                />
                <Chip
                  icon={<StorefrontIcon />}
                  label="Asset Recovery"
                  sx={{ bgcolor: "#ffa32a", color: "#0b0f14", fontWeight: 700 }}
                />
              </Stack>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  mb: 1.5,
                }}
              >
                AV system decommissioning for integrators, offices, and technology refresh projects.
              </Typography>

              <Typography variant="h6" sx={{ color: "rgba(230,238,247,0.8)", mb: 3 }}>
                ReTech removes, inventories, recycles, and resells audiovisual equipment during
                upgrades, renovations, and system replacements—so your team can stay focused on
                the new install.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component="a"
                  href="#quote-form"
                  size="large"
                  variant="contained"
                  sx={{
                    px: 3.5,
                    py: 1.5,
                    bgcolor: "#e6eef7",
                    color: "#0b0f14",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#cfe0f4" },
                  }}
                  startIcon={<FlashOnIcon />}
                >
                  Request a quote
                </Button>

                <Button
                  component={RouterLink}
                  to="/partners"
                  size="large"
                  variant="outlined"
                  sx={{
                    px: 3.5,
                    py: 1.5,
                    borderColor: "rgba(255,255,255,0.28)",
                    color: "rgba(255,255,255,0.92)",
                    "&:hover": { borderColor: "rgba(255,255,255,0.45)" },
                  }}
                  startIcon={<StorefrontIcon />}
                >
                  Partner with us
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
                <Chip
                  icon={<VerifiedIcon />}
                  label="AV-specialized handling"
                  variant="outlined"
                  sx={chipStyle}
                />
                <Chip
                  icon={<SecurityIcon />}
                  label="Inventory + documentation"
                  variant="outlined"
                  sx={chipStyle}
                />
                <Chip
                  icon={<LocalShippingIcon />}
                  label="Removal, pickup, logistics"
                  variant="outlined"
                  sx={chipStyle}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }} />
          </Grid>
        </Container>
      </Box>

      {/* PARTNER SECTION */}
      <PartnerHorizontalSection
        background={PartnerBackgroundImage}
        corpLogos={[
          { src: "/logos/acme.svg", alt: "Corporate AV Client" },
          { src: "/logos/contoso.svg", alt: "Facilities Client" },
        ]}
        indieLogos={[
          { src: "/logos/market-1.svg", alt: "AV Integrator Partner" },
          { src: "/logos/market-2.svg", alt: "Installation Partner" },
        ]}
      />

      {/* HOW IT WORKS */}
      <Box
        component="section"
        sx={{
          position: "relative",
          py: { xs: 10, md: 16 },
          overflow: "hidden",
          color: "#e6eef7",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(1200px 500px at 20% -10%, rgba(42,140,255,0.20), transparent), radial-gradient(1000px 420px at 80% 120%, rgba(255,163,42,0.18), transparent), linear-gradient(180deg, #0b0f14 0%, #0c1018 60%, #0b0f14 100%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(transparent 0%, rgba(255,255,255,0.04) 1px), linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 1px)",
            backgroundSize: "80px 80px, 80px 80px",
            opacity: 0.35,
            maskImage:
              "radial-gradient(100% 100% at 50% 0%, black 40%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Stack spacing={2} alignItems="center" sx={{ mb: { xs: 6, md: 8 } }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                letterSpacing: "-0.02em",
                textAlign: "center",
                maxWidth: 900,
              }}
            >
              From site assessment to final disposition.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(230,238,247,0.78)",
                textAlign: "center",
                maxWidth: 820,
              }}
            >
              We make AV decommissioning simple, documented, and professionally managed.
            </Typography>
          </Stack>

          <Grid container spacing={3} alignItems="stretch">
            {howItWorksSteps.map((s) => (
              <Grid key={s.step} item xs={12} md={4}>
                <Box
                  sx={{
                    height: "100%",
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
                    border: "1px solid rgba(255,255,255,0.12)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "transform .2s ease, border-color .2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      borderColor: "rgba(255,255,255,0.22)",
                    },
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${s.color}33, transparent 40%)`,
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        bgcolor: `${s.color}26`,
                        border: `1px solid ${s.color}55`,
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                        fontSize: 16,
                        color: "#e6eef7",
                      }}
                    >
                      {s.step}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {s.title}
                    </Typography>
                  </Stack>

                  <Typography sx={{ color: "rgba(230,238,247,0.78)", mt: 1.25 }}>
                    {s.desc}
                  </Typography>

                  <Box
                    sx={{
                      mt: 2.5,
                      height: 3,
                      width: "30%",
                      borderRadius: 2,
                      background: `linear-gradient(90deg, ${s.color}, transparent)`,
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: { xs: 6, md: 8 } }}
          >
            <Button
              component="a"
              href="#quote-form"
              variant="contained"
              sx={{
                px: 3.5,
                py: 1.5,
                bgcolor: "#e6eef7",
                color: "#0b0f14",
                fontWeight: 800,
                "&:hover": { bgcolor: "#cfe0f4" },
              }}
            >
              Request a quote
            </Button>

            <Button
              component={RouterLink}
              to="/partners"
              variant="outlined"
              sx={{
                px: 3.5,
                py: 1.5,
                borderColor: "rgba(255,255,255,0.28)",
                color: "rgba(255,255,255,0.9)",
                "&:hover": { borderColor: "rgba(255,255,255,0.45)" },
              }}
            >
              Partner with us
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* TRUST */}
      <TrustSection />

      {/* SERVICES / VALUE */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          What we handle
        </Typography>

        <Grid container spacing={2}>
          {services.map((m) => (
            <Grid key={m.k} item xs={12} md={6}>
              <Card sx={{ ...cardStyle, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {m.k}
                  </Typography>
                  <Typography sx={{ color: "#b6c3d6" }}>{m.v}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* IMPACT / POSITIONING */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Why teams choose ReTech
        </Typography>

        <Grid container spacing={2}>
          {reasons.map((m) => (
            <Grid key={m.k} item xs={12} md={6}>
              <Card sx={{ ...cardStyle, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {m.k}
                  </Typography>
                  <Typography sx={{ color: "#b6c3d6" }}>{m.v}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          FAQs
        </Typography>

        {faqs.map((f) => (
          <Accordion key={f.q} sx={accordionStyle}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#b6c3d6" }} />}>
              <Typography>{f.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: "#b6c3d6" }}>{f.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* CONTACT CTA */}
      <Container id="quote-form" sx={{ py: 6, scrollMarginTop: "96px" }}>
        <Card sx={{ ...cardStyle, p: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Planning a system replacement or office technology refresh?
                </Typography>
                <Typography sx={{ color: "#b6c3d6" }}>
                  Tell us about the project and we’ll help you plan decommissioning, logistics,
                  recycling, and asset recovery.
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1.25}>
                  <TextField
                    placeholder="Company name"
                    fullWidth
                    size="medium"
                    sx={textFieldStyle}
                  />
                  <TextField
                    placeholder="Project location"
                    fullWidth
                    size="medium"
                    sx={textFieldStyle}
                  />
                  <TextField
                    placeholder="Email address"
                    fullWidth
                    size="medium"
                    sx={textFieldStyle}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#2a8cff",
                      fontWeight: 700,
                      "&:hover": { bgcolor: "#3c97ff" },
                    }}
                  >
                    Request a quote
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* FOOTER */}
      <Divider sx={{ borderColor: "#223047" }} />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#b6c3d6" }}>
              © {new Date().getFullYear()} ReTech. All rights reserved.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
              <Link component={RouterLink} to="/privacy" color="#a9d4ff">
                Privacy
              </Link>
              <Link component={RouterLink} to="/terms" color="#a9d4ff">
                Terms
              </Link>
              <Link component={RouterLink} to="/contact" color="#a9d4ff">
                Contact
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

/* --------- styles --------- */
const cardStyle = {
  bgcolor: "#121821",
  border: "1px solid #223047",
  color: "#e6eef7",
  borderRadius: 2,
};

const chipStyle = {
  bgcolor: "#2a8cff22",
  border: "1px solid #2a8cff33",
  color: "#ffffff",
};

const accordionStyle = {
  bgcolor: "#121821",
  border: "1px solid #223047",
  color: "#e6eef7",
  mb: 1.25,
  "& .MuiAccordionSummary-root": { minHeight: 56 },
  "&:before": { display: "none" },
};

const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "#0f141c",
    borderRadius: 1.5,
    color: "#ffffff",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.65)",
    opacity: 1,
  },
  "& fieldset": {
    borderColor: "#223047",
  },
  "&:hover fieldset": {
    borderColor: "#2a8cff66",
  },
  "& .Mui-focused fieldset": {
    borderColor: "#2a8cff",
  },
};
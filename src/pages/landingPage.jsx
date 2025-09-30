import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container, Box, Typography, Button, Grid, Card, CardContent,
  CardActions, Chip, Stack, Avatar, Divider, Accordion, AccordionSummary,
  AccordionDetails, TextField, Link
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import RecyclingIcon from "@mui/icons-material/Recycling";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import StorefrontIcon from "@mui/icons-material/Storefront";
import heroImage from "../assets/reTech-Background-Landing-Page-Hero-art.png";

// ✅ Use the horizontal section component directly
import PartnerHorizontalSection from "../components/PartnerHorizontalSection";
import TrustSection from "../components/TrustSection";
import PartnerBackgroundImage from "../assets/reTech-Background-Partner-Split.png";

export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      {/* HERO — full-bleed, scroll-safe, no fixed sizes */}
      <Box sx={{ position: "relative", overflow: "hidden", color: "#e6eef7" }}>
        {/* Background image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(0.9) brightness(0.75)",
            pointerEvents: "none", // <-- never block scroll/clicks
          }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(11,15,20,0.4) 0%, rgba(11,15,20,0.85) 60%, rgba(11,15,20,1) 100%)",
            pointerEvents: "none",
          }}
        />

        <Container sx={{ position: "relative", zIndex: 1, py: { xs: 10, md: 14 } }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left column: text + chips + CTAs */}
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                <Chip icon={<RecyclingIcon />} label="Reduce" sx={{ bgcolor: "#2a8dff", color: "#0b0f14", fontWeight: 700 }} />
                <Chip icon={<RecyclingIcon />} label="Reuse" sx={{ bgcolor: "#2aff9b", color: "#0b0f14", fontWeight: 700 }} />
                <Chip icon={<RecyclingIcon />} label="Retech" sx={{ bgcolor: "#ffa32a", color: "#0b0f14", fontWeight: 700 }} />
              </Stack>

              <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.02em", mb: 1.5 }}>
                Rescue great tech. Save money. Reduce e-waste.
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(230,238,247,0.8)", mb: 3 }}>
                Retech connects you to surplus devices from schools, offices, and refurb partners—verified,
                graded, and ready to use.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/categories"
                  size="large"
                  variant="contained"
                  sx={{ px: 3.5, py: 1.5, bgcolor: "#e6eef7", color: "#0b0f14", fontWeight: 800, "&:hover": { bgcolor: "#cfe0f4" } }}
                  startIcon={<FlashOnIcon />}
                >
                  Start browsing
                </Button>
                <Button
                  component={RouterLink}
                  to="/partners"
                  size="large"
                  variant="outlined"
                  sx={{ px: 3.5, py: 1.5, borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.92)", "&:hover": { borderColor: "rgba(255,255,255,0.45)" } }}
                  startIcon={<StorefrontIcon />}
                >
                  Become a partner
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
                <Chip icon={<VerifiedIcon />} label="Verified partners" variant="outlined" sx={chipStyle} />
                <Chip icon={<SecurityIcon />} label="Buyer protection" variant="outlined" sx={chipStyle} />
                <Chip icon={<LocalShippingIcon />} label="Pickup or shipping" variant="outlined" sx={chipStyle} />
              </Stack>
            </Grid>

            {/* Right column: keep empty (or add an image/visual) */}
            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }} />
          </Grid>
        </Container>
      </Box>

      {/* Horizontal split partners section */}
      <PartnerHorizontalSection
        background={PartnerBackgroundImage}
        corpLogos={[
          { src: "/logos/acme.svg", alt: "Acme" },
          { src: "/logos/contoso.svg", alt: "Contoso" },
        ]}
        indieLogos={[
          { src: "/logos/market-1.svg", alt: "Marketplace A" },
          { src: "/logos/market-2.svg", alt: "Marketplace B" },
        ]}
      />



      {/* HOW IT WORKS — premium, colorful, dark, spacious */}
      <Box
        component="section"
        sx={{
          position: "relative",
          py: { xs: 10, md: 16 },
          overflow: "hidden",
          color: "#e6eef7",
        }}
      >
        {/* Background: gradient + soft grid glow */}
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
              From discovery to delivery—simple, secure, fast.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(230,238,247,0.78)",
                textAlign: "center",
                maxWidth: 820,
              }}
            >
              Find nearby surplus, hold what you love, and pick up or ship with confidence.
            </Typography>
          </Stack>

          <Grid container spacing={3} alignItems="stretch">
            {[
              {
                step: "1",
                color: "#2a8cff", // blue
                title: "Browse nearby tech",
                desc: "Search by ZIP, category, and condition grade.",
              },
              {
                step: "2",
                color: "#ffa32a", // orange
                title: "Hold & checkout",
                desc: "Reserve items for 15 minutes and pay securely.",
              },
              {
                step: "3",
                color: "#2aff9b", // green
                title: "Pickup or ship",
                desc: "Schedule pickup or get tracked shipping.",
              },
            ].map((s) => (
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
                    // colorful glow edge
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

                  {/* accent bar */}
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

          {/* bottom CTA row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: { xs: 6, md: 8 } }}
          >
            <Button
              variant="contained"
              sx={{
                px: 3.5,
                py: 1.5,
                bgcolor: "#e6eef7",
                color: "#0b0f14",
                fontWeight: 800,
                "&:hover": { bgcolor: "#cfe0f4" },
              }}
              href="/categories"
            >
              Start browsing
            </Button>
            <Button
              variant="outlined"
              sx={{
                px: 3.5,
                py: 1.5,
                borderColor: "rgba(255,255,255,0.28)",
                color: "rgba(255,255,255,0.9)",
                "&:hover": { borderColor: "rgba(255,255,255,0.45)" },
              }}
              href="/partners"
            >
              Become a partner
            </Button>
          </Stack>
        </Container>
      </Box>

    {/* Trust / Badges */}
      <TrustSection />
      {/* Impact / ESG */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Impact to date</Typography>
        <Grid container spacing={2}>
          {[
            { k: "4.8★", v: "Avg rating" },
            { k: "12K+", v: "Devices rescued" },
            { k: "320T", v: "E-waste diverted (est.)" },
            { k: "1,800+", v: "Happy buyers" },
          ].map((m) => (
            <Grid key={m.v} item xs={6} md={3}>
              <Card sx={{ ...cardStyle, textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{m.k}</Typography>
                  <Typography sx={{ color: "#b6c3d6" }}>{m.v}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>FAQs</Typography>
        {[
          { q: "Are the devices tested?", a: "Listings are graded by verified partners. Many items are tested or refurbished; grade notes describe any defects." },
          { q: "What is buyer protection?", a: "Eligible orders include DOA coverage—a simple return policy if a device arrives materially different than described." },
          { q: "Can I pick up locally?", a: "Yes. Many partners offer pickup windows. Some listings support shipping for an extra fee." },
        ].map((f) => (
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

      {/* Newsletter */}
      <Container sx={{ py: 6 }}>
        <Card sx={{ ...cardStyle, p: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 1 }}>Get fresh tech deals in your inbox</Typography>
                <Typography sx={{ color: "#b6c3d6" }}>
                  Be the first to know when new surplus hits your area.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField placeholder="you@example.com" fullWidth size="medium" sx={textFieldStyle} />
                  <Button variant="contained" sx={{ bgcolor: "#2a8cff", ":hover": { bgcolor: "#3c97ff" } }}>
                    Subscribe
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Footer */}
      <Divider sx={{ borderColor: "#223047" }} />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#b6c3d6" }}>
              © {new Date().getFullYear()} Retech. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
              <Link component={RouterLink} to="/privacy" color="#a9d4ff">Privacy</Link>
              <Link component={RouterLink} to="/terms" color="#a9d4ff">Terms</Link>
              <Link component={RouterLink} to="/contact" color="#a9d4ff">Contact</Link>
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
  borderRadius: 2
};

const chipStyle = {
  bgcolor: "#2a8cff22",
  border: "1px solid #2a8cff33",
  color: "#ffffffff"
};

const accordionStyle = {
  bgcolor: "#121821",
  border: "1px solid #223047",
  color: "#e6eef7",
  "& .MuiAccordionSummary-root": { minHeight: 56 },
  "&:before": { display: "none" }
};

const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "#0f141c",
    borderRadius: 1.5
  },
  "& fieldset": { borderColor: "#223047" },
  "&:hover fieldset": { borderColor: "#2a8cff66" }
};

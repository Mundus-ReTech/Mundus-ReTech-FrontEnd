import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";

export default function PartnerHorizontalSection({
  background = "/assets/partner-bg.jpg",
  corpLogos = [],
  indieLogos = [],
}) {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        py: { xs: 12, md: 18 },
        overflow: "hidden",
        color: "#e6eef7",
      }}
    >
      {/* Background image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.55) saturate(0.9)",
        }}
      />

      {/* Overlay gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(11,15,20,0.85) 0%, rgba(11,15,20,0.85) 100%)",
        }}
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left — Corporations */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2} textAlign={{ xs: "center", md: "left" }}>
              <BusinessIcon sx={{ fontSize: 56, color: "#2a8cff" }} />
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                Large Corporations
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(230,238,247,0.9)" }}>
                Compliant offloading, fast revenue recovery, ESG impact.
              </Typography>
              <Typography sx={{ color: "rgba(230,238,247,0.75)", mb: 2 }}>
                Streamline decommissioning with data-wipe attestations, batch certificates,
                analytics, and transparent payout statements. Move devices in days, not months.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  href="/partners#apply"
                  sx={primaryBtn}
                >
                  Talk to sales
                </Button>
                <Button
                  variant="outlined"
                  href="/partners#how"
                  sx={ghostBtn}
                >
                  Learn more
                </Button>
              </Stack>
              <LogoRow logos={corpLogos} />
            </Stack>
          </Grid>

          {/* Right — Individuals */}
          <Grid item xs={12} md={6}>
            <Stack spacing={2} textAlign={{ xs: "center", md: "left" }}>
              <PersonIcon sx={{ fontSize: 56, color: "#2aff9b" }} />
              <Typography variant="h3" sx={{ fontWeight: 900 }}>
                Individuals
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(230,238,247,0.9)" }}>
                Sell a device or clear out a closet—simply and securely.
              </Typography>
              <Typography sx={{ color: "rgba(230,238,247,0.75)", mb: 2 }}>
                List your tech in minutes, get buyer protection, and choose local pickup or
                tracked shipping. We handle payments and support—so you don’t have to.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  href="/signup"
                  sx={primaryBtn}
                >
                  Start selling
                </Button>
                <Button
                  variant="outlined"
                  href="/categories"
                  sx={ghostBtn}
                >
                  Browse buyers’ demand
                </Button>
              </Stack>
              <LogoRow logos={indieLogos} />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

/* Logos row */
function LogoRow({ logos = [] }) {
  const items = logos.length
    ? logos
    : Array.from({ length: 4 }, (_, i) => ({ src: null, alt: `Logo ${i + 1}` }));

  return (
    <Stack
      direction="row"
      spacing={3}
      flexWrap="wrap"
      justifyContent={{ xs: "center", md: "flex-start" }}
      sx={{ mt: 2 }}
    >
      {items.map((l, idx) =>
        l.src ? (
          <Box
            key={idx}
            component="img"
            src={l.src}
            alt={l.alt || "Partner logo"}
            sx={{
              height: 30,
              opacity: 0.9,
              filter: "grayscale(100%)",
              mixBlendMode: "screen",
            }}
          />
        ) : (
          <Box
            key={idx}
            sx={{
              width: 96,
              height: 30,
              borderRadius: 1,
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        )
      )}
    </Stack>
  );
}

/* Buttons */
const primaryBtn = {
  px: 3.5,
  py: 1.5,
  bgcolor: "#e6eef7",
  color: "#0b0f14",
  fontWeight: 800,
  "&:hover": { bgcolor: "#cfe0f4" },
};

const ghostBtn = {
  px: 3.5,
  py: 1.5,
  borderColor: "rgba(255,255,255,0.28)",
  color: "rgba(255,255,255,0.9)",
  "&:hover": { borderColor: "rgba(255,255,255,0.45)" },
};

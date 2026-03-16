import React from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Stack,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import RecyclingRoundedIcon from "@mui/icons-material/RecyclingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

const services = [
  {
    title: "IT Asset Disposal",
    description:
      "Secure retirement of laptops, desktops, servers, networking hardware, and peripherals with a professional business-first workflow.",
    icon: <Inventory2RoundedIcon />,
  },
  {
    title: "AV Decommissioning",
    description:
      "Removal of displays, conferencing systems, racks, control gear, and supporting infrastructure for upgrades, relocations, and closures.",
    icon: <SecurityRoundedIcon />,
  },
  {
    title: "Technology Recycling",
    description:
      "Responsible reuse-first processing with sustainability in mind, helping organizations reduce e-waste and support ESG goals.",
    icon: <RecyclingRoundedIcon />,
  },
  {
    title: "Pickup & Logistics",
    description:
      "Coordinated on-site collection, labor planning, packing, and transport support for small and large technology retirement projects.",
    icon: <LocalShippingRoundedIcon />,
  },
];

const steps = [
  {
    number: "01",
    title: "Assess",
    description:
      "We review the equipment, site conditions, project scope, and building logistics before any work begins.",
  },
  {
    number: "02",
    title: "Coordinate",
    description:
      "Pickup windows, access requirements, packaging, and handling expectations are aligned in advance.",
  },
  {
    number: "03",
    title: "Remove",
    description:
      "Equipment is disconnected, collected, and moved through a controlled, professional workflow.",
  },
  {
    number: "04",
    title: "Document",
    description:
      "Clients receive clear project communication and disposition-oriented closeout documentation.",
  },
];

const industries = [
  { name: "Corporate Offices", icon: <BusinessRoundedIcon /> },
  { name: "Schools & Universities", icon: <SchoolRoundedIcon /> },
  { name: "Venues & Arts Organizations", icon: <EventSeatRoundedIcon /> },
  { name: "Healthcare & Regulated Environments", icon: <HealthAndSafetyRoundedIcon /> },
];

const trustSignals = [
  {
    title: "Secure Handling",
    text: "Structured workflows for handling devices, storage media, and supporting equipment.",
  },
  {
    title: "Sustainability Focus",
    text: "Reuse and responsible recycling are built into the service model wherever possible.",
  },
  {
    title: "Documentation",
    text: "Professional project closeout and records to make internal reporting easier.",
  },
  {
    title: "Local Service",
    text: "Responsive support for NYC and the surrounding Tri-State area.",
  },
];

const quickPoints = [
  "Chain of custody mindset",
  "Professional site handling",
  "Sustainable disposition",
  "Business-focused execution",
];

function SectionEyebrow({ children }) {
  return (
    <Typography
      sx={{
        color: brand.green,
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        mb: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}

export default function ReTechWebsitePage() {
  return (
    <Box sx={{ bgcolor: brand.white, color: brand.text }}>


      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(circle at top right, ${alpha(brand.green, 0.12)} 0%, transparent 24%), radial-gradient(circle at left center, ${alpha(brand.navy, 0.12)} 0%, transparent 30%)`,
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, lg: 6 }}>
              <Chip
                label="Secure IT & AV Decommissioning for NYC Organizations"
                sx={{
                  bgcolor: alpha(brand.green, 0.08),
                  color: brand.green,
                  border: `1px solid ${alpha(brand.green, 0.2)}`,
                  fontWeight: 700,
                  mb: 3,
                  height: 38,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              />

              <Typography
                sx={{
                  fontFamily: '"vvyPreston Display", serif',
                  color: brand.navy,
                  fontSize: { xs: 44, md: 68 },
                  lineHeight: { xs: 1.02, md: 1.02 },
                  letterSpacing: "-0.02em",
                  maxWidth: 700,
                }}
              >
                Retire technology the right way.
              </Typography>

              <Typography
                sx={{
                  mt: 3,
                  fontSize: { xs: 18, md: 21 },
                  lineHeight: 1.7,
                  color: brand.muted,
                  maxWidth: 720,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                ReTech helps businesses, schools, venues, and regulated organizations decommission IT and AV equipment securely, sustainably, and professionally.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
                <Button
                  href="#contact"
                  variant="contained"
                  endIcon={<ChevronRightRoundedIcon />}
                  sx={{
                    bgcolor: brand.navy,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    fontFamily: '"Semplicita Pro", sans-serif',
                    "&:hover": { bgcolor: "#16304F", boxShadow: "none" },
                  }}
                >
                  Get a Quote
                </Button>
                <Button
                  href="#services"
                  variant="outlined"
                  sx={{
                    color: brand.navy,
                    borderColor: brand.border,
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    fontFamily: '"Semplicita Pro", sans-serif',
                    "&:hover": { borderColor: brand.navy, bgcolor: alpha(brand.navy, 0.03) },
                  }}
                >
                  Explore Services
                </Button>
              </Stack>

              <Grid container spacing={2} sx={{ mt: 4, maxWidth: 760 }}>
                {[
                  ["Data Security", "Secure handling of drives and equipment", <SecurityRoundedIcon fontSize="small" />],
                  ["Sustainability", "Responsible reuse and recycling workflows", <RecyclingRoundedIcon fontSize="small" />],
                  ["Professional Execution", "Deinstall, logistics, and documentation", <AssignmentTurnedInRoundedIcon fontSize="small" />],
                ].map(([title, text, icon]) => (
                  <Grid key={title} size={{ xs: 12, sm: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        border: `1px solid ${brand.border}`,
                        borderRadius: 4,
                        bgcolor: brand.white,
                      }}
                    >
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Box sx={{ color: brand.green, display: "flex" }}>{icon}</Box>
                          <Typography sx={{ fontWeight: 700, color: brand.text, fontFamily: '"Semplicita Pro", sans-serif' }}>
                            {title}
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: 14,
                            lineHeight: 1.7,
                            color: brand.muted,
                            fontFamily: '"Semplicita Pro", sans-serif',
                          }}
                        >
                          {text}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 6,
                  p: { xs: 1.5, md: 2 },
                  bgcolor: brand.grayBg,
                  border: `1px solid ${brand.border}`,
                  boxShadow: "0 24px 60px rgba(30, 58, 95, 0.10)",
                }}
              >
                <Card
                  elevation={0}
                  sx={{ borderRadius: 5, border: `1px solid ${alpha(brand.navy, 0.08)}` }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 2, borderBottom: `1px solid ${brand.border}` }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: brand.text, fontFamily: '"Semplicita Pro", sans-serif' }}>
                          Project Snapshot
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}>
                          Enterprise technology retirement workflow
                        </Typography>
                      </Box>
                      <Chip
                        label="Compliant"
                        sx={{ bgcolor: alpha(brand.green, 0.12), color: brand.green, fontWeight: 800 }}
                      />
                    </Stack>

                    <Stack spacing={2} sx={{ mt: 3 }}>
                      {[
                        ["Inventory & Site Review", "Asset count, device categories, removal planning"],
                        ["Deinstallation & Pickup", "On-site disconnect, packing, chain of custody"],
                        ["Sorting & Processing", "Reuse, resale, and responsible recycling"],
                        ["Reporting", "Clear documentation and disposition records"],
                      ].map(([title, text], index) => (
                        <Card
                          key={title}
                          elevation={0}
                          sx={{ borderRadius: 4, border: `1px solid ${alpha(brand.navy, 0.08)}` }}
                        >
                          <CardContent sx={{ p: 2.25 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Box
                                sx={{
                                  width: 38,
                                  height: 38,
                                  minWidth: 38,
                                  borderRadius: "50%",
                                  bgcolor: brand.navy,
                                  color: brand.white,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 800,
                                  fontSize: 14,
                                  fontFamily: '"Semplicita Pro", sans-serif',
                                }}
                              >
                                {index + 1}
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: 700, color: brand.text, fontFamily: '"Semplicita Pro", sans-serif' }}>
                                  {title}
                                </Typography>
                                <Typography
                                  sx={{ mt: 0.5, fontSize: 14, lineHeight: 1.7, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}
                                >
                                  {text}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ borderTop: `1px solid ${brand.border}`, borderBottom: `1px solid ${brand.border}`, bgcolor: brand.grayBg }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Typography sx={{ color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}>
              Built for IT refreshes, office relocations, and AV upgrades
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1, sm: 3 }}>
              {quickPoints.map((point) => (
                <Typography key={point} sx={{ fontWeight: 700, color: brand.navy, fontSize: 14, fontFamily: '"Semplicita Pro", sans-serif' }}>
                  {point}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container id="services" maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ maxWidth: 780 }}>
          <SectionEyebrow>Services</SectionEyebrow>
          <Typography
            sx={{
              fontFamily: '"vvyPreston Display", serif',
              fontSize: { xs: 34, md: 50 },
              lineHeight: 1.05,
              color: brand.navy,
            }}
          >
            Secure technology retirement services for serious organizations.
          </Typography>
          <Typography
            sx={{ mt: 2.5, fontSize: { xs: 17, md: 20 }, lineHeight: 1.75, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}
          >
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {services.map((service) => (
            <Grid key={service.title} size={{ xs: 12, md: 6, xl: 3 }}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 5,
                  border: `1px solid ${brand.border}`,
                  boxShadow: "0 12px 32px rgba(26, 26, 26, 0.04)",
                }}
              >
                <CardContent sx={{ p: 3.25 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: alpha(brand.green, 0.1),
                      color: brand.green,
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography sx={{ fontSize: 22, fontWeight: 700, color: brand.text, fontFamily: '"Semplicita Pro", sans-serif' }}>
                    {service.title}
                  </Typography>
                  <Typography sx={{ mt: 1.5, fontSize: 15, lineHeight: 1.8, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}>
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box id="process" sx={{ bgcolor: brand.grayBg, py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <SectionEyebrow>Process</SectionEyebrow>
              <Typography
                sx={{
                  fontFamily: '"vvyPreston Display", serif',
                  fontSize: { xs: 34, md: 50 },
                  lineHeight: 1.05,
                  color: brand.navy,
                }}
              >
                A simple process that feels safe for enterprise buyers.
              </Typography>
              <Typography sx={{ mt: 2.5, fontSize: { xs: 17, md: 20 }, lineHeight: 1.75, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}>
                Your process section should reassure clients that nothing is improvised and every asset is handled with care.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack spacing={2}>
                {steps.map((step) => (
                  <Card key={step.number} elevation={0} sx={{ borderRadius: 5, border: `1px solid ${brand.border}` }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2.5} alignItems="flex-start">
                        <Typography sx={{ fontSize: 28, fontWeight: 800, color: alpha(brand.navy, 0.24), fontFamily: '"Semplicita Pro", sans-serif' }}>
                          {step.number}
                        </Typography>
                        <Box>
                          <Typography sx={{ fontSize: 22, fontWeight: 700, color: brand.text, fontFamily: '"Semplicita Pro", sans-serif' }}>
                            {step.title}
                          </Typography>
                          <Typography sx={{ mt: 0.75, fontSize: 15, lineHeight: 1.8, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}>
                            {step.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container id="industries" maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={3} alignItems="end">
          <Grid size={{ xs: 12, md: 7 }}>
            <SectionEyebrow>Industries</SectionEyebrow>
            <Typography
              sx={{
                fontFamily: '"vvyPreston Display", serif',
                fontSize: { xs: 34, md: 50 },
                lineHeight: 1.05,
                color: brand.navy,
              }}
            >
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
           
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {industries.map((industry) => (
            <Grid key={industry.name} size={{ xs: 12, md: 6, xl: 3 }}>
              <Card elevation={0} sx={{ borderRadius: 5, border: `1px solid ${brand.border}`, bgcolor: brand.grayBg, height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: brand.navy, mb: 2, display: "flex" }}>{industry.icon}</Box>
                  <Typography sx={{ fontSize: 22, fontWeight: 700, color: brand.text, fontFamily: '"Semplicita Pro", sans-serif' }}>
                    {industry.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box id="trust" sx={{ bgcolor: brand.navy, color: brand.white, py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Typography
                sx={{
                  color: alpha(brand.white, 0.8),
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  mb: 1.5,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Trust Signals
              </Typography>
<Typography
  sx={{
    fontFamily: '"vvyPreston Display", serif',
    fontSize: { xs: 34, md: 50 },
    lineHeight: 1.05,
    color: brand.white,
  }}
>
  Built to inspire confidence in every project.
</Typography>
<Typography
  sx={{
    mt: 2.5,
    fontSize: { xs: 17, md: 20 },
    lineHeight: 1.75,
    color: alpha(brand.white, 0.78),
    fontFamily: '"Semplicita Pro", sans-serif',
  }}
>
  From secure asset handling to responsible disposition and clear reporting, ReTech gives organizations a professional and dependable partner for technology retirement.
</Typography>
            </Grid>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Grid container spacing={2}>
                {trustSignals.map((signal) => (
                  <Grid key={signal.title} size={{ xs: 12, sm: 6 }}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 5,
                        bgcolor: alpha(brand.white, 0.06),
                        border: `1px solid ${alpha(brand.white, 0.1)}`,
                        color: brand.white,
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: '"Semplicita Pro", sans-serif' }}>
                          {signal.title}
                        </Typography>
                        <Typography sx={{ mt: 1.25, fontSize: 15, lineHeight: 1.8, color: alpha(brand.white, 0.78), fontFamily: '"Semplicita Pro", sans-serif' }}>
                          {signal.text}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container id="contact" maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 6,
            border: `1px solid ${brand.border}`,
            background: `linear-gradient(135deg, ${brand.white} 0%, ${brand.grayBg} 100%)`,
            boxShadow: "0 24px 60px rgba(30, 58, 95, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <SectionEyebrow>Call to Action</SectionEyebrow>
            <Typography
              sx={{
                fontFamily: '"vvyPreston Display", serif',
                fontSize: { xs: 32, md: 46 },
                lineHeight: 1.06,
                color: brand.navy,
                maxWidth: 760,
              }}
            >
              Make it easy for serious buyers to take the next step.
            </Typography>
            <Typography sx={{ mt: 2.5, fontSize: { xs: 17, md: 19 }, lineHeight: 1.75, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif', maxWidth: 760 }}>
              Your strongest CTA is not “buy now.” It is a professional invitation to discuss scope, pickup, and project needs.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
              <Button
                href="mailto:support@retechnyc.com"
                variant="contained"
                sx={{
                  bgcolor: brand.navy,
                  color: brand.white,
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  boxShadow: "none",
                  fontFamily: '"Semplicita Pro", sans-serif',
                  "&:hover": { bgcolor: "#16304F", boxShadow: "none" },
                }}
              >
                Email ReTech
              </Button>
              <Button
                href="#"
                variant="outlined"
                sx={{
                  color: brand.green,
                  borderColor: alpha(brand.green, 0.35),
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  fontFamily: '"Semplicita Pro", sans-serif',
                  "&:hover": { borderColor: brand.green, bgcolor: alpha(brand.green, 0.04) },
                }}
              >
                Book a Consultation
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>

      <Divider />

      <Box component="footer" sx={{ bgcolor: brand.white }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, color: brand.navy, fontFamily: '"Semplicita Pro", sans-serif' }}>
                ReTech EcoSystems LLC
              </Typography>
              <Typography sx={{ mt: 0.5, color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}>
                Secure IT & AV Decommissioning • Sustainable Technology Retirement
              </Typography>
            </Box>
            <Typography sx={{ color: brand.muted, fontFamily: '"Semplicita Pro", sans-serif' }}>
              NYC • Tri-State Area • support@retechnyc.com
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

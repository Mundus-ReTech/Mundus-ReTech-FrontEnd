import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box, Container, Grid, Typography, Stack, Card, CardContent, CardActions,
  Button, Chip, Avatar, Divider, Accordion, AccordionSummary, AccordionDetails,
  TextField, Link
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentsIcon from "@mui/icons-material/Payments";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StoreIcon from "@mui/icons-material/Store";

export default function PartnersPage() {
  return (
    <Box
      sx={{
        bgcolor: "#0b0f14",
        color: "#e6eef7",
        "& .MuiTypography-root": { color: "rgba(230,238,247,0.92)" },
        "& a, & .MuiLink-root": { color: "rgba(230,238,247,0.9)" },
      }}
    >
      {/* HERO */}
      <Box sx={{ position: "relative", minHeight: { xs: "48vh", md: "56vh" }, display: "flex", alignItems: "center" }}>
        <Box
          sx={{
            position: "absolute", inset: 0,
            background:
              "radial-gradient(1200px 500px at 20% -10%, rgba(255,255,255,0.06), transparent),linear-gradient(180deg, rgba(11,15,20,0.6) 0%, rgba(11,15,20,1) 100%)"
          }}
        />
        <Container sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
          <Stack spacing={2} maxWidth={920}>
            <Chip
              icon={<StoreIcon />}
              label="For refurbishers, schools & IT managers"
              sx={{
                alignSelf: "flex-start",
                bgcolor: "transparent",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(4px)",
              }}
            />
            <Typography variant="h2" sx={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              Turn surplus into revenue without the friction.
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(230,238,247,0.78)" }}>
              Retech gives you compliant offloading, fast payouts, and ready demand. Upload once, move inventory, and get
              reporting your compliance team will love.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ pt: 1 }}>
              <Button component={RouterLink} to="/partners#apply" variant="contained"
                sx={{ bgcolor: "#e6eef7", color: "#0b0f14", fontWeight: 700, "&:hover": { bgcolor: "#cfe0f4" } }}>
                Apply to become a partner
              </Button>
              <Button component={RouterLink} to="/partners#how" variant="text" sx={{ color: "rgba(255,255,255,0.88)" }}>
                See how it works
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* VALUE PROPS */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          {[
            { icon: <UploadFileIcon />, title: "Bulk upload", desc: "CSV & API options. Map grades, specs & photos." },
            { icon: <VerifiedIcon />, title: "Compliance-ready", desc: "Data-wipe attestations & batch certificates." },
            { icon: <LocalShippingIcon />, title: "Pickup or ship", desc: "Local pickup windows or tracked labels." },
            { icon: <QueryStatsIcon />, title: "Analytics", desc: "Sales velocity, pricing insights, ESG impact." },
          ].map((v) => (
            <Grid key={v.title} item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: 3 }}>
                  <Avatar variant="rounded" sx={iconAvatar}>{v.icon}</Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 1.5 }}>
                    {v.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(255, 255, 255, 0.72)" }}>{v.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* NEW — INDUSTRIES WE PARTNER WITH */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>Industries we partner with</SectionTitle>
        <Typography sx={{ color: "rgba(230,238,247,0.78)", mb: 2 }}>
          We help organizations across sectors safely redeploy or monetize surplus technology — ensuring compliance and
          widening access through our school affiliate network.
        </Typography>

        <Grid container spacing={1.25}>
          {[
            "AV & IT (Crestron, AMX, Q-SYS, Cisco)",
            "Enterprise & Finance (banks, insurance)",
            "Healthcare & Medical Devices",
            "Biotech & Laboratory Equipment",
            "Data Center & Networking",
            "Manufacturing & Industrial (PLC, robotics)",
            "Telecom & Broadcasting",
            "Education & Nonprofit",
            "Retail & POS Systems",
            "Hospitality & Events",
            "Transportation & Logistics",
            "Energy & Utilities",
            "Public Sector & Municipal",
          ].map((tag) => (
            <Grid key={tag} item>
              <Chip
                label={tag}
                sx={{
                  ...chipQuiet,
                  borderColor: "rgba(42,140,255,0.35)",
                  bgcolor: "rgba(42,140,255,0.08)",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* HOW IT WORKS */}
      <Container id="how" sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>How it works</SectionTitle>
        <Grid container spacing={3}>
          {[
            {
              step: "1",
              title: "Onboard & verify",
              desc: "We verify your organization and compliance needs, then enable your partner dashboard.",
            },
            {
              step: "2",
              title: "Upload inventory",
              desc: "Use CSV or API to import devices with grades, notes, and pickup/shipping options.",
            },
            {
              step: "3",
              title: "List & sell",
              desc: "Your listings go live to local buyers and our marketplace. Reservations and payments handled by us.",
            },
            {
              step: "4",
              title: "Fulfill & get paid",
              desc: "Offer pickup slots or ship. Get transparent splits and fast payouts to your bank.",
            },
          ].map((s) => (
            <Grid key={s.step} item xs={12} md={3}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: 3 }}>
                  <Chip label={`Step ${s.step}`} size="small" sx={chipQuiet} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>{s.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* BENEFITS */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>Why partners choose Retech</SectionTitle>
        <Grid container spacing={3}>
          {[
            "Move old inventory quickly with targeted demand",
            "No marketplace hassle—payments, holds, disputes covered",
            "Simple tooling for batch devices and grades",
            "ESG reporting you can share with stakeholders",
            "Clear fees and fast payouts",
            "Dedicated partner support",
          ].map((b) => (
            <Grid key={b} item xs={12} md={4}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <Avatar sx={miniCheck}><VerifiedIcon fontSize="small" /></Avatar>
                    <Typography sx={{ color: "rgba(230,238,247,0.88)" }}>{b}</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* NEW — SCHOOL AFFILIATE PROGRAM */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>School Affiliate Program</SectionTitle>

        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={7}>
            <Card elevation={0} sx={{ ...quietCard, height: "100%" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Access cross-industry gear at educational pricing
                </Typography>
                <Typography sx={{ color: "rgba(230,238,247,0.78)", mb: 2 }}>
                  Approved K-12, higher-ed, and nonprofit schools get priority access to surplus from enterprise,
                  healthcare, finance, manufacturing, AV, and more — all vetted, graded, and ready to deploy in labs,
                  classrooms, and maker spaces.
                </Typography>

                <Grid container spacing={1.25} sx={{ mb: 2 }}>
                  {[
                    "Laptops, tablets, Chromebooks",
                    "Switches, Wi-Fi, security gateways",
                    "AV gear (projectors, DSPs, controllers)",
                    "Medical & lab devices (where eligible)",
                    "Monitors, components, accessories",
                    "Certified data-wiped equipment",
                  ].map((t) => (
                    <Grid item key={t}>
                      <Chip label={t} sx={chipQuiet} />
                    </Grid>
                  ))}
                </Grid>

                <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                  We align inventory pipelines from large organizations to school needs in NYC, Westchester, and beyond,
                  with transparent grading and documentation for your asset records.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    component={RouterLink}
                    to="/partners#apply"
                    variant="contained"
                    sx={{ bgcolor: "#e6eef7", color: "#0b0f14", fontWeight: 700, "&:hover": { bgcolor: "#cfe0f4" } }}
                  >
                    Join the program
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/categories"
                    variant="text"
                    sx={{ color: "rgba(255,255,255,0.88)" }}
                  >
                    Browse current inventory
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card elevation={0} sx={{ ...quietCard, height: "100%", position: "relative", overflow: "hidden" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  How it works for schools
                </Typography>
                <Stack spacing={1.25}>
                  <ReqItem text="Apply with your DOE/EDU credentials (or nonprofit docs)" />
                  <ReqItem text="Get verified and receive school pricing access" />
                  <ReqItem text="Reserve items, choose pickup or shipping" />
                  <ReqItem text="Receive grading docs + wipe attestations" />
                </Stack>

                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />

                <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                  Want to feed your school pipeline? Districts can set standing requests (e.g., “100 Chromebooks / quarter”).
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* REQUIREMENTS & SPLITS */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={quietCard}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Partner requirements
                </Typography>
                <Stack spacing={1.25}>
                  <ReqItem text="Business entity and payout-capable bank account" />
                  <ReqItem text="Compliance: data-wipe process (we can provide templates)" />
                  <ReqItem text="Accurate grading & photo guidelines" />
                  <ReqItem text="Pickup windows or shipping readiness" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={quietCard}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Revenue split & payouts
                </Typography>
                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar sx={miniIcon}><PaymentsIcon fontSize="small" /></Avatar>
                    <Typography sx={{ color: "rgba(230,238,247,0.88)" }}>
                      Typical split: <b>70% partner / 30% marketplace</b> (varies by volume & category).
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                    We handle payments, buyer protection, and support. Payouts are deposited weekly with a full statement.
                  </Typography>
                  <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)" }} />
                  <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                    Ask about volume pricing, enterprise compliance, and white-glove pickups.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* TESTIMONIALS */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>Partner stories</SectionTitle>
        <Grid container spacing={3}>
          {[
            { name: "Northside High School", quote: "Cleared 200 Chromebooks with certificates in 10 days." },
            { name: "City IT Dept", quote: "Transparent reporting and painless payouts—made decommissioning easy." },
            { name: "RefurbCo", quote: "CSV import + steady demand turned aging stock into cash." },
          ].map((t) => (
            <Grid key={t.name} item xs={12} md={4}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography sx={{ color: "rgba(230,238,247,0.88)" }}>"{t.quote}"</Typography>
                  <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>{t.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>FAQs</SectionTitle>
        {[
          { q: "What categories do you support?", a: "Laptops, desktops, monitors, phones, tablets, components, networking, and more." },
          { q: "Can you provide data-wipe certificates?", a: "Yes. We collect attestations and can issue batch-level compliance certificates." },
          { q: "Do you do pickups?", a: "Yes—local pickups in select areas and national shipping label support." },
          { q: "How fast are payouts?", a: "Weekly by default; faster options available for high-volume partners." },
        ].map((f) => (
          <Accordion key={f.q} sx={accordionStyle}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}>
              <Typography sx={{ fontWeight: 600 }}>{f.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>{f.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      {/* INQUIRY FORM */}
      <Container id="apply" sx={{ py: { xs: 6, md: 8 } }}>
        <Card elevation={0} sx={quietCard}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "black" }} bgcolor={'#000000'}>
              Apply to become a partner
            </Typography>
            <Typography sx={{ color: "rgba(230,238,247,0.78)", mb: 3 }}>
              Tell us about your organization and inventory. We’ll get back to you quickly.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField label="Organization name" fullWidth sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Contact name" fullWidth sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email" type="email" fullWidth sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Phone" fullWidth sx={textFieldStyle} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="What do you want to offload? (categories, quantities, timing)"
                  fullWidth
                  multiline
                  minRows={3}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
            <CardActions sx={{ mt: 2, p: 0 }}>
              <Button variant="contained"
                sx={{ bgcolor: "#e6eef7", color: "#0b0f14", fontWeight: 700, "&:hover": { bgcolor: "#cfe0f4" } }}
              >
                Submit inquiry
              </Button>
              <Typography sx={{ color: "rgba(230,238,247,0.78)", ml: 2 }}>
                Prefer email? <Link component={RouterLink} to="/contact" color="rgba(230,238,247,0.9)">Contact us</Link>
              </Typography>
            </CardActions>
          </CardContent>
        </Card>
      </Container>

      {/* FOOTER MINI */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <Container sx={{ py: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
              © {new Date().getFullYear()} Retech. Partners.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
              <Link component={RouterLink} to="/privacy" color="rgba(230,238,247,0.9)">Privacy</Link>
              <Link component={RouterLink} to="/terms" color="rgba(230,238,247,0.9)">Terms</Link>
              <Link component={RouterLink} to="/contact" color="rgba(230,238,247,0.9)">Contact</Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

/* ——— Styles / tiny components ——— */
const quietCard = {
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
};
const chipQuiet = {
  bgcolor: "transparent",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(4px)",
};
const iconAvatar = {
  bgcolor: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
  borderRadius: 2,
  width: 48,
  height: 48,
};
const miniCheck = {
  width: 22,
  height: 22,
  bgcolor: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
};
const miniIcon = {
  width: 28,
  height: 28,
  bgcolor: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.92)",
};
const accordionStyle = {
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
  mb: 1,
  "& .MuiAccordionSummary-root": { minHeight: 56 },
  "&:before": { display: "none" },
};
const textFieldStyle = {
  "& .MuiInputBase-root": {
    bgcolor: "rgba(255,255,255,0.03)",
    borderRadius: 2,
    color: "rgba(255,255,255,0.92)",
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
  "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
};

function SectionTitle({ children }) {
  return (
    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5, letterSpacing: "-0.01em" }}>
      {children}
    </Typography>
  );
}

function ReqItem({ text }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Avatar sx={miniCheck}><VerifiedIcon fontSize="small" /></Avatar>
      <Typography sx={{ color: "rgba(230,238,247,0.9)" }}>{text}</Typography>
    </Stack>
  );
}

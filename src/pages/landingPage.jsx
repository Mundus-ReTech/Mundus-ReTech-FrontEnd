import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar, Toolbar, Container, Box, Typography, Button, Grid, Card, CardContent,
  CardActions, Chip, Stack, Avatar, Divider, Accordion, AccordionSummary,
  AccordionDetails, TextField, Link, Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SavingsIcon from "@mui/icons-material/Savings";
import SecurityIcon from "@mui/icons-material/Security";
import RecyclingIcon from "@mui/icons-material/Recycling";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import RouterIcon from "@mui/icons-material/Router";
import TabletMacIcon from "@mui/icons-material/TabletMac";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import heroImage from "../assets/reTech-Background-Landing-Page-Hero-art.png";
import TrustSection from '../components/TrustSection'




export default function LandingPage() {
  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      {/* Top bar (optional if you already use your Navbar component) */}


      {/* Hero */}
      <Container sx={{ py: { xs: 8, md: 3 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Chip
              icon={<RecyclingIcon />}
              label="Reduce"
              sx={{ bgcolor: "#2a8dff98", border: "1px solid #ffffff93", color: "#a9d4ff", mb: 2 }}
            />
                        <Chip
              icon={<RecyclingIcon />}
              label="Reuse"
              sx={{ bgcolor: "#2aff2a79", border: "1px solid #ffffff93", color: "#a9d4ff", mb: 2 }}
            />
                        <Chip
              icon={<RecyclingIcon />}
              label="ReTech"
              sx={{ bgcolor: "#ffa32a9f", border: "1px solid #ffffff93", color: "#a9d4ff", mb: 2 }}
            />
         <div className="Landing-Page-Header-Content">
  <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1, mb: 2 }}>
    Rescue great tech, save money, reduce e-waste.
  </Typography>
  <Typography variant="h5"  sx={{ color: "#b6c3d6", mb: 3, fontWeight: 100 }}>
    Retech connects you to surplus devices from schools, offices, and refurb partners—verified,
    graded, and ready to use. Good for your wallet and the planet.
  </Typography>
</div>

            


            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                component={RouterLink}
                to="/categories"
                size="large"
                variant="contained"
                sx={{ bgcolor: "#2a8cff", ":hover": { bgcolor: "#3c97ff" } }}
                startIcon={<FlashOnIcon />}
              >
                Start browsing
              </Button>
              <Button
                component={RouterLink}
                to="/partners"
                size="large"
                variant="outlined"
                sx={{ borderColor: "#2a8cff66", color: "#a9d4ff", ":hover": { borderColor: "#3c97ff" } }}
                startIcon={<StorefrontIcon />}
              >
                Become a partner
              </Button>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Chip icon={<VerifiedIcon />} label="Verified partners" variant="outlined" sx={chipStyle} />
              <Chip icon={<SecurityIcon />} label="Buyer protection" variant="outlined" sx={chipStyle} />
              <Chip icon={<LocalShippingIcon />} label="Pickup or shipping" variant="outlined" sx={chipStyle} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            {/* Visual placeholder – swap with your hero image */}
<Box
  component="img"
  src={heroImage}
  alt="Retech Hero"
  sx={{
    width: "100%",
    height: 560,
    objectFit: "cover",
    borderRadius: 3,
    border: "1px solid #223047",
  }}
/>



          </Grid>
        </Grid>
      </Container>

      {/* Value Props */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {[
            {
              icon: <SavingsIcon />,
              title: "Save big",
              desc: "Up to 70% off MSRP on like-new and refurbished devices."
            },
            {
              icon: <VerifiedIcon />,
              title: "Trusted sources",
              desc: "Inventory from verified partners with clear grading."
            },
            {
              icon: <SecurityIcon />,
              title: "Buyer protection",
              desc: "Simple return policy + DOA coverage on eligible items."
            },
            {
              icon: <RecyclingIcon />,
              title: "Reduce e-waste",
              desc: "Your purchase helps keep tech out of landfills."
            }
          ].map((v) => (
            <Grid key={v.title} item xs={12} sm={6} md={3}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                    <Avatar sx={{ bgcolor: "#2a8cff22", border: "1px solid #2a8cff33", color: "#a9d4ff" }}>
                      {v.icon}
                    </Avatar>
                    <Typography variant="h6">{v.title}</Typography>
                  </Stack>
                  <Typography sx={{ color: "#b6c3d6" }}>{v.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Popular Categories */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Popular categories</Typography>
        <Grid container spacing={2}>
          {[
            { icon: <LaptopMacIcon />, label: "Laptops", to: "/categories?cat=LAPTOP" },
            { icon: <TabletMacIcon />, label: "Tablets", to: "/categories?cat=TABLET" },
            { icon: <RouterIcon />, label: "Networking", to: "/categories?cat=NETWORKING" },
            { icon: <HeadphonesIcon />, label: "Accessories", to: "/categories?cat=ACCESSORY" }
          ].map((c) => (
            <Grid key={c.label} item xs={6} sm={3}>
              <Card component={RouterLink} to={c.to} sx={{ ...cardStyle, textDecoration: "none" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Box sx={{ fontSize: 40, mb: 1 }}>{c.icon}</Box>
                  <Typography>{c.label}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it Works */}



      <TrustSection/>
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>How it works</Typography>
        <Grid container spacing={3}>
          {[
            { step: "1", title: "Browse nearby tech", desc: "Search by ZIP, category, and condition grade." },
            { step: "2", title: "Hold & checkout", desc: "Reserve items for 15 minutes and pay securely." },
            { step: "3", title: "Pickup or ship", desc: "Schedule pickup or get tracked shipping." }
          ].map((s) => (
            <Grid key={s.step} item xs={12} md={4}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Chip label={`Step ${s.step}`} size="small" sx={chipStyle} />
                  <Typography variant="h6" sx={{ mt: 1 }}>{s.title}</Typography>
                  <Typography sx={{ color: "#b6c3d6", mt: 0.5 }}>{s.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Partner CTA */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Card sx={{ ...cardStyle, p: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Have surplus devices? Turn them into impact.
                </Typography>
                <Typography sx={{ color: "#b6c3d6", mb: 2 }}>
                  Retech helps schools, offices, and refurbishers move inventory fast—while generating
                  ESG wins and new revenue.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/partners"
                    variant="contained"
                    sx={{ bgcolor: "#2a8cff", ":hover": { bgcolor: "#3c97ff" } }}
                  >
                    Partner with us
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/partners#learn-more"
                    variant="outlined"
                    sx={{ borderColor: "#2a8cff66", color: "#a9d4ff" }}
                  >
                    Learn more
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>Partner benefits</Typography>
                <Stack spacing={1}>
                  <BenefitItem text="Bulk CSV upload & batch tools" />
                  <BenefitItem text="Compliance/data-wipe attestation" />
                  <BenefitItem text="Fast payouts & clear fees" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Social Proof / Testimonials */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>What partners & buyers say</Typography>
        <Grid container spacing={3}>
          {[
            {
              name: "Jordan • IT Director",
              quote: "We cleared 120 laptops in a week and saved on disposal—Retech made it painless."
            },
            {
              name: "Maya • Student",
              quote: "I snagged a like-new ThinkPad for a fraction of retail. Exactly what I needed."
            },
            {
              name: "Ben • Refurb Shop Owner",
              quote: "Easy upload tools and steady demand. Retech became a real revenue channel."
            }
          ].map((t) => (
            <Grid key={t.name} item xs={12} md={4}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Typography sx={{ color: "#b6c3d6" }}>"{t.quote}"</Typography>
                  <Divider sx={{ my: 2, borderColor: "#223047" }} />
                  <Typography variant="subtitle2">{t.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Impact / ESG */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Impact to date</Typography>
        <Grid container spacing={2}>
          {[
            { k: "4.8★", v: "Avg rating" },
            { k: "12K+", v: "Devices rescued" },
            { k: "320T", v: "E-waste diverted (est.)" },
            { k: "1,800+", v: "Happy buyers" }
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
          {
            q: "Are the devices tested?",
            a: "Listings are graded by verified partners. Many items are tested or refurbished; grade notes describe any defects."
          },
          {
            q: "What is buyer protection?",
            a: "Eligible orders include DOA coverage—a simple return policy if a device arrives materially different than described."
          },
          {
            q: "Can I pick up locally?",
            a: "Yes. Many partners offer pickup windows. Some listings support shipping for an extra fee."
          }
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
                  <TextField
                    placeholder="you@example.com"
                    fullWidth
                    size="medium"
                    sx={textFieldStyle}
                  />
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
  color: "#a9d4ff"
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

/* Small helper for Partner Benefits */
function BenefitItem({ text }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar sx={{ width: 22, height: 22, bgcolor: "#2a8cff22", border: "1px solid #2a8cff33", color: "#a9d4ff" }}>
        <VerifiedIcon fontSize="small" />
      </Avatar>
      <Typography sx={{ color: "#b6c3d6" }}>{text}</Typography>
    </Stack>
  );
}

import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Link
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import InventoryIcon from "@mui/icons-material/Inventory";
import PaymentsIcon from "@mui/icons-material/Payments";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import StoreIcon from "@mui/icons-material/Store";
import SecurityIcon from "@mui/icons-material/Security";
import RecyclingIcon from "@mui/icons-material/Recycling";
import HandshakeIcon from "@mui/icons-material/Handshake";

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
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: "48vh", md: "56vh" },
          display: "flex",
          alignItems: "center"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(1200px 500px at 20% -10%, rgba(42,140,255,0.12), transparent), linear-gradient(180deg, rgba(11,15,20,0.65) 0%, rgba(11,15,20,1) 100%)"
          }}
        />
        <Container sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}>
          <Stack spacing={2} maxWidth={920}>
            <Chip
              icon={<HandshakeIcon />}
              label="For AV integrators, facilities teams, and technology refresh partners"
              sx={{
                alignSelf: "flex-start",
                bgcolor: "transparent",
                border: "1px solid rgba(255,255,255,0.16)",
                color: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(4px)",
              }}
            />

            <Typography
              variant="h2"
              sx={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
            >
              Close projects faster with a dedicated AV decommissioning partner.
            </Typography>

            <Typography variant="h6" sx={{ color: "rgba(230,238,247,0.78)" }}>
              ReTech helps partners remove, inventory, recycle, and recover value from outgoing AV
              equipment during upgrades, renovations, and system replacements.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row", color: 'black' }} spacing={1.5} sx={{ pt: 1 }}>
              <Button
                component={RouterLink}
                to="/partners#apply"
                variant="contained"
                sx={{
                  bgcolor: "#0a0a0a",
                  color: "#ffffff",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#000000" }
                }}
              >
                Partner with us
              </Button>

              <Button
                component={RouterLink}
                to="/partners#how"
                variant="text"
                sx={{ color: "rgba(255,255,255,0.88)" }}
              >
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
            {
              icon: <InventoryIcon />,
              title: "Inventory & documentation",
              desc: "Track manufacturer, model, serial number, condition, and project asset notes."
            },
            {
              icon: <VerifiedIcon />,
              title: "AV-specialized handling",
              desc: "Work with a team that understands racks, DSPs, control systems, cameras, and installed AV environments."
            },
            {
              icon: <LocalShippingIcon />,
              title: "Removal & logistics",
              desc: "Coordinate on-site removal, palletizing, pickup, transportation, and downstream disposition."
            },
            {
              icon: <RecyclingIcon />,
              title: "Recovery-first disposition",
              desc: "Prioritize reuse, resale, donation, and responsible recycling instead of default landfill disposal."
            },
          ].map((v) => (
            <Grid key={v.title} item xs={12} sm={6} md={3}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: 3 }}>
                  <Avatar variant="rounded" sx={iconAvatar}>{v.icon}</Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 1.5 }}>
                    {v.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
                    {v.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* WHO WE PARTNER WITH */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>Who we partner with</SectionTitle>
        <Typography sx={{ color: "rgba(230,238,247,0.78)", mb: 2 }}>
          We support organizations that replace, remove, manage, or inherit AV and technology equipment.
        </Typography>

        <Grid container spacing={1.25}>
          {[
            "AV integrators",
            "Installation teams",
            "Facilities departments",
            "Corporate offices",
            "IT & workplace teams",
            "Schools & universities",
            "Performance venues",
            "Hospitals & healthcare facilities",
            "Broadcast & media spaces",
            "General contractors",
            "Office relocation teams",
            "Recyclers & downstream partners",
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
              title: "Review the project",
              desc: "We learn the site scope, equipment types, project timeline, and partner requirements."
            },
            {
              step: "2",
              title: "Plan removal",
              desc: "We coordinate labor, logistics, inventory needs, and disposition strategy before site work begins."
            },
            {
              step: "3",
              title: "Remove & document",
              desc: "Equipment is disconnected, organized, inventoried, and prepared for transport or storage."
            },
            {
              step: "4",
              title: "Recycle or recover value",
              desc: "Usable assets are evaluated for reuse or resale, and non-usable equipment is routed responsibly."
            },
          ].map((s) => (
            <Grid key={s.step} item xs={12} md={3}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: 3 }}>
                  <Chip label={`Step ${s.step}`} size="small" sx={chipQuiet} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                    {s.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                    {s.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* PARTNER BENEFITS */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>Why partners choose ReTech</SectionTitle>
        <Grid container spacing={3}>
          {[
            "Keep install teams focused on the new deployment instead of outgoing equipment",
            "Add decommissioning to your project offering without building it in-house",
            "Improve project closeout with organized removal and asset documentation",
            "Create potential revenue through reuse and resale where appropriate",
            "Reduce disposal headaches and support sustainability goals",
            "Work with a partner that understands AV systems, not just general electronics recycling",
          ].map((b) => (
            <Grid key={b} item xs={12} md={4}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <Avatar sx={miniCheck}><VerifiedIcon fontSize="small" /></Avatar>
                    <Typography sx={{ color: "rgba(230,238,247,0.88)" }}>
                      {b}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* PARTNERSHIP MODELS */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>Partnership models</SectionTitle>

        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ ...quietCard, height: "100%" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Referral partner
                </Typography>
                <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                  Refer projects that need removal, recycling, or asset recovery support. Great for
                  integrators that want a trusted closeout partner.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ ...quietCard, height: "100%" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Subcontract partner
                </Typography>
                <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                  Include ReTech in your project scope so decommissioning is built directly into your
                  installation or renovation workflow.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ ...quietCard, height: "100%" }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Asset recovery partner
                </Typography>
                <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                  For eligible equipment, we can help identify resale potential so outgoing gear becomes
                  a value-recovery opportunity instead of just waste.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* REQUIREMENTS & COMMERCIALS */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={quietCard}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  What helps us work well together
                </Typography>
                <Stack spacing={1.25}>
                  <ReqItem text="Clear scope, site access, and project timeline" />
                  <ReqItem text="Basic equipment info or photos when available" />
                  <ReqItem text="Point of contact for scheduling and coordination" />
                  <ReqItem text="Alignment on inventory, recycling, or recovery goals" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={quietCard}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Commercial flexibility
                </Typography>
                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <Avatar sx={miniIcon}><PaymentsIcon fontSize="small" /></Avatar>
                    <Typography sx={{ color: "rgba(230,238,247,0.88)" }}>
                      Engagements can be structured as direct client work, subcontract work, or referral-based partnerships.
                    </Typography>
                  </Stack>

                  <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                    For appropriate projects, we can also discuss value recovery and revenue-sharing on
                    resold equipment.
                  </Typography>

                  <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)" }} />

                  <Typography sx={{ color: "rgba(230,238,247,0.78)" }}>
                    Ask about recurring support for office upgrades, conference room refreshes, and large
                    multi-room technology replacements.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* PARTNER STORIES */}
      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <SectionTitle>Partner use cases</SectionTitle>
        <Grid container spacing={3}>
          {[
            {
              name: "Conference room refresh",
              quote: "An integrator needs outgoing DSPs, cameras, and touch panels removed so their install team can stay focused on deployment."
            },
            {
              name: "Office relocation",
              quote: "A workplace team needs racks, displays, and meeting room equipment inventoried and cleared during a move."
            },
            {
              name: "Campus upgrade",
              quote: "A school or university needs older AV systems removed, documented, and routed for responsible reuse or recycling."
            },
          ].map((t) => (
            <Grid key={t.name} item xs={12} md={4}>
              <Card elevation={0} sx={quietCard}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography sx={{ color: "rgba(230,238,247,0.88)" }}>
                    "{t.quote}"
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
                  <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                    {t.name}
                  </Typography>
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
          {
            q: "What kinds of partners do you work with?",
            a: "We work with AV integrators, installers, facilities teams, workplace and IT groups, schools, venues, and organizations managing technology replacements or decommissions."
          },
          {
            q: "What equipment can you help remove?",
            a: "Common project categories include control processors, DSPs, amplifiers, cameras, touch panels, projectors, displays, wireless systems, and related AV rack equipment."
          },
          {
            q: "Do you provide inventory reporting?",
            a: "Yes. We can document equipment details such as manufacturer, model, serial number, condition, and general asset notes."
          },
          {
            q: "Can you help with resale or recovery value?",
            a: "Yes. When equipment is suitable, we can evaluate options for reuse or resale rather than sending everything directly to scrap."
          },
          {
            q: "Do you handle recycling too?",
            a: "Yes. Equipment that cannot be reused or recovered can be routed through responsible electronics recycling channels."
          },
        ].map((f) => (
          <Accordion key={f.q} sx={accordionStyle}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "rgba(255,255,255,0.7)" }} />}
            >
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
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Partner with ReTech
            </Typography>

            <Typography sx={{ color: "rgba(230,238,247,0.78)", mb: 3 }}>
              Tell us about your organization, the types of projects you handle, and how you'd like to work together.
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
                  label="What kind of projects, equipment, or partnership are you interested in?"
                  fullWidth
                  multiline
                  minRows={3}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>

            <CardActions sx={{ mt: 2, p: 0 }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#e6eef7",
                  color: "#0b0f14",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#cfe0f4" }
                }}
              >
                Submit inquiry
              </Button>

              <Typography sx={{ color: "rgba(230,238,247,0.78)", ml: 2 }}>
                Prefer email?{" "}
                <Link component={RouterLink} to="/contact" color="rgba(230,238,247,0.9)">
                  Contact us
                </Link>
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
              © {new Date().getFullYear()} ReTech. Partners.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
            >
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
    <Typography
      variant="h5"
      sx={{ fontWeight: 800, mb: 2.5, letterSpacing: "-0.01em" }}
    >
      {children}
    </Typography>
  );
}

function ReqItem({ text }) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="flex-start">
      <Avatar sx={miniCheck}>
        <VerifiedIcon fontSize="small" />
      </Avatar>
      <Typography sx={{ color: "rgba(230,238,247,0.9)" }}>{text}</Typography>
    </Stack>
  );
}
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

function SectionTitle({ children }) {
  return (
    <Typography
      sx={{
        mt: 4,
        mb: 1.25,
        fontSize: { xs: 22, md: 26 },
        fontWeight: 800,
        color: brand.navy,
        fontFamily: '"Semplicita Pro", sans-serif',
      }}
    >
      {children}
    </Typography>
  );
}

function BodyText({ children }) {
  return (
    <Typography
      sx={{
        fontSize: { xs: 16, md: 17 },
        lineHeight: 1.8,
        color: brand.muted,
        fontFamily: '"Semplicita Pro", sans-serif',
      }}
    >
      {children}
    </Typography>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ bgcolor: brand.white, color: brand.text }}>
      <Box
        sx={{
          background: `radial-gradient(circle at top right, ${alpha(
            brand.green,
            0.12
          )} 0%, transparent 24%), radial-gradient(circle at left center, ${alpha(
            brand.navy,
            0.12
          )} 0%, transparent 30%)`,
          borderBottom: `1px solid ${brand.border}`,
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 } }}>
          <Chip
            label="Privacy Policy"
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
              fontSize: { xs: 42, md: 64 },
              lineHeight: 1.03,
              letterSpacing: "-0.02em",
            }}
          >
            Privacy Policy
          </Typography>

          <Typography
            sx={{
              mt: 2.5,
              fontSize: { xs: 17, md: 20 },
              lineHeight: 1.75,
              color: brand.muted,
              fontFamily: '"Semplicita Pro", sans-serif',
            }}
          >
            This Privacy Policy explains how ReTech EcoSystems LLC collects,
            uses, and protects information when you use our website, mobile app,
            and related services.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 6,
            border: `1px solid ${brand.border}`,
            boxShadow: "0 24px 60px rgba(30, 58, 95, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={1}>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: brand.text,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Effective Date: May 19, 2026
              </Typography>
              <Typography
                sx={{
                  color: brand.muted,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Company: ReTech EcoSystems LLC
              </Typography>
              <Typography
                sx={{
                  color: brand.muted,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Contact: support@retechnyc.com
              </Typography>
            </Stack>

            <Divider sx={{ my: 4 }} />

            <SectionTitle>1. Information We Collect</SectionTitle>
            <BodyText>
              We may collect information you provide directly, including your
              name, email address, business information, account details, listing
              information, equipment details, uploaded photos, serial numbers,
              MAC addresses, pickup details, and messages sent through our
              services.
            </BodyText>

            <SectionTitle>2. Information Collected Automatically</SectionTitle>
            <BodyText>
              When you use our website or app, we may collect technical
              information such as device type, browser type, IP address, usage
              activity, pages viewed, app interactions, and diagnostic data. This
              helps us improve performance, security, and reliability.
            </BodyText>

            <SectionTitle>3. How We Use Information</SectionTitle>
            <BodyText>
              We use information to provide and improve our services, create and
              manage listings, support inventory and equipment capture features,
              process payments, respond to support requests, detect fraud,
              maintain security, and communicate with users about their account
              or activity.
            </BodyText>

            <SectionTitle>4. Payments</SectionTitle>
            <BodyText>
              Payment processing may be handled by third-party providers such as
              Stripe. ReTech does not store full payment card numbers on its own
              servers. Payment providers may collect and process payment
              information according to their own privacy and security policies.
            </BodyText>

            <SectionTitle>5. Photos, Equipment Data, and Inventory Records</SectionTitle>
            <BodyText>
              Our services may allow users to upload photos and capture equipment
              information such as serial numbers, MAC addresses, model numbers,
              locations, and condition notes. This data is used to support
              inventory, listing, resale, reuse, recycling, and documentation
              workflows.
            </BodyText>

            <SectionTitle>6. How We Share Information</SectionTitle>
            <BodyText>
              We may share information with service providers that help us
              operate our business, including hosting providers, analytics
              services, payment processors, email providers, and support tools.
              We may also share information when required by law, to protect our
              rights, or to prevent fraud or misuse.
            </BodyText>

            <SectionTitle>7. Data Security</SectionTitle>
            <BodyText>
              We use reasonable administrative, technical, and organizational
              safeguards to protect information. However, no method of electronic
              storage or transmission is completely secure, and we cannot
              guarantee absolute security.
            </BodyText>

            <SectionTitle>8. Data Retention</SectionTitle>
            <BodyText>
              We retain information for as long as needed to provide our
              services, comply with legal obligations, resolve disputes, maintain
              records, and enforce agreements. Users may contact us to request
              deletion of certain information where applicable.
            </BodyText>

            <SectionTitle>9. Your Choices</SectionTitle>
            <BodyText>
              You may contact us to request access, correction, or deletion of
              your information. Some information may need to be retained for
              legal, security, business, or operational reasons.
            </BodyText>

            <SectionTitle>10. Children’s Privacy</SectionTitle>
            <BodyText>
              Our services are not intended for children under 13. We do not
              knowingly collect personal information from children under 13. If
              we become aware that we have collected such information, we will
              take reasonable steps to delete it.
            </BodyText>

            <SectionTitle>11. Changes to This Policy</SectionTitle>
            <BodyText>
              We may update this Privacy Policy from time to time. When we make
              changes, we will update the effective date above. Continued use of
              our services after changes means you accept the updated policy.
            </BodyText>

            <SectionTitle>12. Contact Us</SectionTitle>
            <BodyText>
              For questions about this Privacy Policy or your information, please
              contact ReTech EcoSystems LLC at support@retechnyc.com.
            </BodyText>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
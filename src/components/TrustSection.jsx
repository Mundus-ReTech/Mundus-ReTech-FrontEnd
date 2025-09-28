import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Container,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";

export default function TrustSection() {
  const items = [
    {
      title: "Secure Decommissioning",
      icon: <VerifiedUserIcon />,
      desc: "Every device goes through strict decommissioning. Partners follow best practices to ensure data is permanently wiped, hardware tested, and equipment graded for resale.",
    },
    {
      title: "Verified Partners",
      icon: <BusinessIcon />,
      desc: "We work only with trusted refurbishers, schools, and corporate partners. Each partner is vetted to guarantee transparency, reliability, and compliance.",
    },
    {
      title: "Compliance Certificates",
      icon: <DescriptionIcon />,
      desc: "Each batch of devices is issued a compliance certificate. This assures buyers that the equipment is safe, secure, and compliant with industry data-wipe standards.",
    },
  ];

  return (
    <Container sx={{ py: 8 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
      >
        Trust & Compliance
      </Typography>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <Card
              sx={{
                bgcolor: "#121821",
                border: "1px solid #223047",
                borderRadius: 2,
                color: "#e6eef7",
                height: "100%",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: "#2a8cff22",
                      border: "1px solid #2a8cff33",
                      color: "#a9d4ff",
                      width: 48,
                      height: 48,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                </Stack>
                <Typography sx={{ color: "#b6c3d6" }}>{item.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

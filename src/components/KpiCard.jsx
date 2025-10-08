import React from "react";
import { Card, CardContent, Stack, Typography, Avatar } from "@mui/material";

export default function KpiCard({ icon, label, value }) {
  return (
    <Card elevation={0} sx={{
      bgcolor: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 3
    }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: "#2a8cff22", border: "1px solid #2a8cff33", color: "#a9d4ff" }}>
            {icon}
          </Avatar>
          <Stack>
            <Typography sx={{ color: "rgba(230,238,247,0.72)", fontSize: 13 }}>{label}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>{value}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

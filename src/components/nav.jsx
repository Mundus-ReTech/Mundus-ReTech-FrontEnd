import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemText, Button, Box, Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  // Primary site nav (left/center)
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Categories", path: "/categories" },
    { label: "Partners", path: "/partners" },
  ];

  // Auth actions (right side on desktop)
  const authLinks = [
    { label: "Sign Up", path: "/signup", variant: "contained" },
    { label: "Log In", path: "/login", variant: "outlined" },
  ];

  // Active route styles
  const activeSx = {
    "&.active": {
      fontWeight: 700,
      textDecoration: "underline",
      textUnderlineOffset: "6px",
    },
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#0f141c" }}>
        <Toolbar>
          {/* Brand */}
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            style={{ textDecoration: "none" }}
            sx={{
              color: "#e6eef7",
              fontWeight: "bold",
              flexGrow: 1,
              "&.active": { textDecoration: "none" },
            }}
          >
            Retech
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                component={NavLink}
                to={link.path}
                sx={{ color: "#e6eef7", ...activeSx }}
              >
                {link.label}
              </Button>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 1.5, borderColor: "rgba(255,255,255,0.18)" }} />
            {authLinks.map((link) => (
              <Button
                key={link.label}
                component={NavLink}
                to={link.path}
                variant={link.variant}
                sx={
                  link.variant === "contained"
                    ? {
                        bgcolor: "#e6eef7",
                        color: "#0b0f14",
                        fontWeight: 800,
                        px: 2.25,
                        "&:hover": { bgcolor: "#cfe0f4" },
                      }
                    : {
                        color: "#e6eef7",
                        borderColor: "rgba(255,255,255,0.28)",
                        px: 2,
                        "&:hover": { borderColor: "rgba(255,255,255,0.45)" },
                        ...activeSx,
                      }
                }
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Mobile menu button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 260, bgcolor: "#0f141c", height: "100%" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.label}
                component={NavLink}
                to={link.path}
                sx={{ color: "#e6eef7", ...activeSx }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />

          <List>
            {authLinks.map((link) => (
              <ListItemButton
                key={link.label}
                component={NavLink}
                to={link.path}
                sx={{ color: "#e6eef7", ...activeSx }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

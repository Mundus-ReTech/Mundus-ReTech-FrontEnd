import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Categories", path: "/categories" },
    { label: "Partners", path: "/partners" },
    { label: "My Account", path: "/account" },
  ];

  // Common styles for active NavLink
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
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            style={{ textDecoration: "none" }}
            className="brand"
            // brand styles via sx for color
            sx={{
              color: "#e6eef7",
              fontWeight: "bold",
              flexGrow: 1,
              "&.active": { textDecoration: "none" }, // no underline on brand
            }}
          >
            Retech
          </Typography>

          {/* Desktop links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                component={NavLink}
                to={link.path}
                sx={{
                  color: "#e6eef7",
                  ...activeSx,
                }}
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
                sx={{
                  color: "#e6eef7",
                  ...activeSx,
                }}
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

import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Button,
  Box,
  Divider,
  Badge,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

/**
 * ✅ Navbar shows:
 * - If NOT logged in: Sign Up / Log In
 * - If logged in: Dashboard / Profile Settings / Log out
 *
 * Cart:
 * - Uses localStorage key "cart" (array)
 * - Shows cart icon + badge count
 *
 * Auth keys:
 * - Supports legacy "token" + newer "accessToken"
 * - Clears "refreshToken", "user", "userId", and "session" on logout
 * - ✅ ALSO clears the cart on logout (cart is account-associated)
 */
const TOKEN_KEY = "token"; // legacy
const TOKEN_KEY_V2 = "accessToken"; // newer
const REFRESH_KEY = "refreshToken";
const USER_KEY = "user";
const USER_ID_KEY = "userId";
const SESSION_KEY = "session";

// cart key(s)
const CART_KEY = "cart";
// if you ever store other cart-related keys, add them here
const CART_META_KEYS = ["cart:meta", "cart:coupon", "cart:lastViewed"];

export default function Navbar() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  // ✅ reactive auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const computeIsLoggedIn = useCallback(() => {
    return Boolean(localStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY_V2));
  }, []);

  useEffect(() => {
    const updateAuth = () => setIsLoggedIn(computeIsLoggedIn());
    updateAuth();

    window.addEventListener("storage", updateAuth);
    window.addEventListener("auth:updated", updateAuth);

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("auth:updated", updateAuth);
    };
  }, [computeIsLoggedIn]);

  // ✅ cart count
  const [cartCount, setCartCount] = useState(0);

  const computeCartCount = () => {
    try {
      const raw = localStorage.getItem(CART_KEY) || "[]";
      const cart = JSON.parse(raw);
      if (!Array.isArray(cart)) return 0;
      return cart.reduce((sum, it) => sum + (Number(it?.quantity) || 1), 0);
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    const update = () => setCartCount(computeCartCount());
    update();

    window.addEventListener("storage", update);
    window.addEventListener("cart:updated", update);

    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart:updated", update);
    };
  }, []);

  const navLinks = [
    // { label: "Home", path: "/" },
    // { label: "Categories", path: "/categories" },
    // { label: "Partners", path: "/partners" },
  ];

  const authedLinks = [
    // { label: "Dashboard", path: "/dashboard/smb", variant: "outlined" },
    // { label: "Profile Settings", path: "/account", variant: "contained" },
  ];

  const guestLinks = [
    // { label: "Sign Up", path: "/signup", variant: "contained" },
    // { label: "Log In", path: "/login", variant: "outlined" },
  ];

  const activeSx = {
    "&.active": {
      fontWeight: 700,
      textDecoration: "underline",
      textUnderlineOffset: "6px",
    },
  };

  const containedBtnSx = {
    bgcolor: "#e6eef7",
    color: "#0b0f14",
    fontWeight: 800,
    px: 2.25,
    "&:hover": { bgcolor: "#cfe0f4" },
  };

  const outlinedBtnSx = {
    color: "#e6eef7",
    borderColor: "rgba(255,255,255,0.28)",
    px: 2,
    "&:hover": { borderColor: "rgba(255,255,255,0.45)" },
    ...activeSx,
  };

  const clearAuthStorage = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY_V2);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(SESSION_KEY);
  };

  const clearCartStorage = () => {
    localStorage.removeItem(CART_KEY);
    CART_META_KEYS.forEach((k) => localStorage.removeItem(k));

    // update cart badge immediately (same tab)
    window.dispatchEvent(new Event("cart:updated"));
  };

  const handleLogout = () => {
    clearAuthStorage();
    clearCartStorage();

    // update UI immediately
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth:updated"));

    navigate("/login", { replace: true });
  };

  const rightLinks = isLoggedIn ? authedLinks : guestLinks;

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
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
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

            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1.5, borderColor: "rgba(255,255,255,0.18)" }}
            />

            {/* Cart icon */}
            {/* <Tooltip title="Cart">
              <IconButton
                component={NavLink}
                to="/cart"
                sx={{
                  color: "#e6eef7",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 2,
                  "&:hover": { borderColor: "rgba(255,255,255,0.35)" },
                  ...activeSx,
                }}
              >
                <Badge
                  badgeContent={cartCount}
                  color="primary"
                  overlap="circular"
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#e6eef7",
                      color: "#0b0f14",
                      fontWeight: 900,
                    },
                  }}
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip> */}

            {rightLinks.map((link) => (
              <Button
                key={link.label}
                component={NavLink}
                to={link.path}
                variant={link.variant}
                sx={link.variant === "contained" ? containedBtnSx : outlinedBtnSx}
              >
                {link.label}
              </Button>
            ))}

            {isLoggedIn && (
              <Button
                onClick={handleLogout}
                variant="text"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 700,
                  textTransform: "none",
                  ml: 0.5,
                  "&:hover": { color: "#fff" },
                }}
              >
                Log out
              </Button>
            )}
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

            {/* Cart in drawer */}
            <ListItemButton component={NavLink} to="/cart" sx={{ color: "#e6eef7", ...activeSx }}>
              <ListItemText primary={`Cart${cartCount ? ` (${cartCount})` : ""}`} />
            </ListItemButton>
          </List>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.18)" }} />

          <List>
            {rightLinks.map((link) => (
              <ListItemButton
                key={link.label}
                component={NavLink}
                to={link.path}
                sx={{ color: "#e6eef7", ...activeSx }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}

            {isLoggedIn && (
              <ListItemButton onClick={handleLogout} sx={{ color: "#e6eef7" }}>
                <ListItemText primary="Log out" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}

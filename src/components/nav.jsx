import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  Stack,
  Container,
  Link,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#ffffff",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

const TOKEN_KEY = "token";
const TOKEN_KEY_V2 = "accessToken";
const REFRESH_KEY = "refreshToken";
const USER_KEY = "user";
const USER_ID_KEY = "userId";
const SESSION_KEY = "session";

const CART_KEY = "cart";
const CART_META_KEYS = ["cart:meta", "cart:coupon", "cart:lastViewed"];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const computeIsLoggedIn = useCallback(() => {
    return Boolean(
      localStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY_V2)
    );
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
    window.dispatchEvent(new Event("cart:updated"));
  };

  const handleLogout = () => {
    clearAuthStorage();
    clearCartStorage();
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("auth:updated"));
    navigate("/login", { replace: true });
  };

  const isLandingPage = location.pathname === "/";

  const marketingLinks = [
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "Industries", href: "#industries" },
    { label: "Trust", href: "#trust" },
    { label: "Contact", href: "#contact" },
  ];

  const appLinks = [
    { label: "Categories", path: "/categories" },
    { label: "Partners", path: "/partners" },
  ];

  const authedLinks = [
    { label: "Dashboard", path: "/dashboard/smb", variant: "text" },
    { label: "Account", path: "/account", variant: "text" },
  ];

  const guestLinks = [
    // { label: "Log In", path: "/login", variant: "text" },
    // { label: "Sign Up", path: "/signup", variant: "contained" },
  ];

  const rightLinks = isLoggedIn ? authedLinks : guestLinks;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
           bgcolor: alpha(brand.white, 0.94),
          color: brand.text,
          backdropFilter: "blur(10px)",
          borderBottom: `1px solid ${brand.border}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: 76,
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
              }}
            >
  
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: 22, md: 26 },
                    lineHeight: 1,
                    fontWeight: 700,
                    color: brand.navy,
                    fontFamily: '"vvyPreston Display", serif',
                  }}
                >
                  ReTech
                </Typography>
                <Typography
                  sx={{
                    mt: 0.3,
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: brand.muted,
                    fontWeight: 700,
                    fontFamily: '"Semplicita Pro", sans-serif',
                  }}
                >
                  EcoSystems LLC
                </Typography>
              </Box>
            </Box>

            <Stack
              direction="row"
              spacing={3}
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {isLandingPage
                ? marketingLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      underline="none"
                      sx={{
                        color: brand.text,
                        fontWeight: 600,
                        fontSize: 14,
                        fontFamily: '"Semplicita Pro", sans-serif',
                        "&:hover": { color: brand.navy },
                      }}
                    >
                      {link.label}
                    </Link>
                  ))
                : appLinks.map((link) => (
                    <Button
                      key={link.label}
                      component={NavLink}
                      to={link.path}
                      sx={{
                        color: brand.text,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: 14,
                        fontFamily: '"Semplicita Pro", sans-serif',
                        "&.active": { color: brand.navy },
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
            </Stack>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {/* Uncomment if you want cart visible in desktop nav */}
              {/* <Tooltip title="Cart">
                <IconButton
                  component={NavLink}
                  to="/cart"
                  sx={{
                    color: brand.navy,
                    border: `1px solid ${brand.border}`,
                    borderRadius: 2.5,
                    "&:hover": {
                      borderColor: brand.navy,
                      bgcolor: alpha(brand.navy, 0.03),
                    },
                  }}
                >
                  <Badge
                    badgeContent={cartCount}
                    color="primary"
                    overlap="circular"
                    sx={{
                      "& .MuiBadge-badge": {
                        bgcolor: brand.green,
                        color: brand.white,
                        fontWeight: 800,
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
                  sx={
                    link.variant === "contained"
                      ? {
                          bgcolor: brand.navy,
                          color: brand.white,
                          px: 2.5,
                          py: 1.15,
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 700,
                          boxShadow: "none",
                          fontFamily: '"Semplicita Pro", sans-serif',
                          "&:hover": {
                            bgcolor: "#16304F",
                            boxShadow: "none",
                          },
                        }
                      : {
                          color: brand.text,
                          px: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                          fontFamily: '"Semplicita Pro", sans-serif',
                          "&:hover": { color: brand.navy, bgcolor: "transparent" },
                        }
                  }
                >
                  {link.label}
                </Button>
              ))}

              {isLoggedIn && (
                <Button
                  onClick={handleLogout}
                  variant="text"
                  sx={{
                    color: brand.muted,
                    textTransform: "none",
                    fontWeight: 700,
                    fontFamily: '"Semplicita Pro", sans-serif',
                    "&:hover": {
                      color: brand.navy,
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Log out
                </Button>
              )}

              {/* {isLandingPage && (
                <Button
                  href="#contact"
                  variant="contained"
                  sx={{
                    bgcolor: brand.navy,
                    color: brand.white,
                    px: 2.5,
                    py: 1.25,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    fontFamily: '"Semplicita Pro", sans-serif',
                    "&:hover": { bgcolor: "#16304F", boxShadow: "none" },
                  }}
                >
                  Request a Pickup
                </Button>
              )} */}
            </Stack>

            <IconButton
              edge="end"
              onClick={toggleDrawer(true)}
              sx={{
                display: { xs: "flex", md: "none" },
                color: brand.navy,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 300,
            height: "100%",
            bgcolor: brand.white,
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
        >
          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: `1px solid ${brand.border}`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                component="img"
                src="/logo/retech-logo.svg"
                alt="ReTech EcoSystems LLC"
                sx={{ height: 34, width: "auto" }}
              />
              <Typography
                sx={{
                  fontWeight: 700,
                  color: brand.navy,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                ReTech
              </Typography>
            </Box>

            <IconButton onClick={toggleDrawer(false)} sx={{ color: brand.navy }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <List sx={{ px: 1.5, py: 1.5 }}>
            {isLandingPage
              ? marketingLinks.map((link) => (
                  <ListItemButton
                    key={link.label}
                    component="a"
                    href={link.href}
                    sx={{
                      borderRadius: 3,
                      color: brand.text,
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontFamily: '"Semplicita Pro", sans-serif',
                      }}
                    />
                  </ListItemButton>
                ))
              : appLinks.map((link) => (
                  <ListItemButton
                    key={link.label}
                    component={NavLink}
                    to={link.path}
                    sx={{
                      borderRadius: 3,
                      color: brand.text,
                      "&.active": {
                        bgcolor: alpha(brand.navy, 0.06),
                        color: brand.navy,
                      },
                    }}
                  >
                    <ListItemText
                      primary={link.label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontFamily: '"Semplicita Pro", sans-serif',
                      }}
                    />
                  </ListItemButton>
                ))}

            {/* Uncomment if you want cart visible in drawer */}
            {/* <ListItemButton
              component={NavLink}
              to="/cart"
              sx={{
                borderRadius: 3,
                color: brand.text,
                "&.active": {
                  bgcolor: alpha(brand.navy, 0.06),
                  color: brand.navy,
                },
              }}
            >
              <ListItemText
                primary={`Cart${cartCount ? ` (${cartCount})` : ""}`}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              />
            </ListItemButton> */}
          </List>

          <Divider sx={{ borderColor: brand.border }} />

          <List sx={{ px: 1.5, py: 1.5 }}>
            {rightLinks.map((link) => (
              <ListItemButton
                key={link.label}
                component={NavLink}
                to={link.path}
                sx={{
                  borderRadius: 3,
                  color: brand.text,
                  "&.active": {
                    bgcolor: alpha(brand.navy, 0.06),
                    color: brand.navy,
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontFamily: '"Semplicita Pro", sans-serif',
                  }}
                />
              </ListItemButton>
            ))}

            {isLoggedIn && (
              <ListItemButton
                onClick={handleLogout}
                sx={{ borderRadius: 3, color: brand.text }}
              >
                <ListItemText
                  primary="Log out"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontFamily: '"Semplicita Pro", sans-serif',
                  }}
                />
              </ListItemButton>
            )}

            {isLandingPage && (
              <Box sx={{ px: 1, pt: 1.5 }}>
                <Button
                  href="#contact"
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: brand.navy,
                    color: brand.white,
                    py: 1.35,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    fontFamily: '"Semplicita Pro", sans-serif',
                    "&:hover": {
                      bgcolor: "#16304F",
                      boxShadow: "none",
                    },
                  }}
                >
                  Request a Pickup
                </Button>
              </Box>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
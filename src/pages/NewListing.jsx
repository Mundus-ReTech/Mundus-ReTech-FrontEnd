import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  OutlinedInput,
  alpha,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import VerifiedIcon from "@mui/icons-material/Verified";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../lib/http";

const CONDITIONS = ["NEW", "LIKE_NEW", "REFURBISHED", "GOOD", "FAIR", "FOR_PARTS"];

const CATEGORIES = [
  "Laptop",
  "Desktop",
  "Tablet",
  "Phone",
  "Monitor",
  "Server",
  "Networking",
  "AV Controller",
  "Camera",
  "Component",
  "Accessory",
  "Other",
];

const TECH_TYPES = [
  "General IT",
  "AV / Pro Audio",
  "Networking",
  "Education",
  "Healthcare / Medical",
  "Broadcast",
  "Manufacturing / Industrial",
  "Other",
];

const DEVICE_TYPES = [
  "MacBook",
  "ThinkPad",
  "Chromebook",
  "iPad",
  "iPhone",
  "Crestron Controller",
  "AMX Controller",
  "Cisco Switch",
  "Q-SYS Core",
  "Router",
  "AP",
  "Monitor",
  "Server",
  "Other",
];

const brand = {
  white: "#FFFFFF",
  navy: "#1E3A5F",
  green: "#2E7D32",
  grayBg: "#F5F7FA",
  text: "#1A1A1A",
  muted: "#5F6B7A",
  border: "#D9E1EA",
};

export default function NewListingPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });
  const [images, setImages] = useState([]);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      brand: "",
      model: "",
      make: "",
      category: "Other",
      techTypes: [],
      deviceTypes: [],
      condition: "GOOD",
      rescuePrice: "",
      serialnumber: "",
      macaddress: "",
      pickupEnabled: true,
      pickupStreet: "",
      pickupCity: "",
      pickupState: "",
      pickupZip: "",
      active: true,
    },
  });

  useEffect(() => {
    try {
      const draft = localStorage.getItem("retech_new_listing_draft");
      if (draft) {
        reset(JSON.parse(draft));
      }
    } catch (err) {
      console.error("Failed to load draft:", err);
    }
  }, [reset]);

  const pickupEnabled = watch("pickupEnabled");

  const imagePreviews = useMemo(() => {
    return images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  const onSelectImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = [...images, ...files].slice(0, 10);
    setImages(next);
  };

  const removeImageAt = (idx) => {
    const next = images.slice();
    next.splice(idx, 1);
    setImages(next);
  };

  const onSubmit = async (values) => {
    try {
      const userId =
        localStorage.getItem("userId") ||
        (() => {
          try {
            const u = JSON.parse(localStorage.getItem("user") || "{}");
            return u?._id || u?.id || "";
          } catch {
            return "";
          }
        })();

      if (!userId) {
        setToast({
          open: true,
          type: "error",
          msg: "Missing user id. Please log in again.",
        });
        return;
      }

      if (!values.serialnumber?.trim()) {
        setToast({
          open: true,
          type: "error",
          msg: "Serial number is required.",
        });
        return;
      }

      const photoUrls = [];

      const payload = {
        id: userId,
        title: values.title.trim(),
        description: values.description.trim(),
        brand: values.brand?.trim() || undefined,
        model: values.model?.trim() || undefined,
        make: values.make?.trim() || undefined,
        category: values.category || "Other",
        techTypes: Array.isArray(values.techTypes) ? values.techTypes : [],
        deviceTypes: Array.isArray(values.deviceTypes) ? values.deviceTypes : [],
        condition: values.condition,
        rescuePrice: Number(values.rescuePrice || 0),
        active: Boolean(values.active),
        photos: photoUrls,
        serialnumber: values.serialnumber.trim(),
        macaddress: values.macaddress?.trim() || undefined,
        pickup: values.pickupEnabled
          ? {
              address: {
                zip: values.pickupZip?.trim() || "",
                city: values.pickupCity?.trim() || "",
                state: values.pickupState?.trim() || "",
                street: values.pickupStreet?.trim() || "",
              },
            }
          : undefined,
      };

      const response = await api.post(
        "http://localhost:8080/v1/createlisting",
        payload
      );
      const created = response?.data;

      localStorage.removeItem("retech_new_listing_draft");

      setToast({ open: true, type: "success", msg: "Listing created." });

      const createdId = created?._id || created?.id;
      setTimeout(() => {
        if (createdId) {
          navigate(`/listing/${createdId}`);
        } else {
          navigate("/listings");
        }
      }, 600);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create listing.";

      setToast({ open: true, type: "error", msg });
    }
  };

  const saveDraft = (vals) => {
    localStorage.setItem("retech_new_listing_draft", JSON.stringify(vals));
    setToast({ open: true, type: "success", msg: "Draft saved locally." });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: brand.grayBg,
        color: brand.text,
        background: `radial-gradient(circle at top right, ${alpha(
          brand.green,
          0.06
        )} 0%, transparent 20%), radial-gradient(circle at left top, ${alpha(
          brand.navy,
          0.05
        )} 0%, transparent 28%), ${brand.grayBg}`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", lg: "center" }}
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Box>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.75,
                borderRadius: 999,
                bgcolor: alpha(brand.green, 0.08),
                border: `1px solid ${alpha(brand.green, 0.18)}`,
                color: brand.green,
                mb: 2,
              }}
            >
              <SellRoundedIcon sx={{ fontSize: 18 }} />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: '"Semplicita Pro", sans-serif',
                }}
              >
                Seller tools
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.25} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: alpha(brand.navy, 0.08),
                  color: brand.navy,
                  border: `1px solid ${alpha(brand.navy, 0.12)}`,
                }}
              >
                <Inventory2Icon />
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"vvyPreston Display", serif',
                    fontSize: { xs: 34, md: 48 },
                    lineHeight: 1.05,
                    color: brand.navy,
                  }}
                >
                  New Listing
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    color: brand.muted,
                    fontSize: 16,
                    lineHeight: 1.7,
                    fontFamily: '"Semplicita Pro", sans-serif',
                  }}
                >
                  Create a clean, professional listing for resale, recovery, or
                  pickup.
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSubmitting}
            sx={primaryButtonSx}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </Stack>

        <Grid container spacing={2.25}>
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={panelCardSx}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeader
                  title="Basics"
                  subtitle="Add the main listing title and a clear description."
                />

                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={12}>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: "Title is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Title"
                          fullWidth
                          sx={inputSx}
                          error={Boolean(errors.title)}
                          helperText={errors.title?.message}
                          placeholder="e.g., Lenovo ThinkPad T14 Gen 2, i5, 16GB/512GB"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ required: "Description is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Description"
                          fullWidth
                          multiline
                          minRows={5}
                          sx={inputSx}
                          error={Boolean(errors.description)}
                          helperText={errors.description?.message}
                          placeholder="Condition notes, included accessories, testing performed, cosmetic wear, functionality, and any known issues."
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Divider sx={sectionDividerSx} />

                <SectionHeader
                  title="Classification"
                  subtitle="Help buyers understand what the item is and how it should be grouped."
                />

                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Category"
                          select
                          fullWidth
                          sx={inputSx}
                        >
                          {CATEGORIES.map((v) => (
                            <MenuItem key={v} value={v}>
                              {v}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="condition"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Condition"
                          select
                          fullWidth
                          sx={inputSx}
                        >
                          {CONDITIONS.map((v) => (
                            <MenuItem key={v} value={v}>
                              {v.replaceAll("_", " ")}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Brand"
                          fullWidth
                          sx={inputSx}
                          placeholder="e.g., Lenovo, Apple, Crestron"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="model"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Model"
                          fullWidth
                          sx={inputSx}
                          placeholder="e.g., T14 Gen 2, CP4N"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="make"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Make (optional)"
                          fullWidth
                          sx={inputSx}
                          placeholder="Variant / submodel"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="techTypes"
                      control={control}
                      render={({ field }) => (
                        <Select
                          multiple
                          fullWidth
                          value={field.value || []}
                          onChange={field.onChange}
                          input={<OutlinedInput />}
                          displayEmpty
                          sx={multiSelectSx}
                          renderValue={(selected) =>
                            selected?.length ? (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                {selected.map((v) => (
                                  <Chip
                                    key={v}
                                    label={v}
                                    size="small"
                                    sx={chipSx}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography sx={placeholderSx}>
                                Tech types
                              </Typography>
                            )
                          }
                        >
                          {TECH_TYPES.map((v) => (
                            <MenuItem key={v} value={v}>
                              {v}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="deviceTypes"
                      control={control}
                      render={({ field }) => (
                        <Select
                          multiple
                          fullWidth
                          value={field.value || []}
                          onChange={field.onChange}
                          input={<OutlinedInput />}
                          displayEmpty
                          sx={multiSelectSx}
                          renderValue={(selected) =>
                            selected?.length ? (
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                {selected.map((v) => (
                                  <Chip
                                    key={v}
                                    label={v}
                                    size="small"
                                    sx={chipSx}
                                  />
                                ))}
                              </Box>
                            ) : (
                              <Typography sx={placeholderSx}>
                                Device types
                              </Typography>
                            )
                          }
                        >
                          {DEVICE_TYPES.map((v) => (
                            <MenuItem key={v} value={v}>
                              {v}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Controller
                          name="active"
                          control={control}
                          render={({ field }) => (
                            <Switch
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      }
                      label="Active listing"
                      sx={{
                        color: brand.text,
                        mt: 0.5,
                        "& .MuiFormControlLabel-label": {
                          fontFamily: '"Semplicita Pro", sans-serif',
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Divider sx={sectionDividerSx} />

                <SectionHeader
                  title="Identifiers"
                  subtitle="Add the device details needed for tracking and verification."
                />

                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="serialnumber"
                      control={control}
                      rules={{ required: "Serial number is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Serial number"
                          fullWidth
                          sx={inputSx}
                          error={Boolean(errors.serialnumber)}
                          helperText={errors.serialnumber?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="macaddress"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="MAC address"
                          fullWidth
                          sx={inputSx}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ ...panelCardSx, mt: 2.25 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeader
                  title="Photos"
                  subtitle="Upload up to 10 images. Previews are local until your upload endpoint is connected."
                />

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  sx={{ mt: 1 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<AddPhotoAlternateIcon />}
                    component="label"
                    sx={secondaryButtonSx}
                  >
                    Upload images
                    <input
                      hidden
                      accept="image/*"
                      multiple
                      type="file"
                      onChange={onSelectImages}
                    />
                  </Button>

                  <Typography sx={helperTextSx}>
                    Better photos usually lead to better buyer response and
                    faster movement.
                  </Typography>
                </Stack>

                <Grid container spacing={1.5} sx={{ mt: 1 }}>
                  {imagePreviews.map((p, idx) => (
                    <Grid key={p.url} item xs={6} sm={4} md={3}>
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: 3,
                          border: `1px solid ${brand.border}`,
                          bgcolor: brand.grayBg,
                        }}
                      >
                        <Box
                          component="img"
                          src={p.url}
                          alt={`listing-preview-${idx}`}
                          sx={{
                            width: "100%",
                            height: 150,
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                        <Tooltip title="Remove">
                          <IconButton
                            size="small"
                            onClick={() => removeImageAt(idx)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "rgba(0,0,0,0.50)",
                              color: brand.white,
                              "&:hover": {
                                bgcolor: "rgba(0,0,0,0.65)",
                              },
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={panelCardSx}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <SectionHeader
                  title="Price"
                  subtitle="Set the target rescue or resale price."
                />

                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid item xs={12}>
                    <Controller
                      name="rescuePrice"
                      control={control}
                      rules={{ required: "Price is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Rescue price"
                          fullWidth
                          sx={inputSx}
                          error={Boolean(errors.rescuePrice)}
                          helperText={errors.rescuePrice?.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                            inputMode: "decimal",
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ ...panelCardSx, mt: 2.25 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(brand.navy, 0.08),
                      color: brand.navy,
                      border: `1px solid ${alpha(brand.navy, 0.12)}`,
                    }}
                  >
                    <LocationOnIcon />
                  </Avatar>
                  <Box>
                    <Typography sx={sectionTitleSx}>Pickup</Typography>
                    <Typography sx={sectionSubSx}>
                      Control whether this listing is available for pickup.
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 1.5 }}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="pickupEnabled"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    }
                    label="Pickup enabled"
                    sx={{
                      color: brand.text,
                      "& .MuiFormControlLabel-label": {
                        fontFamily: '"Semplicita Pro", sans-serif',
                      },
                    }}
                  />
                </Box>

                {pickupEnabled && (
                  <>
                    <Divider sx={sectionDividerSx} />

                    <Stack spacing={1.5}>
                      <Controller
                        name="pickupStreet"
                        control={control}
                        rules={{ required: "Street is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Street"
                            fullWidth
                            sx={inputSx}
                            error={Boolean(errors.pickupStreet)}
                            helperText={errors.pickupStreet?.message}
                          />
                        )}
                      />

                      <Controller
                        name="pickupCity"
                        control={control}
                        rules={{ required: "City is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="City"
                            fullWidth
                            sx={inputSx}
                            error={Boolean(errors.pickupCity)}
                            helperText={errors.pickupCity?.message}
                          />
                        )}
                      />

                      <Controller
                        name="pickupState"
                        control={control}
                        rules={{ required: "State is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="State"
                            fullWidth
                            sx={inputSx}
                            error={Boolean(errors.pickupState)}
                            helperText={errors.pickupState?.message}
                          />
                        )}
                      />

                      <Controller
                        name="pickupZip"
                        control={control}
                        rules={{ required: "ZIP is required" }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="ZIP"
                            fullWidth
                            sx={inputSx}
                            error={Boolean(errors.pickupZip)}
                            helperText={errors.pickupZip?.message}
                          />
                        )}
                      />
                    </Stack>
                  </>
                )}
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ ...panelCardSx, mt: 2.25 }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(brand.green, 0.10),
                      color: brand.green,
                      border: `1px solid ${alpha(brand.green, 0.16)}`,
                    }}
                  >
                    <VerifiedIcon />
                  </Avatar>
                  <Box>
                    <Typography sx={sectionTitleSx}>Notes</Typography>
                    <Typography sx={sectionSubSx}>
                      Helpful backend behavior to keep in mind.
                    </Typography>
                  </Box>
                </Stack>

                <Typography sx={{ ...helperTextSx, mt: 1.5 }}>
                  Stripe product and price creation now happen automatically on
                  the backend after the listing is created.
                </Typography>
              </CardContent>
            </Card>

            <Stack direction={{ xs: "column", sm: "row", md: "column" }} spacing={1.5} sx={{ mt: 2.25 }}>
              <Button
                variant="outlined"
                startIcon={<SaveRoundedIcon />}
                onClick={handleSubmit(saveDraft)}
                sx={secondaryButtonSx}
              >
                Save draft
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                sx={primaryButtonSx}
              >
                {isSubmitting ? "Publishing..." : "Publish"}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.type} variant="filled" sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <Box>
      <Typography sx={sectionTitleSx}>{title}</Typography>
      {subtitle && <Typography sx={{ ...sectionSubSx, mt: 0.5 }}>{subtitle}</Typography>}
    </Box>
  );
}

const panelCardSx = {
  borderRadius: 5,
  border: `1px solid ${brand.border}`,
  bgcolor: brand.white,
  boxShadow: "0 12px 32px rgba(30, 58, 95, 0.05)",
};

const inputSx = {
  "& .MuiInputBase-root": {
    borderRadius: 3,
    backgroundColor: brand.white,
    fontFamily: '"Semplicita Pro", sans-serif',
  },
  "& .MuiInputLabel-root": {
    color: brand.muted,
    fontFamily: '"Semplicita Pro", sans-serif',
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.border,
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(brand.navy, 0.45),
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.navy,
    borderWidth: "1px",
  },
  "& .MuiFormHelperText-root": {
    fontFamily: '"Semplicita Pro", sans-serif',
  },
};

const multiSelectSx = {
  borderRadius: 3,
  backgroundColor: brand.white,
  fontFamily: '"Semplicita Pro", sans-serif',
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.border,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(brand.navy, 0.45),
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: brand.navy,
  },
};

const primaryButtonSx = {
  bgcolor: brand.navy,
  color: brand.white,
  px: 2.5,
  py: 1.25,
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 700,
  boxShadow: "none",
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    bgcolor: "#16304F",
    boxShadow: "none",
  },
};

const secondaryButtonSx = {
  color: brand.navy,
  borderColor: brand.border,
  px: 2.25,
  py: 1.15,
  borderRadius: 3,
  textTransform: "none",
  fontWeight: 700,
  bgcolor: brand.white,
  fontFamily: '"Semplicita Pro", sans-serif',
  "&:hover": {
    borderColor: brand.navy,
    bgcolor: alpha(brand.navy, 0.03),
  },
};

const sectionDividerSx = {
  my: 3,
  borderColor: brand.border,
};

const sectionTitleSx = {
  fontSize: 22,
  fontWeight: 800,
  color: brand.navy,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const sectionSubSx = {
  fontSize: 14,
  lineHeight: 1.7,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const helperTextSx = {
  fontSize: 14,
  lineHeight: 1.75,
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const placeholderSx = {
  color: brand.muted,
  fontFamily: '"Semplicita Pro", sans-serif',
};

const chipSx = {
  bgcolor: alpha(brand.navy, 0.05),
  color: brand.navy,
  border: `1px solid ${alpha(brand.navy, 0.12)}`,
  fontWeight: 700,
  fontFamily: '"Semplicita Pro", sans-serif',
};
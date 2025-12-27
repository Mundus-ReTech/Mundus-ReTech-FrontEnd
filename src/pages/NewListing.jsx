import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
  Tooltip,
  Avatar,
  Select,
  OutlinedInput,
  Chip,
  formControlClasses,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import VerifiedIcon from "@mui/icons-material/Verified";
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

// example lists — adjust to your app’s taxonomy
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

const quietCard = {
  bgcolor: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 3,
};

export default function NewListingPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ open: false, type: "success", msg: "" });
  const [images, setImages] = useState([]); // File[] for upload preview

  const {
    control,
    handleSubmit,
    watch,
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
      status: "ACTIVE",
    },
  });

  const pickupEnabled = watch("pickupEnabled");

  const imagePreviews = useMemo(
    () => images.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [images]
  );

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
      // ✅ person id (seller) — using what you already store at login
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
        setToast({ open: true, type: "error", msg: "Missing user id. Please log in again." });
        return;
      }

      // 1) Upload images
      // let photoUrls = [];
      // if (images.length) {
      //   const formData = new FormData();
      //   images.forEach((f) => formData.append("files", f));
        // const up = await api.post("http://localhost:8080/v1/createlisting", formData);
        // photoUrls = up.data?.urls || [];
      // }

      // photos required in new model
      // if (!photoUrls.length) {
      //   setToast({ open: true, type: "error", msg: "Please upload at least 1 photo." });
      //   return;
      // }

      // 2) Create listing payload (✅ matches your new schema)
      const payload = {
        id: userId, // required (person id)
        title: values.title,
        description: values.description,
        brand: values.brand || undefined,
        model: values.model || undefined,
        make: values.make || undefined,
        category: values.category || "Other",
        techTypes: Array.isArray(values.techTypes) ? values.techTypes : [],
        deviceTypes: Array.isArray(values.deviceTypes) ? values.deviceTypes : [],
        condition: values.condition,
        rescuePrice: Number(values.rescuePrice || 0),
        status: values.status || "ACTIVE",
        // photos: photoUrls,
        serialnumber: values.serialnumber || undefined,
        macaddress: values.macaddress || undefined,
        pickup: values.pickupEnabled
          ? {
              address: {
                zip: values.pickupZip || "",
                city: values.pickupCity || "",
                state: values.pickupState || "",
                street: values.pickupStreet || "",
              },
            }
          : undefined,
      };

      // 3) POST listing
      const data  = await api.post("http://localhost:8080/v1/createlisting", payload);
      setToast({ open: true, type: "success", msg: "Listing created!" });
      setTimeout(() => navigate(`/listing/${data?._id || data?.id || ""}`), 600);
    } catch (err) {
      console.error(err);
      setToast({ open: true, type: "error", msg: "Failed to create listing." });
    }
  };

  return (
    <Box sx={{ bgcolor: "#0b0f14", color: "#e6eef7", minHeight: "100vh" }}>
      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.06)" }}>
              <Inventory2Icon sx={{ color: "white" }} />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              New Listing
            </Typography>
          </Stack>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: "#e6eef7",
              color: "#0b0f14",
              fontWeight: 800,
              "&:hover": { bgcolor: "#cfe0f4" },
            }}
          >
            {isSubmitting ? "Saving…" : "Publish"}
          </Button>
        </Stack>

        <Grid container spacing={2.5}>
          {/* LEFT */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ ...quietCard, p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "white" }}>
                Basics
              </Typography>

              <Grid container spacing={2}>
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
                        sx={textFieldStyle}
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
                        sx={textFieldStyle}
                        error={Boolean(errors.description)}
                        helperText={errors.description?.message}
                        placeholder="Condition notes, included accessories, testing performed, etc."
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "white" }}>
                Classification
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Category" select fullWidth sx={textFieldStyle}>
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
                      <TextField {...field} label="Condition" select fullWidth sx={textFieldStyle}>
                        {CONDITIONS.map((v) => (
                          <MenuItem key={v} value={v}>
                            {v.replace("_", " ")}
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
                      <TextField {...field} label="Brand" fullWidth sx={textFieldStyle} placeholder="e.g., Lenovo, Apple, Crestron" />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="model"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Model" fullWidth sx={textFieldStyle} placeholder="e.g., T14 Gen 2, CP4N" />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="make"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Make (optional)" fullWidth sx={textFieldStyle} placeholder="Variant / submodel" />
                    )}
                  />
                </Grid>

                {/* techTypes multi-select */}
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
                        input={<OutlinedInput label="Tech types" />}
                        displayEmpty
                        sx={textFieldStyle}
                        renderValue={(selected) =>
                          selected?.length ? (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {selected.map((v) => (
                                <Chip key={v} label={v} size="small" />
                              ))}
                            </Box>
                          ) : (
                            <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>Tech types</Typography>
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

                {/* deviceTypes multi-select */}
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
                        input={<OutlinedInput label="Device types" />}
                        displayEmpty
                        sx={textFieldStyle}
                        renderValue={(selected) =>
                          selected?.length ? (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {selected.map((v) => (
                                <Chip key={v} label={v} size="small" />
                              ))}
                            </Box>
                          ) : (
                            <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>Device types</Typography>
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

                {/* status */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} label="Status" select fullWidth sx={textFieldStyle}>
                        {["ACTIVE", "HIDDEN", "SOLD"].map((v) => (
                          <MenuItem key={v} value={v}>
                            {v}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "white" }}>
                Identifiers (optional)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="serialnumber"
                    control={control}
                    render={({ field }) => <TextField {...field} label="Serial number" fullWidth sx={textFieldStyle} />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="macaddress"
                    control={control}
                    render={({ field }) => <TextField {...field} label="MAC address" fullWidth sx={textFieldStyle} />}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Photos */}
            <Paper elevation={0} sx={{ ...quietCard, mt: 2, p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "white" }}>
                Photos (required)
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                <Button
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon sx={{ color: "white" }} />}
                  component="label"
                  sx={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.9)" }}
                >
                  Upload images
                  <input hidden accept="image/*" multiple type="file" onChange={onSelectImages} />
                </Button>
                <Typography sx={{ color: "rgba(230,238,247,0.72)" }}>
                  Up to 10 images. First image will be the cover.
                </Typography>
              </Stack>

              <Grid container spacing={1.5} sx={{ mt: 1 }}>
                {imagePreviews.map((p, idx) => (
                  <Grid key={p.url} item xs={6} sm={4} md={3}>
                    <Box
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <Box
                        component="img"
                        src={p.url}
                        alt={`img-${idx}`}
                        sx={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
                      />
                      <Tooltip title="Remove">
                        <IconButton
                          size="small"
                          onClick={() => removeImageAt(idx)}
                          sx={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            bgcolor: "rgba(0,0,0,0.45)",
                            color: "white",
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid> 
                  {console.log(watch())}
          {/* RIGHT */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ ...quietCard, p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "white" }}>
                Price
              </Typography>

              <Grid container spacing={2}>
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
                        sx={textFieldStyle}
                        error={Boolean(errors.rescuePrice)}
                        helperText={errors.rescuePrice?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ color: "white" }}>
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
            </Paper>

            <Paper elevation={0} sx={{ ...quietCard, mt: 2, p: { xs: 2, md: 3 } }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <LocationOnIcon sx={{ color: "white" }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "white" }}>
                  Pickup
                </Typography>
              </Stack>

              <Stack sx={{ mt: 1, color: "white" }}>
                <FormControlLabel
                  control={
                    <Controller
                      name="pickupEnabled"
                      control={control}
                      render={({ field }) => <Switch {...field} checked={field.value} />}
                    />
                  }
                  label="Pickup enabled"
                />
              </Stack>

              {pickupEnabled && (
                <>
                  <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.08)" }} />
                  <Stack spacing={1.25}>
                    <Controller
                      name="pickupStreet"
                      control={control}
                      rules={{ required: "Street is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Street"
                          fullWidth
                          sx={textFieldStyle}
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
                          sx={textFieldStyle}
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
                          sx={textFieldStyle}
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
                          sx={textFieldStyle}
                          error={Boolean(errors.pickupZip)}
                          helperText={errors.pickupZip?.message}
                        />
                      )}
                    />
                  </Stack>
                </>
              )}
            </Paper>

            <Paper elevation={0} sx={{ ...quietCard, mt: 2, p: { xs: 2, md: 3 } }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <VerifiedIcon sx={{ color: "white" }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "white" }}>
                  Notes
                </Typography>
              </Stack>
              <Typography sx={{ mt: 1, color: "rgba(230,238,247,0.72)" }}>
                Add any repair/testing info inside the Description field.
              </Typography>
            </Paper>

            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                onClick={handleSubmit((vals) => {
                  localStorage.setItem("retech_new_listing_draft", JSON.stringify(vals));
                  setToast({ open: true, type: "success", msg: "Draft saved locally." });
                })}
                sx={{ borderColor: "rgba(255,255,255,0.28)", color: "rgba(255,255,255,0.9)" }}
              >
                Save draft
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                sx={{
                  bgcolor: "#e6eef7",
                  color: "#0b0f14",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#cfe0f4" },
                }}
              >
                {isSubmitting ? "Publishing…" : "Publish"}
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

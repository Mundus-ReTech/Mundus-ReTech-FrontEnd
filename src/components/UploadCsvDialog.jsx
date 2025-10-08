import React, { useRef, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, LinearProgress
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from "../lib/http";

export default function UploadCsvDialog({ open, onClose, onUploaded }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const onPick = (e) => setFile(e.target.files?.[0] || null);

  const onSubmit = async () => {
    if (!file) return;
    try {
      setBusy(true);
      setMessage("");
      // Example: convert CSV -> JSON server-side
      const formData = new FormData();
      formData.append("file", file);
      // If you support raw CSV parsing server-side, post to an ingestion endpoint
      // Example placeholder endpoint (implement on server):
      // POST /v1/listings/bulk-csv -> { count }
      const res = await api.post("/listings/bulk-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(`Uploaded ${res.data?.count || 0} listings`);
      onUploaded?.();
    } catch (e) {
      setMessage("Upload failed. Make sure CSV headers match your schema.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Bulk Upload via CSV</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.25}>
          <Typography variant="body2">
            Upload a CSV with headers: <code>title,brand,model,category,condition,rescuePrice,zip</code>.
            Server will map rows to <code>/v1/listings/bulk</code> payload.
          </Typography>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={onPick}
            disabled={busy}
            style={{ marginTop: 8 }}
          />
          {busy && <LinearProgress />}
          {message && <Typography variant="body2">{message}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={onSubmit}
          disabled={!file || busy}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import {
  Container, Typography, Box, Button, TextField, Collapse, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Checkbox
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { menuService } from "../services/menuService";

export default function Updatemenu() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Add-item dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImage, setNewImage] = useState("");

  // Confirmation dialog
  const [confDialog, setConfDialog] = useState(false);

  // Pending local price changes: { [id]: newPrice }
  const [priceEdits, setPriceEdits] = useState({});

  // Items marked for delete
  const [toDelete, setToDelete] = useState(new Set());

  useEffect(() => {
    menuService
      .getAll()
      .then(setItems)
      .catch(() => setErrorMsg("Could not load menu."))
      .finally(() => setLoading(false));
  }, []);

  const updatePriceLocally = (id, value) => {
    if (!/^\d*$/.test(value)) return;
    setPriceEdits((prev) => ({ ...prev, [id]: value }));
  };

  const toggleDelete = (id) => {
    setToDelete((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddConfirm = async () => {
    const price = Number(newPrice);
    if (!newName.trim()) return;

    setSaving(true);
    try {
      const created = await menuService.addItem({
        name: newName.trim(),
        price,
        category: newCategory.trim() || "General",
        image: newImage.trim(),
        stock: 0,
        available: price > 0,
      });
      setItems((prev) => [...prev, created]);
      setNewName("");
      setNewPrice("");
      setNewCategory("");
      setNewImage("");
      setOpenDialog(false);
    } catch {
      setErrorMsg("Failed to add item.");
    } finally {
      setSaving(false);
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    setErrorMsg("");
    setConfDialog(false);

    try {
      // Apply price edits
      for (const [id, price] of Object.entries(priceEdits)) {
        const p = Number(price);
        await menuService.updateItem(id, { price: p, available: p > 0 });
      }

      // Delete marked items
      for (const id of toDelete) {
        await menuService.deleteItem(id);
      }

      // Refresh list
      const fresh = await menuService.getAll();
      setItems(fresh);
      setPriceEdits({});
      setToDelete(new Set());
      setIsDeleting(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch {
      setErrorMsg("Some changes failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const displayPrice = (item) =>
    priceEdits[item.id] !== undefined ? priceEdits[item.id] : String(item.price);

  return (
    <>
      <Navbar />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton
            disableRipple
            onClick={() => navigate("/admin")}
            sx={{ mr: 2, border: '1px solid #e5e7eb', borderRadius: '50%', '&:hover': { backgroundColor: '#f3f4f6' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em">Update Menu</Typography>
        </Box>

        {loading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
        {errorMsg && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{errorMsg}</Alert>}

        {!loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {items.map((item) => (
              <Box
                key={item.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                sx={{
                  border: '1px solid',
                  borderColor: toDelete.has(item.id) ? '#fca5a5' : '#e5e7eb',
                  borderRadius: 3,
                  backgroundColor: toDelete.has(item.id) ? '#fef2f2' : '#fff',
                  transition: '0.2s',
                }}
              >
                <Box flexGrow={1} mr={2}>
                  <Typography fontWeight="600" color="text.primary">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{item.category}</Typography>

                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography variant="body2" color="text.secondary" mr={1} fontWeight="500">₹</Typography>
                    <TextField
                      size="small"
                      variant="standard"
                      value={displayPrice(item)}
                      onChange={(e) => updatePriceLocally(item.id, e.target.value)}
                      InputProps={{ disableUnderline: true }}
                      sx={{ backgroundColor: '#f3f4f6', borderRadius: 1, px: 1, width: 80, '& input': { py: 0.5, fontWeight: '500' } }}
                    />
                  </Box>
                </Box>

                {isDeleting && (
                  <Checkbox
                    checked={toDelete.has(item.id)}
                    onChange={() => toggleDelete(item.id)}
                    color="error"
                  />
                )}
              </Box>
            ))}
          </Box>
        )}

        {!loading && (
          <Box display="flex" justifyContent="space-between" mt={4} pt={3} borderTop="1px solid #e5e7eb">
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => setOpenDialog(true)}
                sx={{ borderColor: '#e5e7eb', color: 'text.primary', fontWeight: 600, '&:hover': { borderColor: 'primary.main', backgroundColor: '#f9fafb' } }}
              >
                Add Item
              </Button>
              <Button
                variant="text"
                color={isDeleting ? "inherit" : "error"}
                onClick={() => { setIsDeleting(!isDeleting); setToDelete(new Set()); }}
                sx={{ fontWeight: 600 }}
              >
                {isDeleting ? "Cancel Remove" : "Remove"}
              </Button>
            </Box>

            <Button
              variant="contained"
              disableElevation
              disabled={saving}
              onClick={() => setConfDialog(true)}
              sx={{ backgroundColor: 'primary.main', fontWeight: 600, px: 4, '&:hover': { backgroundColor: '#000', transform: 'translateY(-1px)' } }}
            >
              {saving ? <CircularProgress size={18} color="inherit" /> : "Save"}
            </Button>
          </Box>
        )}

        {/* Confirm Save */}
        <Dialog open={confDialog} onClose={() => setConfDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle fontWeight="800">
            {toDelete.size > 0 ? `Delete ${toDelete.size} item(s) and save?` : "Save these changes?"}
          </DialogTitle>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button onClick={() => setConfDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
            <Button
              variant="contained"
              disableElevation
              color={toDelete.size > 0 ? "error" : "primary"}
              onClick={saveChanges}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Item */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
          <DialogTitle fontWeight="800">Add New Item</DialogTitle>
          <DialogContent>
            <TextField label="Item Name" fullWidth variant="outlined" value={newName} onChange={(e) => setNewName(e.target.value)} sx={{ mt: 1, mb: 3 }} />
            <TextField label="Category" fullWidth variant="outlined" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} sx={{ mb: 3 }} />
            <TextField label="Price (₹)" type="number" fullWidth variant="outlined" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} sx={{ mb: 3 }} />
            <TextField label="Image URL (optional)" fullWidth variant="outlined" value={newImage} onChange={(e) => setNewImage(e.target.value)} placeholder="https://example.com/image.jpg" />
          </DialogContent>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleAddConfirm}
              disabled={!newName.trim() || saving}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              {saving ? <CircularProgress size={18} color="inherit" /> : "Add to Menu"}
            </Button>
          </DialogActions>
        </Dialog>

        <Collapse in={showAlert}>
          <Alert severity="success" sx={{ mt: 4, borderRadius: 2, border: '1px solid #10b981', backgroundColor: '#ecfdf5', color: '#065f46' }}>
            Changes saved successfully
          </Alert>
        </Collapse>
      </Container>
    </>
  );
}

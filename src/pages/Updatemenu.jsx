import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Collapse,
  Alert
} from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import { Checkbox } from "@mui/material";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Updatemenu({ menuItems, setMenuItems }) {

  const navigate = useNavigate();

  const [editableMenu, setEditableMenu] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const [confDialog, setConfDialog] = useState(false);


  const updatePrice = (id, value) => {

    if (!/^\d*$/.test(value)) return;
    const priceNumber = Number(value);

    const updated = editableMenu.map(item =>
      item.id === id
        ? {
          ...item,
          price: priceNumber,
          available: priceNumber > 0
        }
        : item
    );

    setEditableMenu(updated);
  };

  const toggleDelete = (id) => {
    const updated = editableMenu.map(item =>
      item.id === id
        ? { ...item, markedForDelete: !item.markedForDelete }
        : item
    );

    setEditableMenu(updated);
  };


  const handleAddConfirm = () => {

    const priceNumber = Number(newPrice);

    const newItem = {
      id: Date.now(),
      name: newName,
      price: priceNumber,
      available: priceNumber > 0
    };

    setEditableMenu([...editableMenu, newItem]);

    // Reset fields
    setNewName("");
    setNewPrice("");
    setOpenDialog(false);
  };

  const saveChanges = () => {
    const finalMenu = editableMenu.filter(
      item => !item.markedForDelete
    );

    setMenuItems(finalMenu);
    setEditableMenu(finalMenu);

    setIsDeleting(false);
    setShowAlert(true);
  };

  useEffect(() => {
    setEditableMenu(menuItems);
  }, [menuItems]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);


  return (
    <>
      <Navbar />

      <Container maxWidth="sm" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton
            disableRipple
            onClick={() => navigate("/admin")}
            sx={{
              mr: 2,
              border: '1px solid #e5e7eb',
              borderRadius: '50%',
              '&:hover': { backgroundColor: '#f3f4f6' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h4" fontWeight="900" letterSpacing="-0.03em">
            Update Menu
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {editableMenu.map(item => (
            <Box
              key={item.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3,
                backgroundColor: item.markedForDelete ? '#fef2f2' : '#fff',
                borderColor: item.markedForDelete ? '#fca5a5' : '#e5e7eb',
                transition: '0.2s',
              }}
            >
              <Box flexGrow={1} mr={2}>
                <Typography fontWeight="600" color="text.primary">{item.name}</Typography>

                <Box display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" color="text.secondary" mr={1} fontWeight="500">₹</Typography>
                  <TextField
                    size="small"
                    variant="standard"
                    value={item.price}
                    onChange={(e) => updatePrice(item.id, e.target.value)}
                    InputProps={{ disableUnderline: true }}
                    sx={{
                      backgroundColor: '#f3f4f6',
                      borderRadius: 1,
                      px: 1,
                      width: 80,
                      '& input': { py: 0.5, fontWeight: '500' }
                    }}
                  />
                </Box>
              </Box>

              {isDeleting && (
                <Checkbox
                  checked={item.markedForDelete || false}
                  onChange={() => toggleDelete(item.id)}
                  color="error"
                />
              )}
            </Box>
          ))}
        </Box>

        <Box display="flex" justifyContent="space-between" mt={4} pt={3} borderTop="1px solid #e5e7eb">
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => setOpenDialog(true)}
              sx={{
                borderColor: '#e5e7eb',
                color: 'text.primary',
                fontWeight: 600,
                '&:hover': { borderColor: 'primary.main', backgroundColor: '#f9fafb' }
              }}
            >
              Add Item
            </Button>

            <Button
              variant="text"
              color={isDeleting ? "inherit" : "error"}
              onClick={() => setIsDeleting(!isDeleting)}
              sx={{ fontWeight: 600 }}
            >
              {isDeleting ? "Done" : "Remove"}
            </Button>
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={() => setConfDialog(true)}
            sx={{
              backgroundColor: 'primary.main',
              fontWeight: 600,
              px: 4,
              '&:hover': { backgroundColor: '#000', transform: 'translateY(-1px)' }
            }}
          >
            Save
          </Button>

        </Box>

        {/* Keeping Dialogs roughly the same conceptually but could add sx if needed */}
        <Dialog
          open={confDialog}
          onClose={() => setConfDialog(false)}
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle fontWeight="800">
            {isDeleting
              ? "Delete selected items?"
              : "Save these changes?"}
          </DialogTitle>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button onClick={() => setConfDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disableElevation
              color={isDeleting ? "error" : "primary"}
              onClick={() => {
                saveChanges();
                setConfDialog(false);
              }}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
        >
          <DialogTitle fontWeight="800">Add New Item</DialogTitle>
          <DialogContent>
            <TextField
              label="Item Name"
              fullWidth
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              sx={{ mt: 1, mb: 3 }}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </DialogContent>
          <DialogActions sx={{ pb: 2, px: 3 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
            <Button
              variant="contained"
              disableElevation
              onClick={handleAddConfirm}
              disabled={!newName.trim()}
              sx={{ fontWeight: 600, borderRadius: 2 }}
            >
              Add to Menu
            </Button>
          </DialogActions>
        </Dialog>

        <Collapse in={showAlert}>
          <Alert
            severity="success"
            sx={{ mt: 4, borderRadius: 2, border: '1px solid #10b981', backgroundColor: '#ecfdf5', color: '#065f46' }}
          >
            Changes saved successfully
          </Alert>
        </Collapse>
      </Container>
    </>
  );
}

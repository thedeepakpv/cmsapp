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
  
  const [ editableMenu, setEditableMenu ] = useState([]);
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
  },[menuItems]);

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

      <Container maxWidth="sm">
        
      <Box display="flex" alignItems="center" mt={3} mb={2}>
  
       <IconButton onClick={() => navigate("/admin")}>
        <ArrowBackIcon />
       </IconButton>

      <Typography variant="h5" ml={1}>
         Update Menu
      </Typography>

      </Box>


        {editableMenu.map(item => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            p={2}
            border="1px solid #ccc"
            borderRadius="10px"
          >
            <Box>
              <Typography>{item.name}</Typography>

              <TextField
                size="small"
                label="Price"
                value={item.price}
                onChange={(e) => updatePrice(item.id, e.target.value)}
                sx={{ mt: 1 }}
              />
            
            </Box>
            {isDeleting && (
            <Checkbox
              checked={item.markedForDelete || false}
             onChange={() => toggleDelete(item.id)}
            />
            )}

          </Box>

        ))}

        <Box display="flex" justifyContent="space-between" mt={4}>
  
  <Box>
    <Button
  variant="outlined"
  sx={{ mr: 2 }}
  onClick={() => setOpenDialog(true)}
>
  Add
</Button>

    <Button
     variant="outlined"
      color="error"
      onClick={() => setIsDeleting(!isDeleting)}
     >
    {isDeleting ? "Cancel Delete" : "Delete"}
   </Button>

  </Box>

  <Button variant="contained" onClick={() => setConfDialog(true)}>
    Save
  </Button>

</Box>

<Dialog open={confDialog} onClose={() => setConfDialog(false)}>
  
  <DialogTitle>
    {isDeleting 
      ? "Are you sure you want to delete selected items?" 
      : "Save changes?"}
  </DialogTitle>

  <DialogActions>
    <Button onClick={() => setConfDialog(false)}>
      Cancel
    </Button>
    <Button 
     variant="contained" 
     onClick={() =>{
      saveChanges();
      setConfDialog(false);
    }}
    >
     Confirm
    </Button>

  </DialogActions>
</Dialog>

<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Add New Item</DialogTitle>

  <DialogContent>
    <TextField
      label="Item Name"
      fullWidth
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      sx={{ mt: 1, mb: 2 }}
    />

    <TextField
      label="Price"
      type="number"
      fullWidth
      value={newPrice}
      onChange={(e) => setNewPrice(e.target.value)}
    />
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
    <Button 
  variant="contained" 
  onClick={handleAddConfirm}
  disabled={!newName.trim()}
>
  OK
</Button>

  </DialogActions>
</Dialog>



        <Collapse in={showAlert}>
          <Alert
            severity="success"
             sx={{ mt: 2 }}
          >
            Saved
          </Alert>
        </Collapse>

      </Container>
    </>
  );
}

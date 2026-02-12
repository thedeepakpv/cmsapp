import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Collapse,
  Alert
} from "@mui/material";

import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Updatemenu({ menuItems, setMenuItems }) {
  
  const [ editableMenu, setEditableMenu ] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const updatePrice = (id, value) => {
    const updated = editableMenu.map(item =>
      item.id === id
        ? { ...item, price: Number(value) }
        : item
    );

    setEditableMenu(updated);

  };

  const saveChanges = () => {
    setMenuItems(editableMenu);
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
        <Typography variant="h5" mt={3} mb={2}>
          Update Menu
        </Typography>

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

          </Box>

        ))}

        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button variant="contained" onClick={saveChanges}>
            Save
          </Button>
        </Box>

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

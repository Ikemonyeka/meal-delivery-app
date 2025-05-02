import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Type definitions
type MenuItemType = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type Restaurant = {
  id: number;
  res_id: string;
  name: string;
  image: string;
  address: string;
  rating: number;
  reviews: string;
  deliveryFee: number;
  eta: string;
  promo?: string;
  menu: MenuItemType[];
};

type StoredData = {
  id: string;
};

// Default new menu item structure
const defaultNewItem: Omit<MenuItemType, "id"> = {
  name: "",
  description: "",
  price: 0,
  image: "https://i.imgur.com/placeholder.jpeg", // Default placeholder image
  category: "Main Dishes"
};

export default function RestaurantInfo() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItem, setNewItem] = useState<Omit<MenuItemType, "id">>(defaultNewItem);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // Categories derived from menu items
  const categories = restaurant?.menu
    ? Array.from(new Set(restaurant.menu.map(item => item.category)))
    : ["Main Dishes", "Sides", "Desserts", "Drinks"];

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const storedData = localStorage.getItem("res_id");

      if (!storedData) throw new Error("Restaurant ID not found");

      const parsedData: StoredData = JSON.parse(storedData);
      if (!parsedData?.id) throw new Error("Invalid restaurant ID format");

      const response = await fetch(
        `http://localhost:8000/restaurants?res_id=${parsedData.id}`
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      if (data?.length > 0) {
        setRestaurant(data[0]);
      } else {
        throw new Error("Restaurant not found");
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setNewItem(defaultNewItem);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle text input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name) {
      setNewItem(prev => ({
        ...prev,
        [name]: name === "price" ? parseFloat(value) || 0 : value
      }));
    }
  };
  
  // Handle select input changes
  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    if (name) {
      setNewItem(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddMenuItem = async () => {
    if (!restaurant) return;
    
    try {
      // Create a copy of the restaurant to update
      const updatedRestaurant = { ...restaurant };
      
      // Generate a new ID for the menu item
      const newId = `m${updatedRestaurant.menu.length + 1}`;
      
      // Add the new item to the menu
      const itemToAdd = { ...newItem, id: newId };
      updatedRestaurant.menu = [...updatedRestaurant.menu, itemToAdd];
      
      // Send PUT request to update the restaurant data
      const response = await fetch(`http://localhost:8000/restaurants/${restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRestaurant),
      });

      if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
      
      // Update local state
      setRestaurant(updatedRestaurant);
      handleCloseDialog();
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Menu item added successfully!",
        severity: "success"
      });
      
    } catch (err: any) {
      console.error("Error adding menu item:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to add menu item",
        severity: "error"
      });
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!restaurant) return;
    
    try {
      // Create a copy of the restaurant to update
      const updatedRestaurant = { ...restaurant };
      
      // Remove the item from the menu
      updatedRestaurant.menu = updatedRestaurant.menu.filter(item => item.id !== itemId);
      
      // Send PUT request to update the restaurant data
      const response = await fetch(`http://localhost:8000/restaurants/${restaurant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRestaurant),
      });

      if (!response.ok) throw new Error(`Failed to update: ${response.status}`);
      
      // Update local state
      setRestaurant(updatedRestaurant);
      
      // Show success message
      setSnackbar({
        open: true,
        message: "Menu item deleted successfully!",
        severity: "success"
      });
      
    } catch (err: any) {
      console.error("Error deleting menu item:", err);
      setSnackbar({
        open: true,
        message: err.message || "Failed to delete menu item",
        severity: "error"
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 8 }}>
        <Typography variant="h6" color="error">
          Error
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 8 }}>
        <Typography variant="h6">No restaurant data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "lg", margin: "auto", padding: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
          {restaurant.name}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleOpenDialog}
          sx={{ borderRadius: 2 }}
        >
          Add Menu Item
        </Button>
      </Box>

      {/* Menu Grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 4 }}>
        {restaurant.menu.map((item) => (
          <Card
            key={item.id}
            sx={{
              position: "relative",
              height: 300,
              borderRadius: 2,
              boxShadow: 2,
              backgroundImage: `url(${item.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            {/* Delete icon */}
            <IconButton 
              sx={{ 
                position: "absolute", 
                top: 8, 
                right: 8, 
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                },
                zIndex: 2
              }}
              onClick={() => handleDeleteMenuItem(item.id)}
            >
              <DeleteIcon />
            </IconButton>
            
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3))",
                zIndex: 1,
              }}
            />
            <CardContent sx={{ position: "relative", zIndex: 2, color: "#fff" }}>
              <Typography variant="h6" fontWeight="bold">
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                {item.description}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                ${item.price.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Add Menu Item Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Menu Item</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              name="name"
              label="Item Name"
              fullWidth
              value={newItem.name}
              onChange={handleInputChange}
              required
            />
            
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={newItem.description}
              onChange={handleInputChange}
              required
            />
            
            <TextField
              name="price"
              label="Price"
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              fullWidth
              value={newItem.price}
              onChange={handleInputChange}
              required
            />
            
            <TextField
              name="image"
              label="Image URL"
              fullWidth
              value={newItem.image}
              onChange={handleInputChange}
              helperText="Enter a valid image URL"
            />
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={newItem.category}
                label="Category"
                onChange={handleSelectChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddMenuItem} 
            variant="contained" 
            color="primary"
            disabled={!newItem.name || !newItem.description || newItem.price <= 0}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
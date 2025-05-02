import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";

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

export default function RestaurantInfo() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
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

    fetchRestaurantData();
  }, []);

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
      <Typography variant="h3" sx={{ fontWeight: "bold", marginBottom: 4 }}>
        {restaurant.name}
      </Typography>

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
    </Box>
  );
}

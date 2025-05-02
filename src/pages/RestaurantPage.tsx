import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryFee: number;
  eta: string;
  address?: string;
  menu: MenuItem[];
}

export default function RestaurantPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    // Convert id to a number and fetch data from the server (from db.json)
    const restaurantId = Number(id);

    fetch(`http://localhost:8000/restaurants?id=${restaurantId}`)
    .then((res) => res.json())
    .then((data: Restaurant[]) => {
      if (data.length > 0) {
        setRestaurant(data[0]); // Assuming the query returns an array of results
        setLoading(false);
      } else {
        setRestaurant(null);
        setLoading(false);
      }
    })
    .catch((err) => {
      console.error("Error fetching restaurant:", err);
      setRestaurant(null);
      setLoading(false);
    });
  
  }, [id]);

  if (loading) return <div className="p-4"><CircularProgress /></div>;
  if (!restaurant) return <div className="p-4">Restaurant not found</div>;

  const rawCategories = {
    "Main Dishes": restaurant.menu.filter((item) =>
      item.category?.toLowerCase().includes("main")
    ),
    Sides: restaurant.menu.filter((item) =>
      item.category?.toLowerCase().includes("side")
    ),
    Drinks: restaurant.menu.filter((item) =>
      item.category?.toLowerCase().includes("drink")
    ),
    Desserts: restaurant.menu.filter((item) =>
      item.category?.toLowerCase().includes("dessert")
    )
  };
  
  const categories = Object.keys(rawCategories).filter(
    (key) => rawCategories[key as keyof typeof rawCategories].length > 0
  );
  
  const categorizedMenu = rawCategories as Record<string, MenuItem[]>;
  

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        component="img"
        src={restaurant.image}
        alt={restaurant.name}
        sx={{
          width: "100%",
          height: 280,
          objectFit: "cover",
          borderRadius: 3,
          mb: 3
        }}
      />

      <Typography variant="h4" fontWeight="bold">
        {restaurant.name}
      </Typography>

      <Box display="flex" justifyContent="space-between" color="text.secondary" mt={1} mb={3}>
        <Typography>${restaurant.deliveryFee.toFixed(2)} Delivery Fee</Typography>
        <Typography>{restaurant.eta}</Typography>
      </Box>

      <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
        {categories.map((cat) => (
          <Tab key={cat} label={cat} />
        ))}
      </Tabs>

      <Grid container spacing={3} mt={1}>
        {categories.length > 0 && categorizedMenu[categories[tabIndex]].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="160"
                image={item.image}
                alt={item.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.description}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() =>
                      dispatch(
                        cartActions.addItem({
                          id: item.id,
                          title: item.name,
                          image01: item.image,
                          price: item.price,
                          restaurantName: restaurant.name,
                          restaurantAddress: restaurant.address || "Address currently available"
                        })
                      )
                    }
                  >
                    Add to Cart
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

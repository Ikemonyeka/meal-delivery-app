import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Button
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { restaurants } from "../data/restaurants";
import { useDispatch } from "react-redux";
import { cartActions } from "../store/shopping-cart/cartSlice";

export default function RestaurantPage() {
  const { id } = useParams();
  const restaurant = restaurants.find((r) => r.id.toString() === id);
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);

  if (!restaurant) return <div className="p-4">Restaurant not found</div>;

  // Add Desserts to the category list
  const categories: ("Main Dishes" | "Sides" | "Drinks" | "Desserts")[] = [
    "Main Dishes",
    "Sides",
    "Drinks",
    "Desserts"
  ];

  // Group menu items by category
  const categorizedMenu = {
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
        {categorizedMenu[categories[tabIndex]].map((item) => (
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
                            price: item.price
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

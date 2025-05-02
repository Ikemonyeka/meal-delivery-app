import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import RestaurantCard from "../components/RestaurantCard";

// Define the type directly here or import from a separate types.ts file
interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryFee: number;
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/restaurants")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        return res.json();
      })
      .then((data: Restaurant[]) => {
        console.log(data)
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error loading restaurants");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4"><CircularProgress /></div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="px-4 py-6">
      <Typography variant="h4" gutterBottom>
        Restaurants
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {restaurants.map((res) => (
          <Grid item key={res.id}>
            <RestaurantCard res={res} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Restaurants;

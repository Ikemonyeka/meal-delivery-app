import React from "react";
import { Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { restaurants } from "../data/restaurants";
import RestaurantCard from "../components/RestaurantCard";

const Restaurants = () => {
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

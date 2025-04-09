import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Restaurants from "../pages/Restuarants";
import RestaurantPage from "../pages/RestaurantPage";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/restuarant" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
    </Routes>
  );
};

export default Routers;
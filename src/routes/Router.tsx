import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Restaurants from "../pages/Restuarants";
import RestaurantPage from "../pages/RestaurantPage";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";
import Checkout from "../pages/Checkout";
import ProtectedRoute from "../components/ProtectedRoute";
import Track from "../pages/Track";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/restuarant" element={<Restaurants />} />
      <Route path="/restaurant/:id" element={<RestaurantPage />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/checkout" element={ 
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }
      />
      <Route path="/track" element={<Track />} />
    </Routes>
  );
};

export default Routers;
import React from "react";

import Header from "../components/Header";
import Routes from "../routes/Router"
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const showCart = useSelector((state: RootState) => state.cartUi.cartIsVisible);
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/login" || location.pathname === "/signup";
  
  return (
    <div className="d-flex flex-column vh-100 justify-content-between">
      {!hideHeaderFooter && <Header />}
      {!hideHeaderFooter && <CartDrawer />}
      <div>
        <Routes />
      </div>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

export default Layout;

import React from "react";

import Header from "../components/Header";
import Routes from "../routes/Router"
import Footer from "../components/Footer";

import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Layout = () => {
  const showCart = useSelector((state: RootState) => state.cartUi.cartIsVisible);

  return (
    <div className="d-flex flex-column vh-100 justify-content-between">
      <Header />
      <div>
        <Routes />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;

import React, { useRef, useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Container } from "reactstrap";
import logo from "../assets/images/res-logo.png";
import { useSelector, useDispatch } from "react-redux";
import { cartUiActions } from "../store/shopping-cart/cartUiSlice";
import type { RootState } from "../store/store";
import "../styles/header.css";
import { Button } from "@mui/material";
import { logoutUser } from "../services/authService";
import { useSnackbar } from "notistack";
import OrdersModal from "./OrdersModal";

const nav__links = [
  { display: "Home", path: "/home" },
  { display: "Foods", path: "/restuarant" },
  { display: "Orders", path: "/orders" },
  //{ display: "Contact", path: "/contact" },
];

const Header = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const userID = JSON.parse(localStorage.getItem("user") || "{}");
  const res_id = JSON.parse(localStorage.getItem("res_id") || "{}");

  const [isModalOpen, setModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const toggleMenu = () => menuRef.current?.classList.toggle("show__menu");
  const toggleCart = () => dispatch(cartUiActions.toggle());

  useEffect(() => {
    const handleScroll = () => {
      if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        headerRef.current?.classList.add("header__shrink");
      } else {
        headerRef.current?.classList.remove("header__shrink");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/orders?userID=${userID.id}&_sort=createdAt&_order=desc&_limit=10`
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const openOrdersModal = () => {
    toggleMenu();
    fetchOrders();
    setModalOpen(true);
  };

  const handleLogout = () => {
    logoutUser();
    enqueueSnackbar("Logged out successfully", { variant: "info" });
    navigate("/login");
  };

  const handleTrackOrder = (orderId: string) => {
    navigate(`/track/${orderId}`);
  };

  const isResUser = Object.keys(res_id).length !== 0;

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex justify-content-between" style={{ alignItems: "flex-start" }}>
          <div className="logo d-flex align-items-start" onClick={() => navigate("/home")}>
            <img src={logo} alt="logo" />
          </div>

          {!isResUser && (
            <>
              <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                <div className="menu d-flex align-items-center gap-5" onClick={(e) => e.stopPropagation()}>
                  <div className="header__closeButton">
                    <span onClick={toggleMenu}>
                      <i className="ri-close-fill"></i>
                    </span>
                  </div>
                  {nav__links.map((item, index) =>
                    item.display === "Orders" ? (
                      <NavLink
                        to="#"
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleMenu();
                          openOrdersModal();
                        }}
                        className={({ isActive }) => (isActive ? "active__menu" : "")}
                      >
                        {item.display}
                      </NavLink>
                    ) : (
                      <NavLink
                        to={item.path}
                        key={index}
                        className={({ isActive }) => (isActive ? "active__menu" : "")}
                        onClick={toggleMenu}
                      >
                        {item.display}
                      </NavLink>
                    )
                  )}
                </div>
              </div>

              <div className="nav__right d-flex align-items-center gap-4">
                <span className="cart__icon" onClick={toggleCart}>
                  <i className="ri-shopping-basket-line"></i>
                  <span className="cart__badge">{totalQuantity}</span>
                </span>

                <span className="mobile__menu" onClick={toggleMenu}>
                  <i className="ri-menu-line"></i>
                </span>

                <Button variant="outlined" color="error" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          )}

          {isResUser && (
            <div className="nav__right d-flex align-items-center gap-4">
              <Button variant="outlined" sx={{mt: 4}} color="error" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </Container>

      <OrdersModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        orders={orders}
        onTrack={handleTrackOrder}
      />
    </header>
  );
};

export default Header;

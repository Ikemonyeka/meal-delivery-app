import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import logo from "../assets/images/res-logo.png";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartUiActions } from "../store/shopping-cart/cartUiSlice";
import type { RootState } from "../store/store"; // adjust the path if needed
import "../styles/header.css";
import { Button } from "@mui/material";
import { logoutUser } from "../services/authService";
import { useSnackbar } from "notistack";

const nav__links = [
    {
        display: "Home",
        path: "/home",
    },
    {
        display: "Foods",
        path: "/restuarant",
    },
    {
        display: "Cart",
        path: "/cart",
    },
    {
        display: "Contact",
        path: "/contact",
    },
    ];

    const Header = () => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
    console.log(totalQuantity);
    const dispatch = useDispatch();

    const toggleMenu = () => menuRef.current?.classList.toggle("show__menu");
    let navigate = useNavigate();

    const toggleCart = () => {
        dispatch(cartUiActions.toggle());
    };    

    useEffect(() => {
        const handleScroll = () => {
        if (
            document.body.scrollTop > 80 ||
            document.documentElement.scrollTop > 80
        ) {
            headerRef.current?.classList.add("header__shrink");
        } else {
            headerRef.current?.classList.remove("header__shrink");
        }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    const { enqueueSnackbar } = useSnackbar();
    const handleLogout = () => {
        logoutUser();
        enqueueSnackbar("Logged out successfully", { variant: "info" });
        navigate("/login");
    };

    return (
        <header className="header" ref={headerRef}>
        <Container>
            <div className="nav__wrapper d-flex justify-content-between" style={{ alignItems: "flex-start" }}>
            {/* ======= logo ======= */}
            <div className="logo d-flex align-items-start" onClick={() => navigate("/home")}>
                <img
                src={logo}
                alt="logo"
                />
            </div>

            {/* ======= menu ======= */}
            <div className="navigation" ref={menuRef} onClick={toggleMenu}>
                <div
                className="menu d-flex align-items-center gap-5"
                onClick={(event) => event.stopPropagation()}
                >
                <div className="header__closeButton">
                    <span onClick={toggleMenu}>
                    <i className="ri-close-fill"></i>
                    </span>
                </div>
                {nav__links.map((item, index) => (
                    <NavLink
                    to={item.path}
                    key={index}
                    className={(navClass) =>
                        navClass.isActive ? "active__menu" : ""
                    }
                    onClick={toggleMenu}
                    >
                    {item.display}
                    </NavLink>
                ))}
                </div>
            </div>

            {/* ======== nav right icons ========= */}
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
            </div>
        </Container>
        </header>
    );
};

export default Header;

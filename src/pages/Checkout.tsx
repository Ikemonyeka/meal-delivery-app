import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    TextField,
    IconButton,
    Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { cartActions } from "../store/shopping-cart/cartSlice";
import { useState } from "react";
import PaymentModal from "../components/PaymentModal";
import { useNavigate } from "react-router-dom";

    export default function Checkout() {
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);
    const totalAmount = useSelector((state: RootState) => state.cart.totalAmount);
    const restaurantName = JSON.parse(localStorage.getItem("cartRestaurant")!);
    const restaurantAddress = JSON.parse(localStorage.getItem("restaurantAddress")!);
    const dispatch = useDispatch();

    const initialUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [user, setUser] = useState(initialUser);
    const [editingAddress, setEditingAddress] = useState(false);
    const [editingPhone, setEditingPhone] = useState(false);
    const [newAddress, setNewAddress] = useState(user.address || "");
    const [newPhone, setNewPhone] = useState(user.phone || "");
    const [deliveryOption, setDeliveryOption] = useState("standard");
    const [openPayment, setOpenPayment] = useState(false);
    const navigate = useNavigate();
    
    const Total = totalAmount + ((totalAmount/100) * 6) + ((totalAmount/100) * 15.3)

    const handlePlaceOrder = () => {
        setOpenPayment(true); // trigger modal
    };

    const handlePaymentSuccess = () => {
        dispatch(cartActions.clearCart());
        setTimeout(() => navigate("/track"), 5000); // after countdown
    };

    const handleSaveAddress = () => {
        const updatedUser = { ...user, address: newAddress };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditingAddress(false);
    };

    const handleSavePhone = () => {
        const updatedUser = { ...user, phone: newPhone };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditingPhone(false);
    };

    return (
        <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
            Checkout
        </Typography>

        <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
            alignItems="flex-start"
        >
            {/* Left Section */}
            <Box flex={2}>
            {/* Delivery Info */}
            <Typography variant="h6">Delivery details</Typography>
            <Box mb={2}>
                <Typography fontWeight="bold">
                {user.firstName} {user.lastName}
                </Typography>
                <Typography>{user.email}</Typography>

                {/* Editable Phone */}
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                {editingPhone ? (
                    <>
                    <TextField
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        size="small"
                    />
                    <IconButton onClick={handleSavePhone}>
                        <SaveIcon />
                    </IconButton>
                    </>
                ) : (
                    <>
                    <Typography>{user.phone}</Typography>
                    <IconButton onClick={() => setEditingPhone(true)}>
                        <EditIcon />
                    </IconButton>
                    </>
                )}
                </Box>

                {/* Editable Address */}
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                {editingAddress ? (
                    <>
                    <TextField
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        size="small"
                        fullWidth
                    />
                    <IconButton onClick={handleSaveAddress}>
                        <SaveIcon />
                    </IconButton>
                    </>
                ) : (
                    <>
                    <Typography>{user.address}</Typography>
                    <IconButton onClick={() => setEditingAddress(true)}>
                        <EditIcon />
                    </IconButton>
                    </>
                )}
                </Box>
            </Box>

            {/* Cart Items */}
            <Box mt={4}>
                <Typography variant="h6">Your Items</Typography>
                <List>
                {cartItems.map((item: any) => (
                    <ListItem key={item.id}>
                    <ListItemText
                        primary={item.title}
                        secondary={`$${item.price} x ${item.quantity}`}
                    />
                    <Typography>${item.totalPrice.toFixed(2)}</Typography>
                    </ListItem>
                ))}
                </List>
            </Box>
            </Box>

            {/* Right Sidebar */}
            <Box
            flex={1}
            border="1px solid lightgray"
            borderRadius={2}
            p={2}
            bgcolor="#fafafa"
            minWidth={280}
            >
            <Box mb={2}>
                <Typography fontWeight="bold">
                {restaurantName}
                </Typography>
                <Typography variant="body2">
                {restaurantAddress}
                </Typography>
            </Box>

            <Button
                variant="contained"
                fullWidth
                sx={{ bgcolor: "black", color: "white", mb: 2 }}
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
            >
                Place Order
            </Button>

            <PaymentModal open={openPayment} onClose={() => setOpenPayment(false)}
            onSuccess={handlePaymentSuccess}
            />

            <Divider />

            <Box my={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                Promotion
                </Typography>
                <Button size="small">Add promo code</Button>
            </Box>

            <Divider />

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                Order Total
                </Typography>
                <Box display="flex" justifyContent="space-between">
                <Typography>Subtotal</Typography>
                <Typography>${totalAmount.toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                <Typography>Delivery Fee</Typography>
                <Typography>${((totalAmount/100) * 6).toFixed(2)}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                <Typography>Taxes & Fees</Typography>
                <Typography>${((totalAmount/100) * 15.3).toFixed(2)}</Typography>
                </Box>
                <br />
                <Box display="flex" justifyContent="space-between" fontWeight="bold">
                <Typography variant="subtitle1">TOTAL</Typography>
                <Typography>${Total.toFixed(2)}</Typography>
                </Box>
            </Box>
            </Box>
        </Box>
        </Box>
    );
}  
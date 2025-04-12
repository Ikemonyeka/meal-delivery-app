import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Button,
    Slide,
    IconButton
} from '@mui/material';
import { cartActions } from '../store/shopping-cart/cartSlice';
import { RootState } from '../store/store';
import { cartUiActions } from '../store/shopping-cart/cartUiSlice';
import CloseIcon from '@mui/icons-material/Close';

export default function CartDrawer() {
    const cart = useSelector((state: RootState) => state.cart);
    const cartIsVisible = useSelector((state: RootState) => state.cartUi.cartIsVisible);
    const dispatch = useDispatch();

    const handleRemove = (id: string | number) => dispatch(cartActions.deleteItem(id));
    const handleIncrease = (item: CartItem) => dispatch(cartActions.addItem(item));
    const handleDecrease = (id: string | number) => dispatch(cartActions.removeItem(id));
    const handleClose = () => dispatch(cartUiActions.toggle());

    type CartItem = {
        id: string;
        title: string;
        image01: string;
        price: number;
        quantity: number;
        totalPrice: number;
    };

    const totalAmount = typeof cart.totalAmount === 'number' ? cart.totalAmount : 0;

    return (
        <Slide direction="left" in={cartIsVisible} mountOnEnter unmountOnExit>
        <Box
            sx={{
            position: 'fixed',
            top: '80px', // header height
            right: 0,
            width: 350,
            height: 'calc(100% - 80px)',
            bgcolor: '#fff',
            zIndex: 1300,
            boxShadow: 4,
            overflowY: 'auto',
            p: 2
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Your Cart</Typography>
            <IconButton onClick={handleClose}>
                <CloseIcon />
            </IconButton>
            </Box>

            <List>
            {cart.cartItems.map((item: CartItem) => (
                <ListItem key={item.id} alignItems="flex-start">
                <ListItemAvatar>
                    <Avatar src={item.image01} variant="rounded" />
                </ListItemAvatar>
                <ListItemText
                    primary={item.title}
                    secondary={`$${item.price} x ${item.quantity}`}
                />
                <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
                    <Button size="small" onClick={() => handleDecrease(item.id)}>-</Button>
                    <Button size="small" onClick={() => handleIncrease(item)}>+</Button>
                    <Button size="small" color="error" onClick={() => handleRemove(item.id)}>x</Button>
                </Box>
                </ListItem>
            ))}
            </List>

            <Box mt={2}>
            <Typography>
                Subtotal: <strong>${totalAmount.toFixed(2)}</strong>
            </Typography>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleClose}
            >
                Checkout
            </Button>
            </Box>
        </Box>
        </Slide>
    );
}

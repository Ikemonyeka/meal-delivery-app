import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface OrderItem {
  title: string;
}

interface Order {
  id: string;
  restaurantName: string;
  items: OrderItem[];
  deliveryStatus: string;
  createdAt: string;
  date_id: number;
}

interface OrdersModalProps {
  open: boolean;
  onClose: () => void;
  orders: Order[];
  onTrack: (orderId: string) => void;
}

const OrdersModal: React.FC<OrdersModalProps> = ({
  open,
  onClose,
  orders,
}) => {
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose}>
      <Box
  sx={{
    width: 400,
    bgcolor: "background.paper",
    p: 4,
    mx: "auto",
    mt: 5,
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    maxHeight: "80vh",
  }}
>
  <Typography variant="h6" gutterBottom>
    Your Previous Orders
  </Typography>
  <Box sx={{ overflowY: "auto", flexGrow: 1, mb: 2 }}>
    <List>
      {orders.map((order) => {
        const itemsText = order.restaurantName;
        const orderDate = new Date(order.createdAt).toLocaleDateString();

        const handleTrackOrder = () => {
          localStorage.setItem("orderID", `${order.date_id}`);
          onClose();
          navigate(`/track/${order.date_id}`);
        };

        return (
          <ListItem
            key={order.id}
            secondaryAction={
              order.deliveryStatus === "pending" && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleTrackOrder}
                >
                  Track
                </Button>
              )
            }
          >
            <ListItemText
              primary={itemsText}
              secondary={`${order.deliveryStatus} — ${orderDate}`}
            />
          </ListItem>
        );
      })}
    </List>
  </Box>
  <Button fullWidth variant="contained" onClick={onClose}>
    Close
  </Button>
</Box>

    </Modal>
  );
};

export default OrdersModal;

import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Chip,
    Box,
    Stack,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import { Link } from "react-router-dom";

const RestaurantCard = ({ res }: { res: any }) => {
return (
    <Link to={`/restaurant/${res.id}`} style={{ textDecoration: "none" }}>
    <Card
        sx={{
        width: 250,
        height: 300,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "transform 0.2s ease",
        "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 4,
        },
        }}
    >
        <CardMedia
        component="img"
        height="140"
        image={res.image}
        alt={res.name}
        sx={{ objectFit: "cover" }}
        />

        <CardContent
        sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
        }}
        >
        {/* Line 1: Promo or blank space */}
        <Box sx={{ minHeight: 24 }}>
            {res.promo ? (
            <Chip
                label={`🔥 ${res.promo}`}
                color="error"
                size="small"
                sx={{ mb: 1 }}
            />
            ) : (
            <Box sx={{ height: 24 }} />
            )}
        </Box>

        {/* Line 2: Restaurant Name */}
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {res.name}
        </Typography>

        {/* Line 3: Delivery Fee (left) and Rating (right) */}
        <Box
            sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
            }}
        >
            <Stack direction="row" spacing={0.5} alignItems="center">
            <LocalShippingIcon fontSize="small" />
            <Typography variant="body2">
                ${res.deliveryFee.toFixed(2)}
            </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
            <StarIcon fontSize="small" sx={{ color: "#f1c40f" }} />
            <Typography variant="body2" fontWeight="bold">
                {res.rating}
            </Typography>
            </Stack>
        </Box>
        </CardContent>
    </Card>
    </Link>
);
};

export default RestaurantCard;
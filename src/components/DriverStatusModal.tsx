import React, { useEffect, useState } from "react";
import { Dialog, Box, Typography, CircularProgress } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

export default function DriverStatusModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [driverFound, setDriverFound] = useState(false);

    useEffect(() => {
        const timeout1 = setTimeout(() => setDriverFound(true), 4000); // Show "Driver Found" after 4s
        const timeout2 = setTimeout(() => onClose(), 8000); // Close after 8s

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, [onClose]);

    return (
        <Dialog open={open} fullWidth>
            <Box textAlign="center" py={5}>
                <DirectionsCarIcon sx={{ fontSize: 60, color: driverFound ? "green" : "gray" }} />
                <Typography variant="h6" mt={2}>
                    {driverFound ? "Driver Found!" : "Looking for a driver..."}
                </Typography>
                {!driverFound && <CircularProgress sx={{ mt: 2 }} />}
            </Box>
        </Dialog>
    );
}

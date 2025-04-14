import React from "react";
import { Box, Typography } from "@mui/material";

export default function Track() {
    return (
        <Box p={4}>
            <Typography variant="h4">Order Tracking</Typography>
            <Typography mt={2}>Your delivery is on the way 🚴‍♂️</Typography>
        </Box>
    );
}

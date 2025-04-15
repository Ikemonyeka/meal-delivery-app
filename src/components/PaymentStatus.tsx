import React, { useEffect, useState } from "react";
import { Box, Typography, Dialog, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PaymentStatus({
    success,
    onRedirect
}: {
    success: boolean;
    onRedirect: () => void;
}) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(prev => {
                if (prev === 1) {
                    clearInterval(interval);
                    onRedirect();
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Dialog open fullWidth>
            <Box textAlign="center" py={5}>
                {success ? (
                    <>
                        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" mt={2}>Payment Successful!</Typography>
                        <Typography mt={1}>Redirecting to tracking in {countdown}s...</Typography>
                    </>
                ) : (
                    <>
                        <CancelIcon color="error" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" mt={2}>Payment Failed</Typography>
                    </>
                )}
            </Box>
        </Dialog>
    );
}

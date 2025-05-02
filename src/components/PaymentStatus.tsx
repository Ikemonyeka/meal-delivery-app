import React, { useEffect, useState } from "react";
import { Box, Typography, Dialog, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PaymentStatus({
    success,
    onCountdownEnd,
}: {
    success: boolean;
    onCountdownEnd: () => void;
}) {
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 5) {
                    clearInterval(interval);
                    onCountdownEnd(); // Trigger after countdown finishes
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [onCountdownEnd]);

    return (
        <Dialog open fullWidth>
            <Box textAlign="center" py={5}>
                {success ? (
                    <>
                        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" mt={2}>
                            Payment Successful!
                        </Typography>
                        <Typography mt={1}>
                            Redirecting to tracking in {countdown}s...
                        </Typography>
                    </>
                ) : (
                    <>
                        <CancelIcon color="error" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" mt={2}>
                            Payment Failed
                        </Typography>
                    </>
                )}
            </Box>
        </Dialog>
    );
}

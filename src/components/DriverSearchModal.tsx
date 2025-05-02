import React, { useEffect, useState } from "react";
import { Dialog, Box, Typography, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface DriverSearchModalProps {
    onComplete: () => void;
}

export default function DriverSearchModal({ onComplete }: DriverSearchModalProps) {
    const [driverFound, setDriverFound] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDriverFound(true);
            setTimeout(onComplete, 2000); // Wait 2s after driver is found
        }, 10000); // Simulate 10s search

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <Dialog open fullWidth>
            <Box textAlign="center" py={5}>
                {driverFound ? (
                    <>
                        <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
                        <Typography variant="h6" mt={2}>
                            Driver Found!
                        </Typography>
                        <Typography>Preparing your delivery...</Typography>
                    </>
                ) : (
                    <>
                        <CircularProgress />
                        <Typography variant="h6" mt={2}>
                            Looking for available drivers...
                        </Typography>
                    </>
                )}
            </Box>
        </Dialog>
    );
}

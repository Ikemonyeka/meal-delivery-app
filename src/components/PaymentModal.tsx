import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, CircularProgress, Typography, TextField, Box
} from "@mui/material";
import PaymentStatus from "../components/PaymentStatus";

export default function PaymentModal({ open, onClose, onSuccess }: {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [processing, setProcessing] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setShowStatus(true);
            onSuccess(); // clear cart, etc.
        }, 2000); // simulate 2 sec processing
    };

    if (showStatus) {
        return <PaymentStatus success onRedirect={onClose} />;
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Enter Card Details</DialogTitle>
            <DialogContent>
                {processing ? (
                    <Box textAlign="center" py={4}>
                        <CircularProgress />
                        <Typography mt={2}>Processing payment...</Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField label="Card Number" fullWidth />
                        <TextField label="Exp Date MM/YYYY" fullWidth />
                        <TextField label="CVV" fullWidth />
                    </Box>
                )}
            </DialogContent>
            {!processing && (
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handlePay} variant="contained" color="primary">Pay</Button>
                </DialogActions>
            )}
        </Dialog>
    );
}

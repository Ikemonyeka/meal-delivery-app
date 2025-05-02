import React, { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, CircularProgress, Typography, TextField, Box
} from "@mui/material";
import PaymentStatus from "../components/PaymentStatus";
import DriverSearchModal from "../components/DriverSearchModal"; // NEW

export default function PaymentModal({ open, onClose, onSuccess }: {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [processing, setProcessing] = useState(false);
    const [showDriverSearch, setShowDriverSearch] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setShowDriverSearch(true); // Show driver search modal after payment
        }, 3000); // simulate 3 sec processing
    };

    if (showDriverSearch) {
        return (
            <DriverSearchModal
                onComplete={() => {
                    setShowDriverSearch(false);
                    setShowStatus(true); // Now show redirect modal
                }}
            />
        );
    }

    if (showStatus) {
        return (
            <PaymentStatus
                success
                onCountdownEnd={() => {
                    onSuccess();  // Place order and navigate
                    onClose();    // Close modal
                }}
            />
        );
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

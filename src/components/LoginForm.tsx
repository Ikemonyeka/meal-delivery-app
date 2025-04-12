import { useState } from "react";
import { TextField, Button, Box, Typography, Card, CardContent, Link } from "@mui/material";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/res-logo.png";
import { useSnackbar } from "notistack";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = await loginUser(email, password);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            enqueueSnackbar(`Welcome back, ${user.firstName}`, { variant: "success" });
            navigate("/home");
        } else {
            enqueueSnackbar("Invalid credentials", { variant: "error" });
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Card sx={{ maxWidth: 400, p: 3 }}>
            <CardContent>
            <Box textAlign="center" mb={3}>
                <img src={logo} alt="Logo" style={{ width: 80 }} />
                <Typography variant="h5" mt={2}>Login to Your Account</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth margin="normal" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
                <Typography textAlign="center" mt={2}>
                Don’t have an account? <Link href="/signup">Sign up</Link>
                </Typography>
            </Box>
            </CardContent>
        </Card>
        </Box>
    );
}

import { useState } from "react";
import { TextField, Button, Box, Typography, Card, CardContent, Link } from "@mui/material";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/res-logo.png";
import { useSnackbar } from "notistack";

export default function SignupForm() {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "", phone: "", address: ""
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = await registerUser(formData);
        if (newUser) {
            enqueueSnackbar("User Registered!", { variant: "success" });
            navigate("/login");
        } else {
            enqueueSnackbar("Something went wrong", { variant: "error" });
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Card sx={{ maxWidth: 450, p: 3 }}>
            <CardContent>
            <Box textAlign="center" mb={3}>
                <img src={logo} alt="Logo" style={{ width: 80 }} />
                <Typography variant="h5" mt={2}>Create an Account</Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, value]) => (
                <TextField
                    key={key}
                    fullWidth
                    margin="normal"
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    name={key}
                    type={key === "password" ? "password" : "text"}
                    value={value}
                    onChange={handleChange}
                />
                ))}
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
                <Typography textAlign="center" mt={2}>
                Already have an account? <Link href="/login">Log in</Link>
                </Typography>
            </Box>
            </CardContent>
        </Card>
        </Box>
    );
}

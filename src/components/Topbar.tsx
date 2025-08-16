import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    // Switch, Icon,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

type TopbarProps = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const Topbar = ({ darkMode, toggleDarkMode }: TopbarProps) => {
    const navigate = useNavigate();
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("userRole");

    const logout = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("storage"));
        navigate("/login");
    };

    return (
        <AppBar position="fixed" color="inherit">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Left: App title */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* If you want to use your uploaded PNG */}
                    <img
                        src="/cardiogram.png"   // put your PNG inside public/ as logo.png
                        alt="Logo"
                        style={{ width: 30, height: 30 }}
                    />

                    {/* App title */}
                    <Typography variant="h6" component="div">
                        Healthcare Portal
                    </Typography>
                </Box>

                {/* Right: user info + dark mode toggle + logout */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="body2">
                        {email} ({role})
                    </Typography>

                    <IconButton color="inherit" onClick={toggleDarkMode}>
                        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    {/*<Switch checked={darkMode} onChange={toggleDarkMode} />*/}

                    <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;

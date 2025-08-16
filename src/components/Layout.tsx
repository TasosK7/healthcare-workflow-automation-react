import React from "react";
import { Box, Toolbar } from "@mui/material";
import Topbar from "./Topbar";

type LayoutProps = {
    children: React.ReactNode;
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const Layout = ({ children, darkMode, toggleDarkMode }: LayoutProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Topbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Toolbar /> {/* spacer for fixed AppBar height */}
            <Box component="main" sx={{ flexGrow: 1, p: 0, overflow: 'hidden' }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;

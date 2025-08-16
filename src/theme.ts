// src/theme.ts
import { createTheme, type PaletteMode } from "@mui/material";

// Define a helper so mode is properly typed
const getPalette = (mode: PaletteMode) => ({
    mode,
    primary: { main: mode === "light" ? "#1976d2" : "#90caf9" },
    secondary: { main: mode === "light" ? "#2e7d32" : "#a5d6a7" },
    background:
        mode === "light"
            ? { default: "#f9fafb", paper: "#ffffff" }
            : { default: "#121212", paper: "#1e1e1e" },
});

export const lightTheme = createTheme({
    palette: getPalette("light"),
    shape: { borderRadius: 8 },
    typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

export const darkTheme = createTheme({
    palette: getPalette("dark"),
    shape: { borderRadius: 8 },
    typography: { fontFamily: "Roboto, Arial, sans-serif" },
});

import { createRoot } from "react-dom/client";
import "./index.css";
import Root from "./Root";
// import App from './App.tsx'
// import { ThemeProvider, CssBaseline } from "@mui/material";
// import {useState} from "react";
// import { lightTheme, darkTheme } from "./theme";

// createRoot(document.getElementById('root')!).render(
//     <StrictMode>
//         <App />
//     </StrictMode>,
// )
createRoot(document.getElementById("root")!).render(<Root />);

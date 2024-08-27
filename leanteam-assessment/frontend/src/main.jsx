import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";

const value = {
    appendTo: "self",
};

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <BrowserRouter>
        <PrimeReactProvider value={value}>
            <App />
        </PrimeReactProvider>
    </BrowserRouter>
    // {/* </React.StrictMode> */}
);

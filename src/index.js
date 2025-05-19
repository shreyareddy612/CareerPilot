import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import StoreProvider from "./utils/store";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <StoreProvider>
        <App />
    </StoreProvider>
);

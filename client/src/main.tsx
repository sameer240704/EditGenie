import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarStateProvider } from "./context/SidebarContext.tsx";

createRoot(document.getElementById("root")!).render(
  <SidebarStateProvider>
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  </SidebarStateProvider>
);

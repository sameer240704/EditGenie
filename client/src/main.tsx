import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { SidebarStateProvider } from "./context/SidebarContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SidebarStateProvider>
      <StrictMode>
        <App />
        <Toaster className="bg-white" />
      </StrictMode>
    </SidebarStateProvider>
  </AuthProvider>
);

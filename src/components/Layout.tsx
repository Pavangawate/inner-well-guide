
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "./Navigation";
import ProtectedRoute from "./ProtectedRoute";

const Layout = () => {
  return (
    <ProtectedRoute>
      <TooltipProvider>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <Navigation />
            <main className="flex-1 p-4 md:p-6">
              <div className="max-w-5xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </ProtectedRoute>
  );
};

export default Layout;

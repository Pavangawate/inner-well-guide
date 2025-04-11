
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Dashboard from "./pages/Dashboard";
import CheckIn from "./pages/CheckIn";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set viewport meta for mobile devices
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(viewportMeta);
    
    // Prevent bouncing/scrolling on iOS
    document.body.style.overscrollBehavior = 'none';
    
    return () => {
      document.head.removeChild(viewportMeta);
    };
  }, []);

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner 
              position="bottom-center"
              toastOptions={{
                style: {
                  marginBottom: '4rem'
                }
              }}
            />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="assessment" element={<Assessment />} />
                <Route path="results" element={<Results />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="check-in" element={<CheckIn />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;

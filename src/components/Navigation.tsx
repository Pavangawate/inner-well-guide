
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ActivitySquare, 
  BarChart3, 
  CalendarCheck, 
  Home, 
  LogOut,
  Menu,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      title: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Assessment",
      path: "/assessment",
      icon: <ActivitySquare className="h-5 w-5" />,
    },
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Check-In",
      path: "/check-in",
      icon: <CalendarCheck className="h-5 w-5" />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    signOut();
  };

  return (
    <>
      <Sidebar className="bg-mint/30 backdrop-blur-sm border-r border-mint">
        <SidebarHeader className="p-4 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold">MW</span>
          </div>
          <h1 className="text-lg font-semibold">MindWell</h1>
          <SidebarTrigger className="ml-auto md:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild className={isActive(item.path) ? "bg-accent text-accent-foreground" : ""}>
                  <Link to={item.path} className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            
            {user && (
              <>
                <div className="mt-auto">
                  <div className="border-t border-mint/50 my-2 pt-2"></div>
                  <SidebarMenuItem>
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium truncate">{user.email}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  </SidebarMenuItem>
                </div>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  );
};

export default Navigation;

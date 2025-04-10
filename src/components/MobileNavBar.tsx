
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Brain, LineChart, CalendarCheck, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/assessment", label: "Assessment", icon: Brain },
    { path: "/dashboard", label: "Dashboard", icon: LineChart },
    { path: "/check-in", label: "Check-in", icon: CalendarCheck },
    { path: "/profile", label: "Profile", icon: UserCircle },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-50">
      <nav className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-md transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavBar;

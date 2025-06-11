
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Archive,
  Home,
  PieChart,
  Search,
  Settings,
  Upload,
  Users,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  isCollapsed,
}: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation items - Documents supprimé
  const items = [
    {
      icon: Home,
      label: "Tableau de bord",
      href: "/",
    },
    {
      icon: Archive,
      label: "Archives",
      href: "/archives",
    },
    {
      icon: Upload,
      label: "Ajouter un document",
      href: "/upload",
    },
    {
      icon: Search,
      label: "Recherche",
      href: "/search",
    },
    {
      icon: PieChart,
      label: "Statistiques",
      href: "/stats",
    },
    {
      icon: Users,
      label: "Utilisateurs",
      href: "/users",
    },
    {
      icon: Settings,
      label: "Administration",
      href: "/admin",
    },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 md:relative",
        isCollapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sidebar-border bg-sidebar p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/a0142a7c-c258-4bbc-bc33-eb26a36b0e8d.png" 
            alt="Logo République du Mali" 
            className="h-8 w-8 rounded-full" 
          />
          {!isCollapsed && (
            <span className="text-sm font-bold text-sidebar-foreground">
              Archives MEP
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
        </Button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}

import { Link, Outlet, useLocation } from "react-router";
import { Bell, ShoppingCart, Hammer, LayoutDashboard, Menu } from "lucide-react";
import { useERP } from "../../context/ERPContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

export function MainLayout() {
  const location = useLocation();
  const { notificaciones } = useERP();
  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/compras", label: "Compras", icon: ShoppingCart },
    { path: "/produccion", label: "Producción", icon: Hammer },
    { path: "/", label: "Administración", icon: LayoutDashboard },
  ];

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="size-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-blue-600">ERP Sistema</h1>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-2">
                <NavLinks />
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Notificaciones */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-colors">
                    <Bell className="size-5" />
                    {notificacionesNoLeidas > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs"
                      >
                        {notificacionesNoLeidas}
                      </Badge>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  {notificaciones.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No hay notificaciones
                    </div>
                  ) : (
                    notificaciones.slice(0, 5).map((notif) => (
                      <DropdownMenuItem key={notif.id} className="flex-col items-start p-3">
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium text-sm">{notif.tipo}</span>
                          {!notif.leida && (
                            <Badge variant="secondary" className="text-xs">
                              Nueva
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notif.mensaje}</p>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <button className="inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 transition-colors">
                    <Menu className="size-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="flex flex-col gap-2 mt-8">
                    <NavLinks onClick={() => setMobileMenuOpen(false)} />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
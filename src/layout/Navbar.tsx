import { useState } from "react";
import { ChevronDown, Menu, X, Bell, MessageSquare, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/authContext";

const guestLinks = [{ label: "Home", href: "/" }];

const studentLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Courses", href: "/my-courses" },
];

const eLibraryItems = [
  { label: "MyLoft", href: "#" },
  { label: "Library Catalog", href: "#" },
  { label: "MyLoft Guide", href: "#" },
  { label: "Digital Repository", href: "#" },
  { label: "Step by Step Research guide", href: "#" },
  { label: "EIFL Publishing", href: "#" },
  { label: "Scimago Journal", href: "#" },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eLibOpen, setELibOpen] = useState(false);

  const navLinks = isAuthenticated ? studentLinks : guestLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    // ✅ sticky top-0 z-50 — stays fixed on scroll
    <nav className="sticky top-0 z-50 bg-[#c9a227] shadow-md">
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#1a2a5e]">
            <img
              src="/assets/logo.png"
              alt="KCAU Logo"
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[#1a2a5e] font-black text-xl tracking-tight leading-tight">
              KCAU Virtual Campus
            </span>
            <span className="text-[#1a2a5e]/70 text-xs font-medium tracking-widest uppercase">
              KCA University
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="px-4 py-2 rounded-sm font-semibold text-sm text-white bg-[#1a2a5e] hover:bg-[#132047] transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}

          {/* E-Library dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setELibOpen(true)}
            onMouseLeave={() => setELibOpen(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 rounded-sm font-semibold text-sm text-white bg-[#1a2a5e] hover:bg-[#132047] transition-colors duration-200">
              E-Library
              <ChevronDown size={14} className={`transition-transform duration-200 ${eLibOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute top-full right-0 mt-1 w-56 bg-white shadow-xl rounded-sm border-t-2 border-[#c9a227] transition-all duration-200 ${eLibOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
              {eLibraryItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block px-4 py-2.5 text-sm text-[#1a2a5e] hover:bg-[#c9a227]/10 hover:text-[#c9a227] font-medium transition-colors border-b border-gray-100 last:border-none"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth icons */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-[#1a2a5e]/30">
              <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a2a5e]/10 transition-colors text-[#1a2a5e]">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#1a2a5e]/10 transition-colors text-[#1a2a5e]">
                <MessageSquare size={18} />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 ml-1">
                    <div className="w-9 h-9 rounded-full bg-[#1a2a5e] text-white flex items-center justify-center font-black text-sm">
                      {user?.avatar ?? "U"}
                    </div>
                    <ChevronDown size={14} className="text-[#1a2a5e]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="font-bold text-sm text-[#1a2a5e]">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <User size={14} /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 flex items-center gap-2"
                  >
                    <LogOut size={14} /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white bg-[#1a2a5e] p-2 rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1a2a5e] px-6 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block py-2.5 text-white font-semibold border-b border-white/10 hover:text-[#c9a227] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <p className="py-2.5 text-white font-semibold border-b border-white/10">E-Library</p>
          {eLibraryItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="block py-2 pl-4 text-white/70 text-sm hover:text-[#c9a227]"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button onClick={handleLogout} className="block py-2.5 text-red-400 font-semibold w-full text-left">
              Log out
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
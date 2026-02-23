import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const studentLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "My Courses", href: "/my-courses" },
];

const guestLinks: typeof studentLinks = [];

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
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eLibOpen, setELibOpen] = useState(false);

  const navLinks = isAuthenticated ? studentLinks : guestLinks;

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-50 bg-[#c9a227] shadow-md">
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#1a2a5e]">
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
              className={`px-4 py-2 rounded-sm font-semibold text-sm transition-colors duration-200 ${
                isActive(link.href)
                  ? "bg-white text-[#1a2a5e]"           // ✅ active = white bg, navy text
                  : "text-white hover:bg-white/20"       // inactive = white text
              }`}
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
            <button className={`flex items-center gap-1 px-4 py-2 rounded-sm font-semibold text-sm transition-colors duration-200 text-white hover:bg-white/20`}>
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
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#1a2a5e] bg-white/30 p-2 rounded"
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
              className={`block py-2.5 font-semibold border-b border-white/10 transition-colors ${
                isActive(link.href) ? "text-[#c9a227]" : "text-white hover:text-[#c9a227]"
              }`}
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
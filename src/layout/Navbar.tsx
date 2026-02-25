import { useState } from "react";
import { ChevronDown, Menu, X, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useSystem } from "../context/systemContext";

const studentLinks = [
  { label: "Dashboard",  href: "/dashboard"  },
  { label: "My Courses", href: "/my-courses"  },
];

const lecturerLinks = [
  { label: "Dashboard",     href: "/lecturer/dashboard"     },
  { label: "My Courses",    href: "/lecturer/courses"       },
  { label: "Schedule",      href: "/lecturer/schedule"      },
  { label: "Announcements", href: "/lecturer/announcements" },
];

const adminLinks = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Users",     href: "/admin/users"     },
  { label: "Reports",   href: "/admin/reports"   },
  { label: "Settings",  href: "/admin/settings"  },
];

const eLibraryItems = [
  { label: "MyLoft",                      href: "#" },
  { label: "Library Catalog",             href: "#" },
  { label: "MyLoft Guide",                href: "#" },
  { label: "Digital Repository",          href: "#" },
  { label: "Step by Step Research guide", href: "#" },
  { label: "EIFL Publishing",             href: "#" },
  { label: "Scimago Journal",             href: "#" },
];

const Navbar = () => {
  const { isAuthenticated, role } = useAuth();
  const { settings } = useSystem();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eLibOpen,   setELibOpen]   = useState(false);

  const navLinks =
    !isAuthenticated ? [] :
    role === "lecturer" ? lecturerLinks :
    role === "admin"    ? adminLinks    :
    studentLinks;

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  // Use admin-set colors from systemContext, falling back to defaults
  const navBg     = settings.themeAccentColor || "#c9a227";
  const navText   = settings.themeNavColor    || "#1a2a5e";
  const uniName   = settings.universityName   || "KCAU Virtual Campus";
  const tagline   = settings.tagline          || "KCA University";

  return (
    <nav className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: navBg }}>
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* Logo + name */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: navText }}>
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : null}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-tight" style={{ color: navText }}>
              {uniName}
            </span>
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: navText + "b0" }}>
              {tagline}
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href}
              className="px-4 py-2 rounded-sm font-semibold text-sm transition-colors duration-200"
              style={isActive(link.href)
                ? { backgroundColor: "white", color: navText }
                : { color: "white" }
              }
              onMouseEnter={(e) => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={(e) => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin badge */}
          {role === "admin" && (
            <span className="ml-2 flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-white/20 text-white">
              <Shield size={11} /> ADMIN
            </span>
          )}

          {/* E-Library dropdown */}
          <div className="relative" onMouseEnter={() => setELibOpen(true)} onMouseLeave={() => setELibOpen(false)}>
            <button className="flex items-center gap-1 px-4 py-2 rounded-sm font-semibold text-sm text-white hover:bg-white/20 transition-colors">
              E-Library <ChevronDown size={14} className={`transition-transform duration-200 ${eLibOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`absolute top-full right-0 mt-1 w-56 bg-white shadow-xl rounded-sm border-t-2 transition-all duration-200 ${eLibOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
              style={{ borderColor: navBg }}>
              {eLibraryItems.map((item) => (
                <Link key={item.label} to={item.href}
                  className="block px-4 py-2.5 text-sm font-medium transition-colors border-b border-gray-100 last:border-none"
                  style={{ color: navText }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = navBg + "22"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded" style={{ color: navText, backgroundColor: "rgba(255,255,255,0.3)" }}
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 pb-4" style={{ backgroundColor: navText }}>
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href}
              className="block py-2.5 font-semibold border-b border-white/10 transition-colors"
              style={isActive(link.href) ? { color: navBg } : { color: "white" }}
              onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <p className="py-2.5 text-white font-semibold border-b border-white/10">E-Library</p>
          {eLibraryItems.map((item) => (
            <Link key={item.label} to={item.href}
              className="block py-2 pl-4 text-sm text-white/70 hover:text-white"
              onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
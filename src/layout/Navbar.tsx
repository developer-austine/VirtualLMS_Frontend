import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/", hasDropdown: false },
  {
    label: "E-Library",
    href: "#",
    hasDropdown: true,
    children: [
      { label: "Online Resources", href: "/library/online" },
      { label: "Digital Books", href: "/library/books" },
      { label: "Research Papers", href: "/library/research" },
    ],
  },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-[#c9a227] shadow-md relative z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#1a2a5e]">
            <img
              src="/assets/logo.png"
              alt="KCAU Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
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

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                to={link.href}
                className="flex items-center gap-1 px-4 py-2 rounded-sm font-semibold text-sm text-white bg-[#1a2a5e] hover:bg-[#132047] transition-colors duration-200"
                onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {link.label}
                {link.hasDropdown && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openDropdown === link.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </Link>

              {/* Dropdown */}
              {link.hasDropdown && link.children && (
                <div
                  className={`absolute top-full left-0 mt-1 w-48 bg-white shadow-xl rounded-sm border-t-2 border-[#c9a227] transition-all duration-200 ${
                    openDropdown === link.label
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="block px-4 py-2.5 text-sm text-[#1a2a5e] hover:bg-[#c9a227]/10 hover:text-[#c9a227] font-medium transition-colors duration-150 border-b border-gray-100 last:border-none"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white bg-[#1a2a5e] p-2 rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#1a2a5e] px-6 pb-4">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                to={link.href}
                className="block py-2.5 text-white font-semibold border-b border-white/10 hover:text-[#c9a227] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.hasDropdown &&
                link.children?.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="block py-2 pl-4 text-white/70 text-sm hover:text-[#c9a227] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {child.label}
                  </Link>
                ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
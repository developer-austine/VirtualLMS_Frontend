import { Phone, Mail, Bell, MessageSquare, ChevronDown, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-[#1a2a5e] text-white text-sm py-2 px-6 flex items-center justify-between">
      {/* Left — contact info */}
      <div className="flex items-center gap-6">
        <a href="tel:+2540709813800" className="flex items-center gap-2 hover:text-[#c9a227] transition-colors duration-200">
          <Phone size={14} />
          <span>Call us : (+254) 0709813800</span>
        </a>
        <a href="mailto:elearning@skylimit.ac.ke" className="hidden sm:flex items-center gap-2 hover:text-[#c9a227] transition-colors duration-200">
          <Mail size={14} />
          <span>E-mail : elearning@skylimit.ac.ke</span>
        </a>
      </div>

      {/* Right — auth icons or login link */}
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Message icon */}
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white">
            <MessageSquare size={16} />
          </button>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 hover:bg-white/10 rounded-full pl-1 pr-2 py-1 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#c9a227] text-[#1a2a5e] flex items-center justify-center font-black text-sm">
                  {user?.avatar ?? "U"}
                </div>
                <ChevronDown size={13} className="text-white" />
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
      ) : (
        <Link to="/login" className="font-semibold tracking-wide hover:text-[#c9a227] transition-colors duration-200">
          Log in
        </Link>
      )}
    </div>
  );
};

export default TopBar;
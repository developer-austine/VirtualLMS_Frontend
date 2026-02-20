import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="bg-[#1a2a5e] text-white text-sm py-2 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <a
          href="tel:+2540709813800"
          className="flex items-center gap-2 hover:text-[#c9a227] transition-colors duration-200"
        >
          <Phone size={14} />
          <span>Call us : (+254) 0709813800</span>
        </a>
        <a
          href="mailto:elearning@kcau.ac.ke"
          className="flex items-center gap-2 hover:text-[#c9a227] transition-colors duration-200"
        >
          <Mail size={14} />
          <span>E-mail : elearning@kcau.ac.ke</span>
        </a>
      </div>

      {/* React Router Link — no full page reload */}
      <Link
        to="/login"
        className="font-semibold tracking-wide hover:text-[#c9a227] transition-colors duration-200"
      >
        Log in
      </Link>
    </div>
  );
};

export default TopBar;
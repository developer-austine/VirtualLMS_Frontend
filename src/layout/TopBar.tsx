import { Phone, Mail } from "lucide-react";

const TopBar = () => {
  return (
    <div className="top-bar bg-[#1a2a5e] text-white text-sm py-2 px-6 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <a
          href="tel:+2540709813800"
          className="flex items-center gap-2 hover:text-[#c9a227] transition-colors duration-200"
        >
          <Phone size={14} />
          <span>Call us : (+254) 0713827098</span>
        </a>
        <a
          href="mailto:elearning@kcau.ac.ke"
          className="flex items-center gap-2 hover:text-[#c9a227] transition-colors duration-200"
        >
          <Mail size={14} />
          <span>E-mail : elearning@skylimit.ac.ke</span>
        </a>
      </div>

      <a
        href="/login"
        className="font-semibold tracking-wide hover:text-[#c9a227] transition-colors duration-200"
      >
        Log in
      </a>
    </div>
  );
};

export default TopBar;
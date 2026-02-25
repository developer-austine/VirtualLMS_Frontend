import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Settings, Palette, Image, Mail,
  CheckCircle2, RotateCcw, Eye, University,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSystem } from "../../context/systemContext";
import { useBanner } from "@/hooks/useBanner";

// Hue → rich hex for the gradient slider
const hueToHex = (h: number): string => {
  const s = 1, l = 0.5;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const col = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

// Preset color swatches
const PRESETS = [
  { label: "KCAU Gold",    nav: "#1a2a5e", accent: "#c9a227" },
  { label: "Forest",       nav: "#14532d", accent: "#16a34a" },
  { label: "Royal Blue",   nav: "#1e3a8a", accent: "#3b82f6" },
  { label: "Crimson",      nav: "#7f1d1d", accent: "#dc2626" },
  { label: "Purple Reign", nav: "#3b0764", accent: "#9333ea" },
  { label: "Slate",        nav: "#1e293b", accent: "#64748b" },
  { label: "Teal",         nav: "#134e4a", accent: "#14b8a6" },
  { label: "Amber",        nav: "#451a03", accent: "#f59e0b" },
];

const AdminSettings = () => {
  const navigate  = useNavigate();
  const { settings, updateSettings, resetSettings } = useSystem();
  const bgImage = useBanner();
  const bannerRef = useRef<HTMLInputElement>(null);

  // Local draft state
  const [uniName,   setUniName]   = useState(settings.universityName);
  const [tagline,   setTagline]   = useState(settings.tagline);
  const [navColor,  setNavColor]  = useState(settings.themeNavColor);
  const [accent,    setAccent]    = useState(settings.themeAccentColor);
  const [hue,       setHue]       = useState(200);
  const [bannerPrev,setBannerPrev]= useState(settings.bannerImage);
  const [mailHost,  setMailHost]  = useState(settings.mailHost);
  const [mailPort,  setMailPort]  = useState(settings.mailPort);
  const [mailUser,  setMailUser]  = useState(settings.mailUsername);
  const [mailPass,  setMailPass]  = useState(settings.mailPassword);
  const [savedInfo, setSavedInfo] = useState(false);
  const [savedMail, setSavedMail] = useState(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setBannerPrev(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const applyHue = (h: number) => {
    setHue(h);
    setAccent(hueToHex(h));
  };

  const handleUpdateInfo = () => {
    updateSettings({
      universityName:   uniName,
      tagline:          tagline,
      themeNavColor:    navColor,
      themeAccentColor: accent,
      bannerImage:      bannerPrev,
    });
    setSavedInfo(true);
    setTimeout(() => setSavedInfo(false), 2000);
  };

  const handleUpdateMail = () => {
    updateSettings({
      mailHost:     mailHost,
      mailPort:     mailPort,
      mailUsername: mailUser,
      mailPassword: mailPass,
    });
    setSavedMail(true);
    setTimeout(() => setSavedMail(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setUniName("KCAU Virtual Campus");
    setTagline("KCA University");
    setNavColor("#1a2a5e");
    setAccent("#c9a227");
    setHue(200);
    setBannerPrev("");
  };

  const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/40">
      <div className="w-8 h-8 rounded-lg bg-[#1a2a5e] flex items-center justify-center">
        <Icon size={15} className="text-[#c9a227]" />
      </div>
      <h2 className="text-sm font-black text-[#1a2a5e] uppercase tracking-wide">{title}</h2>
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen w-full"
      style={{ backgroundImage:`url(${bgImage})`, backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed" }}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-5">

        {/* ── Page title card ─────────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-6 py-5">
          <button onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-1 text-xs text-[#c9a227] font-semibold hover:underline mb-3">
            <ArrowLeft size={13} /> Back to Dashboard
          </button>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1a2a5e] flex items-center justify-center">
                <Settings size={18} className="text-[#c9a227]" />
              </div>
              <div>
                <h1 className="text-xl font-black text-[#1a2a5e]">System Settings</h1>
                <p className="text-xs text-gray-400">Changes apply globally to all users (students & lecturers)</p>
              </div>
            </div>
            <button onClick={handleReset} className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors">
              <RotateCcw size={12} /> Reset to defaults
            </button>
          </div>
        </div>

        {/* ── UPDATE UNIVERSITY INFO ───────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <SectionHeader icon={University} title="Update University Info" />

          <div className="px-6 py-6 space-y-5">
            {/* University name */}
            <Field label="University / System Name">
              <Input value={uniName} onChange={(e) => setUniName(e.target.value)}
                placeholder="e.g. KCAU Virtual Campus" className="text-sm border-gray-200" />
            </Field>

            {/* Tagline */}
            <Field label="Tagline">
              <Input value={tagline} onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. KCA University" className="text-sm border-gray-200" />
            </Field>

            {/* Banner image */}
            <Field label="Change Banner Image">
              <div
                onClick={() => bannerRef.current?.click()}
                className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-[#c9a227] transition-colors"
              >
                <div className="px-4 py-2.5 bg-gray-100 border-r border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Image size={14} /> Browse...
                </div>
                <span className="px-4 text-sm text-gray-400">
                  {bannerPrev ? "New image selected ✓" : "No file selected."}
                </span>
              </div>
              <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
              {/* Preview */}
              {bannerPrev && (
                <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 relative h-32">
                  <img src={bannerPrev} alt="Banner preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Eye size={12} /> Preview
                    </span>
                  </div>
                </div>
              )}
            </Field>

            {/* Theme color ── hue slider */}
            <Field label="Theme Color">
              {/* Preset swatches */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setNavColor(p.nav); setAccent(p.accent); }}
                    title={p.label}
                    className={`group relative h-9 rounded-lg border-2 transition-all overflow-hidden ${
                      accent === p.accent ? "border-gray-800 scale-105" : "border-transparent hover:scale-105"
                    }`}
                  >
                    <div className="absolute inset-0 left-0 right-1/2" style={{ backgroundColor: p.nav }} />
                    <div className="absolute inset-0 left-1/2" style={{ backgroundColor: p.accent }} />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-bottom-5 transition-all">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Hue slider — like the reference image */}
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 font-semibold">Or pick a custom accent color:</p>
                <div className="relative">
                  <div className="h-7 rounded-full overflow-hidden"
                    style={{ background: "linear-gradient(to right, #ff0000,#ff8000,#ffff00,#00ff00,#00ffff,#0000ff,#8000ff,#ff00ff,#ff0000)" }}>
                    <input
                      type="range" min={0} max={360} value={hue}
                      onChange={(e) => applyHue(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {/* Thumb indicator */}
                  <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none transition-all"
                    style={{ left: `calc(${(hue / 360) * 100}% - 10px)`, backgroundColor: hueToHex(hue) }} />
                </div>

                {/* Generated shade strip */}
                <div className="grid grid-cols-5 gap-1 mt-2">
                  {[0.8, 0.6, 0.5, 0.35, 0.2].map((l, i) => {
                    const hex = hueToHex(hue);
                    return (
                      <div key={i} className="h-7 rounded-lg border border-white/20 shadow-sm"
                        style={{ backgroundColor: hex, opacity: 0.4 + l * 0.6 }} />
                    );
                  })}
                </div>
              </div>
            </Field>

            {/* Manual hex inputs */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Navbar Color (hex)">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg border border-gray-200 flex-shrink-0" style={{ backgroundColor: navColor }} />
                  <Input value={navColor} onChange={(e) => setNavColor(e.target.value)} placeholder="#1a2a5e" className="text-sm border-gray-200 font-mono" />
                </div>
              </Field>
              <Field label="Accent Color (hex)">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg border border-gray-200 flex-shrink-0" style={{ backgroundColor: accent }} />
                  <Input value={accent} onChange={(e) => setAccent(e.target.value)} placeholder="#c9a227" className="text-sm border-gray-200 font-mono" />
                </div>
              </Field>
            </div>

            {/* Preview bar */}
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <div className="px-4 py-2 text-xs font-bold text-white flex items-center justify-between" style={{ backgroundColor: navColor }}>
                <span>KCAU Virtual Campus</span>
                <span style={{ color: accent }}>● Live Preview</span>
              </div>
              <div className="px-4 py-2 text-xs font-semibold flex items-center gap-4" style={{ backgroundColor: accent, color: navColor }}>
                <span>Dashboard</span><span>My Courses</span><span>Schedule</span><span>Announcements</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <Button onClick={handleUpdateInfo}
                className={`flex-1 font-bold text-sm text-white ${savedInfo ? "bg-green-600 hover:bg-green-700" : "bg-[#1a2a5e] hover:bg-[#132047]"}`}>
                {savedInfo ? <><CheckCircle2 size={14} /> Updated & Applied!</> : "Update"}
              </Button>
              <Button variant="outline" onClick={handleReset} className="px-8 border-gray-300 text-gray-600 font-bold">
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* ── UPDATE MAIL SERVER ───────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <SectionHeader icon={Mail} title="Update Mail Server" />

          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mail Host">
                <Input value={mailHost} onChange={(e) => setMailHost(e.target.value)}
                  placeholder="smtp.gmail.com" className="text-sm border-gray-200" />
              </Field>
              <Field label="Mail Port">
                <Input value={mailPort} onChange={(e) => setMailPort(e.target.value)}
                  placeholder="587" className="text-sm border-gray-200" />
              </Field>
              <Field label="Mail Username">
                <Input value={mailUser} onChange={(e) => setMailUser(e.target.value)}
                  placeholder="elearning@kcau.ac.ke" className="text-sm border-gray-200" />
              </Field>
              <Field label="Mail Password">
                <Input type="password" value={mailPass} onChange={(e) => setMailPass(e.target.value)}
                  placeholder="••••••••" className="text-sm border-gray-200" />
              </Field>
            </div>

            <Button onClick={handleUpdateMail}
              className={`w-full font-bold text-sm text-white ${savedMail ? "bg-green-600 hover:bg-green-700" : "bg-[#1a2a5e] hover:bg-[#132047]"}`}>
              {savedMail ? <><CheckCircle2 size={14} /> Mail Server Updated!</> : "Submit"}
            </Button>
          </div>
        </div>

        {/* ── LIVE THEME PREVIEW ───────────────── */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <SectionHeader icon={Palette} title="Current Applied Theme" />
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl shadow-md flex-shrink-0" style={{ backgroundColor: settings.themeNavColor }} />
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase">Navbar Color</p>
                  <p className="text-sm font-black text-[#1a2a5e] font-mono">{settings.themeNavColor}</p>
                </div>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl shadow-md flex-shrink-0" style={{ backgroundColor: settings.themeAccentColor }} />
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase">Accent Color</p>
                  <p className="text-sm font-black text-[#1a2a5e] font-mono">{settings.themeAccentColor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSettings;
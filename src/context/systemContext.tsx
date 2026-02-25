import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface SystemSettings {
  universityName: string;
  tagline: string;
  themeNavColor: string;  
  themeAccentColor: string; 
  bannerImage: string;    
  logoUrl: string;
  mailHost: string;
  mailPort: string;
  mailUsername: string;
  mailPassword: string;
}

const DEFAULTS: SystemSettings = {
  universityName: "SKYLIMIT Virtual Campus",
  tagline: "SKYLIMIT University",
  themeNavColor: "#c9a227",
  themeAccentColor: "#c9a227",
  bannerImage: "",          // empty = use default school-of-business.png
  logoUrl: "/assets/logo.png",
  mailHost: "",
  mailPort: "587",
  mailUsername: "",
  mailPassword: "",
};

const STORAGE_KEY = "skylimit_system_settings";

const load = (): SystemSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

interface SystemContextType {
  settings: SystemSettings;
  updateSettings: (partial: Partial<SystemSettings>) => void;
  resetSettings: () => void;
}

const SystemContext = createContext<SystemContextType | null>(null);

export const SystemProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SystemSettings>(load);

  const updateSettings = (partial: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULTS);
  };

  // Apply theme CSS variables globally whenever settings change
  useEffect(() => {
    document.documentElement.style.setProperty("--color-nav", settings.themeNavColor);
    document.documentElement.style.setProperty("--color-accent", settings.themeAccentColor);
  }, [settings.themeNavColor, settings.themeAccentColor]);

  return (
    <SystemContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error("useSystem must be used within SystemProvider");
  return ctx;
};
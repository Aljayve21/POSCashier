import React, { createContext, useContext, useState } from "react";

type Theme = {
  dark: boolean;
  // Backgrounds
  bg: string;
  bgCard: string;
  bgInput: string;
  bgSubtle: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Border
  border: string;
  borderSubtle: string;
  // Brand
  accent: string;
  accentLight: string;
  accentDark: string;
  // Status
  success: string;
  warning: string;
  danger: string;
  // Nav
  navBg: string;
};

const lightTheme: Theme = {
  dark: false,
  bg: "#F0EDF7",
  bgCard: "#FFFFFF",
  bgInput: "#F7F5FC",
  bgSubtle: "#F3F0FA",
  textPrimary: "#0F0A1E",
  textSecondary: "#3D3558",
  textMuted: "#8A82A0",
  border: "#E2DCF0",
  borderSubtle: "#EDE9F7",
  accent: "#6C00E0",
  accentLight: "#EDE5FF",
  accentDark: "#4B009B",
  success: "#00C48C",
  warning: "#FFB800",
  danger: "#FF4B55",
  navBg: "#FFFFFF",
};

const darkTheme: Theme = {
  dark: true,
  bg: "#0A0814",
  bgCard: "#150E2A",
  bgInput: "#1C1438",
  bgSubtle: "#1A1230",
  textPrimary: "#F0EAFF",
  textSecondary: "#C5B8E8",
  textMuted: "#6B5E8A",
  border: "#2A1F4A",
  borderSubtle: "#1F1640",
  accent: "#9B4DFF",
  accentLight: "#2A1560",
  accentDark: "#7B00FF",
  success: "#00D4A0",
  warning: "#FFCA38",
  danger: "#FF5C65",
  navBg: "#0F0B20",
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark((d) => !d);
  const theme = isDark ? darkTheme : lightTheme;
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

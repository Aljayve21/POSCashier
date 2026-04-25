import api from "@/src/axios";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type BusinessSettings = {
  business_name: string;
  logo_path: string;
  address: string;
  contact_number: string;
};

type BusinessContextValue = {
  settings: BusinessSettings;
  loading: boolean;
  refreshBranding: () => Promise<void>;
};

const defaultSettings: BusinessSettings = {
  business_name: "Riead Store POS",
  logo_path: "",
  address: "",
  contact_number: "",
};

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refreshBranding = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile/business-settings");

      setSettings({
        business_name: response.data.business_name || defaultSettings.business_name,
        logo_path: response.data.logo_path || "",
        address: response.data.address || "",
        contact_number: response.data.contact_number || "",
      });
    } catch (error) {
      console.log("Business branding load error:", error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBranding();
  }, [refreshBranding]);

  return (
    <BusinessContext.Provider value={{ settings, loading, refreshBranding }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);

  if (!context) {
    throw new Error("useBusiness must be used within BusinessProvider");
  }

  return context;
}

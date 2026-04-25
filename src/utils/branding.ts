import type { ImageSourcePropType } from "react-native";

export const DEFAULT_BUSINESS_NAME = "Riead Store POS";

export function getBusinessDisplayName(name?: string | null) {
  return name?.trim() || DEFAULT_BUSINESS_NAME;
}

export function getBrandImageSource(logoPath?: string | null): ImageSourcePropType {
  if (logoPath?.trim()) {
    return { uri: logoPath };
  }

  return require("../../assets/images/icon.png");
}

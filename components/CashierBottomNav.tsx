import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

type NavItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { icon: "home", label: "Home", route: "/dashboard/cashier-dashboard" },
  { icon: "cart", label: "New Sale", route: "/sales/new-sale" },
  { icon: "wallet", label: "Payments", route: "/payments/payment" },
  { icon: "receipt", label: "History", route: "/transactions/transactions" },
  { icon: "person", label: "Profile", route: "/profile/profile" },
];

export function CashierBottomNav({ activeRoute }: { activeRoute: string }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const maxWidth = isTablet ? 760 : undefined;

  return (
    <View
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: Math.max(insets.bottom + 8, 20),
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          maxWidth,
          backgroundColor: theme.navBg,
          borderRadius: 28,
          paddingVertical: 14,
          paddingHorizontal: isTablet ? 18 : 10,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: theme.dark ? 0.5 : 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 4 },
          elevation: 10,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        {navItems.map((nav) => {
          const active = nav.route === activeRoute;

          return (
            <TouchableOpacity
              key={nav.label}
              style={{ alignItems: "center", paddingHorizontal: isTablet ? 14 : 8 }}
              onPress={() => router.push(nav.route as any)}
            >
              <Ionicons
                name={nav.icon}
                size={isTablet ? 22 : 18}
                color={active ? theme.accent : theme.textMuted}
              />
              <Text
                style={{
                  marginTop: 4,
                  fontSize: isTablet ? 12 : 11,
                  color: active ? theme.accent : theme.textMuted,
                  fontWeight: active ? "700" : "500",
                }}
              >
                {nav.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

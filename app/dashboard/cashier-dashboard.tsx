import { CashierBottomNav } from "@/components/CashierBottomNav";
import { useAuth } from "@/context/AuthContext";
import { useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { getBrandImageSource, getBusinessDisplayName } from "@/src/utils/branding";
import { getResponsiveMetrics } from "@/src/utils/responsive";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Summary = {
  totalSales: number;
  totalTransactions: number;
  pendingUtang: number;
  totalCustomers: number;
};

type Sale = {
  id: number;
  customer_name?: string;
  payment_method?: string;
  total_amount?: number | string;
  created_at?: string;
};

type QuickAction = {
  id: number;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
  tint: string;
};

const quickActions: QuickAction[] = [
  { id: 1, title: "Products", icon: "package-variant-closed", route: "/products/products", tint: "#7C3AED" },
  { id: 2, title: "Inventory", icon: "clipboard-text", route: "/inventory/inventory", tint: "#4F46E5" },
  { id: 3, title: "Customers", icon: "account-group", route: "/customers/customers", tint: "#9333EA" },
  { id: 4, title: "Payments", icon: "wallet-outline", route: "/payments/payment", tint: "#C026D3" },
  { id: 5, title: "Reports", icon: "chart-box", route: "/reports/reports", tint: "#6D28D9" },
  { id: 6, title: "History", icon: "history", route: "/transactions/transactions", tint: "#8B5CF6" },
];

export default function CashierDashboardScreen() {
  const { user } = useAuth();
  const { settings } = useBusiness();
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const metrics = getResponsiveMetrics(width);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>({
    totalSales: 0,
    totalTransactions: 0,
    pendingUtang: 0,
    totalCustomers: 0,
  });
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [summaryRes, salesRes] = await Promise.all([
          api.get("/reports/summary"),
          api.get("/sales"),
        ]);

        setSummary({
          totalSales: Number(summaryRes.data.totalSales || 0),
          totalTransactions: Number(summaryRes.data.totalTransactions || 0),
          pendingUtang: Number(summaryRes.data.pendingUtang || 0),
          totalCustomers: Number(summaryRes.data.totalCustomers || 0),
        });

        setRecentSales((salesRes.data || []).slice(0, 5));
      } catch (error) {
        console.log("Cashier dashboard load error", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const businessName = getBusinessDisplayName(settings.business_name);
  const quickActionWidth = metrics.isTablet ? "31.8%" : "30.6%";
  const recentTotal = useMemo(() => {
    return recentSales.reduce((sum, item) => sum + Number(item.total_amount || 0), 0);
  }, [recentSales]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: metrics.horizontalPadding,
          paddingTop: metrics.isTablet ? 24 : 20,
          paddingBottom: metrics.contentBottomPadding,
        }}
      >
        <View style={{ width: "100%", maxWidth: metrics.contentMaxWidth, alignSelf: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 22,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: metrics.isTablet ? 58 : 48,
                  height: metrics.isTablet ? 58 : 48,
                  borderRadius: metrics.isTablet ? 18 : 16,
                  backgroundColor: theme.bgCard,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 14,
                  shadowColor: theme.accent,
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 6,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Image
                  source={getBrandImageSource(settings.logo_path)}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: metrics.isTablet ? 22 : 18,
                    fontWeight: "800",
                    color: theme.textPrimary,
                    letterSpacing: -0.3,
                  }}
                  numberOfLines={1}
                >
                  {businessName}
                </Text>
                <Text style={{ fontSize: metrics.isTablet ? 14 : 13, color: theme.textMuted, fontWeight: "500" }}>
                  Cashier Workspace
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <TouchableOpacity
                onPress={toggleTheme}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: theme.bgCard,
                  borderWidth: 1,
                  borderColor: theme.border,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#12051F",
                  shadowOpacity: theme.dark ? 0.22 : 0.08,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 4,
                }}
              >
                <Ionicons name={theme.dark ? "sunny" : "moon"} size={18} color={theme.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/profile/profile")}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: theme.bgCard,
                  borderWidth: 1,
                  borderColor: theme.border,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#12051F",
                  shadowOpacity: theme.dark ? 0.22 : 0.08,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 5 },
                  elevation: 4,
                }}
              >
                <Ionicons name="person-circle-outline" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              borderRadius: 30,
              backgroundColor: theme.accent,
              padding: metrics.isTablet ? 28 : 22,
              marginBottom: 20,
              overflow: "hidden",
              shadowColor: theme.accent,
              shadowOpacity: 0.4,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
            }}
          >
            <View
              style={{
                position: "absolute",
                top: -60,
                right: -40,
                width: 190,
                height: 190,
                borderRadius: 95,
                backgroundColor: "rgba(255,255,255,0.10)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -26,
                left: -10,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "rgba(255,255,255,0.06)",
              }}
            />
            <View
              style={{
                position: "absolute",
                top: 20,
                right: 26,
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: "rgba(255,255,255,0.14)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.18)",
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700", letterSpacing: 0.4 }}>
                ACTIVE SHIFT
              </Text>
            </View>

            <Text
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: 11,
                fontWeight: "700",
                letterSpacing: 1.3,
                marginBottom: 16,
              }}
            >
              CASHIER OVERVIEW
            </Text>

            <View
              style={{
                backgroundColor: "rgba(14,5,28,0.12)",
                borderRadius: 22,
                padding: metrics.isTablet ? 18 : 16,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.16)",
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    backgroundColor: "rgba(255,255,255,0.20)",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons name="person" size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.72)",
                      fontSize: 12,
                      fontWeight: "600",
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Logged in as
                  </Text>
                  <Text style={{ color: "#FFFFFF", fontSize: metrics.isTablet ? 23 : 20, fontWeight: "800", letterSpacing: -0.3 }}>
                    {user?.name || "Cashier"}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: metrics.cardGridGap, marginTop: 2 }}>
              {[
                { label: "Today Sales", value: `PHP ${summary.totalSales.toLocaleString()}` },
                { label: "Transactions", value: summary.totalTransactions.toString() },
                { label: "Utang", value: `PHP ${summary.pendingUtang.toLocaleString()}` },
              ].map((item, index) => (
                <View
                  key={item.label}
                  style={{
                    flex: 1,
                    alignItems: index === 0 ? "flex-start" : index === 1 ? "center" : "flex-end",
                    backgroundColor: "rgba(255,255,255,0.10)",
                    borderRadius: 18,
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.12)",
                  }}
                >
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.64)",
                      fontSize: 11,
                      fontWeight: "700",
                      letterSpacing: 0.3,
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </Text>
                  <Text style={{ color: "#FFFFFF", fontSize: metrics.isTablet ? 20 : 18, fontWeight: "800" }}>
                    {loading ? "..." : item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={{
              backgroundColor: theme.bgCard,
              borderRadius: 24,
              padding: metrics.isTablet ? 22 : 18,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: theme.border,
              overflow: "hidden",
              shadowColor: "#12051F",
              shadowOpacity: theme.dark ? 0.22 : 0.06,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}
          >
            <View
              style={{
                position: "absolute",
                right: -22,
                top: -14,
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: theme.accentLight,
                opacity: theme.dark ? 0.3 : 0.7,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "700", letterSpacing: 0.4, marginBottom: 6 }}>
                  BUSINESS NAME
                </Text>
                <Text style={{ fontSize: metrics.isTablet ? 26 : 22, fontWeight: "800", color: theme.textPrimary }} numberOfLines={1}>
                  {businessName}
                </Text>
                <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>
                  Customers served today: {loading ? "..." : summary.totalCustomers}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: theme.accentLight,
                  borderRadius: 18,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "800", color: theme.accent }}>
                  Active Shift
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: theme.bgCard,
              borderRadius: 24,
              padding: metrics.isTablet ? 24 : 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: theme.border,
              shadowColor: "#12051F",
              shadowOpacity: theme.dark ? 0.22 : 0.06,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: theme.textPrimary,
                    letterSpacing: -0.3,
                  }}
                >
                  Quick Access
                </Text>
                <Text style={{ marginTop: 4, color: theme.textMuted, fontSize: 12 }}>
                  Shortcut tools for your shift
                </Text>
              </View>
              <View
                style={{
                  borderRadius: 999,
                  backgroundColor: theme.bgSubtle,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700", color: theme.textMuted }}>
                  6 tools
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                columnGap: metrics.isTablet ? 14 : 11,
                rowGap: metrics.isTablet ? 18 : 14,
              }}
            >
              {quickActions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.route as any)}
                  style={{
                    width: quickActionWidth,
                    alignItems: "center",
                    borderRadius: 22,
                    paddingVertical: metrics.isTablet ? 18 : 16,
                    paddingHorizontal: 8,
                    backgroundColor: theme.bgSubtle,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <View
                    style={{
                      width: metrics.isTablet ? 68 : 58,
                      height: metrics.isTablet ? 68 : 58,
                      borderRadius: 18,
                      backgroundColor: item.tint,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 12,
                      shadowColor: item.tint,
                      shadowOpacity: 0.28,
                      shadowRadius: 14,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: 6,
                    }}
                  >
                    <MaterialCommunityIcons name={item.icon} size={metrics.isTablet ? 28 : 24} color="#FFFFFF" />
                  </View>
                  <Text
                    style={{
                      fontSize: metrics.isTablet ? 13 : 12,
                      color: theme.textPrimary,
                      textAlign: "center",
                      fontWeight: "800",
                      letterSpacing: 0.2,
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text style={{ marginTop: 3, fontSize: 11, color: theme.textMuted }}>
                    Open
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={{
              backgroundColor: theme.bgCard,
              borderRadius: 24,
              padding: metrics.isTablet ? 24 : 20,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: theme.border,
              shadowColor: "#12051F",
              shadowOpacity: theme.dark ? 0.22 : 0.06,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "800",
                    color: theme.textPrimary,
                    marginBottom: 6,
                    letterSpacing: -0.3,
                  }}
                >
                  Recent Activity
                </Text>
                <Text style={{ color: theme.textMuted }}>
                  Latest sales total: PHP {recentTotal.toLocaleString()}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: theme.bgSubtle,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                }}
              >
                <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: "700" }}>
                  {recentSales.length} recent
                </Text>
              </View>
            </View>

            {loading ? (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <ActivityIndicator color={theme.accent} />
              </View>
            ) : recentSales.length === 0 ? (
              <Text style={{ color: theme.textMuted }}>No recent sales yet.</Text>
            ) : (
              recentSales.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 13,
                    paddingHorizontal: 14,
                    borderRadius: 18,
                    backgroundColor: theme.bgSubtle,
                    borderWidth: 1,
                    borderColor: theme.border,
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ color: theme.textPrimary, fontWeight: "700" }} numberOfLines={1}>
                      {item.customer_name || "Walk-in Customer"}
                    </Text>
                    <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                      {item.payment_method || "Unknown"} · {item.created_at ? new Date(item.created_at).toLocaleString() : "No date"}
                    </Text>
                  </View>
                  <Text style={{ color: theme.accent, fontWeight: "800" }}>
                    PHP {Number(item.total_amount || 0).toLocaleString()}
                  </Text>
                </View>
              ))
            )}

            <TouchableOpacity
              onPress={() => router.push("/transactions/transactions")}
              style={{
                marginTop: 16,
                height: 48,
                borderRadius: 18,
                backgroundColor: theme.textPrimary,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#12051F",
                shadowOpacity: 0.14,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 5 },
                elevation: 5,
              }}
            >
              <Text style={{ color: theme.bgCard, fontWeight: "800" }}>View Full History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CashierBottomNav activeRoute="/dashboard/cashier-dashboard" />
    </SafeAreaView>
  );
}

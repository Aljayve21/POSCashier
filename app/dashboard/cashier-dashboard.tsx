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
};

const quickActions: QuickAction[] = [
  { id: 1, title: "Products", icon: "package-variant-closed", route: "/products/products" },
  { id: 2, title: "Inventory", icon: "clipboard-text", route: "/inventory/inventory" },
  { id: 3, title: "Customers", icon: "account-group", route: "/customers/customers" },
  { id: 4, title: "Payments", icon: "wallet-outline", route: "/payments/payment" },
  { id: 5, title: "Reports", icon: "chart-box", route: "/reports/reports" },
  { id: 6, title: "History", icon: "history", route: "/transactions/transactions" },
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
              marginBottom: 24,
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
                }}
              >
                <Ionicons name="person-circle-outline" size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              borderRadius: 28,
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
                top: -30,
                right: -30,
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -20,
                right: 60,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255,255,255,0.05)",
              }}
            />

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 15,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="person" size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    fontWeight: "600",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Logged in as
                </Text>
                <Text style={{ color: "#FFFFFF", fontSize: metrics.isTablet ? 22 : 18, fontWeight: "800", letterSpacing: -0.3 }}>
                  {user?.name || "Cashier"}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: metrics.cardGridGap }}>
              {[
                { label: "Today Sales", value: `PHP ${summary.totalSales.toLocaleString()}` },
                { label: "Transactions", value: summary.totalTransactions.toString() },
                { label: "Utang", value: `PHP ${summary.pendingUtang.toLocaleString()}` },
              ].map((item, index) => (
                <View key={item.label} style={{ flex: 1, alignItems: index === 0 ? "flex-start" : index === 1 ? "center" : "flex-end" }}>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 11,
                      fontWeight: "600",
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
              borderRadius: 22,
              padding: metrics.isTablet ? 22 : 18,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: theme.border,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "600", marginBottom: 4 }}>
                Business Name
              </Text>
              <Text style={{ fontSize: metrics.isTablet ? 26 : 22, fontWeight: "800", color: theme.textPrimary }} numberOfLines={1}>
                {businessName}
              </Text>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                Customers served: {loading ? "..." : summary.totalCustomers}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: theme.accentLight,
                borderRadius: 16,
                paddingVertical: 10,
                paddingHorizontal: 16,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: "700", color: theme.accent }}>
                Active Shift
              </Text>
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
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "800",
                color: theme.textPrimary,
                marginBottom: 18,
                letterSpacing: -0.3,
              }}
            >
              Quick Access
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: metrics.isTablet ? "flex-start" : "space-between", gap: metrics.cardGridGap }}>
              {quickActions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.route as any)}
                  style={{ width: metrics.isTablet ? "31.5%" : "31%", alignItems: "center", marginBottom: 4 }}
                >
                  <View
                    style={{
                      width: metrics.isTablet ? 72 : 60,
                      height: metrics.isTablet ? 72 : 60,
                      borderRadius: 20,
                      backgroundColor: theme.accentLight,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 8,
                      borderWidth: 1,
                      borderColor: theme.border,
                    }}
                  >
                    <MaterialCommunityIcons name={item.icon} size={metrics.isTablet ? 30 : 24} color={theme.accent} />
                  </View>
                  <Text
                    style={{
                      fontSize: metrics.isTablet ? 13 : 12,
                      color: theme.textSecondary,
                      textAlign: "center",
                      fontWeight: "700",
                      letterSpacing: 0.2,
                    }}
                  >
                    {item.title}
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
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "800",
                color: theme.textPrimary,
                marginBottom: 6,
                letterSpacing: -0.3,
              }}
            >
              Recent Activity
            </Text>
            <Text style={{ color: theme.textMuted, marginBottom: 16 }}>
              Latest sales total: PHP {recentTotal.toLocaleString()}
            </Text>

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
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.borderSubtle,
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
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>View Full History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CashierBottomNav activeRoute="/dashboard/cashier-dashboard" />
    </SafeAreaView>
  );
}

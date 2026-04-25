import { useTheme } from "@/context/ThemeContext";
import { businessSettings, cashierUser, dashboardSummary } from "@/data/mockData";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: "✏️", label: "Edit Basic Info" },
    { icon: "🔒", label: "Change Password" },
    { icon: "🖨️", label: "Printer Setup" },
    { icon: "ℹ️", label: "App Version", value: "v2.0.0" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 }}>
        {/* Header row */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 }}>
          <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile hero */}
        <View style={{ backgroundColor: theme.accent, borderRadius: 28, padding: 24, marginBottom: 20, overflow: "hidden", alignItems: "center" }}>
          <View style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.07)" }} />
          <View style={{ width: 84, height: 84, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 38 }}>👤</Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#FFFFFF", marginBottom: 4, letterSpacing: -0.3 }}>{cashierUser.name}</Text>
          <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: "#FFFFFF", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>{cashierUser.role}</Text>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "500" }}>{businessSettings.business_name}</Text>
        </View>

        {/* Shift summary */}
        <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 16 }}>Shift Summary</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            {[
              { label: "Today Sales", value: `₱${dashboardSummary.todaySales.toLocaleString()}`, color: theme.success },
              { label: "Transactions", value: dashboardSummary.totalTransactions.toString(), color: theme.accent },
              { label: "Utang", value: `₱${dashboardSummary.pendingUtang.toLocaleString()}`, color: theme.danger },
            ].map((s) => (
              <View key={s.label} style={{ flex: 1, backgroundColor: s.color + "15", borderRadius: 18, padding: 14, alignItems: "center" }}>
                <Text style={{ fontSize: 18, fontWeight: "800", color: s.color, marginBottom: 4 }}>{s.value}</Text>
                <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: "600", textAlign: "center" }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account Settings */}
        <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 4 }}>Account</Text>
          <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "500", marginBottom: 16 }}>Manage your account settings</Text>
          {menuItems.map((item, idx) => (
            <TouchableOpacity key={item.label} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: idx < menuItems.length - 1 ? 1 : 0, borderBottomColor: theme.borderSubtle }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: theme.bgSubtle, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
                <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: "600" }}>{item.label}</Text>
              {item.value ? <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "600" }}>{item.value}</Text> : <Text style={{ fontSize: 18, color: theme.textMuted }}>›</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={() => router.replace("/auth/login")} style={{ height: 56, borderRadius: 18, borderWidth: 1.5, borderColor: theme.danger, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: theme.danger, fontSize: 16, fontWeight: "700" }}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={{ position: "absolute", left: 16, right: 16, bottom: 20, backgroundColor: theme.navBg, borderRadius: 28, paddingVertical: 14, paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-around", alignItems: "center", shadowColor: "#000", shadowOpacity: theme.dark ? 0.5 : 0.1, shadowRadius: 20, elevation: 10, borderWidth: 1, borderColor: theme.border }}>
        {[
          { icon: "🏠", label: "Home", route: "/dashboard/cashier-dashboard" },
          { icon: "🛒", label: "New Sale", route: "/sales/new-sale" },
          { icon: "💵", label: "Payments", route: "/payments/payment" },
          { icon: "🧾", label: "History", route: "/transactions/transactions" },
          { icon: "👤", label: "Profile", route: "/profile/profile", active: true },
        ].map((nav) => (
          <TouchableOpacity key={nav.label} style={{ alignItems: "center", paddingHorizontal: 8 }} onPress={() => router.push(nav.route as any)}>
            <Text style={{ fontSize: 22, marginBottom: 4 }}>{nav.icon}</Text>
            <Text style={{ fontSize: 11, color: nav.active ? theme.accent : theme.textMuted, fontWeight: nav.active ? "700" : "500" }}>{nav.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

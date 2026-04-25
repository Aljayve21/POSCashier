import { useTheme } from "@/context/ThemeContext";
import { transactionHistory, utangRecords } from "@/data/mockData";
import { exportPdf } from "@/utils/receiptPdf";
import { router } from "expo-router";
import { useMemo } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ReportsScreen() {
  const { theme, toggleTheme } = useTheme();

  const summary = useMemo(() => {
    const completed = transactionHistory.filter((i) => i.status === "Completed");
    const cashSales = completed.filter((i) => i.payment_method === "Cash").reduce((s, i) => s + i.amount, 0);
    const gcashSales = completed.filter((i) => i.payment_method === "GCash").reduce((s, i) => s + i.amount, 0);
    const utangSales = transactionHistory.filter((i) => i.payment_method === "Utang").reduce((s, i) => s + i.amount, 0);
    const totalSales = completed.reduce((s, i) => s + i.amount, 0);
    const pendingUtang = utangRecords.filter((i) => !i.is_paid).reduce((s, i) => s + i.amount, 0);
    return { totalSales, cashSales, gcashSales, utangSales, pendingUtang, completedCount: completed.length, cancelledCount: transactionHistory.filter((i) => i.status === "Cancelled").length, pendingCount: transactionHistory.filter((i) => i.status === "Pending").length, totalTransactions: transactionHistory.length };
  }, []);

  const cards = [
    { label: "Cash Sales", value: `₱${summary.cashSales.toLocaleString()}`, color: theme.success, icon: "💵" },
    { label: "GCash Sales", value: `₱${summary.gcashSales.toLocaleString()}`, color: "#0EA5E9", icon: "📱" },
    { label: "Utang Sales", value: `₱${summary.utangSales.toLocaleString()}`, color: theme.warning, icon: "📋" },
    { label: "Pending Utang", value: `₱${summary.pendingUtang.toLocaleString()}`, color: theme.danger, icon: "⚠️" },
    { label: "Completed", value: summary.completedCount.toString(), color: theme.success, icon: "✅" },
    { label: "Pending", value: summary.pendingCount.toString(), color: theme.warning, icon: "⏳" },
    { label: "Cancelled", value: summary.cancelledCount.toString(), color: theme.danger, icon: "❌" },
    { label: "Total", value: summary.totalTransactions.toString(), color: theme.accent, icon: "📊" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Reports</Text>
          <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero total */}
        <View style={{ backgroundColor: theme.accent, borderRadius: 28, padding: 24, marginBottom: 20, overflow: "hidden" }}>
          <View style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.07)" }} />
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Total Completed Sales</Text>
          <Text style={{ color: "#FFF", fontSize: 40, fontWeight: "800", letterSpacing: -1, marginBottom: 6 }}>₱{summary.totalSales.toLocaleString()}</Text>
          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" }}>April 2026 · All Transactions</Text>
        </View>

        <TouchableOpacity onPress={() => exportPdf({ title: "Cashier Report", htmlBody: `<h3>Total: ₱${summary.totalSales.toLocaleString()}</h3>` })} style={{ height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: theme.accent, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Text style={{ color: theme.accent, fontWeight: "700", fontSize: 15 }}>📄 Export PDF Report</Text>
        </TouchableOpacity>

        {/* Grid cards */}
        <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 14 }}>Breakdown</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 }}>
          {cards.map((card) => (
            <View key={card.label} style={{ width: "48%", backgroundColor: theme.bgCard, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: card.color + "22", justifyContent: "center", alignItems: "center", marginRight: 8 }}>
                  <Text style={{ fontSize: 16 }}>{card.icon}</Text>
                </View>
                <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "600" }}>{card.label}</Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: "800", color: card.color }}>{card.value}</Text>
            </View>
          ))}
        </View>

        {/* Payment breakdown bars */}
        <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: theme.border }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 18 }}>Payment Breakdown</Text>
          {[
            { label: "Cash", value: summary.cashSales, color: theme.success },
            { label: "GCash", value: summary.gcashSales, color: "#0EA5E9" },
            { label: "Utang", value: summary.utangSales, color: theme.warning },
          ].map((b) => {
            const total = summary.totalSales + summary.utangSales;
            const pct = total > 0 ? Math.round((b.value / total) * 100) : 0;
            return (
              <View key={b.label} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ color: theme.textSecondary, fontWeight: "700", fontSize: 14 }}>{b.label}</Text>
                  <Text style={{ color: theme.textPrimary, fontWeight: "800", fontSize: 14 }}>₱{b.value.toLocaleString()} · {pct}%</Text>
                </View>
                <View style={{ height: 8, backgroundColor: theme.bgSubtle, borderRadius: 4, overflow: "hidden" }}>
                  <View style={{ height: 8, width: `${pct}%`, backgroundColor: b.color, borderRadius: 4 }} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

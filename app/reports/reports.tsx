import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { exportPdf } from "@/utils/receiptPdf";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ReportSummary = {
  totalSales: number;
  totalTransactions: number;
  totalCustomers: number;
  pendingUtang: number;
  completedCount: number;
  cancelledCount: number;
  refundedCount: number;
  paymentBreakdown: { name: string; value: number }[];
  paymentCollections: { name: string; value: number }[];
  monthlySales: { month: string; monthNumber: number; sales: number }[];
};

const defaultSummary: ReportSummary = {
  totalSales: 0,
  totalTransactions: 0,
  totalCustomers: 0,
  pendingUtang: 0,
  completedCount: 0,
  cancelledCount: 0,
  refundedCount: 0,
  paymentBreakdown: [],
  paymentCollections: [],
  monthlySales: [],
};

export default function ReportsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [summary, setSummary] = useState<ReportSummary>(defaultSummary);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reports/summary");
      setSummary(response.data);
    } catch (error: any) {
      console.log("Reports error:", error.response?.data || error.message);
      Alert.alert("Error", "Hindi ma-load ang reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Cash Sales",
        value: `PHP ${Number(
          summary.paymentBreakdown.find((item) => item.name === "Cash")?.value || 0
        ).toLocaleString()}`,
        color: theme.success,
      },
      {
        label: "GCash Sales",
        value: `PHP ${Number(
          summary.paymentBreakdown.find((item) => item.name === "GCash")?.value || 0
        ).toLocaleString()}`,
        color: "#0EA5E9",
      },
      {
        label: "Utang Sales",
        value: `PHP ${Number(
          summary.paymentBreakdown.find((item) => item.name === "Utang")?.value || 0
        ).toLocaleString()}`,
        color: theme.warning,
      },
      {
        label: "Pending Utang",
        value: `PHP ${Number(summary.pendingUtang || 0).toLocaleString()}`,
        color: theme.danger,
      },
      {
        label: "Completed",
        value: String(summary.completedCount || 0),
        color: theme.success,
      },
      {
        label: "Cancelled",
        value: String(summary.cancelledCount || 0),
        color: theme.danger,
      },
      {
        label: "Refunded",
        value: String(summary.refundedCount || 0),
        color: theme.warning,
      },
      {
        label: "Customers",
        value: String(summary.totalCustomers || 0),
        color: theme.accent,
      },
    ],
    [summary, theme]
  );

  const handleExport = async () => {
    await exportPdf({
      title: "Cashier Report",
      htmlBody: `
        <h2>Cashier Report</h2>
        <p>Total Sales: PHP ${Number(summary.totalSales || 0).toLocaleString()}</p>
        <p>Total Transactions: ${summary.totalTransactions}</p>
        <p>Total Customers: ${summary.totalCustomers}</p>
        <p>Pending Utang: PHP ${Number(summary.pendingUtang || 0).toLocaleString()}</p>
        <h3>Monthly Sales</h3>
        <ul>
          ${summary.monthlySales
            .map((item) => `<li>${item.month}: PHP ${Number(item.sales || 0).toLocaleString()}</li>`)
            .join("")}
        </ul>
      `,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
            <Text style={{ fontSize: 18 }}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Reports</Text>
          <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 12 }}>{theme.dark ? "Light" : "Dark"}</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ backgroundColor: theme.bgCard, borderRadius: 20, padding: 32, alignItems: "center", borderWidth: 1, borderColor: theme.border }}>
            <ActivityIndicator color={theme.accent} />
            <Text style={{ marginTop: 12, color: theme.textMuted }}>Loading reports...</Text>
          </View>
        ) : (
          <>
            <View style={{ backgroundColor: theme.accent, borderRadius: 28, padding: 24, marginBottom: 20, overflow: "hidden" }}>
              <View style={{ position: "absolute", top: -30, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.07)" }} />
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Total Sales</Text>
              <Text style={{ color: "#FFF", fontSize: 40, fontWeight: "800", letterSpacing: -1, marginBottom: 6 }}>PHP {Number(summary.totalSales || 0).toLocaleString()}</Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" }}>Live backend reports summary</Text>
            </View>

            <TouchableOpacity onPress={handleExport} style={{ height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: theme.accent, alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <Text style={{ color: theme.accent, fontWeight: "700", fontSize: 15 }}>Export PDF Report</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 14 }}>Breakdown</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 24 }}>
              {cards.map((card) => (
                <View key={card.label} style={{ width: "48%", backgroundColor: theme.bgCard, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.border }}>
                  <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "600", marginBottom: 10 }}>{card.label}</Text>
                  <Text style={{ fontSize: 22, fontWeight: "800", color: card.color }}>{card.value}</Text>
                </View>
              ))}
            </View>

            <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: theme.border, marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 18 }}>Sales by Payment Method</Text>
              {summary.paymentBreakdown.map((item) => {
                const pct = summary.totalSales > 0 ? Math.round((Number(item.value || 0) / Number(summary.totalSales || 0)) * 100) : 0;
                const color = item.name === "Cash" ? theme.success : item.name === "GCash" ? "#0EA5E9" : theme.warning;
                return (
                  <View key={item.name} style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text style={{ color: theme.textSecondary, fontWeight: "700", fontSize: 14 }}>{item.name}</Text>
                      <Text style={{ color: theme.textPrimary, fontWeight: "800", fontSize: 14 }}>PHP {Number(item.value || 0).toLocaleString()} · {pct}%</Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: theme.bgSubtle, borderRadius: 4, overflow: "hidden" }}>
                      <View style={{ height: 8, width: `${pct}%`, backgroundColor: color, borderRadius: 4 }} />
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: theme.border }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 16 }}>Monthly Sales</Text>
              {summary.monthlySales.length === 0 ? (
                <Text style={{ color: theme.textMuted }}>No sales data yet.</Text>
              ) : (
                summary.monthlySales.map((item) => (
                  <View key={item.monthNumber} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.borderSubtle }}>
                    <Text style={{ color: theme.textPrimary, fontWeight: "600" }}>{item.month}</Text>
                    <Text style={{ color: theme.accent, fontWeight: "800" }}>PHP {Number(item.sales || 0).toLocaleString()}</Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


import { useTheme } from "@/context/ThemeContext";
import { transactionHistory } from "@/data/mockData";
import { exportPdf } from "@/utils/receiptPdf";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

const statusFilters = ["All", "Completed", "Pending", "Cancelled"];
const rowsPerPage = 5;
const formatDate = (d: Date) => d.toISOString().split("T")[0];

export default function TransactionHistoryScreen() {
  const { theme, toggleTheme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [page, setPage] = useState(1);
  const dateFilter = selectedDate ? formatDate(selectedDate) : "";

  const filtered = useMemo(() => {
    let data = transactionHistory;
    if (selectedStatus !== "All") data = data.filter((i) => i.status === selectedStatus);
    if (dateFilter) data = data.filter((i) => i.created_at.includes(dateFilter));
    return data;
  }, [selectedStatus, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(() => filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage), [filtered, page]);

  const statusColor: Record<string, string> = { Completed: theme.success, Pending: theme.warning, Cancelled: theme.danger };
  const statusIcon: Record<string, string> = { Completed: "✅", Pending: "⏳", Cancelled: "❌" };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Transactions</Text>
          <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => exportPdf({ title: "Transactions", htmlBody: "<p>Export</p>" })} style={{ height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: theme.accent, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <Text style={{ color: theme.accent, fontWeight: "700" }}>📄 Export PDF</Text>
        </TouchableOpacity>

        {/* Date + Status filters */}
        <View style={{ flexDirection: "row", marginBottom: 14, gap: 10 }}>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={{ flex: 1, height: 48, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: selectedDate ? theme.accent : theme.border, justifyContent: "center", paddingHorizontal: 14 }}>
            <Text style={{ color: selectedDate ? theme.accent : theme.textMuted, fontWeight: "600", fontSize: 14 }}>{selectedDate ? dateFilter : "📅 Select Date"}</Text>
          </TouchableOpacity>
          {selectedDate && (
            <TouchableOpacity onPress={() => { setSelectedDate(null); setPage(1); }} style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: theme.danger + "22", borderWidth: 1, borderColor: theme.danger, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: theme.danger, fontWeight: "700", fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {showPicker && (
          <DateTimePicker value={selectedDate ?? new Date()} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={(_e, d) => { if (Platform.OS === "android") setShowPicker(false); if (d) { setSelectedDate(d); setPage(1); } }} />
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4, gap: 8, marginBottom: 16 }}>
          {statusFilters.map((s) => {
            const isActive = selectedStatus === s;
            return (
              <TouchableOpacity key={s} onPress={() => { setSelectedStatus(s); setPage(1); }} style={{ paddingVertical: 8, paddingHorizontal: 18, borderRadius: 14, backgroundColor: isActive ? theme.accent : theme.bgCard, borderWidth: 1.5, borderColor: isActive ? theme.accent : theme.border }}>
                <Text style={{ color: isActive ? "#FFF" : theme.textMuted, fontWeight: "700", fontSize: 13 }}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Transaction cards */}
        {paginated.length === 0 ? (
          <View style={{ backgroundColor: theme.bgCard, borderRadius: 20, padding: 32, alignItems: "center", borderWidth: 1, borderColor: theme.border }}>
            <Text style={{ fontSize: 32, marginBottom: 12 }}>🔍</Text>
            <Text style={{ color: theme.textMuted, fontWeight: "600" }}>No transactions found</Text>
          </View>
        ) : (
          paginated.map((item) => (
            <View key={item.id} style={{ backgroundColor: theme.bgCard, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.border }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "700", color: theme.textPrimary, marginBottom: 4 }}>{item.customer_name}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "500" }}>{item.created_at}</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>₱{item.amount.toLocaleString()}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: theme.bgSubtle }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: theme.textSecondary }}>{item.payment_method}</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: (statusColor[item.status] || theme.textMuted) + "22" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: statusColor[item.status] || theme.textMuted }}>{statusIcon[item.status] || ""} {item.status}</Text>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Pagination */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <TouchableOpacity disabled={page === 1} onPress={() => setPage((p) => p - 1)} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 14, backgroundColor: page === 1 ? theme.bgSubtle : theme.accent }}>
            <Text style={{ color: page === 1 ? theme.textMuted : "#FFF", fontWeight: "700" }}>← Prev</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.textSecondary, fontWeight: "600" }}>Page {page} / {totalPages}</Text>
          <TouchableOpacity disabled={page === totalPages} onPress={() => setPage((p) => p + 1)} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 14, backgroundColor: page === totalPages ? theme.bgSubtle : theme.accent }}>
            <Text style={{ color: page === totalPages ? theme.textMuted : "#FFF", fontWeight: "700" }}>Next →</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ marginTop: 10, color: theme.textMuted, fontSize: 13, textAlign: "center" }}>Showing {paginated.length} of {filtered.length}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

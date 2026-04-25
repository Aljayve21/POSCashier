import { useTheme } from "@/context/ThemeContext";
import { customers as initialCustomers } from "@/data/mockData";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type Customer = { id: number; name: string; phone: string; total_transactions: number; total_utang: number; };

export default function CustomersScreen() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(kw) || c.phone.includes(kw));
  }, [search, customers]);

  const handleAdd = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    setCustomers((prev) => [{ id: Date.now(), name: newName.trim(), phone: newPhone.trim(), total_transactions: 0, total_utang: 0 }, ...prev]);
    setNewName(""); setNewPhone(""); setModalVisible(false);
  };

  const avatarColors = ["#6C00E0", "#00C48C", "#FFB800", "#FF4B55", "#0EA5E9"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Customers</Text>
          <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 8 }}>
            <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={{ height: 40, borderRadius: 14, backgroundColor: theme.accent, paddingHorizontal: 16, justifyContent: "center", alignItems: "center", shadowColor: theme.accent, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 }}>
            <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.bgCard, borderRadius: 16, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, marginBottom: 20, height: 52 }}>
          <Text style={{ fontSize: 18, marginRight: 10, color: theme.textMuted }}>🔍</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search customers..." placeholderTextColor={theme.textMuted} style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filtered.map((c, idx) => (
            <View key={c.id} style={{ backgroundColor: theme.bgCard, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: theme.border }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: avatarColors[idx % avatarColors.length], justifyContent: "center", alignItems: "center", marginRight: 14 }}>
                  <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 18 }}>{c.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 2 }}>{c.name}</Text>
                  <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "500" }}>📱 {c.phone}</Text>
                </View>
                {c.total_utang > 0 && (
                  <View style={{ backgroundColor: theme.danger + "22", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6 }}>
                    <Text style={{ color: theme.danger, fontSize: 13, fontWeight: "700" }}>₱{c.total_utang.toLocaleString()}</Text>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: "row", marginTop: 14, gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: theme.bgSubtle, borderRadius: 12, padding: 12, alignItems: "center" }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>{c.total_transactions}</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: "600" }}>Transactions</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: c.total_utang > 0 ? theme.danger + "15" : theme.success + "15", borderRadius: 12, padding: 12, alignItems: "center" }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: c.total_utang > 0 ? theme.danger : theme.success }}>₱{c.total_utang.toLocaleString()}</Text>
                  <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: "600" }}>Total Utang</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: theme.bgCard, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: "center", marginBottom: 24 }} />
            <Text style={{ fontSize: 22, fontWeight: "800", color: theme.textPrimary, marginBottom: 24 }}>Add Customer</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Customer Name</Text>
            <View style={{ height: 54, borderRadius: 16, backgroundColor: theme.bgInput, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, justifyContent: "center", marginBottom: 16 }}>
              <TextInput value={newName} onChangeText={setNewName} placeholder="Enter customer name" placeholderTextColor={theme.textMuted} style={{ fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
            </View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Phone Number</Text>
            <View style={{ height: 54, borderRadius: 16, backgroundColor: theme.bgInput, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, justifyContent: "center", marginBottom: 24 }}>
              <TextInput value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" placeholder="09XX-XXX-XXXX" placeholderTextColor={theme.textMuted} style={{ fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
            </View>
            <TouchableOpacity onPress={handleAdd} style={{ height: 56, borderRadius: 18, backgroundColor: theme.accent, alignItems: "center", justifyContent: "center", marginBottom: 12, shadowColor: theme.accent, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 }}>
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>Save Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ height: 52, borderRadius: 18, borderWidth: 1.5, borderColor: theme.border, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: theme.textSecondary, fontSize: 16, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { getResponsiveMetrics } from "@/src/utils/responsive";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Customer = {
  id: number;
  name: string;
  phone: string;
  total_transactions: number;
  total_utang: number;
};

type FormState = {
  name: string;
  phone: string;
};

const avatarColors = ["#6C00E0", "#00C48C", "#FFB800", "#FF4B55", "#0EA5E9"];
const emptyForm: FormState = { name: "", phone: "" };

export default function CustomersScreen() {
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const metrics = getResponsiveMetrics(width);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/customers");
      setCustomers(response.data || []);
    } catch (error: any) {
      console.log("Customers load error:", error.response?.data || error.message);
      Alert.alert("Error", "Hindi ma-load ang customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(keyword) ||
        String(customer.phone || "").includes(keyword)
    );
  }, [search, customers]);

  const openAddModal = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || "",
      phone: customer.phone || "",
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingCustomer(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      Alert.alert("Missing Fields", "Ilagay ang customer name at phone.");
      return;
    }

    try {
      setSaving(true);

      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, {
          name: form.name.trim(),
          phone: form.phone.trim(),
        });
      } else {
        await api.post("/customers", {
          name: form.name.trim(),
          phone: form.phone.trim(),
        });
      }

      closeModal();
      await loadCustomers();
      Alert.alert("Success", editingCustomer ? "Customer updated." : "Customer added.");
    } catch (error: any) {
      Alert.alert(
        "Save Failed",
        error.response?.data?.error || "Hindi na-save ang customer."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (customer: Customer) => {
    Alert.alert(
      "Delete Customer",
      `Delete si ${customer.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(customer.id);
              await api.delete(`/customers/${customer.id}`);
              await loadCustomers();
              Alert.alert("Success", "Customer deleted.");
            } catch (error: any) {
              Alert.alert(
                "Delete Failed",
                error.response?.data?.error || "Hindi na-delete ang customer."
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
      <View style={{ flex: 1, paddingHorizontal: metrics.horizontalPadding, paddingTop: metrics.isTablet ? 24 : 20 }}>
        <View style={{ width: "100%", maxWidth: metrics.contentMaxWidth, alignSelf: "center", flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              backgroundColor: theme.bgCard,
              borderWidth: 1,
              borderColor: theme.border,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 14,
            }}
          >
            <Text style={{ fontSize: 18 }}>{"<"}</Text>
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              fontSize: 24,
              fontWeight: "800",
              color: theme.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Customers
          </Text>
          <TouchableOpacity
            onPress={toggleTheme}
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              backgroundColor: theme.bgCard,
              borderWidth: 1,
              borderColor: theme.border,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            <Text style={{ fontSize: 12 }}>{theme.dark ? "Light" : "Dark"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openAddModal}
            style={{
              height: 40,
              borderRadius: 14,
              backgroundColor: theme.accent,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: theme.accent,
              shadowOpacity: 0.35,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 14 }}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.bgCard,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: theme.border,
            paddingHorizontal: 16,
            marginBottom: 20,
            height: 52,
          }}
        >
          <Text style={{ fontSize: 14, marginRight: 10, color: theme.textMuted }}>Find</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search customers..."
            placeholderTextColor={theme.textMuted}
            style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: "500" }}
          />
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator color={theme.accent} />
            <Text style={{ marginTop: 12, color: theme.textMuted }}>Loading customers...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: metrics.isTablet ? 28 : 20 }}>
            {filtered.length === 0 ? (
              <View
                style={{
                  backgroundColor: theme.bgCard,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: theme.border,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.textMuted }}>No customers found.</Text>
              </View>
            ) : (
              filtered.map((customer, index) => (
                <View
                  key={customer.id}
                  style={{
                    backgroundColor: theme.bgCard,
                    borderRadius: 20,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 18,
                        backgroundColor: avatarColors[index % avatarColors.length],
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 14,
                      }}
                    >
                      <Text style={{ color: "#FFF", fontWeight: "800", fontSize: 18 }}>
                        {(customer.name || "C")[0]}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "800",
                          color: theme.textPrimary,
                          marginBottom: 2,
                        }}
                      >
                        {customer.name}
                      </Text>
                      <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "500" }}>
                        Phone: {customer.phone || "No phone"}
                      </Text>
                    </View>

                    {Number(customer.total_utang || 0) > 0 && (
                      <View
                        style={{
                          backgroundColor: theme.danger + "22",
                          borderRadius: 12,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                        }}
                      >
                        <Text style={{ color: theme.danger, fontSize: 13, fontWeight: "700" }}>
                          PHP {Number(customer.total_utang || 0).toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 14, gap: 10 }}>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: theme.bgSubtle,
                        borderRadius: 12,
                        padding: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: "800", color: theme.textPrimary }}>
                        {Number(customer.total_transactions || 0)}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: "600" }}>
                        Transactions
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        backgroundColor:
                          Number(customer.total_utang || 0) > 0
                            ? theme.danger + "15"
                            : theme.success + "15",
                        borderRadius: 12,
                        padding: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "800",
                          color:
                            Number(customer.total_utang || 0) > 0 ? theme.danger : theme.success,
                        }}
                      >
                        PHP {Number(customer.total_utang || 0).toLocaleString()}
                      </Text>
                      <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: "600" }}>
                        Total Utang
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                    <TouchableOpacity
                      onPress={() => openEditModal(customer)}
                      style={{
                        flex: 1,
                        height: 46,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: theme.border,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(customer)}
                      disabled={deletingId === customer.id}
                      style={{
                        flex: 1,
                        height: 46,
                        borderRadius: 14,
                        backgroundColor: deletingId === customer.id ? "#9CA3AF" : theme.danger,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#FFF", fontWeight: "700" }}>
                        {deletingId === customer.id ? "Deleting..." : "Delete"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: theme.bgCard,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 28,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.border,
                alignSelf: "center",
                marginBottom: 24,
              }}
            />
            <Text style={{ fontSize: 22, fontWeight: "800", color: theme.textPrimary, marginBottom: 24 }}>
              {editingCustomer ? "Edit Customer" : "Add Customer"}
            </Text>

            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: theme.textSecondary,
                marginBottom: 8,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Customer Name
            </Text>
            <View
              style={{
                height: 54,
                borderRadius: 16,
                backgroundColor: theme.bgInput,
                borderWidth: 1.5,
                borderColor: theme.border,
                paddingHorizontal: 16,
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <TextInput
                value={form.name}
                onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
                placeholder="Enter customer name"
                placeholderTextColor={theme.textMuted}
                style={{ fontSize: 15, color: theme.textPrimary, fontWeight: "500" }}
              />
            </View>

            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: theme.textSecondary,
                marginBottom: 8,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Phone Number
            </Text>
            <View
              style={{
                height: 54,
                borderRadius: 16,
                backgroundColor: theme.bgInput,
                borderWidth: 1.5,
                borderColor: theme.border,
                paddingHorizontal: 16,
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <TextInput
                value={form.phone}
                onChangeText={(value) => setForm((current) => ({ ...current, phone: value }))}
                keyboardType="phone-pad"
                placeholder="09XXXXXXXXX"
                placeholderTextColor={theme.textMuted}
                style={{ fontSize: 15, color: theme.textPrimary, fontWeight: "500" }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={{
                height: 56,
                borderRadius: 18,
                backgroundColor: saving ? "#9CA3AF" : theme.accent,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                shadowColor: theme.accent,
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>
                  {editingCustomer ? "Update Customer" : "Save Customer"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeModal}
              disabled={saving}
              style={{
                height: 52,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: theme.border,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: theme.textSecondary, fontSize: 16, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


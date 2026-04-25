import api from "@/src/axios";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type UtangRecord = {
  id: number;
  customer_id: number;
  customer_name: string;
  amount: number | string;
  is_paid: boolean;
  due_label?: string;
  due_date?: string;
  created_at?: string;
};

export default function CashierPaymentsScreen() {
  const [utangRecords, setUtangRecords] = useState<UtangRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<UtangRecord | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [saving, setSaving] = useState(false);

  const fetchUtang = async () => {
    try {
      const res = await api.get("/utang");
      setUtangRecords(res.data);
    } catch (error: any) {
      console.log("Utang load error:", error.response?.data || error.message);
      Alert.alert("Error", "Hindi ma-load ang utang records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtang();
  }, []);

  const unpaidRecords = useMemo(() => {
    return utangRecords
      .filter((item) => !item.is_paid && Number(item.amount || 0) > 0)
      .filter((item) =>
        item.customer_name.toLowerCase().includes(search.toLowerCase())
      );
  }, [utangRecords, search]);

  const totalUnpaid = unpaidRecords.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const openPayment = (record: UtangRecord) => {
    setSelected(record);
    setAmount(String(record.amount || ""));
    setPaymentMethod("Cash");
  };

  const closePayment = () => {
    setSelected(null);
    setAmount("");
    setPaymentMethod("Cash");
  };

  const handlePay = async () => {
    if (!selected) return;

    const paymentAmount = Number(amount || 0);
    const balance = Number(selected.amount || 0);

    if (paymentAmount <= 0) {
      Alert.alert("Invalid Amount", "Amount must be greater than zero.");
      return;
    }

    if (paymentAmount > balance) {
      Alert.alert("Invalid Amount", "Payment cannot exceed remaining balance.");
      return;
    }

    try {
      setSaving(true);

      await api.post(`/utang/${selected.id}/pay`, {
        amount: paymentAmount,
        payment_method: paymentMethod,
      });

      Alert.alert("Success", "Payment recorded successfully.");
      closePayment();
      await fetchUtang();
    } catch (error: any) {
      console.log("Payment error:", error.response?.data || error.message);
      Alert.alert(
        "Payment Failed",
        error.response?.data?.error || "Hindi na-save ang payment."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: "#111827",
            marginBottom: 4,
          }}
        >
          Payments
        </Text>

        <Text style={{ color: "#6B7280", marginBottom: 16 }}>
          Collect partial or full utang payments.
        </Text>

        <View
          style={{
            backgroundColor: "#7F00FF",
            borderRadius: 22,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
            Total Unpaid
          </Text>
          <Text style={{ color: "#FFFFFF", fontSize: 32, fontWeight: "800" }}>
            ₱{totalUnpaid.toLocaleString()}
          </Text>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search customer..."
          placeholderTextColor="#9CA3AF"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 13,
            color: "#111827",
            marginBottom: 14,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        />

        {loading ? (
          <ActivityIndicator color="#7F00FF" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {unpaidRecords.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  padding: 18,
                  borderRadius: 18,
                }}
              >
                <Text style={{ color: "#6B7280", textAlign: "center" }}>
                  No unpaid utang found.
                </Text>
              </View>
            ) : (
              unpaidRecords.map((item) => {
                const overdue = isOverdue(item);

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => openPayment(item)}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 18,
                      padding: 16,
                      marginBottom: 12,
                      borderWidth: 1,
                      borderColor: overdue ? "#FCA5A5" : "#E5E7EB",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 17,
                            fontWeight: "800",
                            color: "#111827",
                          }}
                        >
                          {item.customer_name}
                        </Text>

                        <Text style={{ color: "#6B7280", marginTop: 4 }}>
                          {item.due_label || "No due label"}
                        </Text>

                        <Text style={{ color: "#6B7280", marginTop: 2 }}>
                          Due:{" "}
                          {item.due_date
                            ? new Date(item.due_date).toLocaleDateString()
                            : "No date"}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: overdue ? "#FEE2E2" : "#FEF3C7",
                          borderRadius: 999,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: overdue ? "#DC2626" : "#D97706",
                            fontSize: 12,
                            fontWeight: "800",
                          }}
                        >
                          {overdue ? "Overdue" : "Unpaid"}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "800",
                        color: "#7F00FF",
                      }}
                    >
                      ₱{Number(item.amount || 0).toLocaleString()}
                    </Text>

                    <Text style={{ color: "#6B7280", marginTop: 6 }}>
                      Tap to record payment
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}

        <PaymentModal
          visible={!!selected}
          record={selected}
          amount={amount}
          setAmount={setAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          saving={saving}
          onClose={closePayment}
          onPay={handlePay}
        />
      </View>
    </SafeAreaView>
  );
}

function PaymentModal({
  visible,
  record,
  amount,
  setAmount,
  paymentMethod,
  setPaymentMethod,
  saving,
  onClose,
  onPay,
}: {
  visible: boolean;
  record: UtangRecord | null;
  amount: string;
  setAmount: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  saving: boolean;
  onClose: () => void;
  onPay: () => void;
}) {
  if (!record) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          padding: 18,
        }}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 22,
            padding: 18,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: "#111827",
              marginBottom: 4,
            }}
          >
            Record Payment
          </Text>

          <Text style={{ color: "#6B7280", marginBottom: 16 }}>
            {record.customer_name} · Balance ₱
            {Number(record.amount || 0).toLocaleString()}
          </Text>

          <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>
            Amount
          </Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Payment amount"
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              marginBottom: 14,
              color: "#111827",
            }}
          />

          <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 8 }}>
            Payment Method
          </Text>

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 18 }}>
            {["Cash", "GCash"].map((method) => {
              const active = paymentMethod === method;

              return (
                <TouchableOpacity
                  key={method}
                  onPress={() => setPaymentMethod(method)}
                  style={{
                    flex: 1,
                    borderRadius: 14,
                    paddingVertical: 12,
                    alignItems: "center",
                    backgroundColor: active ? "#7F00FF" : "#F3F4F6",
                  }}
                >
                  <Text
                    style={{
                      color: active ? "#FFFFFF" : "#111827",
                      fontWeight: "800",
                    }}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            disabled={saving}
            onPress={onPay}
            style={{
              backgroundColor: saving ? "#9CA3AF" : "#7F00FF",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>
                Save Payment
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={saving}
            onPress={onClose}
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#111827", fontWeight: "700" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function isOverdue(item: UtangRecord) {
  if (item.is_paid || !item.due_date) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(item.due_date);
  due.setHours(0, 0, 0, 0);

  return due < today;
}
import api from "@/src/axios";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UtangConfirmScreen() {
  const {
    total,
    cart,
    customerId,
    customerName,
    customerPhone,
    totalUtang,
  } = useLocalSearchParams<{
    total?: string;
    cart?: string;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    totalUtang?: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [dueLabel, setDueLabel] = useState("");
  const [dueDate, setDueDate] = useState("");

  const parsedTotal = Number(total ?? 0);
  const parsedExistingUtang = Number(totalUtang ?? 0);
  const updatedUtang = parsedExistingUtang + parsedTotal;
  const parsedCart = cart ? JSON.parse(cart as string) : [];

  const handleConfirmUtang = async () => {
    if (!customerId) {
      Alert.alert("Error", "Customer is required");
      return;
    }

    if (parsedCart.length === 0) {
      Alert.alert("Error", "No items in cart");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customer_id: Number(customerId),
        customer_name: customerName || "Customer",
        total_amount: parsedTotal,
        payment_method: "Utang",
        due_label: dueLabel || "No due label",
        due_date: dueDate || null,
        items: parsedCart.map((item: any) => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
        })),
      };

      console.log("UTANG PAYLOAD:", payload);

      const response = await api.post("/sales", payload);

      router.push({
        pathname: "/receipts/receipt",
        params: {
          amount: parsedTotal.toString(),
          paymentMethod: "Utang",
          customerName: customerName || "Customer",
          saleId: String(response.data.sale.id),
          cart: JSON.stringify(parsedCart),
        },
      });
    } catch (error: any) {
      console.log("UTANG ERROR:", error.response?.data || error.message);
      Alert.alert("Failed", error.response?.data?.error || "Failed to save utang");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={styles.header}>Confirm Utang</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Customer</Text>
          <Text style={styles.title}>{customerName}</Text>
          <Text style={styles.sub}>{customerPhone}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>New Utang</Text>
          <Text style={styles.big}>PHP {parsedTotal.toLocaleString()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Updated Total</Text>
          <Text style={[styles.big, { color: "#7F00FF" }]}>PHP {updatedUtang.toLocaleString()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Due Label</Text>
          <TextInput
            value={dueLabel}
            onChangeText={setDueLabel}
            placeholder="Ex: Due next week"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Due Date (optional)</Text>
          <TextInput
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DD (ex: 2026-05-01)"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text style={{ fontWeight: "700", marginBottom: 10 }}>Items</Text>

          {parsedCart.map((item: any) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Text>{item.name} x{item.qty}</Text>
              <Text>PHP {(item.price * item.qty).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          disabled={loading}
          onPress={handleConfirmUtang}
          style={{
            backgroundColor: loading ? "#9CA3AF" : "#7F00FF",
            borderRadius: 18,
            paddingVertical: 16,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={{ color: "#FFF", fontWeight: "700", fontSize: 16 }}>
              Confirm Utang
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  sub: {
    fontSize: 13,
    color: "#6B7280",
  },
  big: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#111827",
  },
});



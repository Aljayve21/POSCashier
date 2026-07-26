import { CashierBottomNav } from "@/components/CashierBottomNav";
import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Order = {
  id: number;
  customer_id: number | null;
  customer_name: string;
  total_amount: string;
  payment_method: string;
  status: string;
  order_status: string;
  delivery_type: string;
  delivery_address: string | null;
  delivery_fee: string;
  customer_notes: string | null;
  created_at: string;
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  "Awaiting Payment": { color: "#FF6B00", bg: "#FFF3E8" },
  Pending: { color: "#FFB800", bg: "#FFF8E1" },
  Preparing: { color: "#6C00E0", bg: "#F3E8FF" },
  Ready: { color: "#00C48C", bg: "#E8FFF5" },
  Completed: { color: "#00C48C", bg: "#E8FFF5" },
  Cancelled: { color: "#FF4B55", bg: "#FFECEE" },
};

export default function OrdersQueueScreen() {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const result = await api.get("/sales");
      const customerOrders = result.data.filter(
        (s: any) => s.delivery_type || s.order_status
      );
      setOrders(customerOrders);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/sales/${orderId}`, { order_status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatus = (current: string) => {
    const flow: Record<string, string> = {
      Pending: "Preparing",
      Preparing: "Ready",
      Ready: "Completed",
    };
    return flow[current];
  };

  const confirmGcashPayment = async (orderId: number) => {
    setConfirmingId(orderId);
    try {
      await api.post(`/sales/${orderId}/confirm-gcash`);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, order_status: "Pending" } : o
        )
      );
    } catch (err) {
      console.error("Failed to confirm payment");
    } finally {
      setConfirmingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === "All") return true;
    return o.order_status === statusFilter;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const nextStatus = getNextStatus(item.order_status);
    const cfg = statusConfig[item.order_status] || statusConfig.Pending;

    return (
      <View
        style={{
          backgroundColor: theme.bgCard,
          borderRadius: 20,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: "bold", color: theme.textPrimary }}>
              Order #{String(item.id).padStart(5, "0")}
            </Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>
              {item.customer_name || "Walk-in"}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
              {formatDate(item.created_at)}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: cfg.bg,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: cfg.color }}>
              {item.order_status}
            </Text>
          </View>
        </View>

        {item.delivery_type === "delivery" && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8, backgroundColor: theme.bgSubtle, padding: 10, borderRadius: 10 }}>
            <Ionicons name="location" size={14} color={theme.accent} />
            <Text style={{ fontSize: 12, color: theme.textSecondary, flex: 1 }} numberOfLines={2}>
              {item.delivery_address || "No address"}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
          <Ionicons name={item.delivery_type === "delivery" ? "bicycle" : "bag-check"} size={14} color={theme.textMuted} />
          <Text style={{ fontSize: 12, color: theme.textMuted }}>
            {item.delivery_type === "delivery" ? "Delivery" : "Pickup"}
          </Text>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>|</Text>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>{item.payment_method}</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.accent }}>
            ₱{Number(item.total_amount).toFixed(2)}
          </Text>

          {item.order_status === "Awaiting Payment" ? (
            <TouchableOpacity
              style={{
                backgroundColor: confirmingId === item.id ? theme.textMuted : "#FF6B00",
                borderRadius: 12,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onPress={() => confirmGcashPayment(item.id)}
              disabled={confirmingId === item.id}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                {confirmingId === item.id ? "Confirming..." : "Confirm GCash Payment"}
              </Text>
            </TouchableOpacity>
          ) : nextStatus ? (
            <TouchableOpacity
              style={{
                backgroundColor: updatingId === item.id ? theme.textMuted : theme.accent,
                borderRadius: 12,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onPress={() => updateStatus(item.id, nextStatus)}
              disabled={updatingId === item.id}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 14 }}>
                {updatingId === item.id ? "Updating..." : `Mark ${nextStatus}`}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
      <View
        style={{
          paddingTop: 8,
          paddingHorizontal: 20,
          paddingBottom: 12,
          backgroundColor: theme.bgCard,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "bold", color: theme.textPrimary }}>
              Orders Queue
            </Text>
            <Text style={{ fontSize: 13, color: theme.textMuted }}>
              {filteredOrders.length} {statusFilter.toLowerCase()} orders
            </Text>
          </View>
          <TouchableOpacity onPress={fetchOrders}>
            <Ionicons name="refresh" size={24} color={theme.accent} />
          </TouchableOpacity>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["Awaiting Payment", "Pending", "Preparing", "Ready", "Completed", "All"]}
          keyExtractor={(item) => item}
          renderItem={({ item: status }) => (
            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === status ? theme.accent : theme.bgSubtle,
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 8,
              }}
              onPress={() => setStatusFilter(status)}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: statusFilter === status ? "#fff" : theme.textSecondary,
                }}
              >
                {status}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          renderItem={renderOrder}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchOrders(); }}
              colors={[theme.accent]}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="checkmark-done-circle" size={60} color={theme.textMuted} />
              <Text style={{ fontSize: 16, color: theme.textMuted, marginTop: 12 }}>
                No {statusFilter.toLowerCase()} orders
              </Text>
            </View>
          }
        />
      )}

      <CashierBottomNav activeRoute="/orders/orders" />
    </SafeAreaView>
  );
}

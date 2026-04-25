import api from "@/src/axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Customer = {
  id: number;
  name: string;
  phone?: string;
  total_transactions?: number;
  total_utang?: number;
};

export default function UtangCustomerScreen() {
  const { total, cart } = useLocalSearchParams<{
    total?: string;
    cart?: string;
  }>();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const parsedTotal = Number(total ?? 0);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
    } catch (error: any) {
      console.log("Customers error:", error.response?.data || error.message);
      Alert.alert("Error", "Hindi ma-load ang customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return customers;

    return customers.filter((customer) => {
      const name = customer.name || "";
      const phone = customer.phone || "";

      return (
        name.toLowerCase().includes(keyword) ||
        phone.toLowerCase().includes(keyword)
      );
    });
  }, [customers, search]);

  const handleSelectCustomer = (customer: Customer) => {
    router.push({
      pathname: "/utang/utang-confirm",
      params: {
        total: parsedTotal.toString(),
        cart: cart?.toString() ?? "[]",
        customerId: customer.id.toString(),
        customerName: customer.name,
        customerPhone: customer.phone || "",
        totalUtang: Number(customer.total_utang || 0).toString(),
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 8,
          }}
        >
          Select Customer
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#6B7280",
            marginBottom: 16,
          }}
        >
          Choose a customer for this utang transaction.
        </Text>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            paddingHorizontal: 14,
            paddingVertical: 4,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search customer name or phone"
            placeholderTextColor="#9CA3AF"
            style={{
              height: 48,
              fontSize: 15,
              color: "#111827",
            }}
          />
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: "#6B7280",
              marginBottom: 6,
            }}
          >
            Utang Amount
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: "#111827",
            }}
          >
            ₱{parsedTotal.toLocaleString()}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator color="#7F00FF" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredCustomers.length === 0 ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  padding: 18,
                }}
              >
                <Text style={{ color: "#6B7280" }}>No customer found.</Text>
              </View>
            ) : (
              filteredCustomers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  onPress={() => handleSelectCustomer(customer)}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 18,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "700",
                      color: "#111827",
                      marginBottom: 6,
                    }}
                  >
                    {customer.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      marginBottom: 4,
                    }}
                  >
                    Phone: {customer.phone || "N/A"}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      marginBottom: 4,
                    }}
                  >
                    Transactions: {customer.total_transactions || 0}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#7F00FF",
                    }}
                  >
                    Current Utang: ₱
                    {Number(customer.total_utang || 0).toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
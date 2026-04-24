import { customers } from "@/data/mockData";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";


export default function UtangCustomerScreen() {
    const { total } = useLocalSearchParams<{ total?: string }>();
    const [search, setSearch] = useState("");

    const parsedTotal = Number(total ?? 0);

    const filteredCustomers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return customers;

        return customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(keyword) ||
                customer.phone.includes(keyword)
        );
    }, [search]);

    const handleSelectCustomer = (customer: (typeof customers)[0]) => {
        router.push({
            pathname: "/utang/utang-confirm",
            params: {
                total: parsedTotal.toString(),
                customerId: customer.id.toString(),
                customerName: customer.name,
                customerPhone: customer.phone,
                totalUtang: customer.total_utang.toString(),
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
                                    Phone: {customer.phone}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        marginBottom: 4,
                                    }}
                                >
                                    Transactions: {customer.total_transactions}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: "#7F00FF",
                                    }}
                                >
                                    Current Utang: ₱{customer.total_utang.toLocaleString()}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
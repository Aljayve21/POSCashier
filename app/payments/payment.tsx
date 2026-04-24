import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

const paymentMethods = ["Cash", "GCash", "Utang"];

export default function PaymentScreen() {
    const { total, cart } = useLocalSearchParams<{
        total?: string;
        cart?: string;
    }>();

    const [selectedMethod, setSelectedMethod] = useState("Cash");

    const parsedTotal = Number(total ?? 0);
    const parsedCart = cart ? JSON.parse(cart) : [];

    const handleCompletePayment = () => {
        if (selectedMethod === "Utang") {
            router.push({
                pathname: "/utang/utang-customer",
                params: {
                    total: parsedTotal.toString(),
                    cart: JSON.stringify(parsedCart),
                },
            });
            return;
        }

        router.replace({
            pathname: "/receipts/receipt",
            params: {
                amount: parsedTotal.toString(),
                paymentMethod: selectedMethod,
                cart: JSON.stringify(parsedCart),
            },
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View style={{ flex: 1, padding: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: "700", color: "#111827", marginBottom: 20 }}>
                    Payment
                </Text>

                <View style={{ backgroundColor: "#FFFFFF", borderRadius: 20, padding: 18, marginBottom: 18 }}>
                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
                        Total Amount
                    </Text>
                    <Text style={{ fontSize: 32, fontWeight: "700", color: "#111827" }}>
                        ₱{parsedTotal.toLocaleString()}
                    </Text>
                </View>

                <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 12 }}>
                    Select Payment Method
                </Text>

                {paymentMethods.map((method) => {
                    const isActive = selectedMethod === method;

                    return (
                        <TouchableOpacity
                            key={method}
                            onPress={() => setSelectedMethod(method)}
                            style={{
                                backgroundColor: isActive ? "#7F00FF" : "#FFFFFF",
                                borderRadius: 18,
                                paddingVertical: 18,
                                paddingHorizontal: 16,
                                marginBottom: 12,
                                borderWidth: 1,
                                borderColor: isActive ? "#7F00FF" : "#E5E7EB",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: isActive ? "#FFFFFF" : "#111827",
                                }}
                            >
                                {method}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                <View style={{ marginTop: "auto" }}>
                    <TouchableOpacity
                        onPress={handleCompletePayment}
                        style={{
                            backgroundColor: "#7F00FF",
                            borderRadius: 18,
                            paddingVertical: 16,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                            Complete Payment
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
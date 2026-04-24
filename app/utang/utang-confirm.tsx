import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function UtangConfirmScreen() {
    const {
        total,
        customerId,
        customerName,
        customerPhone,
        totalUtang,
    } = useLocalSearchParams<{
        total?: string;
        customerId?: string;
        customerName?: string;
        customerPhone?: string;
        totalUtang?: string;
    }>();

    const parsedTotal = Number(total ?? 0);
    const parsedExistingUtang = Number(totalUtang ?? 0);
    const updatedUtang = parsedExistingUtang + parsedTotal;

    const handleConfirmUtang = () => {
        console.log("Utang saved", {
            customerId,
            customerName,
            amount: parsedTotal,
            updatedTotalUtang: updatedUtang,
        });

        router.replace({
            pathname: "/receipts/receipt",
            params: {
                amount: parsedTotal.toString(),
                paymentMethod: "Utang",
                customerName: customerName,
            }
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
                        marginBottom: 16,
                    }}
                >
                    Confirm Utang
                </Text>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 20,
                        padding: 18,
                        marginBottom: 14,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: "#6B7280",
                            marginBottom: 6,
                        }}
                    >
                        Customer
                    </Text>
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: 6,
                        }}
                    >
                        {customerName}
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: "#6B7280",
                        }}
                    >
                        {customerPhone}
                    </Text>
                </View>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 20,
                        padding: 18,
                        marginBottom: 14,
                    }}
                >
                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 6 }}>
                        New Utang Amount
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: "700", color: "#111827" }}>
                        ₱{parsedTotal.toLocaleString()}
                    </Text>
                </View>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 20,
                        padding: 18,
                        marginBottom: 18,
                    }}
                >
                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
                        Existing Utang
                    </Text>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: 14,
                        }}
                    >
                        ₱{parsedExistingUtang.toLocaleString()}
                    </Text>

                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
                        Updated Total Utang
                    </Text>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            color: "#7F00FF",
                        }}
                    >
                        ₱{updatedUtang.toLocaleString()}
                    </Text>
                </View>

                <View style={{ marginTop: "auto" }}>
                    <TouchableOpacity
                        onPress={handleConfirmUtang}
                        style={{
                            backgroundColor: "#7F00FF",
                            borderRadius: 18,
                            paddingVertical: 16,
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontSize: 18,
                                fontWeight: "700",
                            }}
                        >
                            Confirm Utang
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 18,
                            paddingVertical: 16,
                            alignItems: "center",
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                        }}
                    >
                        <Text
                            style={{
                                color: "#111827",
                                fontSize: 16,
                                fontWeight: "600",
                            }}
                        >
                            Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
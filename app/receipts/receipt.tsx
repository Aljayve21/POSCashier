import { useBusiness } from "@/context/BusinessContext";
import { exportReceiptPdf } from "@/utils/receiptPdf";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type CartItem = {
    id?: number;
    name: string;
    price: number;
    qty: number;
};

export default function ReceiptScreen() {
    const { settings } = useBusiness();
    const { amount, paymentMethod, customerName, cart, saleId } = useLocalSearchParams<{
        amount?: string;
        paymentMethod?: string;
        customerName?: string;
        cart?: string;
        saleId?: string;
    }>();

    const parsedAmount = Number(amount ?? 0);
    const parsedCart = useMemo(() => {
        try {
            const rawCart = Array.isArray(cart) ? cart[0] : cart;
            return rawCart ? (JSON.parse(rawCart) as CartItem[]) : [];
        } catch (error) {
            console.log("Receipt cart parse error", error);
            return [];
        }
    }, [cart]);

    const safeCustomerName = Array.isArray(customerName) ? customerName[0] : customerName;
    const safeSaleId = Array.isArray(saleId) ? saleId[0] : saleId;
    const dateNow = new Date().toLocaleString();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 24,
                        padding: 24,
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "800",
                            color: "#111827",
                            marginBottom: 4,
                            textAlign: "center",
                        }}
                    >
                        {settings.business_name || "Riead Store POS"}
                    </Text>

                    <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 12 }}>
                        Official Receipt
                    </Text>

                    <Text style={{ fontSize: 48, marginBottom: 10 }}>OK</Text>

                    <Text style={{ fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 6 }}>
                        Payment Successful
                    </Text>

                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
                        Transaction completed successfully
                    </Text>

                    <Text style={{ fontSize: 30, fontWeight: "700", color: "#7F00FF", marginBottom: 20 }}>
                        PHP {parsedAmount.toLocaleString()}
                    </Text>

                    <View style={{ width: "100%" }}>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ color: "#6B7280" }}>Payment Method</Text>
                            <Text style={{ fontWeight: "600" }}>{paymentMethod ?? "Unknown"}</Text>
                        </View>

                        {safeSaleId && (
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ color: "#6B7280" }}>Sale ID</Text>
                                <Text style={{ fontWeight: "600" }}>#{safeSaleId}</Text>
                            </View>
                        )}

                        {safeCustomerName && (
                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ color: "#6B7280" }}>Customer</Text>
                                <Text style={{ fontWeight: "600" }}>{safeCustomerName}</Text>
                            </View>
                        )}

                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ color: "#6B7280" }}>Date</Text>
                            <Text style={{ fontWeight: "600" }}>{dateNow}</Text>
                        </View>
                    </View>

                    <View
                        style={{
                            width: "100%",
                            marginTop: 12,
                            borderTopWidth: 1,
                            borderTopColor: "#E5E7EB",
                            paddingTop: 14,
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 10 }}>
                            Items
                        </Text>

                        {parsedCart.length === 0 ? (
                            <Text style={{ color: "#6B7280" }}>No item details available.</Text>
                        ) : (
                            parsedCart.map((item, index) => (
                                <View
                                    key={`${item.name}-${index}`}
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text style={{ color: "#374151", flex: 1 }}>
                                        {item.name} x{item.qty}
                                    </Text>
                                    <Text style={{ fontWeight: "600", color: "#111827" }}>
                                        PHP {(item.price * item.qty).toLocaleString()}
                                    </Text>
                                </View>
                            ))
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={async () => {
                            try {
                                await exportReceiptPdf({
                                    amount: parsedAmount,
                                    paymentMethod: paymentMethod ?? "Unknown",
                                    customerName: safeCustomerName,
                                    businessName: settings.business_name || "Riead Store POS",
                                    transactionId: safeSaleId ? `SALE-${safeSaleId}` : `TXN-${Date.now()}`,
                                    items: parsedCart,
                                });
                            } catch (error) {
                                console.log("PDF export error", error);
                            }
                        }}
                        style={{
                            marginTop: 18,
                            backgroundColor: "#FFFFFF",
                            paddingVertical: 14,
                            paddingHorizontal: 30,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                        }}
                    >
                        <Text style={{ color: "#111827", fontWeight: "600" }}>
                            Export as PDF
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.replace("/dashboard/cashier-dashboard")}
                        style={{
                            marginTop: 12,
                            backgroundColor: "#7F00FF",
                            paddingVertical: 14,
                            paddingHorizontal: 30,
                            borderRadius: 16,
                        }}
                    >
                        <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
                            Back to Dashboard
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


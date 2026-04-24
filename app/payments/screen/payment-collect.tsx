import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const paymentMethods = ["Cash", "GCash"];

export default function PaymentCollectScreen() {
    const { utangId, customerName, amount, dueLabel, saleId } =
        useLocalSearchParams<{
            utangId?: string;
            customerName?: string;
            amount?: string;
            dueLabel?: string;
            saleId?: string;
        }>();

    const originalAmount = Number(amount ?? 0);
    const [paymentAmount, setPaymentAmount] = useState(String(originalAmount));
    const [selectedMethod, setSelectedMethod] = useState("Cash");

    const numericPaymentAmount = Number(paymentAmount || 0);

    const remainingBalance = useMemo(() => {
        const remaining = originalAmount - numericPaymentAmount;
        return remaining < 0 ? 0 : remaining;
    }, [originalAmount, numericPaymentAmount]);

    const isFullPayment = numericPaymentAmount >= originalAmount;

    const handleConfirmCollection = () => {
        console.log("Payment collected", {
            utangId,
            customerName,
            saleId,
            originalAmount,
            paymentAmount: numericPaymentAmount,
            paymentMethod: selectedMethod,
            remainingBalance,
            status: isFullPayment ? "Paid" : "Partially Paid",
        });

        router.replace({
            pathname: "/receipts/receipt",
            params: {
                amount: numericPaymentAmount.toString(),
                paymentMethod: selectedMethod,
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
                    Collect Payment
                </Text>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 20,
                        padding: 18,
                        marginBottom: 14,
                    }}
                >
                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 6 }}>
                        Customer
                    </Text>
                    <Text
                        style={{
                            fontSize: 22,
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: 10,
                        }}
                    >
                        {customerName}
                    </Text>

                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 4 }}>
                        Sale ID: #{saleId}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#F59E0B", fontWeight: "600" }}>
                        {dueLabel}
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
                        Current Balance
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: "700", color: "#111827" }}>
                        ₱{originalAmount.toLocaleString()}
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
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: 12,
                        }}
                    >
                        Payment Amount
                    </Text>

                    <TextInput
                        value={paymentAmount}
                        onChangeText={setPaymentAmount}
                        keyboardType="numeric"
                        placeholder="Enter payment amount"
                        placeholderTextColor="#9CA3AF"
                        style={{
                            height: 54,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            borderRadius: 16,
                            paddingHorizontal: 16,
                            fontSize: 16,
                            color: "#111827",
                            backgroundColor: "#FAFAFA",
                            marginBottom: 14,
                        }}
                    />

                    <Text
                        style={{
                            fontSize: 14,
                            color: "#6B7280",
                            marginBottom: 8,
                        }}
                    >
                        Payment Method
                    </Text>

                    {paymentMethods.map((method) => {
                        const isActive = selectedMethod === method;

                        return (
                            <TouchableOpacity
                                key={method}
                                onPress={() => setSelectedMethod(method)}
                                style={{
                                    backgroundColor: isActive ? "#7F00FF" : "#FFFFFF",
                                    borderRadius: 16,
                                    paddingVertical: 14,
                                    paddingHorizontal: 14,
                                    marginBottom: 10,
                                    borderWidth: 1,
                                    borderColor: isActive ? "#7F00FF" : "#E5E7EB",
                                }}
                            >
                                <Text
                                    style={{
                                        color: isActive ? "#FFFFFF" : "#111827",
                                        fontSize: 15,
                                        fontWeight: "600",
                                    }}
                                >
                                    {method}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 20,
                        padding: 18,
                        marginBottom: 18,
                    }}
                >
                    <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 6 }}>
                        Remaining Balance
                    </Text>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            color: remainingBalance === 0 ? "#10B981" : "#111827",
                            marginBottom: 8,
                        }}
                    >
                        ₱{remainingBalance.toLocaleString()}
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: isFullPayment ? "#10B981" : "#F59E0B",
                        }}
                    >
                        {isFullPayment ? "Fully Paid" : "Partial Payment"}
                    </Text>
                </View>

                <View style={{ marginTop: "auto" }}>
                    <TouchableOpacity
                        onPress={handleConfirmCollection}
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
                            Confirm Payment
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
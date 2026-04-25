import api from "@/src/axios";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const [saving, setSaving] = useState(false);

    const numericPaymentAmount = Number(paymentAmount || 0);

    const remainingBalance = useMemo(() => {
        const remaining = originalAmount - numericPaymentAmount;
        return remaining < 0 ? 0 : remaining;
    }, [originalAmount, numericPaymentAmount]);

    const isFullPayment = numericPaymentAmount >= originalAmount;

    const handleConfirmCollection = async () => {
        if (!utangId) {
            Alert.alert("Missing Record", "Walang utang record na napili.");
            return;
        }

        if (numericPaymentAmount <= 0) {
            Alert.alert("Invalid Amount", "Amount must be greater than zero.");
            return;
        }

        if (numericPaymentAmount > originalAmount) {
            Alert.alert("Invalid Amount", "Payment cannot exceed current balance.");
            return;
        }

        try {
            setSaving(true);

            await api.post(`/utang/${utangId}/pay`, {
                amount: numericPaymentAmount,
                payment_method: selectedMethod,
            });

            router.replace({
                pathname: "/receipts/receipt",
                params: {
                    amount: numericPaymentAmount.toString(),
                    paymentMethod: selectedMethod,
                    customerName: customerName,
                }
            });
        } catch (error: any) {
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
                        disabled={saving}
                        onPress={handleConfirmCollection}
                        style={{
                            backgroundColor: saving ? "#9CA3AF" : "#7F00FF",
                            borderRadius: 18,
                            paddingVertical: 16,
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text
                                style={{
                                    color: "#FFFFFF",
                                    fontSize: 18,
                                    fontWeight: "700",
                                }}
                            >
                                Confirm Payment
                            </Text>
                        )}
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


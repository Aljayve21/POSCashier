import { businessSettings, transactionHistory } from "@/data/mockData";
import { exportReceiptPdf } from "@/utils/receiptPdf";
import { useMemo, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";


const filters = ["All", "Completed", "Pending", "Cancelled"];

export default function TransactionHistoryScreen() {
    const [selectedFilter, setSelectedFilter] = useState("All");

    const filteredData = useMemo(() => {
        if (selectedFilter === "All") return transactionHistory;

        return transactionHistory.filter(
            (item) => item.status === selectedFilter
        );
    }, [selectedFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "#10B981"; // green
            case "Pending":
                return "#F59E0B"; // orange
            case "Cancelled":
                return "#EF4444"; // red
            default:
                return "#6B7280";
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
                        marginBottom: 12,
                    }}
                >
                    Transactions
                </Text>

                {/* FILTER TABS */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 16 }}
                >
                    {filters.map((filter) => {
                        const isActive = selectedFilter === filter;

                        return (
                            <TouchableOpacity
                                onPress={async () => {
                                    await exportReceiptPdf({
                                        amount: parsedAmount,
                                        paymentMethod: paymentMethod ?? "Unknown",
                                        customerName,
                                        businessName: businessSettings.business_name,
                                        transactionId: `TXN-${Date.now()}`,
                                    });
                                }}
                                style={{
                                    marginTop: 12,
                                    backgroundColor: "#FFFFFF",
                                    paddingVertical: 14,
                                    paddingHorizontal: 30,
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                }}
                            >
                                <Text style={{ color: "#111827", fontWeight: "600" }}>
                                    Export Receipt PDF
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* LIST */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredData.length === 0 ? (
                        <View
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 18,
                                padding: 16,
                            }}
                        >
                            <Text style={{ color: "#6B7280" }}>
                                No transactions found.
                            </Text>
                        </View>
                    ) : (
                        filteredData.map((item) => (
                            <View
                                key={item.id}
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 18,
                                    padding: 16,
                                    marginBottom: 12,
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginBottom: 6,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "700",
                                            color: "#111827",
                                        }}
                                    >
                                        {item.customer_name}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: "600",
                                            color: getStatusColor(item.status),
                                        }}
                                    >
                                        {item.status}
                                    </Text>
                                </View>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        marginBottom: 4,
                                    }}
                                >
                                    Payment: {item.payment_method}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        marginBottom: 6,
                                    }}
                                >
                                    {item.created_at}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "700",
                                        color: "#7F00FF",
                                    }}
                                >
                                    ₱{item.amount.toLocaleString()}
                                </Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
import { transactionHistory } from "@/data/mockData";
import { exportPdf } from "@/utils/receiptPdf";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import {
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const statusFilters = ["All", "Completed", "Pending", "Cancelled"];
const rowsPerPage = 5;

function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
}

export default function TransactionHistoryScreen() {
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [page, setPage] = useState(1);

    const dateFilter = selectedDate ? formatDate(selectedDate) : "";

    const filteredData = useMemo(() => {
        let data = transactionHistory;

        if (selectedStatus !== "All") {
            data = data.filter((item) => item.status === selectedStatus);
        }

        if (dateFilter) {
            data = data.filter((item) => item.created_at.includes(dateFilter));
        }

        return data;
    }, [selectedStatus, dateFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page]);

    const handlePickDate = (_event: any, date?: Date) => {
        if (Platform.OS === "android") {
            setShowPicker(false);
        }

        if (date) {
            setSelectedDate(date);
            setPage(1);
        }
    };

    const clearDateFilter = () => {
        setSelectedDate(null);
        setPage(1);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
                return "#10B981";
            case "Pending":
                return "#F59E0B";
            case "Cancelled":
                return "#EF4444";
            default:
                return "#6B7280";
        }
    };

    const handleExportTransactions = async () => {
        const rows = filteredData
            .map(
                (item) => `
          <tr>
            <td>${item.created_at}</td>
            <td>${item.customer_name}</td>
            <td>${item.payment_method}</td>
            <td>${item.status}</td>
            <td>₱${item.amount.toLocaleString()}</td>
          </tr>
        `
            )
            .join("");

        await exportPdf({
            title: "Transaction History",
            htmlBody: `
        <p><strong>Status Filter:</strong> ${selectedStatus}</p>
        <p><strong>Date Filter:</strong> ${dateFilter || "All Dates"}</p>
        <p><strong>Total Records:</strong> ${filteredData.length}</p>

        <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse; font-size:12px;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th>Date</th>
              <th>Customer</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rows ||
                `<tr><td colspan="5" style="text-align:center;">No transactions found.</td></tr>`
                }
          </tbody>
        </table>
      `,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: 32,
                }}
            >
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

                <TouchableOpacity
                    onPress={handleExportTransactions}
                    style={{
                        backgroundColor: "#7F00FF",
                        borderRadius: 14,
                        paddingVertical: 12,
                        alignItems: "center",
                        marginBottom: 12,
                    }}
                >
                    <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                        Export Transactions PDF
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", marginBottom: 12 }}>
                    <TouchableOpacity
                        onPress={() => setShowPicker(true)}
                        style={{
                            flex: 1,
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            paddingVertical: 14,
                            paddingHorizontal: 14,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            marginRight: 8,
                        }}
                    >
                        <Text style={{ color: selectedDate ? "#111827" : "#9CA3AF" }}>
                            {selectedDate ? dateFilter : "Select date"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={clearDateFilter}
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 16,
                            paddingVertical: 14,
                            paddingHorizontal: 18,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                        }}
                    >
                        <Text style={{ color: "#EF4444", fontWeight: "700" }}>Clear</Text>
                    </TouchableOpacity>
                </View>

                {showPicker && (
                    <DateTimePicker
                        value={selectedDate ?? new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handlePickDate}
                    />
                )}

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingRight: 8,
                        alignItems: "center",
                    }}
                    style={{ marginBottom: 12 }}
                >
                    {statusFilters.map((status) => {
                        const isActive = selectedStatus === status;

                        return (
                            <TouchableOpacity
                                key={status}
                                onPress={() => {
                                    setSelectedStatus(status);
                                    setPage(1);
                                }}
                                style={{
                                    paddingVertical: 6,
                                    paddingHorizontal: 12,
                                    borderRadius: 16,
                                    backgroundColor: isActive ? "#7F00FF" : "#FFFFFF",
                                    marginRight: 6,
                                    borderWidth: 1,
                                    borderColor: isActive ? "#7F00FF" : "#E5E7EB",
                                }}
                            >
                                <Text
                                    style={{
                                        color: isActive ? "#FFFFFF" : "#111827",
                                        fontWeight: "600",
                                        fontSize: 13,
                                    }}
                                >
                                    {status}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 18,
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                        marginTop: 4,
                    }}
                >
                    <ScrollView horizontal showsHorizontalScrollIndicator>
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    backgroundColor: "#F9FAFB",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#E5E7EB",
                                }}
                            >
                                <TableHeader width={120} label="Date" />
                                <TableHeader width={150} label="Customer" />
                                <TableHeader width={100} label="Payment" />
                                <TableHeader width={110} label="Status" />
                                <TableHeader width={100} label="Amount" />
                            </View>

                            {paginatedData.length === 0 ? (
                                <View style={{ padding: 16, width: 580 }}>
                                    <Text style={{ color: "#6B7280" }}>
                                        No transactions found.
                                    </Text>
                                </View>
                            ) : (
                                paginatedData.map((item) => (
                                    <View
                                        key={item.id}
                                        style={{
                                            flexDirection: "row",
                                            borderBottomWidth: 1,
                                            borderBottomColor: "#F3F4F6",
                                        }}
                                    >
                                        <TableCell width={120} text={item.created_at} />
                                        <TableCell width={150} text={item.customer_name} />
                                        <TableCell width={100} text={item.payment_method} />

                                        <View
                                            style={{
                                                width: 110,
                                                padding: 12,
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: getStatusColor(item.status),
                                                    fontWeight: "700",
                                                    fontSize: 13,
                                                }}
                                            >
                                                {item.status}
                                            </Text>
                                        </View>

                                        <TableCell
                                            width={100}
                                            text={`₱${item.amount.toLocaleString()}`}
                                            bold
                                        />
                                    </View>
                                ))
                            )}
                        </View>
                    </ScrollView>
                </View>

                <View
                    style={{
                        marginTop: 14,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        disabled={page === 1}
                        onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 14,
                            backgroundColor: page === 1 ? "#E5E7EB" : "#7F00FF",
                        }}
                    >
                        <Text
                            style={{
                                color: page === 1 ? "#6B7280" : "#FFFFFF",
                                fontWeight: "700",
                            }}
                        >
                            Prev
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ color: "#111827", fontWeight: "600" }}>
                        Page {page} of {totalPages}
                    </Text>

                    <TouchableOpacity
                        disabled={page === totalPages}
                        onPress={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        style={{
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 14,
                            backgroundColor: page === totalPages ? "#E5E7EB" : "#7F00FF",
                        }}
                    >
                        <Text
                            style={{
                                color: page === totalPages ? "#6B7280" : "#FFFFFF",
                                fontWeight: "700",
                            }}
                        >
                            Next
                        </Text>
                    </TouchableOpacity>
                </View>

                <Text style={{ marginTop: 10, color: "#6B7280", fontSize: 13 }}>
                    Showing {paginatedData.length} of {filteredData.length} transactions
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function TableHeader({ label, width }: { label: string; width: number }) {
    return (
        <View style={{ width, padding: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#374151" }}>
                {label}
            </Text>
        </View>
    );
}

function TableCell({
    text,
    width,
    bold,
}: {
    text: string;
    width: number;
    bold?: boolean;
}) {
    return (
        <View style={{ width, padding: 12, justifyContent: "center" }}>
            <Text
                numberOfLines={2}
                style={{
                    fontSize: 13,
                    color: "#111827",
                    fontWeight: bold ? "700" : "400",
                }}
            >
                {text}
            </Text>
        </View>
    );
}
import { transactionHistory, utangRecords } from "@/data/mockData";
import { exportPdf } from "@/utils/receiptPdf";

import { useMemo } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ReportsScreen() {
    const summary = useMemo(() => {
        const completed = transactionHistory.filter(
            (item) => item.status === "Completed"
        );

        const cashSales = completed
            .filter((item) => item.payment_method === "Cash")
            .reduce((sum, item) => sum + item.amount, 0);

        const gcashSales = completed
            .filter((item) => item.payment_method === "GCash")
            .reduce((sum, item) => sum + item.amount, 0);

        const utangSales = transactionHistory
            .filter((item) => item.payment_method === "Utang")
            .reduce((sum, item) => sum + item.amount, 0);

        const totalSales = completed.reduce((sum, item) => sum + item.amount, 0);

        const pendingUtang = utangRecords
            .filter((item) => !item.is_paid)
            .reduce((sum, item) => sum + item.amount, 0);

        return {
            totalSales,
            cashSales,
            gcashSales,
            utangSales,
            pendingUtang,
            completedCount: completed.length,
            cancelledCount: transactionHistory.filter(
                (item) => item.status === "Cancelled"
            ).length,
            pendingCount: transactionHistory.filter((item) => item.status === "Pending")
                .length,
            totalTransactions: transactionHistory.length,
        };
    }, []);

    const handleExportReport = async () => {
        await exportPdf({
            title: "Cashier Report",
            htmlBody: `
        <h3>Sales Summary</h3>
        <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
          <tr><td><strong>Total Completed Sales</strong></td><td>₱${summary.totalSales.toLocaleString()}</td></tr>
          <tr><td><strong>Cash Sales</strong></td><td>₱${summary.cashSales.toLocaleString()}</td></tr>
          <tr><td><strong>GCash Sales</strong></td><td>₱${summary.gcashSales.toLocaleString()}</td></tr>
          <tr><td><strong>Utang Sales</strong></td><td>₱${summary.utangSales.toLocaleString()}</td></tr>
          <tr><td><strong>Pending Utang</strong></td><td>₱${summary.pendingUtang.toLocaleString()}</td></tr>
        </table>

        <h3>Transaction Counts</h3>
        <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse;">
          <tr><td><strong>Total Transactions</strong></td><td>${summary.totalTransactions}</td></tr>
          <tr><td><strong>Completed</strong></td><td>${summary.completedCount}</td></tr>
          <tr><td><strong>Pending</strong></td><td>${summary.pendingCount}</td></tr>
          <tr><td><strong>Cancelled</strong></td><td>${summary.cancelledCount}</td></tr>
        </table>
      `,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: 6,
                    }}
                >
                    Reports
                </Text>

                <Text style={{ color: "#6B7280", marginBottom: 16 }}>
                    Basic cashier report summary
                </Text>

                <TouchableOpacity
                    onPress={handleExportReport}
                    style={{
                        backgroundColor: "#7F00FF",
                        borderRadius: 14,
                        paddingVertical: 12,
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>
                        Export Report PDF
                    </Text>
                </TouchableOpacity>

                <View
                    style={{
                        backgroundColor: "#7F00FF",
                        borderRadius: 22,
                        padding: 18,
                        marginBottom: 16,
                    }}
                >
                    <Text style={{ color: "#E9D5FF", marginBottom: 8 }}>
                        Total Completed Sales
                    </Text>
                    <Text style={{ color: "#FFFFFF", fontSize: 32, fontWeight: "700" }}>
                        ₱{summary.totalSales.toLocaleString()}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                    }}
                >
                    <ReportCard title="Cash Sales" value={`₱${summary.cashSales.toLocaleString()}`} />
                    <ReportCard title="GCash Sales" value={`₱${summary.gcashSales.toLocaleString()}`} />
                    <ReportCard title="Utang Sales" value={`₱${summary.utangSales.toLocaleString()}`} />
                    <ReportCard title="Pending Utang" value={`₱${summary.pendingUtang.toLocaleString()}`} />
                    <ReportCard title="Transactions" value={summary.totalTransactions.toString()} />
                    <ReportCard title="Completed" value={summary.completedCount.toString()} />
                    <ReportCard title="Pending" value={summary.pendingCount.toString()} />
                    <ReportCard title="Cancelled" value={summary.cancelledCount.toString()} />
                </View>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 20,
                        padding: 16,
                        marginTop: 8,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: 12,
                        }}
                    >
                        Payment Breakdown
                    </Text>

                    <BreakdownRow label="Cash" value={summary.cashSales} total={summary.totalSales} />
                    <BreakdownRow label="GCash" value={summary.gcashSales} total={summary.totalSales} />
                    <BreakdownRow
                        label="Utang"
                        value={summary.utangSales}
                        total={summary.totalSales + summary.utangSales}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function ReportCard({ title, value }: { title: string; value: string }) {
    return (
        <View
            style={{
                width: "48%",
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
            }}
        >
            <Text style={{ color: "#6B7280", fontSize: 13, marginBottom: 8 }}>
                {title}
            </Text>
            <Text style={{ color: "#111827", fontSize: 20, fontWeight: "700" }}>
                {value}
            </Text>
        </View>
    );
}

function BreakdownRow({
    label,
    value,
    total,
}: {
    label: string;
    value: number;
    total: number;
}) {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;

    return (
        <View style={{ marginBottom: 14 }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                }}
            >
                <Text style={{ color: "#374151", fontWeight: "600" }}>{label}</Text>
                <Text style={{ color: "#111827", fontWeight: "700" }}>
                    ₱{value.toLocaleString()} · {percent}%
                </Text>
            </View>

            <View
                style={{
                    height: 8,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 999,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        height: 8,
                        width: `${percent}%`,
                        backgroundColor: "#7F00FF",
                        borderRadius: 999,
                    }}
                />
            </View>
        </View>
    );
}
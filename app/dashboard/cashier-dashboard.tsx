import { businessSettings, cashierUser, dashboardSummary, promoCards, quickActions } from "@/data/mockData";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";


export default function CashierDashboardScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 110,
                }}
            >
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 22,
                        padding: 16,
                        marginBottom: 18,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 22,
                                    backgroundColor: "#E5E7EB",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 12,
                                }}
                            >
                                <Text style={{ fontSize: 18 }}>👤</Text>
                            </View>

                            <View>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "700",
                                        color: "#111827",
                                    }}
                                >
                                    {businessSettings.business_name}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#9CA3AF",
                                        marginTop: 2,
                                    }}
                                >
                                    Cashier Workspace
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                backgroundColor: "#F3F4F6",
                                borderRadius: 12,
                                paddingVertical: 10,
                                paddingHorizontal: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "700",
                                    color: "#374151",
                                }}
                            >
                                ₱ {dashboardSummary.walletBalance}
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: "#7F00FF",
                        borderRadius: 22,
                        padding: 18,
                        marginBottom: 18,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 13,
                            color: "#E9D5FF",
                            marginBottom: 6,
                        }}
                    >
                        Logged in as
                    </Text>

                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            color: "#FFFFFF",
                            marginBottom: 14,
                        }}
                    >
                        {cashierUser.name}
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View>
                            <Text style={{ color: "#E9D5FF", fontSize: 12 }}>Today Sales</Text>
                            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                                ₱{dashboardSummary.todaySales.toLocaleString()}
                            </Text>
                        </View>

                        <View>
                            <Text style={{ color: "#E9D5FF", fontSize: 12 }}>Transactions</Text>
                            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                                {dashboardSummary.totalTransactions}
                            </Text>
                        </View>

                        <View>
                            <Text style={{ color: "#E9D5FF", fontSize: 12 }}>Utang</Text>
                            <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                                ₱{dashboardSummary.pendingUtang.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 22,
                        padding: 16,
                        marginBottom: 18,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: 14,
                        }}
                    >
                        Quick Access
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        {quickActions.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    if (item.title === "Products") {
                                        router.push("/products/products");
                                    } else if (item.title === "Inventory") {
                                        router.push("/inventory/inventory");
                                    } else if (item.title === "Customers") {
                                        router.push("/customers/customers");
                                    } else if (item.title === "Utang") {
                                        router.push("/payments/payment");
                                    } else if (item.title === "Reports") {
                                        router.push("/reports/reports");
                                    }
                                }}
                                style={{
                                    width: "31%",
                                    alignItems: "center",
                                    marginBottom: 18,
                                }}
                            >
                                <View
                                    style={{
                                        width: 58,
                                        height: 58,
                                        borderRadius: 18,
                                        backgroundColor: "#F9FAFB",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 8,
                                        borderWidth: 1,
                                        borderColor: "#F3F4F6",
                                    }}
                                >
                                    <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                                </View>

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#111827",
                                        textAlign: "center",
                                        fontWeight: "500",
                                    }}
                                >
                                    {item.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: "#E5E7EB",
                        paddingTop: 16,
                        marginBottom: 12,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "700",
                            color: "#111827",
                            marginBottom: 14,
                        }}
                    >
                        Updates
                    </Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {promoCards.map((card) => (
                            <View
                                key={card.id}
                                style={{
                                    width: 250,
                                    borderRadius: 18,
                                    backgroundColor: card.color,
                                    padding: 18,
                                    marginRight: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 22,
                                        marginBottom: 18,
                                    }}
                                >
                                    📣
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "700",
                                        color: "#FFFFFF",
                                        marginBottom: 8,
                                    }}
                                >
                                    {card.title}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: "#F9FAFB",
                                        lineHeight: 20,
                                    }}
                                >
                                    {card.subtitle}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <View
                style={{
                    position: "absolute",
                    left: 16,
                    right: 16,
                    bottom: 18,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 22,
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 4,
                }}
            >
                <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => router.replace("/dashboard/cashier-dashboard")}
                >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>🏠</Text>
                    <Text style={{ fontSize: 12, color: "#2563EB", fontWeight: "600" }}>
                        Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => router.push("/sales/new-sale")}
                >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>🛒</Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>New Sale</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => router.push("/payments/payment")}
                >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>💵</Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>Payments</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => router.push("/transactions/transactions")}
                >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>🧾</Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ alignItems: "center" }}
                    onPress={() => router.push("/profile/profile")}
                >
                    <Text style={{ fontSize: 22, marginBottom: 4 }}>👤</Text>
                    <Text style={{ fontSize: 12, color: "#6B7280" }}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
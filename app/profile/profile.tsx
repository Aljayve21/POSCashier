import { businessSettings, cashierUser, dashboardSummary } from "@/data/mockData";
import { router } from "expo-router";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            >
                <View
                    style={{
                        backgroundColor: "#7F00FF",
                        borderRadius: 24,
                        padding: 20,
                        marginBottom: 18,
                    }}
                >
                    <View
                        style={{
                            width: 72,
                            height: 72,
                            borderRadius: 36,
                            backgroundColor: "rgba(255,255,255,0.18)",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 14,
                        }}
                    >
                        <Text style={{ fontSize: 30 }}>👤</Text>
                    </View>

                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            color: "#FFFFFF",
                            marginBottom: 4,
                        }}
                    >
                        {cashierUser.name}
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            color: "#E9D5FF",
                            marginBottom: 12,
                        }}
                    >
                        Role: {cashierUser.role}
                    </Text>

                    <Text style={{ fontSize: 14, color: "#F3E8FF" }}>
                        {businessSettings.business_name}
                    </Text>
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
                        Shift Summary
                    </Text>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 12,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "#F9FAFB",
                                borderRadius: 16,
                                padding: 14,
                                marginRight: 8,
                            }}
                        >
                            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>
                                Today Sales
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
                                ₱{dashboardSummary.todaySales.toLocaleString()}
                            </Text>
                        </View>

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "#F9FAFB",
                                borderRadius: 16,
                                padding: 14,
                                marginLeft: 8,
                            }}
                        >
                            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>
                                Transactions
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
                                {dashboardSummary.totalTransactions}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{
                            backgroundColor: "#F9FAFB",
                            borderRadius: 16,
                            padding: 14,
                        }}
                    >
                        <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 6 }}>
                            Pending Utang
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
                            ₱{dashboardSummary.pendingUtang.toLocaleString()}
                        </Text>
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
                            marginBottom: 10,
                        }}
                    >
                        Account
                    </Text>

                    {[
                        "Edit Basic Info",
                        "Change Password",
                        "Printer Setup",
                        "App Version",
                    ].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={{
                                paddingVertical: 14,
                                borderBottomWidth: item === "App Version" ? 0 : 1,
                                borderBottomColor: "#F3F4F6",
                            }}
                            onPress={() => console.log(item)}
                        >
                            <Text style={{ fontSize: 15, color: "#111827", fontWeight: "500" }}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() => router.replace("/auth/login")}
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 18,
                        paddingVertical: 16,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#FECACA",
                    }}
                >
                    <Text
                        style={{
                            color: "#DC2626",
                            fontSize: 16,
                            fontWeight: "700",
                        }}
                    >
                        Logout
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
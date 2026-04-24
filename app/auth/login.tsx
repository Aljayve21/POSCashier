import { router } from "expo-router";
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 24,
                    paddingTop: 20,
                    paddingBottom: 24,
                    justifyContent: "space-between",
                }}
            >
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Image
                        source={require("../../assets/images/onboarding-store.jpg")}
                        resizeMode="contain"
                        style={{
                            width: 220,
                            height: 220,
                            marginBottom: 20,
                        }}
                    />

                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: "700",
                            color: "#1F2937",
                            textAlign: "center",
                            marginBottom: 10,
                        }}
                    >
                        Welcome Back
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            color: "#6B7280",
                            textAlign: "center",
                            lineHeight: 22,
                            paddingHorizontal: 12,
                            maxWidth: 320,
                        }}
                    >
                        Login to continue managing your products, inventory, sales, and customers.
                    </Text>
                </View>

                <View style={{ marginTop: 10 }}>
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: 8,
                        }}
                    >
                        Email
                    </Text>
                    <TextInput
                        placeholder="Enter your email"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{
                            height: 54,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            borderRadius: 16,
                            paddingHorizontal: 16,
                            fontSize: 16,
                            color: "#111827",
                            marginBottom: 16,
                            backgroundColor: "#FAFAFA",
                        }}
                    />

                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "600",
                            color: "#374151",
                            marginBottom: 8,
                        }}
                    >
                        Password
                    </Text>
                    <TextInput
                        placeholder="Enter your password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        style={{
                            height: 54,
                            borderWidth: 1,
                            borderColor: "#E5E7EB",
                            borderRadius: 16,
                            paddingHorizontal: 16,
                            fontSize: 16,
                            color: "#111827",
                            marginBottom: 14,
                            backgroundColor: "#FAFAFA",
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => console.log("Forgot password pressed")}
                        style={{ alignSelf: "flex-end", marginBottom: 24 }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "600",
                                color: "#7F00FF",
                            }}
                        >
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/dashboard/cashier-dashboard")}
                        style={{
                            height: 56,
                            borderRadius: 16,
                            backgroundColor: "#7F00FF",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 16,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: "600",
                                color: "#ffffff",
                            }}
                        >
                            Login
                        </Text>
                    </TouchableOpacity>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                color: "#6B7280",
                            }}
                        >
                            Don’t have an account?{" "}
                        </Text>
                        <TouchableOpacity onPress={() => console.log("Sign up pressed")}>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: "#7F00FF",
                                }}
                            >
                                Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
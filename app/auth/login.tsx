import { useAuth } from "@/context/AuthContext";
import { useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";
import { getBrandImageSource, getBusinessDisplayName } from "@/src/utils/branding";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  const { signIn } = useAuth();
  const { settings } = useBusiness();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const businessName = getBusinessDisplayName(settings.business_name);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Fields", "Ilagay ang email at password.");
      return;
    }

    try {
      setLoading(true);
      await signIn({ email: email.trim(), password });
      router.replace("/dashboard/cashier-dashboard");
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to login as cashier.";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ position: "absolute", top: 56, right: 24, zIndex: 10 }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.bgCard,
            borderWidth: 1,
            borderColor: theme.border,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12 }}>{theme.dark ? "Light" : "Dark"}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: 56,
            paddingBottom: 32,
            justifyContent: "space-between",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                backgroundColor: theme.accentLight,
                paddingHorizontal: 14,
                paddingVertical: 8,
                marginBottom: 24,
              }}
            >
              <Ionicons name="shield-checkmark" size={16} color={theme.accent} />
              <Text style={{ color: theme.accent, fontWeight: "700", fontSize: 13 }}>
                Cashier Access
              </Text>
            </View>

            <View
              style={{
                width: 82,
                height: 82,
                borderRadius: 26,
                backgroundColor: theme.bgCard,
                borderWidth: 1,
                borderColor: theme.border,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
                shadowColor: theme.accent,
                shadowOpacity: 0.35,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 10 },
                elevation: 10,
                overflow: "hidden",
              }}
            >
              <Image
                source={getBrandImageSource(settings.logo_path)}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
              />
            </View>

            <Text
              style={{
                fontSize: 34,
                fontWeight: "800",
                color: theme.textPrimary,
                letterSpacing: -0.6,
                marginBottom: 10,
              }}
            >
              Welcome{"\n"}Back
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: theme.textMuted,
                lineHeight: 23,
                fontWeight: "500",
                marginBottom: 18,
              }}
            >
              Sign in to continue selling, track customer payments, and manage store activity in{" "}
              {businessName}.
            </Text>

            <View
              style={{
                borderRadius: 20,
                backgroundColor: theme.bgCard,
                borderWidth: 1,
                borderColor: theme.border,
                padding: 18,
              }}
            >
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: theme.accentLight,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="sparkles" size={18} color={theme.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "800" }}>
                    Quick cashier login
                  </Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13, lineHeight: 20 }}>
                    Designed for fast daily store operations on mobile and tablet.
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: theme.textSecondary,
                  marginBottom: 8,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Email
              </Text>
              <View
                style={{
                  minHeight: 56,
                  borderRadius: 16,
                  backgroundColor: theme.bgInput,
                  borderWidth: 1.5,
                  borderColor: theme.border,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 18,
                  gap: 10,
                }}
              >
                <Ionicons name="mail-outline" size={18} color={theme.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="cashier@pos.com"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{ flex: 1, fontSize: 16, color: theme.textPrimary, fontWeight: "500" }}
                />
              </View>

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: theme.textSecondary,
                  marginBottom: 8,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Password
              </Text>
              <View
                style={{
                  minHeight: 56,
                  borderRadius: 16,
                  backgroundColor: theme.bgInput,
                  borderWidth: 1.5,
                  borderColor: theme.border,
                  paddingHorizontal: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                  gap: 10,
                }}
              >
                <Ionicons name="lock-closed-outline" size={18} color={theme.textMuted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.textMuted}
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, fontSize: 16, color: theme.textPrimary, fontWeight: "500" }}
                />
                <TouchableOpacity onPress={() => setShowPassword((current) => !current)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              </View>

              <Text style={{ color: theme.textMuted, fontSize: 12, marginBottom: 20 }}>
                Passwords are now stored securely using hashed protection in the backend.
              </Text>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={{
                  height: 58,
                  borderRadius: 18,
                  backgroundColor: theme.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  shadowColor: theme.accent,
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 10,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
                    <Text
                      style={{ fontSize: 17, fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.3 }}
                    >
                      Sign In
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View
                style={{
                  backgroundColor: theme.bgSubtle,
                  borderRadius: 16,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                }}
              >
                <Text style={{ color: theme.textPrimary, fontWeight: "700", marginBottom: 6 }}>
                  Default Cashier Account
                </Text>
                <Text style={{ color: theme.textMuted }}>Email: cashier@pos.com</Text>
                <Text style={{ color: theme.textMuted }}>Password: 123456</Text>
              </View>
            </View>
          </View>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "500" }}>
              {businessName} v2.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


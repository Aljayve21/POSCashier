import { useAuth } from "@/context/AuthContext";
import { useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";
import { getBrandImageSource, getBusinessDisplayName } from "@/src/utils/branding";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
        <View
          style={{
            flex: 1,
            paddingHorizontal: 28,
            justifyContent: "space-between",
            paddingTop: 60,
            paddingBottom: 36,
          }}
        >
          <View>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 22,
                backgroundColor: theme.bgCard,
                borderWidth: 1,
                borderColor: theme.border,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 28,
                shadowColor: theme.accent,
                shadowOpacity: 0.45,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 8 },
                elevation: 12,
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
                letterSpacing: -0.5,
                marginBottom: 8,
              }}
            >
              Welcome{"\n"}Back
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: theme.textMuted,
                lineHeight: 22,
                fontWeight: "500",
              }}
            >
              Sign in to {getBusinessDisplayName(settings.business_name)}
            </Text>
          </View>

          <View>
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
                height: 56,
                borderRadius: 16,
                backgroundColor: theme.bgInput,
                borderWidth: 1.5,
                borderColor: theme.border,
                paddingHorizontal: 18,
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="cashier@pos.com"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ fontSize: 16, color: theme.textPrimary, fontWeight: "500" }}
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
                height: 56,
                borderRadius: 16,
                backgroundColor: theme.bgInput,
                borderWidth: 1.5,
                borderColor: theme.border,
                paddingHorizontal: 18,
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={theme.textMuted}
                secureTextEntry={!showPassword}
                style={{ flex: 1, fontSize: 16, color: theme.textPrimary, fontWeight: "500" }}
              />
              <TouchableOpacity onPress={() => setShowPassword((current) => !current)}>
                <Text style={{ fontSize: 14, color: theme.textMuted }}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 24 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: theme.accent }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

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
                shadowOpacity: 0.4,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 6 },
                elevation: 10,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text
                  style={{ fontSize: 17, fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.3 }}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: theme.bgCard,
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

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "500" }}>
              {getBusinessDisplayName(settings.business_name)} v2.0
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


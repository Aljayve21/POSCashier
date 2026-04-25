import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ position: "absolute", top: 56, right: 24, zIndex: 10 }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: theme.bgCard, borderWidth: 1,
            borderColor: theme.border, justifyContent: "center", alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>{theme.dark ? "☀️" : "🌙"}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 28, justifyContent: "space-between", paddingTop: 60, paddingBottom: 36 }}>
          <View>
            <View style={{
              width: 72, height: 72, borderRadius: 22, backgroundColor: theme.accent,
              justifyContent: "center", alignItems: "center", marginBottom: 28,
              shadowColor: theme.accent, shadowOpacity: 0.45, shadowRadius: 20,
              shadowOffset: { width: 0, height: 8 }, elevation: 12,
            }}>
              <Text style={{ fontSize: 32 }}>🛒</Text>
            </View>
            <Text style={{ fontSize: 34, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5, marginBottom: 8 }}>
              Welcome{"\n"}Back
            </Text>
            <Text style={{ fontSize: 15, color: theme.textMuted, lineHeight: 22, fontWeight: "500" }}>
              Sign in to your cashier workspace
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Email</Text>
            <View style={{ height: 56, borderRadius: 16, backgroundColor: theme.bgInput, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 18, justifyContent: "center", marginBottom: 20 }}>
              <TextInput value={email} onChangeText={setEmail} placeholder="you@store.com" placeholderTextColor={theme.textMuted} keyboardType="email-address" autoCapitalize="none" style={{ fontSize: 16, color: theme.textPrimary, fontWeight: "500" }} />
            </View>

            <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Password</Text>
            <View style={{ height: 56, borderRadius: 16, backgroundColor: theme.bgInput, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={theme.textMuted} secureTextEntry={!showPassword} style={{ flex: 1, fontSize: 16, color: theme.textPrimary, fontWeight: "500" }} />
              <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                <Text style={{ fontSize: 18, color: theme.textMuted }}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 32 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: theme.accent }}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/dashboard/cashier-dashboard")}
              style={{ height: 58, borderRadius: 18, backgroundColor: theme.accent, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: theme.accent, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 10 }}
            >
              <Text style={{ fontSize: 17, fontWeight: "700", color: "#FFFFFF", letterSpacing: 0.3 }}>Sign In</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 14, color: theme.textMuted }}>Don't have an account? </Text>
              <TouchableOpacity>
                <Text style={{ fontSize: 14, fontWeight: "700", color: theme.accent }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "500" }}>Riead Store POS · v2.0</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

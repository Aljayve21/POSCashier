import { CashierBottomNav } from "@/components/CashierBottomNav";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { getResponsiveMetrics } from "@/src/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ReportSummary = {
  totalSales: number;
  totalTransactions: number;
  pendingUtang: number;
};

type BusinessSettings = {
  business_name?: string;
};

export default function ProfileScreen() {
  const { user, updateUser, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const metrics = getResponsiveMetrics(width);

  const [summary, setSummary] = useState<ReportSummary>({
    totalSales: 0,
    totalTransactions: 0,
    pendingUtang: 0,
  });
  const [business, setBusiness] = useState<BusinessSettings>({});
  const [loading, setLoading] = useState(true);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const loadProfileData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [summaryRes, businessRes, userRes] = await Promise.all([
        api.get("/reports/summary"),
        api.get("/profile/business-settings"),
        api.get(`/profile/users/${user.id}`),
      ]);

      setSummary({
        totalSales: Number(summaryRes.data.totalSales || 0),
        totalTransactions: Number(summaryRes.data.totalTransactions || 0),
        pendingUtang: Number(summaryRes.data.pendingUtang || 0),
      });
      setBusiness({ business_name: businessRes.data.business_name || "" });
      setProfileForm({
        name: userRes.data.name || "",
        email: userRes.data.email || "",
      });
      updateUser({
        name: userRes.data.name,
        email: userRes.data.email,
      });
    } catch (error: any) {
      console.log("Profile load error:", error.response?.data || error.message);
      Alert.alert("Error", "Hindi ma-load ang profile data.");
    } finally {
      setLoading(false);
    }
  }, [updateUser, user?.id]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      Alert.alert("Missing Fields", "Ilagay ang name at email.");
      return;
    }

    try {
      setSavingProfile(true);
      const response = await api.put(`/profile/users/${user.id}`, {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
      });
      updateUser(response.data.user);
      setProfileModalOpen(false);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.error || "Hindi na-update ang profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.id) return;

    if (
      !passwordForm.current_password ||
      !passwordForm.new_password ||
      !passwordForm.confirm_password
    ) {
      Alert.alert("Missing Fields", "Completehin ang password fields.");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      Alert.alert("Mismatch", "Hindi tugma ang new password at confirm password.");
      return;
    }

    try {
      setSavingPassword(true);
      await api.put(`/profile/users/${user.id}/password`, {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordModalOpen(false);
      Alert.alert("Success", "Password updated successfully.");
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.error || "Hindi na-update ang password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: metrics.horizontalPadding,
          paddingTop: metrics.isTablet ? 24 : 20,
          paddingBottom: metrics.contentBottomPadding,
        }}
      >
        <View style={{ width: "100%", maxWidth: metrics.contentMaxWidth, alignSelf: "center" }}>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 20 }}>
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                backgroundColor: theme.bgCard,
                borderWidth: 1,
                borderColor: theme.border,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name={theme.dark ? "sunny" : "moon"} size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: theme.accent,
              borderRadius: 28,
              padding: metrics.isTablet ? 28 : 24,
              marginBottom: 20,
              overflow: "hidden",
              alignItems: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 160,
                height: 160,
                borderRadius: 80,
                backgroundColor: "rgba(255,255,255,0.07)",
              }}
            />
            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: 28,
                backgroundColor: "rgba(255,255,255,0.2)",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="person-circle" size={42} color="#FFFFFF" />
            </View>
            <Text style={{ fontSize: metrics.isTablet ? 28 : 24, fontWeight: "800", color: "#FFFFFF", marginBottom: 4, letterSpacing: -0.3 }}>
              {user?.name || "Cashier"}
            </Text>
            <View style={{ backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 8 }}>
              <Text style={{ fontSize: 13, color: "#FFFFFF", fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {user?.role || "cashier"}
              </Text>
            </View>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "500" }}>
              {business.business_name || "Store"}
            </Text>
          </View>

          {loading ? (
            <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: 24, alignItems: "center", borderWidth: 1, borderColor: theme.border }}>
              <ActivityIndicator color={theme.accent} />
              <Text style={{ marginTop: 12, color: theme.textMuted }}>Loading profile...</Text>
            </View>
          ) : (
            <>
              <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: metrics.isTablet ? 24 : 20, marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 16 }}>Shift Summary</Text>
                <View style={{ flexDirection: metrics.isTablet ? "row" : "row", gap: 12 }}>
                  {[
                    { label: "Total Sales", value: `PHP ${summary.totalSales.toLocaleString()}`, color: theme.success },
                    { label: "Transactions", value: String(summary.totalTransactions), color: theme.accent },
                    { label: "Utang", value: `PHP ${summary.pendingUtang.toLocaleString()}`, color: theme.danger },
                  ].map((item) => (
                    <View key={item.label} style={{ flex: 1, backgroundColor: item.color + "15", borderRadius: 18, padding: 14, alignItems: "center" }}>
                      <Text style={{ fontSize: metrics.isTablet ? 18 : 16, fontWeight: "800", color: item.color, marginBottom: 4, textAlign: "center" }}>{item.value}</Text>
                      <Text style={{ fontSize: 11, color: theme.textMuted, fontWeight: "600", textAlign: "center" }}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={{ backgroundColor: theme.bgCard, borderRadius: 24, padding: metrics.isTablet ? 24 : 20, marginBottom: 20, borderWidth: 1, borderColor: theme.border }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: theme.textPrimary, marginBottom: 4 }}>Account</Text>
                <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: "500", marginBottom: 16 }}>Manage your account settings</Text>

                {[
                  { label: "Name", value: profileForm.name },
                  { label: "Email", value: profileForm.email },
                  { label: "Role", value: user?.role || "cashier" },
                  { label: "App Version", value: "v2.0.0" },
                ].map((item) => (
                  <View key={item.label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.borderSubtle }}>
                    <Text style={{ color: theme.textMuted, fontWeight: "600" }}>{item.label}</Text>
                    <Text style={{ color: theme.textPrimary, fontWeight: "700", flexShrink: 1, textAlign: "right" }}>{item.value}</Text>
                  </View>
                ))}

                <TouchableOpacity onPress={() => setProfileModalOpen(true)} style={{ height: 52, borderRadius: 16, backgroundColor: theme.accent, alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                  <Text style={{ color: "#FFFFFF", fontWeight: "700" }}>Edit Basic Info</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setPasswordModalOpen(true)} style={{ height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: theme.accent, alignItems: "center", justifyContent: "center", marginTop: 12 }}>
                  <Text style={{ color: theme.accent, fontWeight: "700" }}>Change Password</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity onPress={() => { signOut(); router.replace("/auth/login"); }} style={{ height: 56, borderRadius: 18, borderWidth: 1.5, borderColor: theme.danger, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: theme.danger, fontSize: 16, fontWeight: "700" }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ProfileModal
        visible={profileModalOpen}
        form={profileForm}
        setForm={setProfileForm}
        saving={savingProfile}
        onClose={() => setProfileModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <PasswordModal
        visible={passwordModalOpen}
        form={passwordForm}
        setForm={setPasswordForm}
        saving={savingPassword}
        onClose={() => setPasswordModalOpen(false)}
        onSave={handleChangePassword}
      />

      <CashierBottomNav activeRoute="/profile/profile" />
    </SafeAreaView>
  );
}

function ProfileModal({ visible, form, setForm, saving, onClose, onSave }: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 18 }}>
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 14 }}>Edit Basic Info</Text>
          <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Name</Text>
          <TextInput value={form.name} onChangeText={(value) => setForm((prev: any) => ({ ...prev, name: value }))} style={inputStyle} />
          <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Email</Text>
          <TextInput value={form.email} onChangeText={(value) => setForm((prev: any) => ({ ...prev, email: value }))} autoCapitalize="none" keyboardType="email-address" style={inputStyle} />
          <TouchableOpacity disabled={saving} onPress={onSave} style={{ backgroundColor: saving ? "#9CA3AF" : "#7F00FF", borderRadius: 16, paddingVertical: 14, alignItems: "center", marginBottom: 10 }}>
            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Save Profile</Text>}
          </TouchableOpacity>
          <TouchableOpacity disabled={saving} onPress={onClose} style={{ backgroundColor: "#F3F4F6", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
            <Text style={{ color: "#111827", fontWeight: "700" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function PasswordModal({ visible, form, setForm, saving, onClose, onSave }: any) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 18 }}>
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18 }}>
          <Text style={{ fontSize: 20, fontWeight: "800", color: "#111827", marginBottom: 14 }}>Change Password</Text>
          <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Current Password</Text>
          <TextInput value={form.current_password} onChangeText={(value) => setForm((prev: any) => ({ ...prev, current_password: value }))} secureTextEntry style={inputStyle} />
          <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>New Password</Text>
          <TextInput value={form.new_password} onChangeText={(value) => setForm((prev: any) => ({ ...prev, new_password: value }))} secureTextEntry style={inputStyle} />
          <Text style={{ fontWeight: "700", color: "#111827", marginBottom: 6 }}>Confirm Password</Text>
          <TextInput value={form.confirm_password} onChangeText={(value) => setForm((prev: any) => ({ ...prev, confirm_password: value }))} secureTextEntry style={inputStyle} />
          <TouchableOpacity disabled={saving} onPress={onSave} style={{ backgroundColor: saving ? "#9CA3AF" : "#7F00FF", borderRadius: 16, paddingVertical: 14, alignItems: "center", marginBottom: 10 }}>
            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>Update Password</Text>}
          </TouchableOpacity>
          <TouchableOpacity disabled={saving} onPress={onClose} style={{ backgroundColor: "#F3F4F6", borderRadius: 16, paddingVertical: 14, alignItems: "center" }}>
            <Text style={{ color: "#111827", fontWeight: "700" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 12,
  marginBottom: 14,
  color: "#111827",
};

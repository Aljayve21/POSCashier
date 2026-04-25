import { useAuth } from "@/context/AuthContext";
import { useBusiness } from "@/context/BusinessContext";
import { useTheme } from "@/context/ThemeContext";
import { getBrandImageSource, getBusinessDisplayName } from "@/src/utils/branding";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useAuth();
  const { settings } = useBusiness();
  const { theme } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setReady(true);
    }, 1100);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    router.replace(user ? "/dashboard/cashier-dashboard" : "/auth/login");
  }, [ready, user]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 28,
        }}
      >
        <View
          style={{
            width: 108,
            height: 108,
            borderRadius: 30,
            backgroundColor: theme.bgCard,
            borderWidth: 1,
            borderColor: theme.border,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
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
            fontSize: 26,
            fontWeight: "800",
            color: theme.textPrimary,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {getBusinessDisplayName(settings.business_name)}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: theme.textMuted,
            textAlign: "center",
            marginBottom: 26,
          }}
        >
          Smart POS cashier workspace
        </Text>

        <ActivityIndicator color={theme.accent} />
      </View>
    </SafeAreaView>
  );
}


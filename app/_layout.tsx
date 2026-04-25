import { AuthProvider } from "@/context/AuthContext";
import { BusinessProvider } from "@/context/BusinessContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <BusinessProvider>
          <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth/login" />
              <Stack.Screen name="dashboard/cashier-dashboard" />
              <Stack.Screen name="products/products" />
              <Stack.Screen name="inventory/inventory" />
              <Stack.Screen name="customers/customers" />
              <Stack.Screen name="payments/payment" />
              <Stack.Screen name="payments/screen/payment-collect" />
              <Stack.Screen name="sales/new-sale" />
              <Stack.Screen name="transactions/transactions" />
              <Stack.Screen name="reports/reports" />
              <Stack.Screen name="profile/profile" />
              <Stack.Screen name="receipts/receipt" />
              <Stack.Screen name="utang/utang-customer" />
              <Stack.Screen name="utang/utang-confirm" />
            </Stack>
          </AuthProvider>
        </BusinessProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

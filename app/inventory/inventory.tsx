import { useTheme } from "@/context/ThemeContext";
import { featuredProducts } from "@/data/mockData";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function InventoryScreen() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");

  const getStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: theme.danger };
    if (stock <= 5) return { label: "Low Stock", color: theme.warning };
    return { label: "In Stock", color: theme.success };
  };

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return featuredProducts;
    return featuredProducts.filter((i) => i.name.toLowerCase().includes(kw));
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Inventory</Text>
          <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.bgCard, borderRadius: 16, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, marginBottom: 20, height: 52 }}>
          <Text style={{ fontSize: 18, marginRight: 10, color: theme.textMuted }}>🔍</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search inventory..." placeholderTextColor={theme.textMuted} style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => {
            const status = getStatus(item.stock);
            const pct = Math.min(100, (item.stock / 50) * 100);
            return (
              <View style={{ flexDirection: "row", backgroundColor: theme.bgCard, borderRadius: 20, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.border }}>
                <View style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: theme.bgSubtle, justifyContent: "center", alignItems: "center", overflow: "hidden", marginRight: 14 }}>
                  <Image source={item.image} style={{ width: "85%", height: "85%" }} resizeMode="contain" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: theme.textPrimary, flex: 1, marginRight: 8 }}>{item.name}</Text>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: status.color + "22" }}>
                      <Text style={{ color: status.color, fontSize: 11, fontWeight: "700" }}>{status.label}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 15, fontWeight: "800", color: theme.accent, marginBottom: 8 }}>₱{item.price}</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "600" }}>Stock Level</Text>
                    <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textPrimary }}>{item.stock} units</Text>
                  </View>
                  <View style={{ height: 6, backgroundColor: theme.borderSubtle, borderRadius: 3, overflow: "hidden" }}>
                    <View style={{ height: 6, width: `${pct}%`, backgroundColor: status.color, borderRadius: 3 }} />
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

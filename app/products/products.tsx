import { useTheme } from "@/context/ThemeContext";
import { featuredProducts } from "@/data/mockData";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ProductsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return featuredProducts;
    return featuredProducts.filter((i) => i.name.toLowerCase().includes(kw));
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
            <Text style={{ fontSize: 18 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Products</Text>
          <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.bgCard, borderRadius: 16, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, marginBottom: 20, height: 52 }}>
          <Text style={{ fontSize: 18, marginRight: 10, color: theme.textMuted }}>🔍</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search products..." placeholderTextColor={theme.textMuted} style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ width: "48%", backgroundColor: theme.bgCard, borderRadius: 22, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: theme.border }}>
              <View style={{ height: 100, borderRadius: 16, backgroundColor: theme.bgSubtle, justifyContent: "center", alignItems: "center", marginBottom: 12, overflow: "hidden" }}>
                <Image source={item.image} style={{ width: "85%", height: "85%" }} resizeMode="contain" />
              </View>
              <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: "700", color: theme.textPrimary, marginBottom: 6, letterSpacing: -0.2 }}>{item.name}</Text>
              <Text style={{ fontSize: 16, fontWeight: "800", color: theme.accent, marginBottom: 4 }}>₱{item.price}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.stock <= 5 ? theme.danger : theme.success, marginRight: 6 }} />
                <Text style={{ fontSize: 12, color: item.stock <= 5 ? theme.danger : theme.textMuted, fontWeight: "600" }}>
                  {item.stock <= 5 ? `Low: ${item.stock}` : `Stock: ${item.stock}`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { getResponsiveMetrics } from "@/src/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  id: number;
  name: string;
  category?: string;
  price: number | string;
  image_path?: string;
  stock?: number;
};

const PRODUCTS_PER_PAGE = 6;

export default function ProductsScreen() {
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const metrics = getResponsiveMetrics(width);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products");
        setProducts(response.data || []);
      } catch (error) {
        console.log("Products load error", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((item) => item.category?.trim()).filter(Boolean))
    ) as string[];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchesSearch = !keyword || item.name.toLowerCase().includes(keyword);
      const matchesCategory =
        selectedCategory === "All" || (item.category || "Uncategorized") === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, filtered]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
      <View style={{ flex: 1, paddingHorizontal: metrics.horizontalPadding, paddingTop: metrics.isTablet ? 24 : 20 }}>
        <View style={{ width: "100%", maxWidth: metrics.contentMaxWidth, alignSelf: "center", flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
              <Ionicons name="arrow-back" size={18} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Products</Text>
            <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name={theme.dark ? "sunny" : "moon"} size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.bgCard, borderRadius: 16, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, marginBottom: 16, height: 52 }}>
            <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 10 }} />
            <TextInput value={search} onChangeText={setSearch} placeholder="Search products..." placeholderTextColor={theme.textMuted} style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 10, alignItems: "center" }}
            style={{ marginBottom: 6, maxHeight: 44 }}
          >
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={{
                    paddingHorizontal: metrics.isTablet ? 14 : 12,
                    paddingVertical: metrics.isTablet ? 8 : 7,
                    borderRadius: 999,
                    marginRight: 8,
                    backgroundColor: active ? theme.accent : theme.bgCard,
                    borderWidth: 1,
                    borderColor: active ? theme.accent : theme.border,
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ color: active ? "#FFFFFF" : theme.textPrimary, fontWeight: "700", fontSize: metrics.isTablet ? 12 : 11 }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text style={{ color: theme.textMuted, fontWeight: "600" }}>
              {filtered.length} product(s)
            </Text>
            <Text style={{ color: theme.textMuted, fontWeight: "600" }}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator color={theme.accent} />
              <Text style={{ marginTop: 12, color: theme.textMuted }}>Loading products...</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={paginatedProducts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
                style={{ flex: 1 }}
                ListEmptyComponent={
                  <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 24 }}>
                    No products found.
                  </Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity style={{ width: "48%", backgroundColor: theme.bgCard, borderRadius: 22, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: theme.border }}>
                    <View style={{ height: 100, borderRadius: 16, backgroundColor: theme.bgSubtle, justifyContent: "center", alignItems: "center", marginBottom: 12, overflow: "hidden" }}>
                      <Image
                        source={
                          item.image_path
                            ? { uri: item.image_path }
                            : require("../../assets/images/onboarding-store.jpg")
                        }
                        style={{ width: "85%", height: "85%" }}
                        contentFit="contain"
                      />
                    </View>
                    <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: "700", color: theme.textPrimary, marginBottom: 6, letterSpacing: -0.2 }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>{item.category || "Uncategorized"}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: theme.accent, marginBottom: 4 }}>PHP {Number(item.price || 0).toLocaleString()}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Number(item.stock || 0) <= 5 ? theme.danger : theme.success, marginRight: 6 }} />
                      <Text style={{ fontSize: 12, color: Number(item.stock || 0) <= 5 ? theme.danger : theme.textMuted, fontWeight: "600" }}>
                        {Number(item.stock || 0) <= 5 ? `Low: ${Number(item.stock || 0)}` : `Stock: ${Number(item.stock || 0)}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />

              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
                <TouchableOpacity
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: currentPage === 1 ? theme.bgSubtle : theme.bgCard,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: currentPage === 1 ? theme.textMuted : theme.textPrimary, fontWeight: "700" }}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={currentPage === totalPages}
                  onPress={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  style={{
                    flex: 1,
                    height: 46,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: currentPage === totalPages ? theme.bgSubtle : theme.bgCard,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: currentPage === totalPages ? theme.textMuted : theme.textPrimary, fontWeight: "700" }}>Next</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

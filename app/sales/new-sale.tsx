import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { getResponsiveMetrics } from "@/src/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Product = {
  id: number;
  name: string;
  category?: string;
  price: number | string;
  image_path?: string;
  stock?: number;
  reorder_level?: number;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

const PRODUCTS_PER_PAGE = 6;

export default function NewSaleScreen() {
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const metrics = getResponsiveMetrics(width);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (error: any) {
      console.log("Products error:", error.response?.data || error.message);
      Alert.alert("Error", "Hindi ma-load ang products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((item) => item.category?.trim()).filter(Boolean))
    ) as string[];

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter((item) => (item.category || "Uncategorized") === selectedCategory);
  }, [products, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, filteredProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const addToCart = (product: Product) => {
    const stock = Number(product.stock || 0);

    if (stock <= 0) {
      Alert.alert("Out of Stock", "Wala nang stock ang product na ito.");
      return;
    }

    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      if (existing.qty >= stock) {
        Alert.alert("Stock Limit", "Hindi puwedeng lumagpas sa available stock.");
        return;
      }

      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price || 0),
          qty: 1,
        },
      ]);
    }
  };

  const changeQty = (id: number, delta: number) => {
    const product = products.find((item) => item.id === id);
    const stock = Number(product?.stock || 0);

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;

          const nextQty = item.qty + delta;

          if (nextQty > stock) {
            Alert.alert("Stock Limit", "Hindi puwedeng lumagpas sa available stock.");
            return item;
          }

          return { ...item, qty: nextQty };
        })
        .filter((item) => item.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={theme.accent} />
          <Text style={{ marginTop: 12, color: theme.textMuted }}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
      <View style={{ flex: 1, paddingHorizontal: metrics.horizontalPadding, paddingTop: metrics.isTablet ? 24 : 20 }}>
        <View style={{ width: "100%", maxWidth: metrics.contentMaxWidth, alignSelf: "center", flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: theme.bgCard,
                borderWidth: 1,
                borderColor: theme.border,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name="arrow-back" size={18} color={theme.textPrimary} />
            </TouchableOpacity>

            <Text
              style={{
                flex: 1,
                fontSize: 22,
                fontWeight: "800",
                color: theme.textPrimary,
                letterSpacing: -0.4,
              }}
            >
              New Sale
            </Text>

            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                width: 40,
                height: 40,
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
              {filteredProducts.length} product(s) in {selectedCategory}
            </Text>
            <Text style={{ color: theme.textMuted, fontWeight: "600" }}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          <FlatList
            data={paginatedProducts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ paddingBottom: 12 }}
            style={{ flex: 1, marginBottom: 12 }}
            ListEmptyComponent={
              <Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 24 }}>
                No products found.
              </Text>
            }
            renderItem={({ item }) => {
              const inCart = cart.find((cartItem) => cartItem.id === item.id);
              const stock = Number(item.stock || 0);
              const isOut = stock <= 0;

              return (
                <TouchableOpacity
                  disabled={isOut}
                  onPress={() => addToCart(item)}
                  style={{
                    width: "48.5%",
                    backgroundColor: theme.bgCard,
                    borderRadius: 20,
                    padding: 12,
                    marginBottom: 12,
                    opacity: isOut ? 0.5 : 1,
                    borderWidth: inCart ? 2 : 1,
                    borderColor: inCart ? theme.accent : theme.border,
                  }}
                >
                  <View
                    style={{
                      height: 90,
                      borderRadius: 14,
                      backgroundColor: theme.bgSubtle,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 10,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={
                        item.image_path
                          ? { uri: item.image_path }
                          : require("../../assets/images/onboarding-store.jpg")
                      }
                      style={{ width: "80%", height: "80%" }}
                      contentFit="contain"
                    />

                    {inCart && (
                      <View
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 24,
                          height: 24,
                          borderRadius: 8,
                          backgroundColor: theme.accent,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#FFF", fontSize: 11, fontWeight: "800" }}>
                          {inCart.qty}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: "700", color: theme.textPrimary, marginBottom: 4, lineHeight: 18 }}>
                    {item.name}
                  </Text>

                  <Text style={{ fontSize: 11, color: theme.textMuted, marginBottom: 4 }}>
                    {item.category || "Uncategorized"}
                  </Text>

                  <Text style={{ fontSize: 15, fontWeight: "800", color: theme.accent }}>
                    PHP {Number(item.price || 0).toLocaleString()}
                  </Text>

                  <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>
                    Stock: {stock}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
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

          <View
            style={{
              backgroundColor: theme.bgCard,
              borderRadius: 24,
              padding: 18,
              borderWidth: 1,
              borderColor: theme.border,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: "800", color: theme.textPrimary }}>
                Cart
              </Text>

              <View
                style={{
                  backgroundColor: theme.accentLight,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: theme.accent }}>
                  {cart.length} items
                </Text>
              </View>
            </View>

            {cart.length === 0 && (
              <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: "500", textAlign: "center", paddingVertical: 8 }}>
                Tap a product to add it
              </Text>
            )}

            <ScrollView style={{ maxHeight: 140 }} showsVerticalScrollIndicator={false}>
              {cart.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "700", color: theme.textPrimary, fontSize: 14 }} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: "500" }}>
                      PHP {item.price} x {item.qty} = PHP {(item.price * item.qty).toLocaleString()}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                    <TouchableOpacity
                      onPress={() => changeQty(item.id, -1)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        backgroundColor: theme.bgSubtle,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="remove" size={16} color={theme.danger} />
                    </TouchableOpacity>

                    <Text style={{ width: 28, textAlign: "center", fontWeight: "800", color: theme.textPrimary }}>
                      {item.qty}
                    </Text>

                    <TouchableOpacity
                      onPress={() => changeQty(item.id, 1)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        backgroundColor: theme.accentLight,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="add" size={16} color={theme.accent} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: theme.border,
                paddingTop: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "600", marginBottom: 2 }}>
                  Total
                </Text>

                <Text style={{ fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>
                  PHP {total.toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity
                disabled={cart.length === 0}
                onPress={() =>
                  router.push({
                    pathname: "/payments/payment",
                    params: {
                      total: total.toString(),
                      cart: JSON.stringify(cart),
                    },
                  })
                }
                style={{
                  height: 52,
                  paddingHorizontal: 24,
                  borderRadius: 16,
                  backgroundColor: cart.length === 0 ? theme.bgSubtle : theme.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: theme.accent,
                  shadowOpacity: cart.length > 0 ? 0.35 : 0,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                <Text style={{ color: cart.length === 0 ? theme.textMuted : "#FFF", fontWeight: "700", fontSize: 15 }}>
                  Pay Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

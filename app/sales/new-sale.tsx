import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

export default function NewSaleScreen() {
  const { theme, toggleTheme } = useTheme();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
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
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={theme.accent} />
          <Text style={{ marginTop: 12, color: theme.textMuted }}>
            Loading products...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
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
            <Text style={{ fontSize: 18 }}>←</Text>
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
            <Text style={{ fontSize: 18 }}>{theme.dark ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={products}
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

                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: theme.textPrimary,
                    marginBottom: 4,
                    lineHeight: 18,
                  }}
                >
                  {item.name}
                </Text>

                <Text style={{ fontSize: 15, fontWeight: "800", color: theme.accent }}>
                  ₱{Number(item.price || 0).toLocaleString()}
                </Text>

                <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>
                  Stock: {stock}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

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
            <Text
              style={{
                color: theme.textMuted,
                fontSize: 14,
                fontWeight: "500",
                textAlign: "center",
                paddingVertical: 8,
              }}
            >
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
                  <Text
                    style={{
                      fontWeight: "700",
                      color: theme.textPrimary,
                      fontSize: 14,
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      color: theme.textMuted,
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    ₱{item.price} × {item.qty} = ₱
                    {(item.price * item.qty).toLocaleString()}
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
                    <Text style={{ fontSize: 16, color: theme.danger, fontWeight: "800" }}>
                      −
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      width: 28,
                      textAlign: "center",
                      fontWeight: "800",
                      color: theme.textPrimary,
                    }}
                  >
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
                    <Text style={{ fontSize: 16, color: theme.accent, fontWeight: "800" }}>
                      +
                    </Text>
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
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textMuted,
                  fontWeight: "600",
                  marginBottom: 2,
                }}
              >
                Total
              </Text>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: theme.textPrimary,
                  letterSpacing: -0.5,
                }}
              >
                ₱{total.toLocaleString()}
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
              <Text
                style={{
                  color: cart.length === 0 ? theme.textMuted : "#FFF",
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                Pay Now →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
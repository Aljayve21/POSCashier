import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { featuredProducts } from "../../data/mockData";

type CartItem = {
    id: number;
    name: string;
    price: number;
    qty: number;
};

export default function NewSaleScreen() {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: any) => {
        const existing = cart.find((item) => item.id === product.id);

        if (existing) {
            const updated = cart.map((item) =>
                item.id === product.id
                    ? { ...item, qty: item.qty + 1 }
                    : item
            );
            setCart(updated);
        } else {
            setCart([
                ...cart,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: 1,
                },
            ]);
        }
    };

    const increaseQty = (id: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, qty: item.qty + 1 } : item
            )
        );
    };

    const decreaseQty = (id: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, qty: item.qty - 1 } : item
                )
                .filter((item) => item.qty > 0)
        );
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View style={{ flex: 1, padding: 12 }}>
                <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
                    New Sale
                </Text>

                {/* PRODUCTS */}
                <FlatList
                    data={featuredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => addToCart(item)}
                            style={{
                                width: "48%",
                                backgroundColor: "#FFFFFF",
                                borderRadius: 18,
                                padding: 10,
                                marginBottom: 12,
                                borderWidth: 1,
                                borderColor: "#E5E7EB",
                            }}
                        >
                            {/* IMAGE */}
                            <View
                                style={{
                                    height: 90,
                                    borderRadius: 12,
                                    backgroundColor: "#F3F4F6",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: 8,
                                    overflow: "hidden",
                                }}
                            >
                                <Image
                                    source={item.image}
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* NAME */}
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "700",
                                    color: "#111827",
                                    marginBottom: 4,
                                }}
                                numberOfLines={2}
                            >
                                {item.name}
                            </Text>

                            {/* PRICE */}
                            <Text style={{ color: "#6B7280", fontSize: 13 }}>
                                ₱{item.price}
                            </Text>

                            {/* STOCK */}
                            <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                                Stock: {item.stock}
                            </Text>
                        </TouchableOpacity>
                    )}
                />

                {/* CART */}
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 18,
                        padding: 14,
                        marginTop: 6,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "700",
                            marginBottom: 10,
                        }}
                    >
                        Cart
                    </Text>

                    {cart.length === 0 && (
                        <Text style={{ color: "#9CA3AF" }}>No items yet</Text>
                    )}

                    {cart.map((item) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 10,
                            }}
                        >
                            <View>
                                <Text style={{ fontWeight: "600" }}>{item.name}</Text>
                                <Text style={{ color: "#6B7280" }}>
                                    ₱{item.price} x {item.qty}
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                                    <Text style={{ fontSize: 18, marginHorizontal: 10 }}>➖</Text>
                                </TouchableOpacity>

                                <Text>{item.qty}</Text>

                                <TouchableOpacity onPress={() => increaseQty(item.id)}>
                                    <Text style={{ fontSize: 18, marginHorizontal: 10 }}>➕</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* TOTAL */}
                    <View
                        style={{
                            marginTop: 10,
                            borderTopWidth: 1,
                            borderTopColor: "#E5E7EB",
                            paddingTop: 10,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "700" }}>
                            Total: ₱{total.toLocaleString()}
                        </Text>

                        <TouchableOpacity
                            style={{
                                marginTop: 12,
                                backgroundColor: "#7F00FF",
                                padding: 14,
                                borderRadius: 14,
                                alignItems: "center",
                            }}
                            onPress={() => router.push({
                                pathname: "/payments/payment",
                                params: {
                                    total: total.toString(),
                                    cart: JSON.stringify(cart),
                                },
                            }
                            )}
                        >
                            <Text style={{ color: "#fff", fontWeight: "600" }}>
                                Proceed to Payment
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
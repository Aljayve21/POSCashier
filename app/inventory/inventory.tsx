import { featuredProducts } from "@/data/mockData";
import { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    View,
} from "react-native";


export default function InventoryScreen() {
    const [search, setSearch] = useState("");

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return { label: "Out of Stock", color: "#EF4444" };
        }
        if (stock <= 5) {
            return { label: "Low Stock", color: "#F59E0B" };
        }
        return { label: "In Stock", color: "#10B981" };
    };

    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return featuredProducts;

        return featuredProducts.filter((item) =>
            item.name.toLowerCase().includes(keyword)
        );
    }, [search]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View style={{ flex: 1, padding: 16 }}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: 14,
                    }}
                >
                    Inventory
                </Text>

                {/* SEARCH */}
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 16,
                        paddingHorizontal: 14,
                        paddingVertical: 4,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                    }}
                >
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search product"
                        placeholderTextColor="#9CA3AF"
                        style={{
                            height: 48,
                            fontSize: 15,
                            color: "#111827",
                        }}
                    />
                </View>

                {/* LIST */}
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => {
                        const status = getStockStatus(item.stock);

                        return (
                            <View
                                style={{
                                    flexDirection: "row",
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 18,
                                    padding: 12,
                                    marginBottom: 12,
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                }}
                            >
                                {/* IMAGE */}
                                <View
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: 12,
                                        backgroundColor: "#F3F4F6",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "hidden",
                                        marginRight: 12,
                                    }}
                                >
                                    <Image
                                        source={item.image}
                                        style={{ width: "100%", height: "100%" }}
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* DETAILS */}
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "700",
                                            color: "#111827",
                                            marginBottom: 4,
                                        }}
                                    >
                                        {item.name}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#6B7280",
                                            marginBottom: 4,
                                        }}
                                    >
                                        ₱{item.price}
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: "#111827",
                                            fontWeight: "600",
                                            marginBottom: 6,
                                        }}
                                    >
                                        Stock: {item.stock}
                                    </Text>

                                    {/* STATUS BADGE */}
                                    <View
                                        style={{
                                            alignSelf: "flex-start",
                                            paddingHorizontal: 10,
                                            paddingVertical: 4,
                                            borderRadius: 12,
                                            backgroundColor: status.color + "20",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: status.color,
                                                fontSize: 12,
                                                fontWeight: "600",
                                            }}
                                        >
                                            {status.label}
                                        </Text>
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
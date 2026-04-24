import { featuredProducts } from "@/data/mockData";
import { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    View
} from "react-native";


export default function ProductsScreen() {
    const [search, setSearch] = useState("");

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
                    Products
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

                {/* PRODUCT GRID */}
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    renderItem={({ item }) => (
                        <View
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
                                numberOfLines={2}
                                style={{
                                    fontSize: 14,
                                    fontWeight: "700",
                                    color: "#111827",
                                    marginBottom: 4,
                                }}
                            >
                                {item.name}
                            </Text>

                            {/* PRICE */}
                            <Text
                                style={{
                                    fontSize: 13,
                                    color: "#6B7280",
                                    marginBottom: 2,
                                }}
                            >
                                ₱{item.price}
                            </Text>

                            {/* STOCK */}
                            <Text
                                style={{
                                    fontSize: 12,
                                    color:
                                        item.stock <= 5 ? "#EF4444" : "#9CA3AF",
                                    fontWeight: item.stock <= 5 ? "600" : "400",
                                }}
                            >
                                Stock: {item.stock}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}
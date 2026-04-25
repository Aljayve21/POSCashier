import { useTheme } from "@/context/ThemeContext";
import api from "@/src/axios";
import { getResponsiveMetrics } from "@/src/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type InventoryItem = {
  id: number;
  name: string;
  category?: string;
  stock: number;
  reorder_level: number;
};

const ITEMS_PER_PAGE = 8;

export default function InventoryScreen() {
  const { theme, toggleTheme } = useTheme();
  const { width } = useWindowDimensions();
  const metrics = getResponsiveMetrics(width);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockInput, setStockInput] = useState("");
  const [reorderInput, setReorderInput] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/inventory");
      setItems(
        (response.data || []).map((item: any) => ({
          id: Number(item.id),
          name: item.name,
          category: item.category || "Uncategorized",
          stock: Number(item.stock || 0),
          reorder_level: Number(item.reorder_level || 0),
        }))
      );
    } catch (error: any) {
      console.log("Inventory load error:", error.response?.data || error.message);
      Alert.alert("Error", "Hindi ma-load ang inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map((item) => item.category).filter(Boolean))) as string[];
    return ["All", ...uniqueCategories];
  }, [items]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !keyword ||
        item.name.toLowerCase().includes(keyword) ||
        String(item.stock).includes(keyword);
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const getStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: "Out of Stock", color: theme.danger };
    if (stock <= reorderLevel || stock <= 5) return { label: "Low Stock", color: theme.warning };
    return { label: "In Stock", color: theme.success };
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setStockInput(String(item.stock));
    setReorderInput(String(item.reorder_level));
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setStockInput("");
    setReorderInput("");
  };

  const handleSaveInventory = async () => {
    if (!selectedItem) return;

    const nextStock = Number(stockInput);
    const nextReorder = Number(reorderInput);

    if (Number.isNaN(nextStock) || nextStock < 0 || Number.isNaN(nextReorder) || nextReorder < 0) {
      Alert.alert("Invalid Values", "Ilagay ang valid stock at reorder level.");
      return;
    }

    try {
      setSaving(true);
      await api.put(`/products/inventory/${selectedItem.id}`, {
        stock: nextStock,
        reorder_level: nextReorder,
      });
      closeEditModal();
      await loadInventory();
      Alert.alert("Success", "Inventory updated.");
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.response?.data?.error || "Hindi na-update ang inventory."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={["top"]}>
      <View style={{ flex: 1, paddingHorizontal: metrics.horizontalPadding, paddingTop: metrics.isTablet ? 24 : 20 }}>
        <View style={{ width: "100%", maxWidth: metrics.contentMaxWidth, alignSelf: "center", flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
              <Ionicons name="arrow-back" size={18} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={{ flex: 1, fontSize: 24, fontWeight: "800", color: theme.textPrimary, letterSpacing: -0.5 }}>Inventory</Text>
            <TouchableOpacity onPress={toggleTheme} style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: theme.bgCard, borderWidth: 1, borderColor: theme.border, justifyContent: "center", alignItems: "center" }}>
              <Ionicons name={theme.dark ? "sunny" : "moon"} size={18} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: theme.bgCard, borderRadius: 16, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, marginBottom: 16, height: 52 }}>
            <Ionicons name="search" size={18} color={theme.textMuted} style={{ marginRight: 10 }} />
            <TextInput value={search} onChangeText={setSearch} placeholder="Search inventory..." placeholderTextColor={theme.textMuted} style={{ flex: 1, fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, alignItems: "center" }} style={{ marginBottom: 6, maxHeight: 44 }}>
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
            <Text style={{ color: theme.textMuted, fontWeight: "600" }}>{filtered.length} inventory item(s)</Text>
            <Text style={{ color: theme.textMuted, fontWeight: "600" }}>Page {currentPage} of {totalPages}</Text>
          </View>

          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator color={theme.accent} />
              <Text style={{ marginTop: 12, color: theme.textMuted }}>Loading inventory...</Text>
            </View>
          ) : (
            <>
              <FlatList
                data={paginatedItems}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
                style={{ flex: 1 }}
                ListEmptyComponent={<Text style={{ color: theme.textMuted, textAlign: "center", marginTop: 24 }}>No inventory found.</Text>}
                renderItem={({ item }) => {
                  const status = getStatus(item.stock, item.reorder_level);
                  const stockBase = Math.max(item.reorder_level * 2 || 10, 10);
                  const pct = Math.min(100, (item.stock / stockBase) * 100);

                  return (
                    <TouchableOpacity onPress={() => openEditModal(item)} style={{ flexDirection: "row", backgroundColor: theme.bgCard, borderRadius: 20, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: theme.border }}>
                      <View style={{ width: 72, height: 72, borderRadius: 16, backgroundColor: theme.bgSubtle, justifyContent: "center", alignItems: "center", marginRight: 14 }}>
                        <Ionicons name="cube-outline" size={28} color={theme.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={{ fontSize: 15, fontWeight: "700", color: theme.textPrimary }}>{item.name}</Text>
                            <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{item.category || "Uncategorized"}</Text>
                          </View>
                          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: status.color + "22" }}>
                            <Text style={{ color: status.color, fontSize: 11, fontWeight: "700" }}>{status.label}</Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6, marginTop: 6 }}>
                          <Text style={{ fontSize: 12, color: theme.textMuted, fontWeight: "600" }}>Stock Level</Text>
                          <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textPrimary }}>{item.stock} units</Text>
                        </View>
                        <View style={{ height: 6, backgroundColor: theme.borderSubtle, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                          <View style={{ height: 6, width: `${pct}%`, backgroundColor: status.color, borderRadius: 3 }} />
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <Text style={{ fontSize: 12, color: theme.textMuted }}>Reorder level: {item.reorder_level}</Text>
                          <Text style={{ fontSize: 12, color: theme.accent, fontWeight: "700" }}>Tap to edit</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
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

      <Modal visible={!!selectedItem} transparent animationType="slide" onRequestClose={closeEditModal}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: theme.bgCard, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 28 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: "center", marginBottom: 24 }} />
            <Text style={{ fontSize: 22, fontWeight: "800", color: theme.textPrimary, marginBottom: 8 }}>Update Inventory</Text>
            <Text style={{ color: theme.textMuted, marginBottom: 20 }}>{selectedItem?.name}</Text>

            <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Stock</Text>
            <View style={{ height: 54, borderRadius: 16, backgroundColor: theme.bgInput, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, justifyContent: "center", marginBottom: 16 }}>
              <TextInput value={stockInput} onChangeText={setStockInput} keyboardType="numeric" placeholder="Stock" placeholderTextColor={theme.textMuted} style={{ fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
            </View>

            <Text style={{ fontSize: 13, fontWeight: "700", color: theme.textSecondary, marginBottom: 8, letterSpacing: 0.5, textTransform: "uppercase" }}>Reorder Level</Text>
            <View style={{ height: 54, borderRadius: 16, backgroundColor: theme.bgInput, borderWidth: 1.5, borderColor: theme.border, paddingHorizontal: 16, justifyContent: "center", marginBottom: 24 }}>
              <TextInput value={reorderInput} onChangeText={setReorderInput} keyboardType="numeric" placeholder="Reorder level" placeholderTextColor={theme.textMuted} style={{ fontSize: 15, color: theme.textPrimary, fontWeight: "500" }} />
            </View>

            <TouchableOpacity onPress={handleSaveInventory} disabled={saving} style={{ height: 56, borderRadius: 18, backgroundColor: saving ? "#9CA3AF" : theme.accent, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "700" }}>Save Inventory</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={closeEditModal} disabled={saving} style={{ height: 52, borderRadius: 18, borderWidth: 1.5, borderColor: theme.border, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: theme.textSecondary, fontSize: 16, fontWeight: "600" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

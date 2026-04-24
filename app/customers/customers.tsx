import { customers as initialCustomers } from "@/data/mockData";
import { useMemo, useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Customer = {
    id: number;
    name: string;
    phone: string;
    total_transactions: number;
    total_utang: number;
};

export default function CustomersScreen() {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [modalVisible, setModalVisible] = useState(false);

    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");

    const filteredCustomers = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return customers;

        return customers.filter(
            (customer) =>
                customer.name.toLowerCase().includes(keyword) ||
                customer.phone.includes(keyword)
        );
    }, [search, customers]);

    const handleAddCustomer = () => {
        if (!newName.trim() || !newPhone.trim()) {
            console.log("Name and phone are required");
            return;
        }

        const newCustomer: Customer = {
            id: Date.now(),
            name: newName.trim(),
            phone: newPhone.trim(),
            total_transactions: 0,
            total_utang: 0,
        };

        setCustomers((prev) => [newCustomer, ...prev]);
        setNewName("");
        setNewPhone("");
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
            <View style={{ flex: 1, padding: 16 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "700",
                            color: "#111827",
                        }}
                    >
                        Customers
                    </Text>

                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            backgroundColor: "#7F00FF",
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: 14,
                        }}
                    >
                        <Text
                            style={{
                                color: "#FFFFFF",
                                fontWeight: "600",
                                fontSize: 14,
                            }}
                        >
                            + Add
                        </Text>
                    </TouchableOpacity>
                </View>

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
                        placeholder="Search customer"
                        placeholderTextColor="#9CA3AF"
                        style={{
                            height: 48,
                            fontSize: 15,
                            color: "#111827",
                        }}
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredCustomers.length === 0 ? (
                        <View
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 18,
                                padding: 16,
                            }}
                        >
                            <Text style={{ color: "#6B7280" }}>No customers found.</Text>
                        </View>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <View
                                key={customer.id}
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 18,
                                    padding: 16,
                                    marginBottom: 12,
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: "700",
                                        color: "#111827",
                                        marginBottom: 6,
                                    }}
                                >
                                    {customer.name}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        marginBottom: 4,
                                    }}
                                >
                                    Phone: {customer.phone}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: "#6B7280",
                                        marginBottom: 4,
                                    }}
                                >
                                    Transactions: {customer.total_transactions}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "600",
                                        color: "#7F00FF",
                                    }}
                                >
                                    Total Utang: ₱{customer.total_utang.toLocaleString()}
                                </Text>
                            </View>
                        ))
                    )}
                </ScrollView>

                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.35)",
                            justifyContent: "flex-end",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#FFFFFF",
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                padding: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: "700",
                                    color: "#111827",
                                    marginBottom: 16,
                                }}
                            >
                                Add Customer
                            </Text>

                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: 8,
                                }}
                            >
                                Customer Name
                            </Text>
                            <TextInput
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Enter customer name"
                                placeholderTextColor="#9CA3AF"
                                style={{
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                    borderRadius: 16,
                                    paddingHorizontal: 14,
                                    fontSize: 15,
                                    color: "#111827",
                                    backgroundColor: "#FAFAFA",
                                    marginBottom: 14,
                                }}
                            />

                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: 8,
                                }}
                            >
                                Phone Number
                            </Text>
                            <TextInput
                                value={newPhone}
                                onChangeText={setNewPhone}
                                keyboardType="phone-pad"
                                placeholder="Enter phone number"
                                placeholderTextColor="#9CA3AF"
                                style={{
                                    height: 52,
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                    borderRadius: 16,
                                    paddingHorizontal: 14,
                                    fontSize: 15,
                                    color: "#111827",
                                    backgroundColor: "#FAFAFA",
                                    marginBottom: 20,
                                }}
                            />

                            <TouchableOpacity
                                onPress={handleAddCustomer}
                                style={{
                                    backgroundColor: "#7F00FF",
                                    borderRadius: 16,
                                    paddingVertical: 15,
                                    alignItems: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FFFFFF",
                                        fontSize: 16,
                                        fontWeight: "700",
                                    }}
                                >
                                    Save Customer
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: 16,
                                    paddingVertical: 15,
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderColor: "#E5E7EB",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#111827",
                                        fontSize: 16,
                                        fontWeight: "600",
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}
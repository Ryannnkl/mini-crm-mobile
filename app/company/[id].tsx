import { ThemedPicker } from "@/components/themed-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Company,
  CompanyStatus,
  companyStatusColumns,
} from "@/types/company.type";
import { Ionicons } from "@expo/vector-icons";
import type { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { router, useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export default function CompanyScreen() {
  const params = useGlobalSearchParams();
  const [company, setCompany] = useState<Company>(
    JSON.parse(params.company as string)
  );
  const [showActions, setShowActions] = useState(false);

  const handleStatusChange = (itemValue: ItemValue, itemIndex: number) => {
    const status = itemValue as CompanyStatus;
    setCompany((prev) => ({
      ...prev,
      status,
    }));
    // TODO: Add API call to update company status
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Company",
      "Are you sure you want to delete this company?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: Add API call to delete company
            router.back();
          },
        },
      ]
    );
  };

  const actionItems = [
    {
      label: "Edit",
      icon: "pencil",
      onPress: () => console.log("Edit company"),
    },
    {
      label: "Delete",
      icon: "trash",
      onPress: handleDelete,
      destructive: true,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{company.name}</ThemedText>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowActions(!showActions)}
        >
          <Ionicons name="ellipsis-vertical" size={24} color="#007AFF" />
        </TouchableOpacity>

        {showActions && (
          <ThemedView
            style={styles.actionsContainer}
            darkColor="#222"
            lightColor="#fff"
          >
            {actionItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={() => {
                  item.onPress();
                  setShowActions(false);
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.destructive ? "#FF3B30" : "#445"}
                  style={styles.actionIcon}
                />
                <ThemedText
                  style={item.destructive ? styles.destructiveText : {}}
                >
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ThemedView>
        )}
      </View>

      <ThemedView style={styles.section}>
        <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "center", height: '100%', maxHeight: 100, width: '100%' }}>
          <ThemedText style={styles.label}>Status</ThemedText>
          <View style={styles.pickerContainer}>
            <ThemedPicker
              selectedValue={company.status}
              onValueChange={handleStatusChange}
              items={companyStatusColumns.map((status) => ({
                label: status.name,
                value: status.id as CompanyStatus,
              }))}
            />
          </View>
        </View>

        {company.phone && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Phone</ThemedText>
            <ThemedText>{company?.phone}</ThemedText>
          </View>
        )}

        {company.website && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Website</ThemedText>
            <ThemedText style={styles.link}>{company.website}</ThemedText>
          </View>
        )}

        {company.leadSource && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Lead Source</ThemedText>
            <ThemedText>{company.leadSource}</ThemedText>
          </View>
        )}

        {company.potentialValue && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Potential Value</ThemedText>
            <ThemedText>${company.potentialValue.toLocaleString()}</ThemedText>
          </View>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  actionButton: {
    padding: 8,
  },
  actionsContainer: {
    position: "absolute",
    right: 0,
    top: 40,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
    minWidth: 160,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  destructiveText: {
    color: "#FF3B30",
  },
  actionIcon: {
    marginRight: 12,
  },
  section: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 2,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    color: "#666",
    flex: 1,
  },
  pickerContainer: {
    width:'50%',
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  link: {
    color: "#007AFF",
  },
});

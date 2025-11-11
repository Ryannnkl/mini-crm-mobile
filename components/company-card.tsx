import type { Company } from "@/types/company.type";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

import { companyStatusColumns } from "@/types/company.type";
import { contrastColor } from "@/utils/colors";

export const CompanyCard = ({
  company,
  onPress,
}: {
  company: Company;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress}>
    <ThemedView style={styles.card} darkColor="#222" lightColor="#eee">
      <View style={styles.cardHeader}>
        <ThemedText type="subtitle" style={styles.companyName}>
          {company.name}
        </ThemedText>
        <ThemedText
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                companyStatusColumns.find((status) => status.id === company.status)?.color || "",
              color:contrastColor(companyStatusColumns.find((status) => status.id === company.status)?.color || "#000"),
            },
          ]}
        >
          {company.status}
        </ThemedText>
      </View>
      <View style={styles.cardContent}>
        {company.website && (
          <View style={styles.infoRow}>
            <IconSymbol name="globe" size={16} color="#666" style={styles.icon} />
            <ThemedText style={styles.infoText}>{company.website}</ThemedText>
          </View>
        )}
        {company.phone && (
          <View style={styles.infoRow}>
            <IconSymbol name="phone" size={16} color="#666" style={styles.icon} />
            <ThemedText style={styles.infoText}>{company.phone}</ThemedText>
          </View>
        )}
      </View>
    </ThemedView>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardContent: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  icon: {
    marginRight: 8,
    width: 20,
  },
  infoText: {
    fontSize: 14,
  },
});

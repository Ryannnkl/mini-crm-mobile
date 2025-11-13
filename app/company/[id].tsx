import { useMutation } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import type { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { router, useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { InteractionsList } from "@/components/interactions-list";
import { ThemedPicker } from "@/components/themed-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DELETE_COMPANY, UPDATE_COMPANY_STATUS } from "@/lib/graphql/mutations";
import { GET_COMPANIES } from "@/lib/graphql/queries";
import {
  Company,
  CompanyStatus,
  companyStatusColumns,
} from "@/types/company.type";

export default function CompanyScreen() {
  const params = useGlobalSearchParams();
  const [company, setCompany] = useState<Company>(
    JSON.parse(params.company as string)
  );
  const [showActions, setShowActions] = useState(false);

  const [deleteCompany, { loading: deleting }] = useMutation(DELETE_COMPANY, {
    variables: {
      id: parseInt(company.id as string, 10),
    },
    update: (cache) => {
      const companyId = company.id;
      const existingCompanies = cache.readQuery<{ companies: Company[] }>({
        query: GET_COMPANIES,
      });

      if (existingCompanies) {
        cache.writeQuery({
          query: GET_COMPANIES,
          data: {
            companies: existingCompanies.companies.filter(
              (c) => c.id !== companyId
            ),
          },
        });
      }
    },
    onCompleted: () => {
      router.back();
    },
    onError: (error: Error) => {
      Alert.alert("Erro", "Erro ao deletar empresa. Tente novamente.");
    },
  });

  const [updateStatus] = useMutation(UPDATE_COMPANY_STATUS, {
    update: (cache, result) => {
      const data = result.data as
        | { updateCompanyStatus: { id: string; status: string } }
        | undefined;
      if (!data?.updateCompanyStatus) return;
      const updatedCompany = data.updateCompanyStatus;

      const existingCompanies = cache.readQuery<{ companies: Company[] }>({
        query: GET_COMPANIES,
      });

      if (existingCompanies) {
        cache.writeQuery({
          query: GET_COMPANIES,
          data: {
            companies: existingCompanies.companies.map((c) =>
              c.id === updatedCompany.id
                ? { ...c, status: updatedCompany.status }
                : c
            ),
          },
        });
      }
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Erro", "Erro ao atualizar status. Tente novamente.");
    },
  });

  const handleStatusChange = async (itemValue: ItemValue) => {
    const status = itemValue as CompanyStatus;

    setCompany((prev) => ({
      ...prev,
      status,
    }));

    try {
      await updateStatus({
        variables: {
          id: parseInt(company.id as string, 10),
          input: {
            status,
          },
        },
      });
    } catch {
      setCompany((prev) => ({
        ...prev,
        status: company.status,
      }));
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Deletar Empresa",
      "Tem certeza que deseja deletar esta empresa? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: deleting ? "Deletando..." : "Deletar",
          style: "destructive",
          onPress: () => {
            if (deleting) return;
            deleteCompany();
          },
        },
      ]
    );
  };

  const actionItems = [
    {
      label: "Deletar",
      icon: "trash",
      onPress: handleDelete,
      destructive: true,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 50}
      >
        <View style={styles.header}>
          <ThemedText type="title">{company.name}</ThemedText>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowActions(!showActions)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#777" />
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
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              maxHeight: 100,
              width: "100%",
            }}
          >
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
              <ThemedText style={styles.label}>Telefone</ThemedText>
              <ThemedText>{company?.phone || ""}</ThemedText>
            </View>
          )}
          {company.website && (
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Website</ThemedText>
              <ThemedText style={styles.link}>
                {company.website || ""}
              </ThemedText>
            </View>
          )}
          {company.leadSource && (
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Fonte de Lead</ThemedText>
              <ThemedText>{company.leadSource || ""}</ThemedText>
            </View>
          )}
          {company.potentialValue && (
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Valor Potencial</ThemedText>
              <ThemedText>
                {"$" + company.potentialValue.toLocaleString()}
              </ThemedText>
            </View>
          )}
        </ThemedView>
        <InteractionsList company={company} />
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  actionIcon: {
    marginRight: 8,
  },
  destructiveText: {
    color: "#FF3B30",
  },
  section: {
    marginBottom: 16,
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
    width: "50%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
  },
  link: {
    color: "#007AFF",
  },
});

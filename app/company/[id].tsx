import { useMutation, useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import type { ItemValue } from "@react-native-picker/picker/typings/Picker";
import { router, useGlobalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

import { ThemedInput } from "@/components/themed-input";
import { ThemedPicker } from "@/components/themed-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  CREATE_INTERACTION,
  DELETE_COMPANY,
  UPDATE_COMPANY_STATUS,
} from "@/lib/graphql/mutations";
import { GET_COMPANIES, GET_INTERACTIONS } from "@/lib/graphql/queries";
import {
  Company,
  CompanyStatus,
  companyStatusColumns,
} from "@/types/company.type";

interface Interaction {
  id: number | string;
  content: string;
  companyId: number;
  createdAt: string;
  type?: string;
  userId?: string;
  updatedAt?: string;
}

interface InteractionsData {
  interactions: Interaction[];
}

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

  const [newInteraction, setNewInteraction] = useState("");
  const [isSending, setIsSending] = useState(false);

  const {
    data: interactionsData,
    loading: loadingInteractions,
    error: interactionsError,
    refetch,
  } = useQuery<InteractionsData>(GET_INTERACTIONS, {
    variables: { companyId: parseInt(company.id as string, 10) },
    fetchPolicy: "cache-and-network",
  });

  const [createInteraction] = useMutation<{ createInteraction: Interaction }>(
    CREATE_INTERACTION,
    {
      onCompleted: (data) => {
        setNewInteraction("");
        refetch();
      },
      onError: () => {
        Alert.alert(
          "Erro",
          "Não foi possível enviar a interação. Tente novamente."
        );
      },
    }
  );

  const handleSendInteraction = async () => {
    if (!newInteraction.trim()) return;

    setIsSending(true);
    const companyId = parseInt(company.id as string, 10);

    try {
      await createInteraction({
        variables: {
          companyId,
          content: newInteraction.trim(),
        },
        update: (cache, { data }) => {
          if (!data?.createInteraction) return;

          const existingInteractions = cache.readQuery<InteractionsData>({
            query: GET_INTERACTIONS,
            variables: { companyId },
          });

          if (existingInteractions) {
            cache.writeQuery({
              query: GET_INTERACTIONS,
              variables: { companyId },
              data: {
                interactions: [
                  {
                    ...data.createInteraction,
                    id: data.createInteraction.id.toString(),
                  },
                  ...existingInteractions.interactions,
                ],
              },
            });
          }
        },
      });

      setNewInteraction("");
    } catch (error) {
      console.error("Error sending interaction:", error);
      Alert.alert(
        "Erro",
        "Não foi possível enviar a interação. Tente novamente."
      );
    } finally {
      setIsSending(false);
    }
  };

  const actionItems = [
    {
      label: "Deletar",
      icon: "trash",
      onPress: handleDelete,
      destructive: true,
    },
  ];

  const renderInteraction = ({
    item,
    index,
  }: {
    item: Interaction;
    index: number;
  }) => {
    return (
      <ThemedView
        style={styles.interactionContainer}
        darkColor="#222"
        lightColor="#ddd"
      >
        <View style={styles.interactionContent}>
          <ThemedText style={styles.interactionText}>
            {item.content || "Sem conteúdo"}
          </ThemedText>
          <ThemedText style={styles.interactionDate}>
            {item.createdAt
              ? new Date(parseInt(item.createdAt)).toLocaleString("pt-BR")
              : "Data não disponível"}
          </ThemedText>
        </View>
      </ThemedView>
    );
  };

  const renderHeader = () => (
    <>
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
            <ThemedText style={styles.label}>Fonte de Lead</ThemedText>
            <ThemedText>{company.leadSource}</ThemedText>
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
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ThemedView style={styles.container}>
        {renderHeader()}
        <FlatList
          data={interactionsData?.interactions || []}
          renderItem={renderInteraction}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => {
            if (loadingInteractions) {
              return (
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>
                    Carregando interações...
                  </ThemedText>
                </View>
              );
            }
            if (interactionsError) {
              return (
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>
                    Erro ao carregar interações: {interactionsError.message}
                  </ThemedText>
                </View>
              );
            }
            return (
              <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                  Nenhuma interação registrada ainda.
                </ThemedText>
              </View>
            );
          }}
          contentContainerStyle={styles.flatListContent}
          style={styles.flatList}
        />
        <ThemedView style={styles.inputContainer}>
          <ThemedInput
            value={newInteraction}
            onChangeText={setNewInteraction}
            placeholder="Digite sua mensagem..."
            multiline
            style={styles.input}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!newInteraction.trim() || isSending) &&
                styles.sendButtonDisabled,
            ]}
            onPress={handleSendInteraction}
            disabled={!newInteraction.trim() || isSending}
          >
            <Ionicons
              name={isSending ? "time" : "send"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  flatList: {
    width: "100%",
    flex: 1,
  },
  flatListContent: {
    padding: 8,
    paddingBottom: 100,
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
  interactionsSection: {
    width: "100%",
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  emptyContainer: {
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#666",
  },
  noInteractions: {
    textAlign: "center",
    color: "#fff",
    marginTop: 16,
  },
  interactionContainer: {
    marginBottom: 12,
    width: "100%",
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 1,
  },
  interactionContent: {
    padding: 12,
  },
  interactionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 4,
  },
  interactionDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  interactionsList: {
    width: "100%",
    minHeight: 50,
  },
  interactionsFlatList: {
    width: "100%",
    maxHeight: 300,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    flex: 1,
    maxWidth: "85%",
    minHeight: 48,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderRadius: 24,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
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

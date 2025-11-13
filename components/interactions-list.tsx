import { Ionicons } from "@expo/vector-icons";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";
import { ThemedInput } from "./themed-input";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

import { CREATE_INTERACTION } from "@/lib/graphql/mutations";
import { GET_INTERACTIONS } from "@/lib/graphql/queries";
import { Company } from "@/types/company.type";
import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";

import type { Interaction } from "@/types/interaction.type";

interface InteractionsData {
  interactions: Interaction[];
}

interface InteractionsListProps {
  company: Company;
}

export function InteractionsList({ company }: InteractionsListProps) {
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

  return (
    <View style={styles.container}>
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
        <Pressable
          style={[
            styles.sendButton,
            (!newInteraction.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendInteraction}
          disabled={!newInteraction.trim() || isSending}
        >
          <Ionicons name={isSending ? "time" : "send"} size={20} color="#fff" />
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  interactionContainer: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    width: "100%",
  },
  interactionContent: {
    padding: 12,
    width: "100%",
  },
  interactionText: {
    fontSize: 16,
  },
  interactionDate: {
    fontSize: 12,
    marginTop: 4,
    color: "#777",
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
  flatList: {
    flex: 1,
    width: "100%",
  },
  flatListContent: {
    padding: 8,
    paddingBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 8,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 16,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
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
});

import { CompanyCard } from "@/components/company-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { authClient } from "@/lib/auth-client";
import { GET_COMPANIES } from "@/lib/graphql/queries";
import { useQuery } from "@apollo/client/react";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import type { Company } from "@/types/company.type";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ companies: Company[] }>(
    GET_COMPANIES
  );

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } catch (err) {
      console.error("Error refreshing:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddCompany = () => {
    router.push("/add-company");
  };

  const handleCompanyPress = (companyId: string, company: Company) => {
    router.push({
      pathname: "/company/[id]",
      params: { id: companyId, company: JSON.stringify(company) },
    });
  };

  if (!user) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Faça login para ver suas empresas</ThemedText>
      </ThemedView>
    );
  }

  if (loading && !isRefreshing) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 10 }}>
          Carregando empresas...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#dc3545" />
        <ThemedText style={styles.errorText}>
          Ocorreu um erro ao carregar as empresas
        </ThemedText>
        <Pressable
          style={[styles.button, styles.retryButton]}
          onPress={handleRefresh}
        >
          <ThemedText style={styles.buttonText}>Tentar novamente</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const companies = data?.companies || [];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Empresas</ThemedText>
      </ThemedView>

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CompanyCard
            company={item}
            onPress={() => handleCompanyPress(item.id, item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <Ionicons name="business-outline" size={48} color="#999" />
            <ThemedText style={styles.emptyText}>
              Nenhuma empresa cadastrada
            </ThemedText>
          </ThemedView>
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddCompany}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
      <StatusBar style="auto"/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
    color: "#dc3545",
  },
  retryButton: {
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Constants.statusBarHeight + 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  refreshButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    textAlign: "center",
    color: "#999",
  },
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

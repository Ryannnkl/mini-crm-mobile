import { ThemedButton } from "@/components/themed-button";
import { ThemedInput } from "@/components/themed-input";
import { ThemedPicker } from "@/components/themed-picker";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CREATE_COMPANY, GET_COMPANIES } from "@/lib/graphql/queries";
import { useMutation } from "@apollo/client/react";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function AddCompanyScreen() {
  const [formData, setFormData] = useState<any>({
    name: "",
    website: "",
    phone: "",
    leadSource: "other",
    status: "lead",
  });

  const [createCompany, { loading }] = useMutation(CREATE_COMPANY, {
    refetchQueries: [{ query: GET_COMPANIES }],
    onCompleted: () => router.back(),
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = () => {
    try {
      if (formData.name.trim()) {
        createCompany({
          variables: {
            input: {
              ...formData,
              name: formData.name.trim(),
              website: formData.website.trim() || null,
              phone: formData.phone.trim() || null,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Nome *
          </ThemedText>
          <ThemedInput
            placeholder="Nome da empresa"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Website
          </ThemedText>
          <ThemedInput
            placeholder="https://"
            value={formData.website}
            onChangeText={(text) => setFormData({ ...formData, website: text })}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Telefone
          </ThemedText>
          <ThemedInput
            placeholder="(00) 00000-0000"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold" style={styles.label}>
            Origem do Lead
          </ThemedText>

          <ThemedPicker
            items={[
              { label: "Website", value: "website" },
              { label: "Referência", value: "referral" },
              { label: "Chamada Telefônica", value: "cold_call" },
              { label: "Outro", value: "other" },
            ]}
            selectedValue={formData.leadSource}
            onValueChange={(value) => setFormData({ ...formData, leadSource: value })}
          />
        </View>

        <ThemedButton
          text="Salvar"
          onPress={handleSubmit}
          isLoading={loading}
          disabled={!formData.name.trim() || loading}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerRight: {
    width: 40,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 6,
  },
  label: {
    marginBottom: 8,
  },
  selectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#fff',
    padding: 12,
    color: '#FFF'
  },
  selectText: {
    flex: 1,
  },
  selectIcon: {
    marginLeft: 8,
  },
  submitButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  selectItem: {
    fontSize: 16,
    fontWeight: "600",
  },
});

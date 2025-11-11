import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { authClient } from '@/lib/auth-client';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu nome');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Erro', 'Por favor, informe seu e-mail');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Erro', 'Por favor, informe um e-mail válido');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não conferem');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      Alert.alert(
        'Cadastro realizado!',
        'Sua conta foi criada com sucesso. Verifique seu e-mail para ativar sua conta.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/signin')
          }
        ]
      );
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      Alert.alert('Erro', error.message || 'Não foi possível realizar o cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Cadastre-se</ThemedText>
      
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholderTextColor="#888"
        autoCapitalize="words"
      />
      
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        secureTextEntry
        placeholderTextColor="#888"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirme sua senha"
        value={formData.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        secureTextEntry
        placeholderTextColor="#888"
        onSubmitEditing={handleSignUp}
      />
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? 'Criando conta...' : 'Criar conta'}
        </ThemedText>
      </TouchableOpacity>
      
      <Link href="/signin" style={styles.link}>
        <ThemedText type="link">Já tem uma conta? Faça login</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    marginTop: 24,
  },
});

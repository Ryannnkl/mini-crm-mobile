import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { authClient } from '@/lib/auth-client';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, View } from 'react-native';

export default function AccountScreen() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace('/signin');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            {user?.image ? (
              <Image 
                source={{ uri: user.image }} 
                style={styles.avatar} 
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <MaterialIcons name="person" size={60} color="#666" />
              </View>
            )}
          </View>
          
          <ThemedText type="title" style={styles.userName}>{user?.name}</ThemedText>
          
          <View style={styles.emailContainer}>
            <ThemedText style={styles.email}>{user?.email}</ThemedText>
            {user?.emailVerified ? (
              <MaterialIcons name="verified" size={18} color="#4CAF50" style={styles.verifiedIcon} />
            ) : (
              <View style={styles.verificationBadge}>
                <ThemedText style={styles.verificationText}>Não verificado</ThemedText>
              </View>
            )}
          </View>
          
          <ThemedText style={styles.memberSince}>
            Membro desde {user ? new Date(user.createdAt).toLocaleDateString('pt-BR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : ''}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.logoutButtonContainer}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    backgroundColor: '#e1e1e1',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginRight: 6,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  verificationBadge: {
    backgroundColor: '#ffeb3b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  verificationText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  memberSince: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  logoutButtonContainer: {
    margin: 24,
    marginTop: 'auto',
  }
});
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';  // Firebase config
import { useRouter } from 'expo-router';  // Router for navigation
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function SettingsScreen() {
  const router = useRouter(); // Router for navigation
  const [email, setEmail] = useState(''); // State to store email for password reset
  const [isResetEmailSent, setIsResetEmailSent] = useState(false); // Track if email was sent

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/Home'); // Navigate back to the login screen
    } catch (error: any) {
      Alert.alert('Logout Error', error.message);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setIsResetEmailSent(true); // Show email sent confirmation
      Alert.alert('Password Reset', 'Password reset link has been sent to your email.');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  // Navigate to About screen
  const handleAbout = () => {
    router.push('/About'); // Navigate to About screen
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <MaterialCommunityIcons
          name="account-circle"
          size={100}
          color="#00796B"
          style={styles.profileIcon}
        />
        <ThemedText style={styles.profileName}>John Doe</ThemedText>
        <ThemedText style={styles.profileEmail}>john.doe@example.com</ThemedText>
      </View>

      {/* Settings Options */}
      <ThemedView style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={handleAbout}>
          <Text style={styles.optionText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={() => setIsResetEmailSent(false)}>
          <Text style={styles.optionText}>Reset Password</Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Password Reset Form */}
      {isResetEmailSent ? (
        <View style={styles.resetConfirmation}>
          <ThemedText>Your password reset link has been sent to your email.</ThemedText>
        </View>
      ) : (
        <View style={styles.resetPasswordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.resetButton} onPress={handlePasswordReset}>
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by SmileCare</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  profileIcon: {
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004D40',
  },
  profileEmail: {
    fontSize: 16,
    color: '#00796B',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetPasswordContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  resetButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetConfirmation: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#d3f9d8',
    borderRadius: 10,
    textAlign: 'center',
  },
  footer: {
    marginTop: 50,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#00796B',
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Login button pressed'); // Check if function is triggered
    try {
      console.log('Attempting to log in...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful');
      router.push('/About'); // Ensure this path is correct based on your folder structure
    } catch (error: any) {
      console.error('Login Error:', error.message);
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Login to SmileCare 🦷</ThemedText>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Login" onPress={handleLogin} color="#4CAF50" />

      <TouchableOpacity onPress={() => router.push('../SignupScreen')}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  signupText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007bff',
    fontWeight: 'bold',
  },
});
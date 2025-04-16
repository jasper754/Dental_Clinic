import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText'; // Optional

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      router.replace('./Home'); // Or wherever you want to go after signup
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Create an Account</ThemedText>

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

      <Button title="Sign Up" onPress={handleSignUp} />

      {/* Link to Login screen */}
      <TouchableOpacity onPress={() => router.replace('./Home')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log in</Text>
        </Text>
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
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter, Link } from 'expo-router';

// Correct path to the image
const backgroundImage = require('../assets/images/Background.png');

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      router.replace('/+not-found'); // Change to your actual home screen
    } catch (error: any) {
      Alert.alert('Signup Error', error.message);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.logo}>SmileCare 🦷</Text>
        <Text style={styles.heading}>Create Account</Text>
        <Text style={styles.subheading}>Sign up to get started</Text>

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

        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.loginButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Link href="/+not-found" asChild>
          <TouchableOpacity>
            <Text style={styles.signupText}>
              Already have an account?{' '}
              <Text style={styles.signupLink}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // optional translucent layer
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupText: {
    fontSize: 14,
    color: '#444',
  },
  signupLink: {
    color: '#007bff',
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


// Correct path to the image
const backgroundImage = require('../assets/images/Background.png');


export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
  // Alert state
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: ''
  });


  const showAlert = (title, message) => {
    setAlert({
      visible: true,
      title,
      message
    });
  };


  const closeAlert = () => {
    setAlert({
      visible: false,
      title: '',
      message: ''
    });
  };


  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };


  const handleSignUp = async () => {
    // Validation checks
    if (!email || !password || !confirmPassword) {
      showAlert('Missing Information', 'Please fill in all fields.');
      return;
    }


    if (!validateEmail(email)) {
      showAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }


    if (password.length < 6) {
      showAlert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }


    if (password !== confirmPassword) {
      showAlert('Password Mismatch', 'Passwords do not match.');
      return;
    }


    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showAlert('Success', 'Account created successfully!');
      setTimeout(() => {
        router.replace('/About'); // Change to your actual home screen
      }, 1500);
    } catch (error: any) {
      let errorMessage = 'Signup failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use. Please use a different email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      }
      showAlert('Signup Error', errorMessage);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={backgroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Custom Alert Modal */}
        <Modal
          visible={alert.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeAlert}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{alert.title}</Text>
              <Text style={styles.modalMessage}>{alert.message}</Text>
              <TouchableOpacity onPress={closeAlert} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>
              <View style={styles.logoContainer}>
                <Ionicons name="medkit-sharp" size={40} color="#4CAF50" style={styles.logoIcon} />
                <Text style={styles.logo}>SmileCare 🦷</Text>
              </View>


              <Text style={styles.heading}>Create Account</Text>
              <Text style={styles.subheading}>Sign up to get started</Text>


              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </View>


              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIconContainer}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>


              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#4CAF50" style={styles.inputIcon} />
                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIconContainer}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>


              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleSignUp}
              >
                <Text style={styles.signupButtonText}>Sign Up</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
              </TouchableOpacity>


              <Link href="/Login" asChild>
                <TouchableOpacity>
                  <Text style={styles.loginText}>
                    Already have an account?{' '}
                    <Text style={styles.loginLink}>Log in</Text>
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </TouchableWithoutFeedback>
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
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    margin: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    marginRight: 10,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIconContainer: {
    padding: 8,
  },
  signupButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  loginText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

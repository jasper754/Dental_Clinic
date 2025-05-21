import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';




const backgroundImage = {
  uri: 'https://t3.ftcdn.net/jpg/01/19/67/02/360_F_119670247_HDccziQUuo2kFpaNiM22dIto5I8GPAWW.jpg', };


export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  // New state for alert
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


  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Missing Information', 'Please enter both email and password to continue.');
      return;
    }


    if (!validateEmail(email)) {
      showAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }


    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      showAlert('Login Successful', 'Welcome back to SmileCare!');
      setTimeout(() => {
        router.push('/About');
      }, 500);
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      }
      showAlert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  return (
    <SafeAreaView style={styles.container}>
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


      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoid}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
            <View style={styles.overlay}>
              <View style={styles.logoContainer}>
                <Ionicons name="medkit-sharp" size={40} color="darkred" style={styles.logoIcon} />
                <Text style={styles.logo}>SmileCare🦷</Text>
              </View>


              <Text style={styles.tagline}>Your smile, our passion</Text>


              {/* BLUR VIEW CARD */}
              <BlurView intensity={80} tint="light" style={styles.formContainer}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Log in to access your dental care</Text>


                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={22} color="#1A73E8" style={styles.icon} />
                  <TextInput
                    placeholder="Email address"
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>


                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={22} color="#1A73E8" style={styles.icon} />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#888"
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#888" />
                  </TouchableOpacity>
                </View>


                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>


                <TouchableOpacity
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.loginButtonText}>Log In</Text>
                      <Ionicons name="arrow-forward-outline" size={18} color="#fff" style={styles.buttonIcon} />
                    </>
                  )}
                </TouchableOpacity>


                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>


                <Link href="/Signup" asChild>
                  <TouchableOpacity style={styles.signupButton}>
                    <Text style={styles.signupButtonText}>Create an Account</Text>
                  </TouchableOpacity>
                </Link>


                <Text style={styles.footerText}>
                  By logging in, you agree to our <Text style={styles.linkText}>Terms</Text> & <Text style={styles.linkText}>Privacy</Text>
                </Text>
              </BlurView>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  background: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    marginRight: 8,
  },
  logo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'darkblue',  
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffaa',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotText: {
    alignSelf: 'flex-end',
    color: '#1A73E8',
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#1A73E8',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#a4c2f4',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#888',
  },
  signupButton: {
    borderColor: '#1A73E8',
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#1A73E8',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  linkText: {
    color: '#1A73E8',
    fontWeight: '500',
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
    backgroundColor: '#1A73E8',
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

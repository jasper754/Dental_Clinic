import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getAuth,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { router } from 'expo-router';

const backgroundImage = require('../assets/images/Background.png');

const WebAlert = ({ visible, title, message, onClose }) => {
  if (!visible) return null;

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      showAlert('Not Logged In', 'Please sign in to view your profile');
    }
  }, []);

  const showAlert = (title, message) => {
    if (Platform.OS !== 'web') {
      Alert.alert(title, message);
    } else {
      setAlertTitle(title);
      setAlertMessage(message);
      setAlertVisible(true);
    }
  };

  const handleEmailUpdate = async () => {
    if (!newEmail) {
      showAlert('Empty Field', 'Please enter a new email address');
      return;
    }

    const user = getAuth().currentUser;
    if (user) {
      try {
        await updateEmail(user, newEmail);
        showAlert('Success', 'Your email has been updated successfully');
        setNewEmail('');
        setUser(getAuth().currentUser);
      } catch (error) {
        showAlert('Update Failed', error.message || 'Please try again later');
      }
    }
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      showAlert('Empty Fields', 'Please enter both current and new passwords');
      return;
    }

    if (newPassword.length < 6) {
      showAlert('Weak Password', 'Password should be at least 6 characters');
      return;
    }

    const user = getAuth().currentUser;
    if (user) {
      try {
        const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        showAlert('Success', 'Your password has been updated successfully');
        setCurrentPassword('');
        setNewPassword('');
      } catch (error) {
        showAlert('Update Failed', error.message || 'Please verify your current password');
      }
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <WebAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.push('/About')}>
                <MaterialCommunityIcons name="chevron-left" size={32} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>My Profile</Text>
              <View style={styles.headerPlaceholder} />
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.avatarWrapper}>
                <View style={styles.avatar}>
                  <MaterialCommunityIcons name="account" size={50} color="#fff" />
                </View>
              </View>

              <Text style={styles.userName}>{user?.displayName || 'User Profile'}</Text>

              <View style={styles.emailBadge}>
                <MaterialCommunityIcons name="email-outline" size={16} color="#3b82f6" />
                <Text style={styles.emailText}>{user?.email || 'No email available'}</Text>
              </View>
            </View>

            <View style={styles.settingsWrapper}>
              <Text style={styles.sectionTitle}>Account Settings</Text>

              <View style={styles.settingCard}>
                <Text style={styles.settingLabel}>Update Email Address</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="email-edit-outline"
                    size={22}
                    color="#64748b"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="New email address"
                    placeholderTextColor="#94a3b8"
                    value={newEmail}
                    onChangeText={setNewEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity style={styles.updateButton} onPress={handleEmailUpdate}>
                  <Text style={styles.updateButtonText}>Update Email</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingCard}>
                <Text style={styles.settingLabel}>Change Password</Text>

                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={22}
                    color="#64748b"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Current password"
                    placeholderTextColor="#94a3b8"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!passwordVisible}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.visibilityButton}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <MaterialCommunityIcons
                      name={passwordVisible ? 'eye-off' : 'eye'}
                      size={22}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock-plus-outline"
                    size={22}
                    color="#64748b"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="New password"
                    placeholderTextColor="#94a3b8"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!newPasswordVisible}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.visibilityButton}
                    onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                  >
                    <MaterialCommunityIcons
                      name={newPasswordVisible ? 'eye-off' : 'eye'}
                      size={22}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.updateButton} onPress={handlePasswordUpdate}>
                  <Text style={styles.updateButtonText}>Update Password</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                  getAuth().signOut();
                  router.push('/Login');
                }}
              >
                <MaterialCommunityIcons name="logout" size={22} color="#ef4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerPlaceholder: {
    width: 32,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  emailText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 6,
    fontWeight: '500',
  },
  settingsWrapper: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  settingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    height: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 44, // Make room for the visibility toggle
  },
  visibilityButton: {
    padding: 10,
    position: 'absolute',
    right: 4,
  },
  updateButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 320,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
  },
  modalMessage: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

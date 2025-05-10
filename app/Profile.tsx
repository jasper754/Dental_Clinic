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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, updateEmail, updatePassword, EmailAuthProvider } from 'firebase/auth';
import { router } from 'expo-router';

const backgroundImage = require('../assets/images/Background.png');

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    } else {
      Alert.alert('Error', 'User not authenticated');
    }
  }, []);

  const handleEmailUpdate = async () => {
    const user = getAuth().currentUser;
    if (user && newEmail) {
      try {
        await updateEmail(user, newEmail);
        Alert.alert('Success', 'Email updated successfully');
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please provide a valid email');
    }
  };

  const handlePasswordUpdate = async () => {
    const user = getAuth().currentUser;
    if (user && newPassword && currentPassword) {
      try {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await user.reauthenticateWithCredential(credential);
        await updatePassword(user, newPassword);
        Alert.alert('Success', 'Password updated successfully');
      } catch (error: any) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'Please provide the current and new password');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/About')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <MaterialCommunityIcons name="account-circle" size={80} color="#4f83cc" />
          <Text style={styles.profileName}>{user?.displayName || 'John Doe'}</Text>
          <Text style={styles.profileEmail}>{user?.email || 'No email available'}</Text>
        </View>

        {/* Email Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>New Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new email"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={handleEmailUpdate}>
            <Text style={styles.buttonText}>Update Email</Text>
          </TouchableOpacity>
        </View>

        {/* Password Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <Text style={styles.inputLabel}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handlePasswordUpdate}>
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginTop: 10,
  },
  profileEmail: {
    fontSize: 14,
    color: '#455a64',
    marginTop: 5,
  },
  inputGroup: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderColor: '#4f83cc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4f83cc',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Alert, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firestore } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const backgroundImage = require('../assets/images/Background.png');

export default function Reservation() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');

  const handleConfirm = async () => {
    if (!fullName || !email || !date || !time || !service) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      // Save data to Firestore
      await addDoc(collection(firestore, 'reservations'), {
        fullName,
        email,
        date,
        time,
        service,
        createdAt: new Date(),
      });

      console.log("Reservation submitted successfully.");

      // Navigate to the summary screen
      router.push({
        pathname: '/Reservation',
        params: { fullName, email, date, time, service },
      });
    } catch (error) {
      console.error('Error saving reservation: ', error);
      Alert.alert('Error', 'There was an issue saving the reservation.');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>📝 Reservation Summary</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput placeholder="Full Name" style={styles.input} value={fullName} onChangeText={setFullName} />
          <TextInput placeholder="Email Address" style={styles.input} keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput placeholder="Preferred Date" style={styles.input} value={date} onChangeText={setDate} />
          <TextInput placeholder="Preferred Time" style={styles.input} value={time} onChangeText={setTime} />
          <TextInput placeholder="Service (e.g., Cleaning, Braces)" style={styles.input} value={service} onChangeText={setService} />

          <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
            <Text style={styles.submitButtonText}>Submit Reservation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#004D40',
    textAlign: 'center',
    width: '100%',
  },
  formContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
    maxWidth: 350,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

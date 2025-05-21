import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Platform, ImageBackground, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firestore } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';


// Background image - use a placeholder or specific image path
const backgroundImage = require('../assets/images/Background.png'); // Matching image from screen history


export default function Reservation() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');
 
  const services = [
    { id: '1', name: 'Teeth Cleaning', icon: 'tooth-outline' },
    { id: '2', name: 'Dental Checkup', icon: 'medical-bag' },
    { id: '3', name: 'Teeth Whitening', icon: 'white-balance-sunny' },
    { id: '4', name: 'Root Canal', icon: 'needle' },
    { id: '5', name: 'Braces Consultation', icon: 'content-save-outline' },
  ];


  const showAlertMessage = (title, message, onOkPress) => {
    // Use native Alert for mobile
    if (Platform.OS !== 'web') {
      Alert.alert(title, message, [{ text: 'OK', onPress: onOkPress }]);
      return;
    }
   
    // Custom alert for web
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed && onOkPress) {
      onOkPress();
    }
  };


  const handleConfirm = async () => {
    if (!fullName || !email || !date || !time || !service) {
      showAlertMessage('Error', 'Please fill in all required fields.');
      return;
    }


    if (!email.includes('@')) {
      showAlertMessage('Error', 'Please enter a valid email address.');
      return;
    }


    try {
      // Save data to Firestore
      await addDoc(collection(firestore, 'reservations'), {
        fullName,
        email,
        phone,
        date,
        time,
        service,
        notes,
        createdAt: new Date(),
      });


      showAlertMessage(
        'Success!',
        'Your appointment has been booked. We will send a confirmation email shortly.',
        () => {
          // Navigate to the reservation details screen
          router.push({
            pathname: '/ReservationScreen',
            params: { fullName, email, date, time, service },
          });
        }
      );
    } catch (error) {
      console.error('Error saving reservation: ', error);
      showAlertMessage('Error', 'There was an issue saving your reservation. Please try again.');
    }
  };


  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Book Your Appointment</Text>
          </View>


          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
           
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={22} color="#0A6EBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Full Name"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#888"
              />
            </View>
           
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={22} color="#0A6EBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Email Address"
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#888"
              />
            </View>
           
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone" size={22} color="#0A6EBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#888"
              />
            </View>


            <Text style={styles.sectionTitle}>Appointment Details</Text>
           
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="calendar" size={22} color="#0A6EBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Date (MM/DD/YYYY)"
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholderTextColor="#888"
              />
            </View>
           
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="clock-outline" size={22} color="#0A6EBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Time (e.g., 2:30 PM)"
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholderTextColor="#888"
              />
            </View>


            <Text style={styles.sectionTitle}>Service Selection</Text>
            <View style={styles.serviceContainer}>
              {services.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.serviceItem,
                    service === item.name && styles.serviceItemSelected
                  ]}
                  onPress={() => setService(item.name)}
                >
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={service === item.name ? "#fff" : "#0A6EBD"}
                  />
                  <Text style={[
                    styles.serviceText,
                    service === item.name && styles.serviceTextSelected
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
           
            <View style={styles.notesContainer}>
              <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
              <TextInput
                placeholder="Tell us about any special requirements or concerns..."
                style={styles.notesInput}
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
                placeholderTextColor="#888"
              />
            </View>


            <TouchableOpacity style={styles.submitButton} onPress={handleConfirm}>
              <MaterialCommunityIcons name="calendar-check" size={22} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.submitButtonText}>Confirm Appointment</Text>
            </TouchableOpacity>
           
            <Text style={styles.disclaimer}>
              By booking an appointment, you agree to our cancellation policy. Please provide at least 24 hours notice for any changes.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#0A6EBD', // Changed to blue
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF', // White text on blue header
    letterSpacing: 0.5,
  },
  formContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    shadowColor: '#0A6EBD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A6EBD',
    marginTop: 16,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f8ff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e7ff',
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 5,
    color: '#333',
    fontSize: 16,
  },
  serviceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#f5f8ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  serviceItemSelected: {
    backgroundColor: '#0A6EBD',
    borderColor: '#0A6EBD',
  },
  serviceText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#0A6EBD',
    fontWeight: '500',
  },
  serviceTextSelected: {
    color: '#fff',
  },
  notesContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: '#f5f8ff',
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e0e7ff',
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#0A6EBD',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#0A6EBD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disclaimer: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
});

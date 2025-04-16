import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';

export default function ReservationScreen() {
  const router = useRouter(); // Hook to navigate
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [service, setService] = useState('');
  const [reservationData, setReservationData] = useState<any>(null); // State to hold the reservation data

  // Handle form submission
  const handleSubmit = () => {
    // Store the reservation data
    setReservationData({ fullName, email, date, time, service });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Back Button Top Right */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <ThemedText type="title" style={styles.title}>📝 Make a Reservation</ThemedText>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        placeholder="Email Address"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Preferred Date"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        placeholder="Preferred Time"
        style={styles.input}
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        placeholder="Service (e.g., Cleaning, Braces)"
        style={styles.input}
        value={service}
        onChangeText={setService}
      />

      <Button title="Submit Reservation" onPress={handleSubmit} />

      {/* Conditional rendering of reservation details after submission */}
      {reservationData && (
        <View style={styles.reservationDetails}>
          <ThemedText type="title" style={styles.reservationTitle}>Reservation Summary</ThemedText>
          <Text style={styles.reservationText}>Name: {reservationData.fullName}</Text>
          <Text style={styles.reservationText}>Email: {reservationData.email}</Text>
          <Text style={styles.reservationText}>Date: {reservationData.date}</Text>
          <Text style={styles.reservationText}>Time: {reservationData.time}</Text>
          <Text style={styles.reservationText}>Service: {reservationData.service}</Text>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 10,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,  // Positioned to the left of the screen
    zIndex: 10,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 80,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  reservationDetails: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reservationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reservationText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

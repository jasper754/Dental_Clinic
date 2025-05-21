import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';

export default function EditReservation() {
  const router = useRouter();
  const { fullName, email, date, time, service } = useLocalSearchParams();

  const [newDate, setNewDate] = useState(date as string);
  const [newTime, setNewTime] = useState(time as string);

  const showAlertMessage = (title: string, message: string) => {
    if (Platform.OS !== 'web') {
      // React Native Alert
      import('react-native').then(({ Alert }) => Alert.alert(title, message));
      return;
    }
    // Web alert fallback
    window.alert(`${title}\n\n${message}`);
  };

  const handleUpdate = async () => {
    try {
      // Query the reservation doc by email + old date + old time + service
      const reservationsRef = collection(firestore, 'reservations');
      const q = query(
        reservationsRef,
        where('email', '==', email),
        where('date', '==', date),
        where('time', '==', time),
        where('service', '==', service)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showAlertMessage('Error', 'Reservation not found');
        return;
      }

      // Update the first matched document
      const reservationDoc = querySnapshot.docs[0];
      await updateDoc(reservationDoc.ref, {
        date: newDate,
        time: newTime,
      });

      showAlertMessage('Success', 'Your reservation has been updated.');

      // Navigate back to ReservationScreen with updated params
      router.push({
        pathname: '/ReservationScreen',
        params: {
          fullName,
          email,
          date: newDate,
          time: newTime,
          service,
        },
      });
    } catch (error) {
      console.error('Error updating reservation:', error);
      showAlertMessage('Error', 'Failed to update reservation.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reschedule Appointment</Text>

      <Text style={styles.label}>New Date</Text>
      <TextInput value={newDate} onChangeText={setNewDate} style={styles.input} />

      <Text style={styles.label}>New Time</Text>
      <TextInput value={newTime} onChangeText={setNewTime} style={styles.input} />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Appointment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0A6EBD', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0A6EBD',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReservationCheckScreen() {
  const router = useRouter();
  
  // Access the reservation data passed via query
  const { fullName, email, date, time, service } = router.query ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Reservation Details</Text>

      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>Name: {fullName || 'Not provided'}</Text>
        <Text style={styles.detailText}>Email: {email || 'Not provided'}</Text>
        <Text style={styles.detailText}>Date: {date || 'Not provided'}</Text>
        <Text style={styles.detailText}>Time: {time || 'Not provided'}</Text>
        <Text style={styles.detailText}>Service: {service || 'Not provided'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
